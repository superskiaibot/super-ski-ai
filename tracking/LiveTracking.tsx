import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Square,
  Navigation,
  Zap,
  Activity,
  Clock,
  Mountain,
  Thermometer,
  Wind,
  Target,
  TrendingUp,
  MapPin,
  Camera,
  Video,
  Share2,
  Settings,
  Maximize,
  Minimize,
  Route,
  BarChart3,
  Map,
  Search,
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
  Filter,
  Snowflake,
  Eye,
  EyeOff,
  Layers,
  Info,
  CheckCircle,
  AlertCircle,
  Globe,
  Phone
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { MapView } from './MapView';
import { ElevationChart } from './ElevationChart';
import { User, SavedRun, Resort } from '../../src/types';

interface LiveStats {
  distance: number;
  duration: number;
  currentSpeed: number;
  maxSpeed: number;
  averageSpeed: number;
  vertical: number;
  altitude: number;
  calories: number;
  heartRate?: number;
}

interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: Date;
  speed: number;
  accuracy: number;
}

interface ResortDetails extends Resort {
  description?: string;
  elevation?: {
    base: number;
    summit: number;
    vertical: number;
  };
  trails?: {
    total: number;
    beginner: number;
    intermediate: number;
    advanced: number;
    expert: number;
  };
  lifts?: {
    total: number;
    types: string[];
  };
  snowReport?: {
    baseDepth: number;
    newSnow24h: number;
    conditions: string;
    lastUpdated: Date;
  };
  weather?: {
    temperature: {
      high: number;
      low: number;
    };
    conditions: string;
    windSpeed: number;
    visibility: string;
  };
  amenities?: string[];
  contact?: {
    phone: string;
    email: string;
    website: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  rating: number;
  reviews: number;
  isOpen: boolean;
  season?: {
    opening: string;
    closing: string;
  };
  ticketPrices?: {
    adult: number;
    child: number;
    senior: number;
  };
}

interface LiveTrackingProps {
  currentUser: User;
  selectedResort?: Resort;
  isTracking: boolean;
  onStartTracking: () => void;
  onPauseTracking: () => void;
  onStopTracking: () => void;
  onSaveRun: (run: SavedRun) => void;
}

export function LiveTracking({
  currentUser,
  selectedResort: initialSelectedResort,
  isTracking,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  onSaveRun
}: LiveTrackingProps) {
  const [trackingState, setTrackingState] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [selectedResort, setSelectedResort] = useState<ResortDetails | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'map' | 'elevation' | 'details'>('overview');
  
  // Section visibility states
  const [showResortSection, setShowResortSection] = useState(true);
  const [showStatsSection, setShowStatsSection] = useState(true);
  const [showMapSection, setShowMapSection] = useState(true);
  const [showDetailsSection, setShowDetailsSection] = useState(false);
  
  // Resort search states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [liveStats, setLiveStats] = useState<LiveStats>({
    distance: 0,
    duration: 0,
    currentSpeed: 0,
    maxSpeed: 0,
    averageSpeed: 0,
    vertical: 0,
    altitude: 2100,
    calories: 0,
    heartRate: 0
  });
  const [gpsTrack, setGpsTrack] = useState<GPSPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GPSPoint>({
    latitude: selectedResort?.coordinates?.latitude || 46.8182,
    longitude: selectedResort?.coordinates?.longitude || 8.2275,
    altitude: 2100,
    timestamp: new Date(),
    speed: 0,
    accuracy: 5
  });

  const startTime = useRef<Date | null>(null);
  const pausedTime = useRef<number>(0);
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);

  // Mock resort data
  const [resorts] = useState<ResortDetails[]>([
    {
      id: 'whistler',
      name: 'Whistler Blackcomb',
      location: 'Whistler, BC',
      country: 'Canada',
      website: 'https://whistlerblackcomb.com',
      logo: undefined,
      description: 'One of the largest ski resorts in North America, featuring two massive mountains with over 8,000 acres of skiable terrain.',
      elevation: {
        base: 652,
        summit: 2284,
        vertical: 1632
      },
      trails: {
        total: 200,
        beginner: 20,
        intermediate: 110,
        advanced: 58,
        expert: 12
      },
      lifts: {
        total: 37,
        types: ['Gondola', 'Express Quad', 'Triple Chair', 'Magic Carpet']
      },
      snowReport: {
        baseDepth: 185,
        newSnow24h: 12,
        conditions: 'Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -2, low: -8 },
        conditions: 'Light Snow',
        windSpeed: 15,
        visibility: 'Good'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Spa', 'Childcare'],
      contact: {
        phone: '+1-604-967-8950',
        email: 'info@whistlerblackcomb.com',
        website: 'https://whistlerblackcomb.com'
      },
      coordinates: {
        latitude: 50.1163,
        longitude: -122.9574
      },
      images: [],
      rating: 4.8,
      reviews: 15420,
      isOpen: true,
      season: {
        opening: 'November 23',
        closing: 'April 28'
      },
      ticketPrices: {
        adult: 159,
        child: 89,
        senior: 135
      }
    },
    {
      id: 'vail',
      name: 'Vail Ski Resort',
      location: 'Vail, Colorado',
      country: 'USA',
      website: 'https://vail.com',
      logo: undefined,
      description: 'America\'s largest ski mountain offering legendary back bowls and pristine groomed runs in the heart of Colorado.',
      elevation: {
        base: 2500,
        summit: 3527,
        vertical: 1027
      },
      trails: {
        total: 195,
        beginner: 18,
        intermediate: 53,
        advanced: 44,
        expert: 80
      },
      lifts: {
        total: 31,
        types: ['Gondola', 'High Speed Quad', 'Fixed Grip Quad', 'Triple Chair']
      },
      snowReport: {
        baseDepth: 142,
        newSnow24h: 8,
        conditions: 'Packed Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -1, low: -12 },
        conditions: 'Partly Cloudy',
        windSpeed: 12,
        visibility: 'Excellent'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Spa', 'Golf Course'],
      contact: {
        phone: '+1-970-476-9090',
        email: 'info@vail.com',
        website: 'https://vail.com'
      },
      coordinates: {
        latitude: 39.6403,
        longitude: -106.3742
      },
      images: [],
      rating: 4.7,
      reviews: 12890,
      isOpen: true,
      season: {
        opening: 'November 15',
        closing: 'April 21'
      },
      ticketPrices: {
        adult: 239,
        child: 149,
        senior: 199
      }
    },
    {
      id: 'chamonix',
      name: 'Chamonix Mont-Blanc',
      location: 'Chamonix, France',
      country: 'France',
      website: 'https://chamonix.com',
      logo: undefined,
      description: 'The birthplace of extreme skiing, offering legendary off-piste terrain and breathtaking views of Mont Blanc.',
      elevation: {
        base: 1035,
        summit: 3842,
        vertical: 2807
      },
      trails: {
        total: 155,
        beginner: 23,
        intermediate: 62,
        advanced: 45,
        expert: 25
      },
      lifts: {
        total: 47,
        types: ['Cable Car', 'Gondola', 'Express Quad', 'Chairlift']
      },
      snowReport: {
        baseDepth: 195,
        newSnow24h: 25,
        conditions: 'Fresh Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -5, low: -15 },
        conditions: 'Heavy Snow',
        windSpeed: 25,
        visibility: 'Limited'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Mountaineering', 'Glacier Tours'],
      contact: {
        phone: '+33-4-50-53-22-75',
        email: 'info@chamonix.com',
        website: 'https://chamonix.com'
      },
      coordinates: {
        latitude: 45.9237,
        longitude: 6.8694
      },
      images: [],
      rating: 4.9,
      reviews: 8750,
      isOpen: true,
      season: {
        opening: 'December 2',
        closing: 'May 5'
      },
      ticketPrices: {
        adult: 65,
        child: 55,
        senior: 59
      }
    },
    {
      id: 'st-anton',
      name: 'St. Anton am Arlberg',
      location: 'St. Anton, Austria',
      country: 'Austria',
      website: 'https://stantonamarlberg.com',
      logo: undefined,
      description: 'Legendary resort in the Austrian Alps known for challenging terrain, deep powder, and vibrant après-ski culture.',
      elevation: {
        base: 1304,
        summit: 2811,
        vertical: 1507
      },
      trails: {
        total: 305,
        beginner: 43,
        intermediate: 123,
        advanced: 89,
        expert: 50
      },
      lifts: {
        total: 88,
        types: ['Funicular', 'Cable Car', 'Gondola', 'Express Chairlift']
      },
      snowReport: {
        baseDepth: 168,
        newSnow24h: 18,
        conditions: 'Powder',
        lastUpdated: new Date()
      },
      weather: {
        temperature: { high: -3, low: -11 },
        conditions: 'Snowing',
        windSpeed: 18,
        visibility: 'Good'
      },
      amenities: ['Ski School', 'Equipment Rental', 'Dining', 'Shopping', 'Spa', 'Après-Ski'],
      contact: {
        phone: '+43-5446-22690',
        email: 'info@stantonamarlberg.com',
        website: 'https://stantonamarlberg.com'
      },
      coordinates: {
        latitude: 47.1333,
        longitude: 10.2667
      },
      images: [],
      rating: 4.6,
      reviews: 9840,
      isOpen: true,
      season: {
        opening: 'December 8',
        closing: 'April 28'
      },
      ticketPrices: {
        adult: 72,
        child: 43,
        senior: 65
      }
    }
  ]);

  // Initialize with first resort if none selected
  useEffect(() => {
    if (!selectedResort && resorts.length > 0) {
      setSelectedResort(resorts[0]);
    }
  }, [resorts, selectedResort]);

  // Filter resorts based on search
  const filteredResorts = resorts.filter(resort => 
    resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resort.location.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'vertical':
        return (b.elevation?.vertical || 0) - (a.elevation?.vertical || 0);
      default:
        return 0;
    }
  });

  // Mock GPS tracking simulation
  useEffect(() => {
    if (isTracking || trackingState === 'recording') {
      const interval = setInterval(() => {
        setCurrentLocation(prev => ({
          ...prev,
          latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
          altitude: prev.altitude + (Math.random() - 0.5) * 10,
          timestamp: new Date(),
          speed: Math.random() * 60 + 20,
          accuracy: Math.random() * 5 + 3
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTracking, trackingState]);

  // Start tracking
  const handleStartTracking = () => {
    if (!selectedResort) return;
    
    setTrackingState('recording');
    startTime.current = new Date();
    onStartTracking();
    
    // Auto-collapse resort section when tracking starts
    setShowResortSection(false);
    setShowStatsSection(true);
    setShowMapSection(true);
  };

  // Pause tracking
  const handlePauseTracking = () => {
    setTrackingState('paused');
    pausedTime.current += Date.now() - (startTime.current?.getTime() || 0);
    onPauseTracking();
  };

  // Resume tracking
  const handleResumeTracking = () => {
    setTrackingState('recording');
    startTime.current = new Date();
    onStartTracking();
  };

  // Stop tracking
  const handleStopTracking = () => {
    setTrackingState('idle');
    onStopTracking();
    
    // Show details section after stopping
    setShowDetailsSection(true);
    setShowResortSection(true);
    
    // Reset data
    setLiveStats({
      distance: 0,
      duration: 0,
      currentSpeed: 0,
      maxSpeed: 0,
      averageSpeed: 0,
      vertical: 0,
      altitude: 2100,
      calories: 0,
      heartRate: 0
    });
    setGpsTrack([]);
    startTime.current = null;
    pausedTime.current = 0;
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle favorite
  const toggleFavorite = (resortId: string) => {
    setFavorites(prev => 
      prev.includes(resortId) 
        ? prev.filter(id => id !== resortId)
        : [...prev, resortId]
    );
  };

  // Select resort
  const handleSelectResort = (resort: ResortDetails) => {
    setSelectedResort(resort);
    setCurrentLocation(prev => ({
      ...prev,
      latitude: resort.coordinates?.latitude || prev.latitude,
      longitude: resort.coordinates?.longitude || prev.longitude
    }));
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : ''}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Live Tracking</h1>
          <p className="text-muted-foreground">
            {selectedResort 
              ? `${trackingState === 'recording' ? 'Recording' : trackingState === 'paused' ? 'Paused' : 'Ready'} at ${selectedResort.name}`
              : 'Select a resort to begin tracking'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          
          <Badge variant={trackingState === 'recording' ? 'default' : trackingState === 'paused' ? 'secondary' : 'outline'}>
            {trackingState === 'recording' ? 'Recording' : trackingState === 'paused' ? 'Paused' : 'Ready'}
          </Badge>
        </div>
      </motion.div>

      {/* Resort Selection Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Collapsible open={showResortSection} onOpenChange={setShowResortSection}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Resort Selection
                    {selectedResort && (
                      <Badge variant="outline" className="ml-2">
                        {selectedResort.name}
                      </Badge>
                    )}
                  </div>
                  {showResortSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search resorts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Sort by Rating</SelectItem>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="vertical">Sort by Vertical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resort Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResorts.map((resort) => (
                    <motion.div
                      key={resort.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedResort?.id === resort.id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50 hover:shadow-sm'
                      }`}
                      onClick={() => handleSelectResort(resort)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold truncate">{resort.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{resort.location}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-6 h-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(resort.id);
                            }}
                          >
                            <Heart className={`w-3 h-3 ${favorites.includes(resort.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Badge variant={resort.isOpen ? 'default' : 'secondary'} className="text-xs">
                            {resort.isOpen ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">{resort.trails?.total}</div>
                          <div className="text-muted-foreground">Trails</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{resort.elevation?.vertical}m</div>
                          <div className="text-muted-foreground">Vertical</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{resort.rating}</div>
                          <div className="text-muted-foreground">Rating</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Snowflake className="w-3 h-3 text-blue-500" />
                          <span>{resort.snowReport?.baseDepth}cm</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Thermometer className="w-3 h-3 text-red-500" />
                          <span>{resort.weather?.temperature.high}°C</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </motion.div>

      {/* Recording Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-6">
              {trackingState === 'idle' && (
                <Button
                  onClick={handleStartTracking}
                  size="lg"
                  className="w-20 h-20 rounded-full text-lg"
                  disabled={!selectedResort}
                >
                  <Play className="w-8 h-8" />
                </Button>
              )}
              
              {trackingState === 'recording' && (
                <>
                  <Button
                    onClick={handlePauseTracking}
                    size="lg"
                    variant="outline"
                    className="w-16 h-16 rounded-full"
                  >
                    <Pause className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={handleStopTracking}
                    size="lg"
                    variant="destructive"
                    className="w-16 h-16 rounded-full"
                  >
                    <Square className="w-6 h-6" />
                  </Button>
                </>
              )}
              
              {trackingState === 'paused' && (
                <>
                  <Button
                    onClick={handleResumeTracking}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={handleStopTracking}
                    size="lg"
                    variant="destructive"
                    className="w-16 h-16 rounded-full"
                  >
                    <Square className="w-6 h-6" />
                  </Button>
                </>
              )}

              {trackingState !== 'idle' && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button variant="outline" size="lg">
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                </div>
              )}
            </div>

            {!selectedResort && trackingState === 'idle' && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Select a resort above to start tracking
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Live Stats Section */}
      {trackingState !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Collapsible open={showStatsSection} onOpenChange={setShowStatsSection}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Live Statistics
                    </div>
                    {showStatsSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Duration - White with Blue Border */}
                    <div className="text-center p-4 bg-white border-2 border-blue-400 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 mx-auto mb-2 shadow-sm">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-blue-700">{formatDuration(liveStats.duration)}</div>
                      <div className="text-sm text-blue-700/70 font-medium uppercase tracking-wide">Duration</div>
                    </div>

                    {/* Distance - White with Green Border */}
                    <div className="text-center p-4 bg-white border-2 border-green-400 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 mx-auto mb-2 shadow-sm">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-green-700">{liveStats.distance.toFixed(1)} km</div>
                      <div className="text-sm text-green-700/70 font-medium uppercase tracking-wide">Distance</div>
                    </div>

                    {/* Current Speed - White with Orange Border */}
                    <div className="text-center p-4 bg-white border-2 border-orange-400 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 mx-auto mb-2 shadow-sm">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-orange-700">{liveStats.currentSpeed.toFixed(1)}</div>
                      <div className="text-sm text-orange-700/70 font-medium uppercase tracking-wide">km/h</div>
                    </div>

                    {/* Max Speed - White with Purple Border */}
                    <div className="text-center p-4 bg-white border-2 border-purple-400 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 mx-auto mb-2 shadow-sm">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-purple-700">{liveStats.maxSpeed.toFixed(1)}</div>
                      <div className="text-sm text-purple-700/70 font-medium uppercase tracking-wide">Max km/h</div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>
      )}

      {/* Map and Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Collapsible open={showMapSection} onOpenChange={setShowMapSection}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Map & Analysis
                  </div>
                  {showMapSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="p-0">
                <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="w-full">
                  <div className="px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="map">Live Map</TabsTrigger>
                      <TabsTrigger value="elevation">Elevation</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="p-6 space-y-4">
                    {selectedResort && (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Current Resort</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Resort</div>
                            <div className="font-medium">{selectedResort.name}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Conditions</div>
                            <div className="font-medium">{selectedResort.snowReport?.conditions}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Temperature</div>
                            <div className="font-medium">{selectedResort.weather?.temperature.high}°C</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Wind</div>
                            <div className="font-medium">{selectedResort.weather?.windSpeed} km/h</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="map" className="p-0">
                    <div className="h-96">
                      <MapView
                        gpsTrack={gpsTrack}
                        currentLocation={currentLocation}
                        isTracking={trackingState === 'recording'}
                        showResorts={false}
                        showTrack={true}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="elevation" className="p-6">
                    <div className="h-64">
                      <ElevationChart gpsTrack={gpsTrack} />
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">GPS Accuracy</div>
                        <div className="font-medium">±{currentLocation.accuracy.toFixed(0)}m</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Track Points</div>
                        <div className="font-medium">{gpsTrack.length}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Altitude</div>
                        <div className="font-medium">{currentLocation.altitude.toFixed(0)}m</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Status</div>
                        <div className="font-medium">{trackingState}</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </motion.div>

      {/* Session Details (shown after stopping) */}
      {showDetailsSection && trackingState === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Session Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Great session! Your run has been automatically saved.
                </p>
              </div>
              
              <div className="flex justify-center space-x-2">
                <Button>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Session
                </Button>
                <Button variant="outline">
                  View Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}