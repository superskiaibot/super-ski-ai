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
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { MiniUnlockAnimation } from './ui/mini-unlock-animation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { MapView } from './tracking/MapView';
import { ElevationChart } from './tracking/ElevationChart';
import { ResortSelector } from './ResortSelector';
import { ResortSelectionScreen } from './tracking/ResortSelectionScreen';
import { LiveStatsCards } from './tracking/LiveStatsCards';
import { TrackingControls } from './tracking/TrackingControls';
import { SaveRunDialog } from './tracking/SaveRunDialog';
import { ControlCenter } from './tracking/ControlCenter';
import { SkiForACureEvent } from './SkiForACureEvent';
import { EventJoinModule, EventJoinData } from './event/EventJoinModule';
import { TrackingEventPanel } from './event/TrackingEventPanel';
import { User, SavedRun } from '../src/types/index';
import { TrackingStats, Resort } from './tracking/types';
import { formatTime, formatDistance, getMockCoordinates } from './tracking/utils';
import { INITIAL_TRACKING_STATS, TRACKING_UPDATE_INTERVAL, MIN_SESSION_DURATION_FOR_SAVE } from './tracking/constants';
import { hasFeature } from '../src/utils/featureGates';

interface UnifiedTrackingProps {
  currentUser: User;
  isTracking: boolean;
  isPaused?: boolean;
  hasActiveSession?: boolean;
  sessionStartTime?: Date | null;
  onStartTracking: () => void;
  onPauseTracking: () => void;
  onStopTracking: () => void;
  onSaveRun: (run: SavedRun) => void;
  onOpenAnalytics?: () => void;
  onUpgrade?: () => void;
  onTrackingStatsUpdate?: (stats: TrackingStats) => void;
  runs: SavedRun[];
  selectedResort?: Resort | null;
  onResortSelect?: (resort: Resort) => void;
  showResortSelector?: boolean;
  onShowResortSelector?: () => void;
  onCloseResortSelector?: () => void;
  showAnalyticsSection?: boolean;
  isMapFullscreen: boolean;
  isFullscreenTransition: boolean;
  onMapFullscreenChange: (isFullscreen: boolean) => void;
  // Event system props
  eventStripData?: any;
  eventManagementData?: any;
  onEventJoinComplete?: (data: EventJoinData) => void;
}

// Mock friends data
interface FriendLocation {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  status: 'tracking' | 'paused' | 'offline';
  lastSeen: Date;
  currentRun?: {
    duration: number;
    distance: number;
    speed: number;
    vertical: number;
  };
  resort?: string;
}

const mockFriends: FriendLocation[] = [
  {
    id: 'friend1',
    name: 'Sarah Chen',
    username: 'sarahski',
    location: {
      latitude: 50.1158,
      longitude: -122.9487,
      altitude: 1420
    },
    status: 'tracking',
    lastSeen: new Date(),
    currentRun: {
      duration: 1800,
      distance: 5.2,
      speed: 28,
      vertical: 680
    },
    resort: 'Whistler Village'
  },
  {
    id: 'friend2',
    name: 'Marcus Johnson',
    username: 'powderhound',
    location: {
      latitude: 50.1168,
      longitude: -122.9497,
      altitude: 1380
    },
    status: 'paused',
    lastSeen: new Date(Date.now() - 300000),
    currentRun: {
      duration: 2400,
      distance: 7.8,
      speed: 0,
      vertical: 920
    },
    resort: 'Peak 2 Peak'
  },
  {
    id: 'friend3',
    name: 'Emma Wilson',
    username: 'skiemma',
    location: {
      latitude: 50.1148,
      longitude: -122.9477,
      altitude: 1450
    },
    status: 'tracking',
    lastSeen: new Date(),
    currentRun: {
      duration: 900,
      distance: 2.1,
      speed: 35,
      vertical: 340
    },
    resort: 'Blackcomb Base'
  },
  {
    id: 'friend4',
    name: 'Jake Miller',
    username: 'mountainjake',
    location: {
      latitude: 50.1138,
      longitude: -122.9507,
      altitude: 1320
    },
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000),
    resort: 'Whistler Village'
  }
];

// Mock events data
interface EventData {
  id: string;
  name: string;
  type: string;
  resort: string;
  participants: number;
  maxParticipants: number;
  timeRemaining: number;
  progress: number;
  userRank: number;
  goal: string;
  prizePool: number;
  startTime?: string;
  startsIn?: string;
}

