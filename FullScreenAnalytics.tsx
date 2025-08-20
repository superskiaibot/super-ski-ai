import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BarChart3,
  TrendingUp,
  Clock,
  Mountain,
  Activity,
  Play,
  Timer,
  Square,
  Lock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User as UserType, SavedRun } from '../src/types/index';
import { TrackingStats } from './tracking/types';
import { formatTime, formatDistance } from './tracking/utils';
import { hasFeature } from '../src/utils/featureGates';
import { ElevationChart } from './tracking/ElevationChart';
import { MiniUnlockAnimation } from './ui/mini-unlock-animation';

interface FullScreenAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  runs: SavedRun[];
  isTracking: boolean;
  isPaused?: boolean;
  sessionStartTime?: Date | null;
  onStartTracking?: () => void;
  onPauseTracking?: () => void;
  onStopTracking?: () => void;
  trackingStats?: TrackingStats;
}

export function FullScreenAnalytics({
  isOpen,
  onClose,
  currentUser,
  isTracking,
  isPaused = false,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  trackingStats
}: FullScreenAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'analytics' | 'performance'>('live');
  const [isFullscreenTransition, setIsFullscreenTransition] = useState(false);
  
  // Check if user has Pro features
  const hasProFeatures = hasFeature(currentUser, 'advanced_analytics');

  // Handle tab change with Pro feature gating
  const handleTabChange = (tab: 'live' | 'analytics' | 'performance') => {
    if (!hasProFeatures) {
      // For Basic users, don't change tabs - they get upgrade prompt
      return;
    }
    setActiveTab(tab);
  };

  // Handle instant fullscreen transitions
  useEffect(() => {
    if (isOpen) {
      setIsFullscreenTransition(true);
      // Reset transition flag quickly
      setTimeout(() => {
        setIsFullscreenTransition(false);
      }, 50);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Mock speed and elevation history for charts
  const speedHistory = Array.from({ length: 60 }, (_, i) => ({
    time: i,
    elevation: 20 + Math.random() * 40
  }));

  const elevationHistory = Array.from({ length: 60 }, (_, i) => ({
    time: i,
    elevation: 1200 + Math.random() * 200
  }));

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isFullscreenTransition ? 0 : 0.1 }} // Instant when transitioning
          className={`fixed inset-0 z-50 bg-background ${isFullscreenTransition ? 'fullscreen-instant' : ''}`}
        >
          {/* Fullscreen Analytics Container - INSTANT APPEARANCE */}
          <div className={`h-full w-full flex flex-col ${isFullscreenTransition ? 'snowline-map-fullscreen-instant' : ''}`}>
            
            {/* Header - FIXED POSITION FOR PERFORMANCE */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: isFullscreenTransition ? 0 : 0.1 }}
                    className="text-xl font-semibold"
                  >
                    Session Analytics
                  </motion.h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="hover:bg-muted transition-all duration-150"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Enhanced Tabbed Interface - FAST TRANSITIONS */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="w-full h-auto p-1 bg-transparent gap-0 grid grid-cols-3">
                    <TabsTrigger 
                      value="live" 
                      className={`flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-150 ${
                        !hasProFeatures ? 'opacity-75 hover:opacity-90' : ''
                      }`}
                    >
                      <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Live Stats</span>
                      {!hasProFeatures && (
                        <Lock className="w-3 h-3 ml-1 flex-shrink-0 text-muted-foreground" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className={`flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-150 ${
                        !hasProFeatures ? 'opacity-75 hover:opacity-90' : ''
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Analytics</span>
                      {!hasProFeatures && (
                        <Lock className="w-3 h-3 ml-1 flex-shrink-0 text-muted-foreground" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="performance" 
                      className={`flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-150 ${
                        !hasProFeatures ? 'opacity-75 hover:opacity-90' : ''
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Performance</span>
                      {!hasProFeatures && (
                        <Lock className="w-3 h-3 ml-1 flex-shrink-0 text-muted-foreground" />
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Tab Content Area - OPTIMIZED SCROLLING */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                {/* Live Stats Tab - FAST LOADING */}
                <TabsContent value="live" className="h-full p-0 m-0">
                  {hasProFeatures ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: isFullscreenTransition ? 0 : 0.1 }}
                      className="p-4 lg:p-6 space-y-6"
                    >
                      {/* Current Stats Grid - NO ANIMATIONS FOR PERFORMANCE */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="snowline-card text-center p-4">
                          <CardContent className="p-0">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {trackingStats?.speed.toFixed(1) || '0.0'}
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Speed (km/h)</p>
                          </CardContent>
                        </Card>

                        <Card className="snowline-card text-center p-4">
                          <CardContent className="p-0">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {trackingStats?.maxSpeed.toFixed(1) || '0.0'}
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Max Speed (km/h)</p>
                          </CardContent>
                        </Card>

                        <Card className="snowline-card text-center p-4">
                          <CardContent className="p-0">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {Math.round(trackingStats?.elevation || 1200)}m
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Elevation</p>
                          </CardContent>
                        </Card>

                        <Card className="snowline-card text-center p-4">
                          <CardContent className="p-0">
                            <div className="text-2xl font-bold text-orange-600 mb-1">
                              {Math.round(trackingStats?.vertical || 0)}m
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Vertical Drop</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Session Summary - FAST RENDER */}
                      <Card className="snowline-card">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Session Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">Total Time</div>
                              <div className="text-xl font-bold text-foreground">{trackingStats ? formatTime(trackingStats.duration) : '0:00'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">Distance</div>
                              <div className="text-xl font-bold text-foreground">{trackingStats ? formatDistance(trackingStats.distance) : '0km'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">Avg Speed</div>
                              <div className="text-xl font-bold text-foreground">{trackingStats?.avgSpeed.toFixed(1) || '0.0'} km/h</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground mb-1">Runs</div>
                              <div className="text-xl font-bold text-foreground">{trackingStats?.runs || 0}</div>
                            </div>
                          </div>

                          {/* Tracking Controls - FAST INTERACTION */}
                          <div className="flex gap-3 pt-4 border-t">
                            {isPaused ? (
                              <Button
                                onClick={onStartTracking}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl min-h-[44px] font-medium transition-all duration-150"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </Button>
                            ) : isTracking ? (
                              <Button
                                onClick={onPauseTracking}
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl min-h-[44px] font-medium transition-all duration-150"
                              >
                                <Timer className="w-4 h-4 mr-2" />
                                Pause
                              </Button>
                            ) : (
                              <Button
                                onClick={onStartTracking}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl min-h-[44px] font-medium transition-all duration-150"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Start
                              </Button>
                            )}
                            <Button
                              onClick={onStopTracking}
                              variant="outline"
                              className="flex-1 border-red-300 text-red-700 hover:bg-red-50 rounded-xl min-h-[44px] font-medium transition-all duration-150"
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Stop
                            </Button>
                          </div>

                          {/* Status indicator - NO ANIMATION */}
                          {isPaused && (
                            <div className="flex justify-center">
                              <Badge className="bg-yellow-500 text-white font-semibold">
                                PAUSED
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    // Basic user upgrade prompt - INSTANT LOAD
                    <div className="p-6 text-center">
                      <MiniUnlockAnimation featureName="Live Statistics" />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Enhanced Live Stats</h3>
                        <p className="text-muted-foreground">
                          Get real-time detailed analytics with Pro
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Analytics Tab - INSTANT CONTENT */}
                <TabsContent value="analytics" className="h-full p-0 m-0">
                  {hasProFeatures ? (
                    <div className="p-4 lg:p-6 space-y-6">
                      {/* Speed Chart - STATIC LOAD */}
                      <Card className="snowline-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Speed Chart
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ElevationChart 
                            data={speedHistory}
                            height={200}
                            color="#22c55e"
                            title="Speed (km/h)"
                          />
                        </CardContent>
                      </Card>

                      {/* Session Analytics - NO ANIMATIONS */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="snowline-card text-center p-4">
                          <CardContent className="p-0">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {trackingStats?.calories.toFixed(0) || '0'}
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Calories</p>
                          </CardContent>
                        </Card>

                        <Card className="snowline-card text-center p-4">
                          <CardContent className="p-0">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                              {trackingStats?.liftRides || 0}
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Lift Rides</p>
                          </CardContent>
                        </Card>

                        <Card className="snowline-card text-center p-4">
                          <CardContent className="p-0">
                            <div className="text-2xl font-bold text-orange-600 mb-1">
                              {trackingStats?.temperature || -5}°C
                            </div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Temperature</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    // Basic user upgrade prompt
                    <div className="p-6 text-center">
                      <MiniUnlockAnimation featureName="Advanced Analytics" />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Advanced Analytics</h3>
                        <p className="text-muted-foreground">
                          Detailed charts and performance insights
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Performance Tab - INSTANT CONTENT */}
                <TabsContent value="performance" className="h-full p-0 m-0">
                  {hasProFeatures ? (
                    <div className="p-4 lg:p-6 space-y-6">
                      {/* Elevation Chart - STATIC LOAD */}
                      <Card className="snowline-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Mountain className="w-5 h-5" />
                            Elevation Profile
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ElevationChart 
                            data={elevationHistory}
                            height={200}
                            color="#3b82f6"
                            title="Elevation (m)"
                          />
                        </CardContent>
                      </Card>

                      {/* Performance Metrics - NO ANIMATIONS */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="snowline-card">
                          <CardHeader>
                            <CardTitle>Speed Zones</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Slow (0-20 km/h)</span>
                              <span className="font-medium">{trackingStats?.speedZones.slow || 0}s</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Moderate (20-40 km/h)</span>
                              <span className="font-medium">{trackingStats?.speedZones.moderate || 0}s</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Fast (40-60 km/h)</span>
                              <span className="font-medium">{trackingStats?.speedZones.fast || 0}s</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Extreme (60+ km/h)</span>
                              <span className="font-medium">{trackingStats?.speedZones.extreme || 0}s</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="snowline-card">
                          <CardHeader>
                            <CardTitle>Performance Stats</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Ski Time %</span>
                              <span className="font-medium">{trackingStats?.skiTimePercent.toFixed(1) || '0.0'}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Chair Time %</span>
                              <span className="font-medium">{trackingStats?.chairTimePercent.toFixed(1) || '0.0'}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Vertical/Hour</span>
                              <span className="font-medium">{trackingStats?.verticalPerHour.toFixed(0) || '0'}m</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Avg Run Time</span>
                              <span className="font-medium">{trackingStats ? formatTime(trackingStats.averageRunTime) : '0:00'}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    // Basic user upgrade prompt
                    <div className="p-6 text-center">
                      <MiniUnlockAnimation featureName="Performance Analytics" />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Performance Analytics</h3>
                        <p className="text-muted-foreground">
                          Speed zones, terrain analysis, and advanced metrics
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}