import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Square,
  Activity,
  Mountain,
  Timer,
  Route,
  Zap,
  TrendingUp,
  MapPin,
  Thermometer,
  Wind,
  Eye,
  Snowflake,
  Clock,
  Target
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';
import { User as UserType, SavedRun } from '../../src/types';

interface SnowlineTrackingProps {
  currentUser: UserType;
  isTracking: boolean;
  onStartTracking: () => void;
  onPauseTracking: () => void;
  onStopTracking: () => void;
  onSaveRun: (run: SavedRun) => void;
}

interface TrackingStats {
  duration: number;
  distance: number;
  speed: number;
  maxSpeed: number;
  vertical: number;
  avgSpeed: number;
  calories: number;
  temperature: number;
}

export function SnowlineTracking({
  currentUser,
  isTracking,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  onSaveRun
}: SnowlineTrackingProps) {
  const [stats, setStats] = useState<TrackingStats>({
    duration: 0,
    distance: 0,
    speed: 0,
    maxSpeed: 0,
    vertical: 0,
    avgSpeed: 0,
    calories: 0,
    temperature: -5
  });

  const [isPaused, setIsPaused] = useState(false);
  const [sessionGoal, setSessionGoal] = useState({ distance: 10, vertical: 1000 });

  // Simulate real-time tracking updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setStats(prev => {
          const newSpeed = Math.random() * 40 + 10; // 10-50 km/h
          const newDistance = prev.distance + (newSpeed / 3600); // Convert to distance per second
          const newVertical = prev.vertical + Math.random() * 2; // Random elevation gain
          
          return {
            ...prev,
            duration: prev.duration + 1,
            distance: newDistance,
            speed: newSpeed,
            maxSpeed: Math.max(prev.maxSpeed, newSpeed),
            vertical: newVertical,
            avgSpeed: newDistance > 0 ? (newDistance / (prev.duration + 1)) * 3600 : 0,
            calories: prev.calories + 0.2 // Rough calorie estimate
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, isPaused]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      onPauseTracking();
      toast.info('⏸️ Tracking paused');
    } else {
      toast.success('▶️ Tracking resumed');
    }
  };

  const handleStop = () => {
    onStopTracking();
    setIsPaused(false);
    
    // Create a saved run
    const newRun: SavedRun = {
      id: `run_${Date.now()}`,
      userId: currentUser.id,
      name: `${new Date().toLocaleDateString()} Session`,
      description: 'Tracked with Snowline',
      startTime: new Date(Date.now() - stats.duration * 1000),
      endTime: new Date(),
      stats: {
        duration: stats.duration,
        distance: stats.distance,
        vertical: stats.vertical,
        maxSpeed: stats.maxSpeed,
        averageSpeed: stats.avgSpeed,
        difficulty: stats.maxSpeed > 40 ? 'black' : stats.maxSpeed > 25 ? 'blue' : 'green'
      },
      resort: {
        id: 'current',
        name: 'Current Location',
        location: 'Mountain Resort'
      },
      likes: 0,
      shares: 0,
      comments: 0,
      isPublic: true,
      isFeatured: false,
      privacy: 'public',
      weather: {
        temperature: stats.temperature,
        conditions: 'Clear',
        visibility: 'excellent'
      }
    };
    
    onSaveRun(newRun);
    
    // Reset stats
    setStats({
      duration: 0,
      distance: 0,
      speed: 0,
      maxSpeed: 0,
      vertical: 0,
      avgSpeed: 0,
      calories: 0,
      temperature: -5
    });
  };

  const distanceProgress = (stats.distance / sessionGoal.distance) * 100;
  const verticalProgress = (stats.vertical / sessionGoal.vertical) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--powder-gray))] via-background to-[hsl(var(--glacier-blue))]/30 p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground">GPS Tracking</h1>
        <p className="text-muted-foreground">
          {isTracking ? (isPaused ? 'Tracking Paused' : 'Live Tracking Active') : 'Ready to Track'}
        </p>
      </motion.div>

      {/* Main Stats Display - White Cards with Colored Borders */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border bg-card shadow-lg p-8 bg-gradient-to-br from-white to-[hsl(var(--glacier-blue))]/50"
        style={{ 
          borderColor: 'hsl(var(--border))', 
          boxShadow: 'var(--mountain-shadow)' 
        }}
      >
        <div className="grid grid-cols-3 gap-8 text-center">
          {/* Duration - Blue Text */}
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-bold tracking-tight text-blue-600" style={{ 
              fontVariationSettings: '"wght" 700',
              letterSpacing: '-0.03em'
            }}>
              {formatDuration(stats.duration)}
            </div>
            <div className="text-sm font-medium text-blue-600/70 mt-1" style={{ 
              fontVariationSettings: '"wght" 500',
              letterSpacing: '0.025em',
              textTransform: 'uppercase'
            }}>Duration</div>
          </div>

          {/* Distance - Green Text */}
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-bold tracking-tight text-green-600" style={{ 
              fontVariationSettings: '"wght" 700',
              letterSpacing: '-0.03em'
            }}>
              {stats.distance.toFixed(1)}km
            </div>
            <div className="text-sm font-medium text-green-600/70 mt-1" style={{ 
              fontVariationSettings: '"wght" 500',
              letterSpacing: '0.025em',
              textTransform: 'uppercase'
            }}>Distance</div>
          </div>

          {/* Speed - Orange Text */}
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-bold tracking-tight text-orange-600" style={{ 
              fontVariationSettings: '"wght" 700',
              letterSpacing: '-0.03em'
            }}>
              {stats.speed.toFixed(1)}
            </div>
            <div className="text-sm font-medium text-orange-600/70 mt-1" style={{ 
              fontVariationSettings: '"wght" 500',
              letterSpacing: '0.025em',
              textTransform: 'uppercase'
            }}>km/h</div>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="mt-8 flex justify-center">
          <AnimatePresence mode="wait">
            {!isTracking ? (
              <motion.div
                key="start"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Button
                  onClick={onStartTracking}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-8 py-4 text-lg font-semibold transition-all bg-[hsl(var(--mountain-green))] text-white hover:bg-[hsl(var(--mountain-green))]/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={{ 
                    fontVariationSettings: '"wght" 600',
                    boxShadow: 'var(--mountain-shadow)'
                  }}
                >
                  <Play className="w-6 h-6" />
                  Start Tracking
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="controls"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex gap-4"
              >
                <Button
                  onClick={handlePause}
                  variant="outline"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold transition-all bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                  style={{ fontVariationSettings: '"wght" 500' }}
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={handleStop}
                  variant="destructive"
                  className="px-6 py-3 bg-[hsl(var(--avalanche-orange))] hover:bg-[hsl(var(--avalanche-orange))]/90"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop & Save
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Status Indicator */}
        {isTracking && !isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--mountain-green))] animate-pulse" style={{ boxShadow: '0 0 8px currentColor' }} />
            <span className="text-sm font-medium text-[hsl(var(--mountain-green))]">LIVE TRACKING</span>
          </motion.div>
        )}
      </motion.div>

      {/* Secondary Stats Grid - White Cards with Colored Borders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Max Speed - White with Orange Border */}
        <Card className="rounded-2xl bg-white border-2 border-orange-400 shadow-sm text-center p-4" style={{ 
          boxShadow: 'var(--powder-shadow)' 
        }}>
          <CardContent className="p-0">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-700">{stats.maxSpeed.toFixed(1)}</div>
            <div className="text-xs text-orange-700/70 font-medium uppercase tracking-wide">Max Speed km/h</div>
          </CardContent>
        </Card>

        {/* Vertical - White with Green Border */}
        <Card className="rounded-2xl bg-white border-2 border-green-400 shadow-sm text-center p-4" style={{ 
          boxShadow: 'var(--powder-shadow)' 
        }}>
          <CardContent className="p-0">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700">{stats.vertical.toFixed(0)}</div>
            <div className="text-xs text-green-700/70 font-medium uppercase tracking-wide">Vertical m</div>
          </CardContent>
        </Card>

        {/* Avg Speed - White with Blue Border */}
        <Card className="rounded-2xl bg-white border-2 border-blue-400 shadow-sm text-center p-4" style={{ 
          boxShadow: 'var(--powder-shadow)' 
        }}>
          <CardContent className="p-0">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{stats.avgSpeed.toFixed(1)}</div>
            <div className="text-xs text-blue-700/70 font-medium uppercase tracking-wide">Avg Speed km/h</div>
          </CardContent>
        </Card>

        {/* Calories - White with Purple Border */}
        <Card className="rounded-2xl bg-white border-2 border-purple-400 shadow-sm text-center p-4" style={{ 
          boxShadow: 'var(--powder-shadow)' 
        }}>
          <CardContent className="p-0">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700">{stats.calories.toFixed(0)}</div>
            <div className="text-xs text-purple-700/70 font-medium uppercase tracking-wide">Calories</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Session Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border bg-card shadow-lg p-6"
        style={{ 
          borderColor: 'hsl(var(--border))', 
          boxShadow: 'var(--mountain-shadow)' 
        }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Session Goals
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Distance Progress</span>
              <span>{stats.distance.toFixed(1)} / {sessionGoal.distance} km</span>
            </div>
            <Progress value={Math.min(distanceProgress, 100)} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Vertical Progress</span>
              <span>{stats.vertical.toFixed(0)} / {sessionGoal.vertical} m</span>
            </div>
            <Progress value={Math.min(verticalProgress, 100)} className="h-2" />
          </div>
        </div>
      </motion.div>

      {/* Weather & Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border bg-card shadow-sm p-6"
        style={{ 
          borderColor: 'hsl(var(--border))', 
          boxShadow: 'var(--powder-shadow)' 
        }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Snowflake className="w-5 h-5 text-primary" />
          Current Conditions
        </h3>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Thermometer className="w-5 h-5 text-blue-500 mb-1" />
            <span className="text-lg font-semibold">{stats.temperature}°C</span>
            <span className="text-xs text-muted-foreground">Temperature</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Wind className="w-5 h-5 text-gray-500 mb-1" />
            <span className="text-lg font-semibold">5 km/h</span>
            <span className="text-xs text-muted-foreground">Wind</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Eye className="w-5 h-5 text-green-500 mb-1" />
            <span className="text-lg font-semibold">Clear</span>
            <span className="text-xs text-muted-foreground">Visibility</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}