from fastapi import APIRouter, Depends, HTTPException
from ..schemas import WeatherData
from ..services import get_weather_data
from ..auth import get_current_active_user
from ..models import User

router = APIRouter()


@router.get("/current", response_model=WeatherData)
async def get_current_weather(
    lat: float,
    lon: float,
    current_user: User = Depends(get_current_active_user)
):
    """Get current weather data for specified coordinates"""
    weather = await get_weather_data(lat, lon)
    
    if not weather:
        raise HTTPException(
            status_code=503,
            detail="Weather service unavailable"
        )
    
    return weather