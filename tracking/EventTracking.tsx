import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Square,
  Mountain,
  MapPin,
  Activity,
  TrendingUp,
  Users,
  Zap,
  Clock,
  Route,
  Target,
  Save,
  Share2,
  Thermometer,
  Wind,
  Eye,
  Gauge,
  BarChart3,
  LineChart,
  Award,
  AlertTriangle,
  CheckCircle,
  Flame,
  Snowflake,
  Compass,
  Heart,
  Camera,
  Video,
  Timer,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Equal,
  Navigation,
  Settings,
  TrendingDown,
  MapIcon,
  Calendar,
  Star,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Crosshair,
  Info,
  Menu,
  X,
  Lock,
  Trash2,
  UserPlus,
  Radio,
  Wifi,
  Navigation2,
  MessageCircle,
  Phone,
  Shield,
  Trophy,
  Medal,
  Crown,
  Podium,
  Flag,
  MapBranchOff,
  Siren,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { MapView } from './MapView';
import { LiveStatsCards } from './LiveStatsCards';
import { TrackingControls } from './TrackingControls';
import { SaveRunDialog } from './SaveRunDialog';
import { User, SavedRun } from '../../src/types/index';
import { TrackingStats, Resort } from './types';
import { formatTime, formatDistance, getMockCoordinates } from './utils';
import { INITIAL_TRACKING_STATS, TRACKING_UPDATE_INTERVAL } from './constants';
import { hasFeature } from '../../src/utils/featureGates';

interface EventParticipant {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  status: 'tracking' | 'paused' | 'finished' | 'offline';
  lastSeen: Date;
  currentStats: {
    duration: number;
    distance: number;
    speed: number;
    vertical: number;
    maxSpeed: number;
    averageSpeed: number;
  };
  position: number;
  isCurrentUser?: boolean;
  checkpoints?: string[];
  lastCheckpoint?: string;
}

interface EventDetails {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  resort: Resort;
  type: 'race' | 'freeride' | 'challenge' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'active' | 'finished';
  organizer: {
    id: string;
    name: string;
    username: string;
  };
  rules?: string[];
  prizes?: string[];
  checkpoints?: Array<{
    id: string;
    name: string;
    location: { latitude: number; longitude: number };
    order: number;
  }>;
}

interface EventTrackingProps {
  currentUser: User;
  event: EventDetails;
  isTracking: boolean;
  isPaused?: boolean;
  hasActiveSession?: boolean;
  sessionStartTime?: Date | null;
  onStartTracking: () => void;
  onPauseTracking: () => void;
  onStopTracking: () => void;
  onSaveRun: (run: SavedRun) => void;
  onLeaveEvent?: () => void;
  onUpgrade?: () => void;
  onTrackingStatsUpdate?: (stats: TrackingStats) => void;
  runs: SavedRun[];
  isMapFullscreen: boolean;
  isFullscreenTransition: boolean;
  onMapFullscreenChange: (isFullscreen: boolean) => void;
}