const mockActiveEvents: EventData[] = [
  {
    id: 'event1',
    name: 'Sunday Slalom Challenge',
    type: 'Speed Competition',
    resort: 'The Remarkables',
    participants: 47,
    maxParticipants: 50,
    timeRemaining: 3600,
    progress: 72,
    userRank: 12,
    goal: '15km total',
    prizePool: 500
  },
  {
    id: 'event2',
    name: 'Vertical Madness',
    type: 'Endurance Challenge',
    resort: 'Coronet Peak',
    participants: 23,
    maxParticipants: 30,
    timeRemaining: 7200,
    progress: 45,
    userRank: 8,
    goal: '2000m vertical',
    prizePool: 750
  }
];

const mockUpcomingEvents: EventData[] = [
  {
    id: 'event3',
    name: 'Monday Morning Powder Hunt',
    type: 'Group Challenge',
    resort: 'Cardrona',
    participants: 15,
    maxParticipants: 25,
    timeRemaining: 0,
    progress: 0,
    userRank: 0,
    goal: '10km distance',
    prizePool: 300,
    startTime: 'Tomorrow 8:00 AM',
    startsIn: 'Starts in 14h'
  },
  {
    id: 'event4',
    name: 'Weekly Distance Derby',
    type: 'Weekly Challenge',
    resort: 'Mount Hutt',
    participants: 89,
    maxParticipants: 100,
    timeRemaining: 0,
    progress: 0,
    userRank: 0,
    goal: '50km this week',
    prizePool: 1200,
    startTime: 'Monday 6:00 AM',
    startsIn: 'Starts in 2d'
  }
];

const mockCompletedEvents: EventData[] = [
  {
    id: 'event5',
    name: 'Saturday Speed Sprint',
    type: 'Speed Competition',
    resort: 'Treble Cone',
    participants: 32,
    maxParticipants: 32,
    timeRemaining: 0,
    progress: 100,
    userRank: 5,
    goal: '3 fastest runs',
    prizePool: 400
  }
];

