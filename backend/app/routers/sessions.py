from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import User, SkiSession, GPSPoint
from ..schemas import (
    SkiSessionCreate, SkiSession as SkiSessionSchema, SkiSessionSummary,
    SkiSessionUpdate, GPSPointCreate, GPSPoint as GPSPointSchema,
    DashboardStats
)
from ..auth import get_current_active_user
from ..services import calculate_session_stats, get_user_dashboard_stats, get_weather_data

router = APIRouter()


@router.post("/", response_model=SkiSessionSchema)
def create_session(
    session: SkiSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if user has an active session
    active_session = db.query(SkiSession).filter(
        SkiSession.user_id == current_user.id,
        SkiSession.is_active == True
    ).first()
    
    if active_session:
        raise HTTPException(
            status_code=400,
            detail="You already have an active session. Please end it before starting a new one."
        )
    
    db_session = SkiSession(
        **session.dict(),
        user_id=current_user.id,
        start_time=datetime.utcnow(),
        is_active=True
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return db_session


@router.get("/", response_model=List[SkiSessionSummary])
def get_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    sessions = db.query(SkiSession).filter(
        SkiSession.user_id == current_user.id
    ).order_by(desc(SkiSession.start_time)).offset(skip).limit(limit).all()
    
    return sessions


@router.get("/active", response_model=SkiSessionSchema)
def get_active_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    session = db.query(SkiSession).filter(
        SkiSession.user_id == current_user.id,
        SkiSession.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="No active session found")
    
    return session


@router.get("/{session_id}", response_model=SkiSessionSchema)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    session = db.query(SkiSession).filter(
        SkiSession.id == session_id,
        SkiSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session


@router.put("/{session_id}", response_model=SkiSessionSchema)
def update_session(
    session_id: int,
    session_update: SkiSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    session = db.query(SkiSession).filter(
        SkiSession.id == session_id,
        SkiSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    update_data = session_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)
    
    db.commit()
    db.refresh(session)
    
    return session


@router.post("/{session_id}/end", response_model=SkiSessionSchema)
def end_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    session = db.query(SkiSession).filter(
        SkiSession.id == session_id,
        SkiSession.user_id == current_user.id,
        SkiSession.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Active session not found")
    
    # Calculate final statistics
    gps_points = db.query(GPSPoint).filter(GPSPoint.session_id == session_id).all()
    stats = calculate_session_stats(gps_points)
    
    # Update session with final stats
    session.end_time = datetime.utcnow()
    session.is_active = False
    session.total_distance = stats["total_distance"]
    session.total_elevation_gain = stats["total_elevation_gain"]
    session.max_speed = stats["max_speed"]
    session.avg_speed = stats["avg_speed"]
    
    # Get weather data for the session
    if gps_points:
        first_point = gps_points[0]
        weather = await get_weather_data(first_point.latitude, first_point.longitude)
        if weather:
            session.weather_temp = weather.temperature
            session.weather_condition = weather.condition
    
    db.commit()
    db.refresh(session)
    
    return session


@router.post("/{session_id}/gps", response_model=GPSPointSchema)
def add_gps_point(
    session_id: int,
    gps_point: GPSPointCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify session belongs to user and is active
    session = db.query(SkiSession).filter(
        SkiSession.id == session_id,
        SkiSession.user_id == current_user.id,
        SkiSession.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Active session not found")
    
    db_gps_point = GPSPoint(
        **gps_point.dict(),
        session_id=session_id
    )
    db.add(db_gps_point)
    db.commit()
    db.refresh(db_gps_point)
    
    return db_gps_point


@router.get("/{session_id}/gps", response_model=List[GPSPointSchema])
def get_session_gps_points(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify session belongs to user
    session = db.query(SkiSession).filter(
        SkiSession.id == session_id,
        SkiSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    gps_points = db.query(GPSPoint).filter(
        GPSPoint.session_id == session_id
    ).order_by(GPSPoint.timestamp).all()
    
    return gps_points


@router.delete("/{session_id}")
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    session = db.query(SkiSession).filter(
        SkiSession.id == session_id,
        SkiSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(session)
    db.commit()
    
    return {"message": "Session deleted successfully"}


@router.get("/stats/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return get_user_dashboard_stats(db, current_user.id)