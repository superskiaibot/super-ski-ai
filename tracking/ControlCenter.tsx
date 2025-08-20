import React from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Activity,
  Shield,
  Camera,
  MonitorSpeaker,
  Signal,
  Battery,
  Wifi,
  Play,
  Pause,
  Square,
  Save,
  Lock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Thermometer,
  Wind,
  Eye
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrackingStats, Resort } from './types';
import { formatTime, formatDistance } from './utils';
import { User } from '../../src/types/index';

interface ControlCenterProps {
  trackingStats: TrackingStats;
  trackingStatus: 'LIVE' | 'PAUSED' | 'STOPPED' | null;
  hasProFeatures: boolean;
  selectedResort?: Resort | null;
  currentUser: User;
  isTracking: boolean;
  isPaused: boolean;
  onSaveRun: () => void;
  onShowUpgrade?: () => void;
  onToggleStats: () => void;
  speedHistory: { time: number; elevation: number }[];
  elevationHistory: { time: number; elevation: number }[];
}

export function ControlCenter({
  trackingStats,
  trackingStatus,
  hasProFeatures,
  selectedResort,
  currentUser,
  isTracking,
  isPaused,
  onSaveRun,
  onShowUpgrade,
  onToggleStats,
  speedHistory,
  elevationHistory
}: ControlCenterProps) {
  return (
    <>
      {/* Control Center Header - Mission Control Style */}
      <div className="sticky top-14 z-20 bg-gradient-to-r from-midnight via-gray-900 to-midnight backdrop-blur-md border-b border-gray-800 -mt-4">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MonitorSpeaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl leading-tight">MISSION CONTROL</h3>
                <p className="text-blue-300 text-sm leading-tight font-medium">Snowline Tracking Command Center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* System Status Indicators */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Signal className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-xs font-mono">GPS STRONG</span>
                </div>
                <div className="flex items-center gap-1">
                  <Battery className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-xs font-mono">92%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-xs font-mono">ONLINE</span>
                </div>
              </div>
              
              {trackingStatus && (
                <Badge 
                  variant="secondary" 
                  className={`px-4 py-2 text-sm font-bold font-mono ${
                    trackingStatus === 'LIVE' ? 'bg-green-500/20 text-green-300 border-green-500/50 animate-pulse' :
                    trackingStatus === 'PAUSED' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
                    'bg-gray-500/20 text-gray-300 border-gray-500/50'
                  }`}
                >
                  ● {trackingStatus}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Center Content */}
      <div className="p-6 space-y-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
        
        {/* Real-Time Mission Status Display */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-300 font-mono tracking-wider">
                {formatTime(trackingStats.duration)}
              </div>
              <p className="text-blue-400/70 text-sm font-medium uppercase tracking-wide">Mission Time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-300 font-mono tracking-wider">
                {formatDistance(trackingStats.distance)}
              </div>
              <p className="text-green-400/70 text-sm font-medium uppercase tracking-wide">Distance Covered</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-300 font-mono tracking-wider">
                {trackingStats.maxSpeed.toFixed(1)}
              </div>
              <p className="text-purple-400/70 text-sm font-medium uppercase tracking-wide">Max Speed km/h</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-300 font-mono tracking-wider">
                {Math.round(trackingStats.vertical)}m
              </div>
              <p className="text-orange-400/70 text-sm font-medium uppercase tracking-wide">Vertical Gained</p>
            </CardContent>
          </Card>
        </div>

        {/* Unified Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {/* Primary Controls */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Activity className="w-5 h-5" />
                Primary Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {}}
                  disabled={!isTracking && !isPaused}
                  className={`w-full h-12 font-bold font-mono tracking-wide ${
                    isTracking 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-yellow-100' 
                      : 'bg-green-600 hover:bg-green-700 text-green-100'
                  }`}
                >
                  {isTracking ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      PAUSE TRACKING
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {isPaused ? 'RESUME' : 'START'} TRACKING
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {}}
                  disabled={!isTracking && !isPaused}
                  variant="destructive"
                  className="w-full h-12 font-bold font-mono tracking-wide bg-red-600 hover:bg-red-700"
                >
                  <Square className="w-5 h-5 mr-2" />
                  STOP & SAVE
                </Button>

                <Button
                  onClick={onSaveRun}
                  disabled={trackingStats.duration === 0}
                  variant="outline"
                  className="w-full h-12 font-bold font-mono tracking-wide border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  <Save className="w-5 h-5 mr-2" />
                  SAVE RUN
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Systems */}
          <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-red-300">
                <Shield className="w-5 h-5" />
                Safety Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Emergency GPS</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">ACTIVE</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Auto Check-in</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs">15 MIN</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">Crash Detection</span>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 text-xs">ENABLED</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recording & Media */}
          <Card className={`bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50 backdrop-blur-lg ${!hasProFeatures ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Camera className="w-5 h-5" />
                Recording Systems
                {!hasProFeatures && <Lock className="w-4 h-4 text-gray-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasProFeatures ? (
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-10 font-medium border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Video Recording
                  </Button>

                  <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">Auto Highlights</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">ON</Badge>
                  </div>

                  <div className="text-xs text-purple-400/70 font-mono bg-purple-900/10 p-2 rounded">
                    Storage: 2.4GB / 32GB available
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Lock className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-4">Recording features require Pro</p>
                  <Button 
                    onClick={onShowUpgrade}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-orange-300">
                <MonitorSpeaker className="w-5 h-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">GPS Signal</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">STRONG</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Battery Level</span>
                  <span className="text-sm font-mono text-blue-300">92%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Data Connection</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">ONLINE</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Storage Used</span>
                  <span className="text-sm font-mono text-orange-300">24%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather & Conditions */}
          <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border-cyan-700/50 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Thermometer className="w-5 h-5" />
                Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">Temperature</span>
                  </div>
                  <span className="text-sm font-mono text-cyan-300">-2°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">Wind Speed</span>
                  </div>
                  <span className="text-sm font-mono text-cyan-300">12 km/h</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">Visibility</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">EXCELLENT</Badge>
                </div>

                {selectedResort && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-gray-300">Resort</span>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 text-right">{selectedResort.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={onToggleStats}
                variant="outline" 
                className="w-full h-10 font-medium border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <Activity className="w-4 h-4 mr-2" />
                Toggle Analytics
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-10 font-medium border-green-500 text-green-400 hover:bg-green-500/10"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Mark Waypoint
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-10 font-medium border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}