export function UnifiedTracking({
  currentUser,
  isTracking,
  isPaused = false,
  hasActiveSession = false,
  sessionStartTime,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  onSaveRun,
  onOpenAnalytics,
  onUpgrade,
  onTrackingStatsUpdate,
  runs,
  selectedResort,
  onResortSelect,
  showResortSelector = false,
  onShowResortSelector,
  onCloseResortSelector,
  showAnalyticsSection = true,
  isMapFullscreen,
  isFullscreenTransition,
  onMapFullscreenChange,
  eventStripData,
  eventManagementData,
  onEventJoinComplete
}: UnifiedTrackingProps) {
  // Core tracking state
  const [trackingStats, setTrackingStats] = useState<TrackingStats>(INITIAL_TRACKING_STATS);

  // UI state
  const [activeTab, setActiveTab] = useState<'live' | 'analytics' | 'performance'>('live');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [runName, setRunName] = useState('');
  const [runDescription, setRunDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [mapStyle, setMapStyle] = useState<'terrain' | 'satellite' | 'hybrid'>('terrain');
  const [isLocating, setIsLocating] = useState(false);
  const [showFullscreenStats, setShowFullscreenStats] = useState(false);

  // Friends tracking state
  const [isFriendsMode, setIsFriendsMode] = useState(false);
  const [friends, setFriends] = useState<FriendLocation[]>(mockFriends);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  // Events tracking state
  const [isEventsMode, setIsEventsMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Additional cards control
  const [showAdditionalCards, setShowAdditionalCards] = useState(false);
  
  // Event join modal state
  const [showEventJoinModal, setShowEventJoinModal] = useState(false);
  
  // Mock feature toggle for event - in real app this would come from backend
  const [eventFeatureEnabled] = useState(true);

  // Track previous Pro status to detect upgrades
  const previousProStatusRef = useRef(hasFeature(currentUser, 'advanced_analytics'));

  // Current location state
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Performance tracking arrays - Fixed for ElevationChart
  const [speedHistory, setSpeedHistory] = useState<{ time: number; elevation: number }[]>([]);
  const [elevationHistory, setElevationHistory] = useState<{ time: number; elevation: number }[]>([]);

  // Track card expansion to adjust map height
  const [cardsExpanded, setCardsExpanded] = useState(false);

  // Set location when resort is selected
  useEffect(() => {
    if (selectedResort) {
      const coords = getMockCoordinates(selectedResort.id);
      if (coords) {
        setCurrentLocation(coords);
      }
    }
  }, [selectedResort]);

  // Track Pro status changes for unlock animations
  useEffect(() => {
    const currentProStatus = hasFeature(currentUser, 'advanced_analytics');
    if (!previousProStatusRef.current && currentProStatus) {
      // User just upgraded to Pro - mini unlock animations will trigger automatically
    }
    previousProStatusRef.current = currentProStatus;
  }, [currentUser]);

  // OPTIMIZED: Pass tracking stats to parent component with proper cleanup
  const onTrackingStatsUpdateCallback = useCallback((stats: TrackingStats) => {
    if (onTrackingStatsUpdate) {
      onTrackingStatsUpdate(stats);
    }
  }, [onTrackingStatsUpdate]);

  useEffect(() => {
    if (onTrackingStatsUpdateCallback) {
      // Use setTimeout to prevent setState during render
      const timeoutId = setTimeout(() => {
        onTrackingStatsUpdateCallback(trackingStats);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [trackingStats, onTrackingStatsUpdateCallback]);

  // OPTIMIZED: Friends location updates with proper cleanup
  useEffect(() => {
    if (isFriendsMode) {
      const interval = setInterval(() => {
        setFriends(prevFriends => 
          prevFriends.map(friend => {
            if (friend.status === 'tracking') {
              // Simulate friend movement
              const newLocation = {
                ...friend.location,
                latitude: friend.location.latitude + (Math.random() - 0.5) * 0.001,
                longitude: friend.location.longitude + (Math.random() - 0.5) * 0.001,
                altitude: friend.location.altitude + (Math.random() - 0.5) * 10
              };
              
              const newRun = friend.currentRun ? {
                ...friend.currentRun,
                duration: friend.currentRun.duration + 5,
                distance: friend.currentRun.distance + 0.02,
                speed: 20 + Math.random() * 30,
                vertical: friend.currentRun.vertical + Math.random() * 2
              } : undefined;

              return {
                ...friend,
                location: newLocation,
                currentRun: newRun,
                lastSeen: new Date()
              };
            }
            return friend;
          })
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isFriendsMode]);

  // FIXED: GPS tracking simulation with proper dependency array
  useEffect(() => {
    if (isTracking && !isPaused) {
      const interval = setInterval(() => {
        setTrackingStats(prev => {
          const newSpeed = 15 + Math.random() * 40;
          const speedIncrease = Math.random() * 0.5;
          const elevationChange = Math.random() * 4 - 2;
          const newDuration = prev.duration + 1;
          
          // Create new objects to prevent mutations
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
          const distancePerRun = prev.runs > 0 ? prev.distance / prev.runs : 0;

          let newRuns = prev.runs;
          let newLiftRides = prev.liftRides;
          if (newSpeed < 5 && prev.speed >= 15) {
            newLiftRides += 1;
          } else if (newSpeed >= 15 && prev.speed < 5) {
            newRuns += 1;
          }

          const newElevation = (prev.elevation || 1200) + elevationChange;

          // Calculate lift ascent - add vertical meters when on lifts (slow speeds going uphill)
          let liftAscentChange = 0;
          if (newSpeed < 8 && elevationChange > 0) {
            // On a lift going uphill
            liftAscentChange = elevationChange;
          }

          // Update chart data separately to avoid dependencies on chart arrays
          const newSpeedPoint = { time: newDuration, elevation: newSpeed };
          const newElevationPoint = { time: newDuration, elevation: newElevation };
          
          setSpeedHistory(prevHistory => [...prevHistory.slice(-59), newSpeedPoint]);
          setElevationHistory(prevHistory => [...prevHistory.slice(-59), newElevationPoint]);

          // Return the new tracking stats object
          return {
            ...prev,
            duration: newDuration,
            distance: prev.distance + speedIncrease / 3600,
            speed: newSpeed,
            maxSpeed: Math.max(prev.maxSpeed, newSpeed),
            avgSpeed: prev.distance > 0 ? (prev.distance / totalTime) : 0,
            elevation: newElevation,
            vertical: prev.vertical + Math.max(0, elevationChange),
            liftAscent: (prev.liftAscent || 0) + liftAscentChange, // Add lift ascent tracking
            calories: prev.calories + 0.25,
            runs: newRuns,
            liftRides: newLiftRides,
            speedZones: updatedSpeedZones,
            terrainTime: updatedTerrainTime,
            verticalPerHour,
            distancePerRun,
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
  }, [isTracking, isPaused]); // FIXED: Only depend on tracking state, not stats

  const handleStartTracking = () => {
    if (!selectedResort) {
      onShowResortSelector?.();
      return;
    }
    
    onStartTracking();
    
    // Only reset stats if this is a completely new session
    if (!hasActiveSession) {
      setTrackingStats(prev => ({
        ...INITIAL_TRACKING_STATS,
        elevation: 1200,
        temperature: selectedResort.temperature || -5
      }));
      
      // Reset chart data for new session
      setSpeedHistory([]);
      setElevationHistory([]);
    }
  };

  const handlePauseTracking = () => {
    onPauseTracking();
  };

  const handleStopTracking = () => {
    onStopTracking();
    setShowSaveDialog(true);
  };

  const handleResortSelect = (resort: any) => {
    onResortSelect?.(resort);
    onCloseResortSelector?.();
  };

  const handleSaveRun = (isDraft = false) => {
    const sessionDate = sessionStartTime || new Date(Date.now() - trackingStats.duration * 1000);
    const currentDate = new Date();
    
    const newRun: SavedRun = {
      id: `run_${Date.now()}`,
      userId: currentUser.id,
      name: runName || `${selectedResort?.name || 'Mountain'} Session`,
      description: runDescription,
      startTime: sessionDate,
      endTime: new Date(sessionDate.getTime() + trackingStats.duration * 1000),
      stats: {
        duration: trackingStats.duration,
        distance: trackingStats.distance,
        vertical: trackingStats.vertical,
        maxSpeed: trackingStats.maxSpeed,
        averageSpeed: trackingStats.avgSpeed,
        difficulty: 'intermediate'
      },
      resort: selectedResort ? {
        id: selectedResort.id,
        name: selectedResort.name,
        location: selectedResort.location
      } : {
        id: 'unknown',
        name: 'Unknown Resort',
        location: 'Unknown Location'
      },
      likes: 0,
      shares: 0,
      comments: 0,
      isPublic: isPublic,
      privacy: isPublic ? 'public' : 'private',
      isDraft: isDraft,
      sessionDate: sessionDate,
      publishedAt: isDraft ? undefined : currentDate,
      createdAt: currentDate,
      weather: {
        temperature: trackingStats.temperature,
        conditions: selectedResort?.weatherCondition || 'Unknown',
        visibility: 'good'
      }
    };

    onSaveRun(newRun);
    setShowSaveDialog(false);
    setRunName('');
    setRunDescription('');
  };

  // Handle tab change with Pro feature gating
  const handleTabChange = (tab: 'live' | 'analytics' | 'performance') => {
    if ((tab === 'analytics' || tab === 'performance') && !hasFeature(currentUser, 'advanced_analytics')) {
      onOpenAnalytics?.();
      return;
    }
    setActiveTab(tab);
  };

  // Toggle friends mode
  const handleToggleFriendsMode = () => {
    setIsFriendsMode(!isFriendsMode);
    setSelectedFriend(null);
  };

  // Handle friend selection
  const handleSelectFriend = (friendId: string) => {
    setSelectedFriend(selectedFriend === friendId ? null : friendId);
  };

  // Toggle events mode
  const handleToggleEventsMode = () => {
    setIsEventsMode(!isEventsMode);
    setSelectedEvent(null);
  };

  // Handle event selection
  const handleSelectEvent = (eventId: string) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
  };

  // SIMPLIFIED FULLSCREEN HANDLER
  const handleToggleFullscreen = () => {
    onMapFullscreenChange(!isMapFullscreen);
  };

  // Check if we need to show tracking session state
  const displayHasTrackingSession = hasActiveSession || trackingStats.duration > 0 || isTracking;

  // Determine current tracking status for display
  const trackingStatus = isTracking ? 'LIVE' : isPaused ? 'PAUSED' : displayHasTrackingSession ? 'STOPPED' : null;

  // Check if user has Pro features
  const hasProFeatures = hasFeature(currentUser, 'advanced_analytics');

  // Handle card expansion change
  const handleCardExpansionChange = (expanded: boolean) => {
    setCardsExpanded(expanded);
  };

  // Handle event join completion
  const handleEventJoinComplete = (joinData: EventJoinData) => {
    console.log('🎿 Event joined from tracking page:', joinData);
    setShowEventJoinModal(false);
    if (onEventJoinComplete) {
      onEventJoinComplete(joinData);
    }
  };

  // Check if user should see join modal
  const shouldShowEventJoin = eventFeatureEnabled && 
                               selectedResort && 
                               !eventManagementData?.isJoined &&
                               !showEventJoinModal;

  // Handle the analytics button click
  const handleAnalyticsButtonClick = () => {
    setShowAdditionalCards(!showAdditionalCards);
    onOpenAnalytics?.();
  };

  const activeFriends = friends.filter(f => f.status === 'tracking');
  const pausedFriends = friends.filter(f => f.status === 'paused');
  const offlineFriends = friends.filter(f => f.status === 'offline');

  return (
    <div className="w-full bg-background">
      {/* Event Join Modal */}
      {shouldShowEventJoin && (
        <EventJoinModule
          isOpen={true}
          onClose={() => setShowEventJoinModal(true)}
          onJoinComplete={handleEventJoinComplete}
          showAsModal={true}
          eventData={{
            title: 'Ski for a Cure Global 2024',
            dateRange: 'Sep 6–14, 2024',
            participantCount: 2847,
            raised: 285000,
            goal: 500000,
            isActive: true
          }}
        />
      )}

      {/* Resort Selection Screen */}
      {!selectedResort && (
        <ResortSelectionScreen onShowResortSelector={() => onShowResortSelector?.()} />
      )}

      {/* Main Tracking Interface */}
      {selectedResort && (
        <div className={`w-full ${isMapFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
          {/* Map Area - Using centralized fullscreen state */}
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
                selectedResort={selectedResort}
                mapStyle={mapStyle}
              />
            </div>

            {/* Map Controls */}
            {!isMapFullscreen && (
              <div className="absolute top-4 left-4 right-4 z-20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-sm min-w-0 max-w-full">
                      <div className="flex items-center gap-3 min-w-0">
                        <Mountain className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-foreground text-sm leading-tight truncate">{selectedResort.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight truncate hidden sm:block">{selectedResort.location}</div>
                        </div>
                        {isFriendsMode && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                            Friends Mode
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleAnalyticsButtonClick}
                      className={`w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center transition-all duration-300 shadow-sm hover:border-primary/30 group bg-white text-gray-700 hover:bg-gray-50 relative ${
                        showAdditionalCards ? 'border-primary/50 bg-primary/5 scale-105' : ''
                      }`}
                      title={showAdditionalCards ? "Hide Additional Cards" : "Show Additional Cards"}
                    >
                      <BarChart3 className={`w-4 h-4 transition-all duration-300 group-hover:text-primary ${
                        showAdditionalCards ? 'text-primary scale-110' : ''
                      }`} />
                      {!hasProFeatures && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setMapStyle(mapStyle === 'terrain' ? 'satellite' : mapStyle === 'satellite' ? 'hybrid' : 'terrain')}
                      className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm relative"
                      title="Map Style"
                    >
                      <Layers className="w-4 h-4" />
                      {!hasProFeatures && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setIsLocating(true)}
                      className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                      title="Center Location"
                    >
                      <Target className="w-4 h-4" />
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

            {/* Fullscreen Controls */}
            {isMapFullscreen && (
              <div className="absolute top-4 left-4 right-4 z-30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-lg min-w-0 max-w-full">
                      <div className="flex items-center gap-3 min-w-0">
                        <Mountain className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-foreground text-sm leading-tight truncate">{selectedResort.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight truncate hidden sm:block">{selectedResort.location}</div>
                        </div>
                        {isFriendsMode && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                            Friends Mode
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleAnalyticsButtonClick}
                      className={`w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center transition-all duration-300 shadow-lg hover:border-primary/30 group bg-white text-gray-700 hover:bg-gray-50 relative ${
                        showAdditionalCards ? 'border-primary/50 bg-primary/5 scale-105' : ''
                      }`}
                      title={showAdditionalCards ? "Hide Additional Cards" : "Show Additional Cards"}
                    >
                      <BarChart3 className={`w-4 h-4 transition-all duration-300 group-hover:text-primary ${
                        showAdditionalCards ? 'text-primary scale-110' : ''
                      }`} />
                      {!hasProFeatures && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setMapStyle(mapStyle === 'terrain' ? 'satellite' : mapStyle === 'satellite' ? 'hybrid' : 'terrain')}
                      className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-lg relative"
                      title="Map Style"
                    >
                      <Layers className="w-4 h-4" />
                      {!hasProFeatures && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted-foreground rounded-full flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setIsLocating(true)}
                      className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-lg"
                      title="Center Location"
                    >
                      <Target className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={handleToggleFullscreen}
                      className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-lg"
                      title="Exit Fullscreen"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Analytics Cards - OPTIMIZED POSITIONING */}
            <LiveStatsCards
              trackingStats={trackingStats}
              isFullscreen={isMapFullscreen}
              isTracking={isTracking}
              isPaused={isPaused}
              showAdditionalCards={showAdditionalCards}
              onCardExpansionChange={handleCardExpansionChange}
              currentUser={currentUser}
              isFullscreenTransition={isFullscreenTransition}
            />
          </div>

          {/* Tracking Controls - Only show when not in fullscreen */}
          {!isMapFullscreen && (
            <div className="relative z-10">
              <TrackingControls
                currentUser={currentUser}
                isTracking={isTracking}
                isPaused={isPaused}
                hasTrackingSession={displayHasTrackingSession}
                selectedResort={selectedResort}
                onStartTracking={handleStartTracking}
                onPauseTracking={handlePauseTracking}
                onStopTracking={handleStopTracking}
                showAnalyticsSection={showAnalyticsSection}
              />
            </div>
          )}

          {/* Detailed Analytics Section - Only show when not in fullscreen */}
          {!isMapFullscreen && showAnalyticsSection && (
            <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
              {/* Performance Charts */}
              <Card className="snowline-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Events & Challenges
                    </span>
                    <div className="flex items-center gap-2">
                      {isTracking && isEventsMode && (
                        <Badge variant="default" className="bg-green-500 text-white animate-pulse">
                          <Activity className="w-3 h-3 mr-1" />
                          Live Global Event
                        </Badge>
                      )}
                      {!hasProFeatures && (
                        <Badge variant="outline" className="border-primary/20 text-primary">
                          Pro Feature
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hasProFeatures ? (
                    <div className="space-y-6">
                      {/* Events Mode Toggle */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border border-pink-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">Ski For A Cure Global</h4>
                            <p className="text-sm text-muted-foreground">Join the world's largest charity ski movement</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="events-mode"
                            checked={isEventsMode}
                            onCheckedChange={handleToggleEventsMode}
                          />
                          <Label htmlFor="events-mode" className="sr-only">
                            Enable Ski For A Cure Global participation
                          </Label>
                        </div>
                      </div>

                      {isEventsMode ? (
                        <SkiForACureEvent
                          currentUser={currentUser}
                          onUpgrade={onUpgrade}
                          onJoinEvent={(eventId) => {
                            console.log('Joining Ski For A Cure Global event:', eventId);
                            // Handle global event joining logic
                          }}
                          onJoinTeam={(teamId) => {
                            console.log('Joining global team:', teamId);
                            // Handle global team joining logic
                          }}
                          onCreateTeam={() => {
                            console.log('Creating new global team');
                            // Handle global team creation logic
                          }}
                          onDonate={(amount) => {
                            console.log('Donating to global cause:', amount);
                            // Handle global donation logic
                          }}
                        />
                      ) : (
                        <div className="text-center py-8 space-y-4">
                          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                            <Heart className="w-8 h-8 text-pink-500" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold">Ski For A Cure Global Participation Disabled</h3>
                            <p className="text-muted-foreground text-sm">
                              Enable participation to join the world's largest charity ski movement, supporting cancer research through every kilometer skied and dollar raised globally.
                            </p>
                          </div>
                          <Button
                            onClick={handleToggleEventsMode}
                            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Join Ski For A Cure Global
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Events & Challenges</h3>
                        <p className="text-muted-foreground">
                          Unlock event participation, group challenges, competitions, and organized skiing events with Snowline Pro.
                        </p>
                      </div>
                      <Button onClick={() => onUpgrade?.()} className="mt-4">
                        <Mountain className="w-4 h-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Save Run Dialog */}
      <SaveRunDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveRun}
        trackingStats={trackingStats}
        selectedResort={selectedResort}
        runName={runName}
        runDescription={runDescription}
        isPublic={isPublic}
        onRunNameChange={setRunName}
        onRunDescriptionChange={setRunDescription}
        onIsPublicChange={setIsPublic}
        sessionDate={sessionStartTime}
        currentUser={currentUser}
        onUpgrade={onUpgrade}
        currentLocation={currentLocation}
        trackingData={[]}
      />

      {/* Resort Selector */}
      <ResortSelector
        isOpen={showResortSelector}
        onClose={() => onCloseResortSelector?.()}
        onSelectResort={handleResortSelect}
        selectedResort={selectedResort}
      />
    </div>
  );
}