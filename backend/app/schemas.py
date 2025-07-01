from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


# User schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# GPS Point schemas
class GPSPointBase(BaseModel):
    latitude: float
    longitude: float
    elevation: Optional[float] = None
    speed: Optional[float] = None


class GPSPointCreate(GPSPointBase):
    pass


class GPSPoint(GPSPointBase):
    id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# Session schemas
class SkiSessionBase(BaseModel):
    title: str
    notes: Optional[str] = None


class SkiSessionCreate(SkiSessionBase):
    pass


class SkiSessionUpdate(BaseModel):
    title: Optional[str] = None
    notes: Optional[str] = None
    end_time: Optional[datetime] = None


class SkiSession(SkiSessionBase):
    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    total_distance: float
    total_elevation_gain: float
    max_speed: float
    avg_speed: float
    weather_temp: Optional[float] = None
    weather_condition: Optional[str] = None
    is_active: bool
    created_at: datetime
    gps_points: List[GPSPoint] = []

    class Config:
        from_attributes = True


class SkiSessionSummary(BaseModel):
    id: int
    title: str
    start_time: datetime
    end_time: Optional[datetime] = None
    total_distance: float
    total_elevation_gain: float
    max_speed: float
    is_active: bool


# Weather schemas
class WeatherData(BaseModel):
    temperature: float
    condition: str
    description: str
    humidity: int
    wind_speed: float


# Dashboard stats
class DashboardStats(BaseModel):
    total_sessions: int
    total_distance: float
    total_elevation: float
    total_time: float  # in hours
    avg_speed: float