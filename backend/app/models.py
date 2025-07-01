from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.relationship import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sessions = relationship("SkiSession", back_populates="user")


class SkiSession(Base):
    __tablename__ = "ski_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    total_distance = Column(Float, default=0.0)  # in kilometers
    total_elevation_gain = Column(Float, default=0.0)  # in meters
    max_speed = Column(Float, default=0.0)  # in km/h
    avg_speed = Column(Float, default=0.0)  # in km/h
    weather_temp = Column(Float, nullable=True)  # in Celsius
    weather_condition = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)  # true if session is currently being tracked
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="sessions")
    gps_points = relationship("GPSPoint", back_populates="session", cascade="all, delete-orphan")


class GPSPoint(Base):
    __tablename__ = "gps_points"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("ski_sessions.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, nullable=True)  # in meters
    speed = Column(Float, nullable=True)  # in km/h
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("SkiSession", back_populates="gps_points")