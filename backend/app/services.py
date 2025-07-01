import httpx
import math
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from .models import SkiSession, GPSPoint
from .schemas import WeatherData, DashboardStats
from .config import settings


async def get_weather_data(lat: float, lon: float) -> Optional[WeatherData]:
    """Fetch weather data from OpenWeather API"""
    if not settings.openweather_api_key:
        return None
    
    url = f"https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.openweather_api_key,
        "units": "metric"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            return WeatherData(
                temperature=data["main"]["temp"],
                condition=data["weather"][0]["main"],
                description=data["weather"][0]["description"],
                humidity=data["main"]["humidity"],
                wind_speed=data["wind"]["speed"]
            )
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two GPS coordinates using Haversine formula"""
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    return c * r


def calculate_elevation_gain(elevations: List[float]) -> float:
    """Calculate total elevation gain from a list of elevations"""
    total_gain = 0.0
    for i in range(1, len(elevations)):
        diff = elevations[i] - elevations[i-1]
        if diff > 0:
            total_gain += diff
    return total_gain


def calculate_session_stats(gps_points: List[GPSPoint]) -> dict:
    """Calculate comprehensive session statistics"""
    if len(gps_points) < 2:
        return {
            "total_distance": 0.0,
            "total_elevation_gain": 0.0,
            "max_speed": 0.0,
            "avg_speed": 0.0
        }
    
    # Sort points by timestamp
    points = sorted(gps_points, key=lambda p: p.timestamp)
    
    # Calculate total distance
    total_distance = 0.0
    speeds = []
    elevations = []
    
    for i in range(1, len(points)):
        prev_point = points[i-1]
        curr_point = points[i]
        
        # Distance calculation
        distance = calculate_distance(
            prev_point.latitude, prev_point.longitude,
            curr_point.latitude, curr_point.longitude
        )
        total_distance += distance
        
        # Speed calculation
        time_diff = (curr_point.timestamp - prev_point.timestamp).total_seconds() / 3600  # hours
        if time_diff > 0:
            speed = distance / time_diff  # km/h
            speeds.append(speed)
        
        # Elevation tracking
        if curr_point.elevation is not None:
            elevations.append(curr_point.elevation)
    
    # Calculate elevation gain
    total_elevation_gain = calculate_elevation_gain(elevations) if elevations else 0.0
    
    # Calculate speed statistics
    max_speed = max(speeds) if speeds else 0.0
    avg_speed = sum(speeds) / len(speeds) if speeds else 0.0
    
    return {
        "total_distance": total_distance,
        "total_elevation_gain": total_elevation_gain,
        "max_speed": max_speed,
        "avg_speed": avg_speed
    }


def get_user_dashboard_stats(db: Session, user_id: int) -> DashboardStats:
    """Calculate dashboard statistics for a user"""
    sessions = db.query(SkiSession).filter(SkiSession.user_id == user_id).all()
    
    total_sessions = len(sessions)
    total_distance = sum(session.total_distance for session in sessions)
    total_elevation = sum(session.total_elevation_gain for session in sessions)
    
    # Calculate total time
    total_time = 0.0
    for session in sessions:
        if session.end_time:
            duration = (session.end_time - session.start_time).total_seconds() / 3600
            total_time += duration
    
    # Calculate average speed
    avg_speed = total_distance / total_time if total_time > 0 else 0.0
    
    return DashboardStats(
        total_sessions=total_sessions,
        total_distance=total_distance,
        total_elevation=total_elevation,
        total_time=total_time,
        avg_speed=avg_speed
    )