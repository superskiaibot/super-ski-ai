import React, { useState, useEffect, useCallback } from 'react';
import { useGPS } from '../../hooks/useGPS';
import { sessionsAPI, weatherAPI } from '../../services/api';
import { SkiSession, WeatherData, GPSPointCreate } from '../../types';
import SessionMap from './SessionMap';
import LiveStats from './LiveStats';
import WeatherDisplay from './WeatherDisplay';

const LiveTracking: React.FC = () => {
  const [activeSession, setActiveSession] = useState<SkiSession | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');

  const { position, error: gpsError, isTracking, startTracking, stopTracking } = useGPS({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000
  });

  // Check for active session on component mount
  useEffect(() => {
    checkActiveSession();
  }, []);

  // Add GPS points when position updates during active session
  useEffect(() => {
    if (activeSession && position && activeSession.is_active) {
      addGPSPoint();
    }
  }, [position, activeSession]);

  // Load weather data when position is available
  useEffect(() => {
    if (position && !weather) {
      loadWeatherData();
    }
  }, [position, weather]);

  const checkActiveSession = async () => {
    try {
      const session = await sessionsAPI.getActiveSession();
      setActiveSession(session);
      if (session.is_active) {
        startTracking();
      }
    } catch (error) {
      // No active session
    }
  };

  const loadWeatherData = async () => {
    if (!position) return;

    try {
      const weatherData = await weatherAPI.getCurrentWeather(
        position.coords.latitude,
        position.coords.longitude
      );
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to load weather data:', error);
    }
  };

  const addGPSPoint = async () => {
    if (!activeSession || !position) return;

    const gpsPoint: GPSPointCreate = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      elevation: position.coords.altitude || undefined,
      speed: position.coords.speed || undefined
    };

    try {
      await sessionsAPI.addGPSPoint(activeSession.id, gpsPoint);
      // Refresh session data to get updated stats
      const updatedSession = await sessionsAPI.getSession(activeSession.id);
      setActiveSession(updatedSession);
    } catch (error) {
      console.error('Failed to add GPS point:', error);
    }
  };

  const startSession = async () => {
    if (!sessionTitle.trim()) {
      alert('Please enter a session title');
      return;
    }

    setIsStarting(true);
    try {
      const newSession = await sessionsAPI.createSession({
        title: sessionTitle.trim()
      });
      setActiveSession(newSession);
      startTracking();
      setSessionTitle('');
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start session');
    } finally {
      setIsStarting(false);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    setIsEnding(true);
    try {
      const endedSession = await sessionsAPI.endSession(activeSession.id);
      setActiveSession(endedSession);
      stopTracking();
    } catch (error) {
      console.error('Failed to end session:', error);
      alert('Failed to end session');
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-mountain-900 mb-8">
          Live GPS Tracking
        </h1>

        {/* GPS Error */}
        {gpsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <strong>GPS Error:</strong> {gpsError}
          </div>
        )}

        {/* Session Controls */}
        {!activeSession || !activeSession.is_active ? (
          <div className="card-ski mb-8">
            <h2 className="text-xl font-semibold text-mountain-900 mb-4">
              Start New Session
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter session title (e.g., 'Morning Run at Whistler')"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="input-ski flex-1"
                disabled={isStarting}
              />
              <button
                onClick={startSession}
                disabled={isStarting || !sessionTitle.trim()}
                className="btn-ski whitespace-nowrap"
              >
                {isStarting ? 'Starting...' : '🎿 Start Tracking'}
              </button>
            </div>
          </div>
        ) : (
          <div className="card-ski mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-mountain-900">
                  {activeSession.title}
                </h2>
                <p className="text-mountain-600">
                  Started: {new Date(activeSession.start_time).toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-green-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    Recording
                  </div>
                </div>
              </div>
              <button
                onClick={endSession}
                disabled={isEnding}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                {isEnding ? 'Ending...' : '⏹️ End Session'}
              </button>
            </div>
          </div>
        )}

        {/* Current Position & Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Location */}
          <div className="card-ski">
            <h3 className="text-lg font-semibold text-mountain-900 mb-3">
              Current Location
            </h3>
            {position ? (
              <div className="space-y-2">
                <p className="text-sm text-mountain-600">
                  <strong>Lat:</strong> {position.coords.latitude.toFixed(6)}
                </p>
                <p className="text-sm text-mountain-600">
                  <strong>Lng:</strong> {position.coords.longitude.toFixed(6)}
                </p>
                {position.coords.altitude && (
                  <p className="text-sm text-mountain-600">
                    <strong>Altitude:</strong> {position.coords.altitude.toFixed(0)}m
                  </p>
                )}
                {position.coords.speed && (
                  <p className="text-sm text-mountain-600">
                    <strong>Speed:</strong> {(position.coords.speed * 3.6).toFixed(1)} km/h
                  </p>
                )}
              </div>
            ) : (
              <div className="text-mountain-600">
                {isTracking ? 'Getting location...' : 'Location not available'}
              </div>
            )}
          </div>

          {/* Weather */}
          <div className="card-ski">
            <WeatherDisplay weather={weather} />
          </div>

          {/* GPS Status */}
          <div className="card-ski">
            <h3 className="text-lg font-semibold text-mountain-900 mb-3">
              GPS Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  isTracking ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-mountain-600">
                  {isTracking ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  position ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm text-mountain-600">
                  {position ? 'Signal Found' : 'Searching...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats and Map */}
        {activeSession && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
              <LiveStats session={activeSession} />
            </div>
            <div className="xl:col-span-2">
              <SessionMap session={activeSession} currentPosition={position} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;