// Mock event participants data
const mockParticipants: EventParticipant[] = [
  {
    id: 'participant1',
    name: 'Sarah Chen',
    username: 'sarahski',
    location: {
      latitude: -45.032,
      longitude: 168.662,
      altitude: 1642
    },
    status: 'tracking',
    lastSeen: new Date(),
    currentStats: {
      duration: 2700,
      distance: 8.4,
      speed: 42,
      vertical: 890,
      maxSpeed: 68,
      averageSpeed: 38.2
    },
    position: 1,
    checkpoints: ['start', 'checkpoint1', 'checkpoint2'],
    lastCheckpoint: 'checkpoint2'
  },
  {
    id: 'current-user',
    name: 'Alex Rider',
    username: 'alexrider',
    location: {
      latitude: -45.031,
      longitude: 168.663,
      altitude: 1638
    },
    status: 'tracking',
    lastSeen: new Date(),
    currentStats: {
      duration: 2750,
      distance: 8.1,
      speed: 38,
      vertical: 865,
      maxSpeed: 64,
      averageSpeed: 36.8
    },
    position: 2,
    isCurrentUser: true,
    checkpoints: ['start', 'checkpoint1'],
    lastCheckpoint: 'checkpoint1'
  },
  {
    id: 'participant3',
    name: 'Marcus Johnson',
    username: 'powderhound',
    location: {
      latitude: -45.034,
      longitude: 168.660,
      altitude: 1580
    },
    status: 'tracking',
    lastSeen: new Date(),
    currentStats: {
      duration: 2890,
      distance: 7.8,
      speed: 35,
      vertical: 820,
      maxSpeed: 59,
      averageSpeed: 34.5
    },
    position: 3,
    checkpoints: ['start', 'checkpoint1'],
    lastCheckpoint: 'checkpoint1'
  },
  {
    id: 'participant4',
    name: 'Emma Wilson',
    username: 'skiemma',
    location: {
      latitude: -45.029,
      longitude: 168.665,
      altitude: 1695
    },
    status: 'paused',
    lastSeen: new Date(Date.now() - 180000),
    currentStats: {
      duration: 2580,
      distance: 7.2,
      speed: 0,
      vertical: 750,
      maxSpeed: 55,
      averageSpeed: 32.1
    },
    position: 4,
    checkpoints: ['start'],
    lastCheckpoint: 'start'
  },
  {
    id: 'participant5',
    name: 'Jake Miller',
    username: 'mountainjake',
    location: {
      latitude: -45.036,
      longitude: 168.658,
      altitude: 1520
    },
    status: 'finished',
    lastSeen: new Date(Date.now() - 600000),
    currentStats: {
      duration: 3240,
      distance: 12.5,
      speed: 0,
      vertical: 1250,
      maxSpeed: 72,
      averageSpeed: 39.8
    },
    position: 0, // Finished - separate leaderboard
    checkpoints: ['start', 'checkpoint1', 'checkpoint2', 'finish'],
    lastCheckpoint: 'finish'
  }
];

