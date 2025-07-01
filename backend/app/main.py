from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth, sessions, weather

app = FastAPI(
    title="Super Ski AI API",
    description="A comprehensive ski tracking API with GPS tracking, weather integration, and session analytics",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(weather.router, prefix="/weather", tags=["weather"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Super Ski AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}