export function EventTracking({
  currentUser,
  event,
  isTracking,
  isPaused = false,
  hasActiveSession = false,
  sessionStartTime,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  onSaveRun,
  onLeaveEvent,
  onUpgrade,
  onTrackingStatsUpdate,
  runs,
  isMapFullscreen,
  isFullscreenTransition,
  onMapFullscreenChange
}: EventTrackingProps) {
  // Core tracking state
  const [trackingStats, setTrackingStats] = useState<TrackingStats>(INITIAL_TRACKING_STATS);
  const [participants, setParticipants] = useState<EventParticipant[]>(mockParticipants);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'map' | 'stats' | 'chat'>('leaderboard');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [runName, setRunName] = useState('');
  const [runDescription, setRunDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [mapStyle, setMapStyle] = useState<'terrain' | 'satellite' | 'hybrid'>('terrain');
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Event-specific state
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [showCheckpoints, setShowCheckpoints] = useState(true);
  const [eventMessages, setEventMessages] = useState<Array<{
    id: string;
    user: string;
    message: string;
    timestamp: Date;
    type: 'message' | 'checkpoint' | 'system';
  }>>([
    {
      id: '1',
      user: 'System',
      message: 'Event started! Good luck everyone! 🎿',
      timestamp: new Date(Date.now() - 180000),
      type: 'system'
    },
    {
      id: '2',
      user: 'Sarah Chen',
      message: 'Perfect conditions today! See you all at the finish! ⛷️',
      timestamp: new Date(Date.now() - 120000),
      type: 'message'
    },
    {
      id: '3',
      user: 'System',
      message: 'Jake Miller has reached the finish line! 🏁',
      timestamp: new Date(Date.now() - 60000),
      type: 'checkpoint'
    }
  ]);

  // Track card expansion to adjust map height
  const [cardsExpanded, setCardsExpanded] = useState(false);

  // Current location state
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Set location when event is loaded
  useEffect(() => {
    if (event?.resort) {
      const coords = getMockCoordinates(event.resort.id);
      if (coords) {
        setCurrentLocation(coords);
      }
    }
  }, [event?.resort]);

  // OPTIMIZED: Pass tracking stats to parent component
  const onTrackingStatsUpdateCallback = useCallback((stats: TrackingStats) => {
    if (onTrackingStatsUpdate) {
      onTrackingStatsUpdate(stats);
    }
  }, [onTrackingStatsUpdate]);

  useEffect(() => {
    if (onTrackingStatsUpdateCallback) {
      const timeoutId = setTimeout(() => {
        onTrackingStatsUpdateCallback(trackingStats);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [trackingStats, onTrackingStatsUpdateCallback]);

  // GPS tracking simulation with event updates
  useEffect(() => {
    if (isTracking && !isPaused) {
      const interval = setInterval(() => {
        setTrackingStats(prev => {
          const newSpeed = 15 + Math.random() * 40;
          const speedIncrease = Math.random() * 0.5;
          const elevationChange = Math.random() * 4 - 2;
          const newDuration = prev.duration + 1;
          
          const updatedSpeedZones = { ...prev.speedZones };
          if (newSpeed <= 20) updatedSpeedZones.slow += 1;
          else if (newSpeed <= 40) updatedSpeedZones.moderate += 1;
          else if (newSpeed <= 60) updatedSpeedZones.fast += 1;
          else updatedSpeedZones.extreme += 1;

          const updatedTerrainTime = { ...prev.terrainTime };
          const slope = Math.abs(elevationChange) * 10;
          if (slope <= 5) updatedTerrainTime.flat += 1;
          else if (slope <= 15) updatedTerrainTime.gentle += 1;
          else if (slope <= 25) updatedTerrainTime.moderate += 1;
          else if (slope <= 35) updatedTerrainTime.steep += 1;
          else updatedTerrainTime.extreme += 1;

          const totalTime = newDuration / 3600;
          const verticalPerHour = totalTime > 0 ? prev.vertical / totalTime : 0;

          let newRuns = prev.runs;
          let newLiftRides = prev.liftRides;
          if (newSpeed < 5 && prev.speed >= 15) {
            newLiftRides += 1;
          } else if (newSpeed >= 15 && prev.speed < 5) {
            newRuns += 1;
          }

          const newElevation = (prev.elevation || 1640) + elevationChange;

          return {
            ...prev,
            duration: newDuration,
            distance: prev.distance + speedIncrease / 3600,
            speed: newSpeed,
            maxSpeed: Math.max(prev.maxSpeed, newSpeed),
            avgSpeed: prev.distance > 0 ? (prev.distance / totalTime) : 0,
            elevation: newElevation,
            vertical: prev.vertical + Math.max(0, elevationChange),
            calories: prev.calories + 0.25,
            runs: newRuns,
            liftRides: newLiftRides,
            speedZones: updatedSpeedZones,
            terrainTime: updatedTerrainTime,
            verticalPerHour,
            distancePerRun: newRuns > 0 ? prev.distance / newRuns : 0,
            averageRunTime: newRuns > 0 ? newDuration / newRuns : 0,
            longestRun: Math.max(prev.longestRun, newDuration),
            skiTimePercent: (updatedSpeedZones.moderate + updatedSpeedZones.fast + updatedSpeedZones.extreme) / newDuration * 100,
            chairTimePercent: updatedSpeedZones.slow / newDuration * 100,
            restTimePercent: 100 - ((updatedSpeedZones.moderate + updatedSpeedZones.fast + updatedSpeedZones.extreme + updatedSpeedZones.slow) / newDuration * 100)
          };
        });
      }, TRACKING_UPDATE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isTracking, isPaused]);

  // Simulate participant updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants(prevParticipants => 
        prevParticipants.map(participant => {
          if (participant.status === 'tracking' && !participant.isCurrentUser) {
            const speedVariation = (Math.random() - 0.5) * 10;
            const newSpeed = Math.max(0, participant.currentStats.speed + speedVariation);
            
            return {
              ...participant,
              currentStats: {
                ...participant.currentStats,
                duration: participant.currentStats.duration + 5,
                distance: participant.currentStats.distance + 0.02,
                speed: newSpeed,
                vertical: participant.currentStats.vertical + Math.random() * 2
              },
              lastSeen: new Date()
            };
          }
          return participant;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartTracking = () => {
    onStartTracking();
    
    if (!hasActiveSession) {
      setTrackingStats(prev => ({
        ...INITIAL_TRACKING_STATS,
        elevation: 1640,
        temperature: event.resort?.temperature || -5
      }));
    }
  };

  const handleSaveRun = (isDraft = false) => {
    const sessionDate = sessionStartTime || new Date(Date.now() - trackingStats.duration * 1000);
    
    const newRun: SavedRun = {
      id: `run_${Date.now()}`,
      userId: currentUser.id,
      name: runName || `${event.name} - ${event.resort.name}`,
      description: runDescription || `Participated in ${event.name} event`,
      startTime: sessionDate,
      endTime: new Date(sessionDate.getTime() + trackingStats.duration * 1000),
      stats: {
        duration: trackingStats.duration,
        distance: trackingStats.distance,
        vertical: trackingStats.vertical,
        maxSpeed: trackingStats.maxSpeed,
        averageSpeed: trackingStats.avgSpeed,
        difficulty: event.difficulty
      },
      resort: {
        id: event.resort.id,
        name: event.resort.name,
        location: event.resort.location
      },
      likes: 0,
      shares: 0,
      comments: 0,
      isPublic: isPublic,
      privacy: isPublic ? 'public' : 'private',
      isDraft: isDraft,
      sessionDate: sessionDate,
      publishedAt: isDraft ? undefined : new Date(),
      createdAt: new Date(),
      weather: {
        temperature: trackingStats.temperature,
        conditions: event.resort?.weatherCondition || 'Unknown',
        visibility: 'good'
      },
      eventId: event.id,
      eventName: event.name
    };

    onSaveRun(newRun);
    setShowSaveDialog(false);
    setRunName('');
    setRunDescription('');
  };

  const handleToggleFullscreen = () => {
    onMapFullscreenChange(!isMapFullscreen);
  };

  const handleCardExpansionChange = (expanded: boolean) => {
    setCardsExpanded(expanded);
  };

  // Get current user's position in leaderboard
  const currentUserParticipant = participants.find(p => p.isCurrentUser);
  const activeParticipants = participants.filter(p => p.status === 'tracking').sort((a, b) => b.currentStats.distance - a.currentStats.distance);
  const finishedParticipants = participants.filter(p => p.status === 'finished').sort((a, b) => a.currentStats.duration - b.currentStats.duration);

  // Check if user has Pro features
  const hasProFeatures = hasFeature(currentUser, 'advanced_analytics');

  // Event status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tracking': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'finished': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'offline': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-full bg-background">
      <div className={`w-full ${isMapFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {/* Map Area */}
        <div className={`relative ${
          isFullscreenTransition || isMapFullscreen
            ? 'snowline-map-fullscreen-instant'
            : 'snowline-map-extension'
        } ${
          isMapFullscreen 
            ? 'h-screen w-full' 
            : cardsExpanded 
              ? 'h-[65vh] lg:h-[75vh]' 
              : 'h-[50vh] lg:h-[60vh]'
        }`}>
          {/* Map Container */}
          <div className={`absolute inset-0 ${
            isFullscreenTransition || isMapFullscreen
              ? 'snowline-map-fullscreen-instant'
              : 'snowline-smooth-transition'
          } ${
            cardsExpanded ? 'shadow-lg' : 'shadow-sm'
          }`}>
            <MapView
              currentLocation={currentLocation}
              isTracking={isTracking}
              trackingData={[]}
              selectedResort={event.resort}
              mapStyle={mapStyle}
              participants={participants}
              showCheckpoints={showCheckpoints}
              checkpoints={event.checkpoints}
            />
          </div>

          {/* Event Header Controls */}
          {!isMapFullscreen && (
            <div className="absolute top-4 left-4 right-4 z-20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-sm min-w-0 max-w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                        <Flag className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-foreground text-sm leading-tight truncate font-semibold">{event.name}</div>
                        <div className="text-xs text-muted-foreground leading-tight truncate hidden sm:block">{event.resort.name}</div>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 flex-shrink-0">
                        {event.status === 'active' ? 'Live Event' : event.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowEventDetails(!showEventDetails)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center transition-all duration-300 shadow-sm hover:border-primary/30 group bg-white text-gray-700 hover:bg-gray-50"
                    title="Event Details"
                  >
                    <Info className="w-4 h-4 transition-all duration-300 group-hover:text-primary" />
                  </button>
                  
                  <button
                    onClick={() => setMapStyle(mapStyle === 'terrain' ? 'satellite' : mapStyle === 'satellite' ? 'hybrid' : 'terrain')}
                    className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    title="Map Style"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleToggleFullscreen}
                    className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Analytics Cards */}
          <LiveStatsCards
            trackingStats={trackingStats}
            isFullscreen={isMapFullscreen}
            isTracking={isTracking}
            isPaused={isPaused}
            showAdditionalCards={true}
            onCardExpansionChange={handleCardExpansionChange}
            currentUser={currentUser}
            isFullscreenTransition={isFullscreenTransition}
            isEventMode={true}
            eventPosition={currentUserParticipant?.position || 0}
            totalParticipants={activeParticipants.length}
          />
        </div>

        {/* Event Tracking Controls */}
        {!isMapFullscreen && (
          <div className="relative z-10">
            <TrackingControls
              currentUser={currentUser}
              isTracking={isTracking}
              isPaused={isPaused}
              hasTrackingSession={hasActiveSession}
              selectedResort={event.resort}
              onStartTracking={handleStartTracking}
              onPauseTracking={onPauseTracking}
              onStopTracking={onStopTracking}
              showAnalyticsSection={true}
              isEventMode={true}
              eventName={event.name}
            />
          </div>
        )}

        {/* Event Content Tabs */}
        {!isMapFullscreen && (
          <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 via-white to-orange-50">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1">
                <TabsTrigger 
                  value="leaderboard" 
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger 
                  value="map"
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Live Map
                </TabsTrigger>
                <TabsTrigger 
                  value="stats"
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Stats
                </TabsTrigger>
                <TabsTrigger 
                  value="chat"
                  className="rounded-lg text-sm font-medium data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard" className="space-y-6 mt-6">
                {/* Event Header */}
                <Card className="snowline-card border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Flag className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-orange-900">{event.name}</CardTitle>
                          <CardDescription className="text-orange-700">{event.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-orange-500 text-white mb-2">
                          {event.status === 'active' ? 'Live Event' : event.status}
                        </Badge>
                        <div className="text-sm text-orange-700">
                          {participants.filter(p => p.status === 'tracking').length} / {event.maxParticipants} Active
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Finished Participants */}
                {finishedParticipants.length > 0 && (
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        Finished
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {finishedParticipants.map((participant, index) => (
                        <div key={participant.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {index + 1}
                            </div>
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-semibold">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-yellow-900">{participant.name}</p>
                                {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                                {index === 1 && <Medal className="w-4 h-4 text-gray-400" />}
                                {index === 2 && <Medal className="w-4 h-4 text-orange-600" />}
                              </div>
                              <p className="text-sm text-yellow-700">@{participant.username}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-lg font-bold text-yellow-900">
                              {formatTime(participant.currentStats.duration)}
                            </div>
                            <div className="text-sm text-yellow-700">
                              {participant.currentStats.distance.toFixed(1)}km • {participant.currentStats.vertical.toFixed(0)}m
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Live Leaderboard */}
                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Live Leaderboard
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 animate-pulse">
                        Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeParticipants.map((participant, index) => (
                      <div 
                        key={participant.id} 
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                          participant.isCurrentUser 
                            ? 'bg-blue-50 border-blue-300 shadow-sm ring-2 ring-blue-200' 
                            : selectedParticipant === participant.id
                              ? 'bg-gray-50 border-gray-300 shadow-sm'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedParticipant(selectedParticipant === participant.id ? null : participant.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                            'bg-gradient-to-br from-blue-500 to-blue-600'
                          }`}>
                            {index + 1}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className={`text-white font-semibold ${
                              participant.isCurrentUser 
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                : 'bg-gradient-to-br from-gray-500 to-gray-600'
                            }`}>
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-semibold ${participant.isCurrentUser ? 'text-blue-900' : 'text-foreground'}`}>
                                {participant.name}
                                {participant.isCurrentUser && ' (You)'}
                              </p>
                              <div className={`w-2 h-2 rounded-full ${
                                participant.status === 'tracking' ? 'bg-green-500 animate-pulse' :
                                participant.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`}></div>
                            </div>
                            <p className="text-sm text-muted-foreground">@{participant.username}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(participant.status)}`}>
                                {participant.status}
                              </Badge>
                              {participant.lastCheckpoint && (
                                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                  {participant.lastCheckpoint}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1 justify-end">
                            <Route className="w-3 h-3 text-green-500" />
                            <span className="text-sm font-bold text-green-600">
                              {participant.currentStats.distance.toFixed(1)}km
                            </span>
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Gauge className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">
                              {participant.currentStats.speed.toFixed(0)} km/h
                            </span>
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Mountain className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-600 font-medium">
                              {participant.currentStats.vertical.toFixed(0)}m
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Your Performance */}
                {currentUserParticipant && (
                  <Card className="snowline-card border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-900">
                        <Target className="w-5 h-5 text-blue-500" />
                        Your Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">{currentUserParticipant.position}</div>
                          <div className="text-sm text-blue-700">Position</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">
                            {formatTime(currentUserParticipant.currentStats.duration)}
                          </div>
                          <div className="text-sm text-blue-700">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">
                            {currentUserParticipant.currentStats.distance.toFixed(1)}
                          </div>
                          <div className="text-sm text-blue-700">Distance (km)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-900">
                            {currentUserParticipant.currentStats.maxSpeed.toFixed(0)}
                          </div>
                          <div className="text-sm text-blue-700">Max Speed (km/h)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="map" className="space-y-6 mt-6">
                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapIcon className="w-5 h-5 text-primary" />
                      Live Participant Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapIcon className="w-12 h-12 mx-auto mb-2" />
                        <p>Interactive map with all participants</p>
                        <p className="text-sm">Shows real-time positions and checkpoints</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6 mt-6">
                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Event Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Participation</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Participants:</span>
                            <span className="font-medium">{participants.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Currently Active:</span>
                            <span className="font-medium text-green-600">{participants.filter(p => p.status === 'tracking').length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Finished:</span>
                            <span className="font-medium text-blue-600">{participants.filter(p => p.status === 'finished').length}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Average Speed:</span>
                            <span className="font-medium">
                              {(participants.reduce((sum, p) => sum + p.currentStats.averageSpeed, 0) / participants.length).toFixed(1)} km/h
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fastest Speed:</span>
                            <span className="font-medium">
                              {Math.max(...participants.map(p => p.currentStats.maxSpeed)).toFixed(0)} km/h
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Distance:</span>
                            <span className="font-medium">
                              {participants.reduce((sum, p) => sum + p.currentStats.distance, 0).toFixed(1)} km
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-6 mt-6">
                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Event Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-64 bg-gray-50 rounded-xl p-4 overflow-y-auto space-y-3">
                        {eventMessages.map(message => (
                          <div key={message.id} className={`flex gap-3 ${
                            message.type === 'system' ? 'justify-center' : ''
                          }`}>
                            {message.type === 'system' ? (
                              <div className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full text-center">
                                {message.message}
                              </div>
                            ) : (
                              <>
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                                    {message.user.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{message.user}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {message.timestamp.toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{message.message}</p>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Send a message to all participants..."
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <Button size="sm" className="px-4">
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Event Actions */}
            <Card className="snowline-card border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Siren className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900">Event Controls</h4>
                      <p className="text-sm text-red-700">Manage your participation in this event</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onLeaveEvent}
                      className="border-red-300 text-red-600 hover:bg-red-100"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Leave Event
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Save Run Dialog */}
      <SaveRunDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveRun}
        trackingStats={trackingStats}
        selectedResort={event.resort}
        runName={runName}
        runDescription={runDescription}
        isPublic={isPublic}
        onRunNameChange={setRunName}
        onRunDescriptionChange={setRunDescription}
        onIsPublicChange={setIsPublic}
        sessionDate={sessionStartTime}
        currentUser={currentUser}
        onUpgrade={onUpgrade}
        isEventMode={true}
        eventName={event.name}
      />
    </div>
  );
}