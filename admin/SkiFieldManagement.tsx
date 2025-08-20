import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mountain,
  Settings,
  Activity,
  Users,
  AlertTriangle,
  DollarSign,
  Calendar,
  MapPin,
  Thermometer,
  Cloud,
  Wind,
  Snowflake,
  Cable,
  Map,
  Megaphone,
  Shield,
  BarChart3,
  Clock,
  Edit,
  Save,
  X,
  Plus,
  Minus,
  Power,
  PowerOff,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Coffee,
  Utensils,
  Parking,
  Wifi,
  Camera,
  Radio,
  Siren,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { User as UserType } from '../../src/types/index';

interface SkiFieldManagementProps {
  currentUser: UserType;
  onBack: () => void;
}

interface LiftData {
  id: string;
  name: string;
  type: 'chairlift' | 'gondola' | 'surface' | 'tbar' | 'platter';
  status: 'operational' | 'closed' | 'maintenance' | 'delayed';
  capacity: number;
  waitTime: number;
  vertical: number;
  length: number;
}

interface TrailData {
  id: string;
  name: string;
  difficulty: 'green' | 'blue' | 'black' | 'double-black';
  status: 'open' | 'closed' | 'groomed' | 'powder';
  length: number;
  vertical: number;
  groomed: boolean;
}

interface WeatherData {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: string;
  visibility: string;
  snowfall24h: number;
  snowfall7d: number;
  snowDepth: number;
  conditions: string;
  lastUpdated: Date;
}

export function SkiFieldManagement({ currentUser, onBack }: SkiFieldManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Resort Information State
  const [resortInfo, setResortInfo] = useState({
    name: 'Coronet Peak',
    location: 'Queenstown, New Zealand',
    elevation: { base: 1195, summit: 1649 },
    established: 1947,
    trailCount: 28,
    liftCount: 6,
    skiableArea: 280,
    website: 'https://coronetpeak.co.nz',
    phone: '+64 3 450 1970',
    description: 'Coronet Peak is New Zealand\'s original ski resort, offering spectacular views of Lake Wakatipu and the Remarkables mountain range.',
    operatingHours: { open: '9:00', close: '16:00' },
    seasonStart: 'June 15',
    seasonEnd: 'October 15'
  });

  // Weather State
  const [weather, setWeather] = useState<WeatherData>({
    temperature: -5,
    feelsLike: -8,
    windSpeed: 15,
    windDirection: 'SW',
    visibility: 'Good',
    snowfall24h: 12,
    snowfall7d: 45,
    snowDepth: 85,
    conditions: 'Fresh Snow',
    lastUpdated: new Date()
  });

  // Lifts State
  const [lifts, setLifts] = useState<LiftData[]>([
    { id: 'l1', name: 'Coronet Express', type: 'chairlift', status: 'operational', capacity: 6, waitTime: 5, vertical: 481, length: 1230 },
    { id: 'l2', name: 'M1 Express', type: 'chairlift', status: 'operational', capacity: 4, waitTime: 8, vertical: 395, length: 1050 },
    { id: 'l3', name: 'Big Easy', type: 'chairlift', status: 'closed', capacity: 4, waitTime: 0, vertical: 285, length: 740 },
    { id: 'l4', name: 'Greengates', type: 'surface', status: 'operational', capacity: 2, waitTime: 2, vertical: 120, length: 280 },
    { id: 'l5', name: 'Rocky Gully T-Bar', type: 'tbar', status: 'maintenance', capacity: 2, waitTime: 0, vertical: 165, length: 420 },
    { id: 'l6', name: 'Coronet Peak Platter', type: 'platter', status: 'operational', capacity: 1, waitTime: 3, vertical: 95, length: 180 }
  ]);

  // Trails State
  const [trails, setTrails] = useState<TrailData[]>([
    { id: 't1', name: 'Meadows', difficulty: 'green', status: 'open', length: 1200, vertical: 180, groomed: true },
    { id: 't2', name: 'Easy Rider', difficulty: 'green', status: 'open', length: 1800, vertical: 285, groomed: true },
    { id: 't3', name: 'Coronet Bowl', difficulty: 'blue', status: 'open', length: 1500, vertical: 320, groomed: false },
    { id: 't4', name: 'M1 Run', difficulty: 'blue', status: 'open', length: 2100, vertical: 395, groomed: true },
    { id: 't5', name: 'Back Bowl', difficulty: 'black', status: 'powder', length: 1200, vertical: 285, groomed: false },
    { id: 't6', name: 'Coronet Face', difficulty: 'black', status: 'open', length: 900, vertical: 380, groomed: false },
    { id: 't7', name: 'Rocky Gully', difficulty: 'double-black', status: 'closed', length: 600, vertical: 285, groomed: false }
  ]);

  // Pricing State
  const [pricing, setPricing] = useState({
    adultDay: 129,
    childDay: 59,
    seniorDay: 99,
    seasonPass: 1299,
    beginner: 89,
    halfDay: 89,
    night: 49,
    parking: 15
  });

  // Analytics State
  const [analytics, setAnalytics] = useState({
    visitorsToday: 1247,
    visitorsYesterday: 1189,
    averageVisitDuration: '4h 23m',
    liftUtilization: 78,
    popularTrails: ['M1 Run', 'Coronet Bowl', 'Easy Rider'],
    revenue: { today: 161830, thisWeek: 892450, thisMonth: 3247890 },
    busyPeriods: ['10:00-12:00', '13:00-15:00'],
    weatherImpact: 'positive'
  });

  const handleLiftStatusChange = (liftId: string, newStatus: LiftData['status']) => {
    setLifts(prev => prev.map(lift => 
      lift.id === liftId ? { ...lift, status: newStatus } : lift
    ));
  };

  const handleTrailStatusChange = (trailId: string, newStatus: TrailData['status']) => {
    setTrails(prev => prev.map(trail => 
      trail.id === trailId ? { ...trail, status: newStatus } : trail
    ));
  };

  const handleEmergencyToggle = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      setShowSafetyAlert(true);
    }
  };

  const getLiftStatusColor = (status: LiftData['status']) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'delayed': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrailStatusColor = (status: TrailData['status']) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-red-600 bg-red-50 border-red-200';
      case 'groomed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'powder': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: TrailData['difficulty']) => {
    switch (difficulty) {
      case 'green': return 'text-green-600 bg-green-100';
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'black': return 'text-gray-900 bg-gray-200';
      case 'double-black': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background overflow-hidden">
      {/* Enhanced Header */}
      <div className="border-b border-border bg-card/95 backdrop-blur-lg">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Ski Field Management</h1>
                <p className="text-sm text-muted-foreground">{resortInfo.name} Operations Center</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {emergencyMode && (
              <Badge variant="destructive" className="animate-pulse">
                <Siren className="w-3 h-3 mr-1" />
                Emergency Mode
              </Badge>
            )}
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
            <Button
              variant={emergencyMode ? "destructive" : "outline"}
              size="sm"
              onClick={handleEmergencyToggle}
              className="rounded-xl"
            >
              <Shield className="w-4 h-4 mr-2" />
              Emergency {emergencyMode ? 'Active' : 'Standby'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b border-border bg-card/50 px-6 py-4">
              <TabsList className="grid w-full grid-cols-7 max-w-4xl">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="lifts" className="flex items-center gap-2">
                  <Cable className="w-4 h-4" />
                  Lifts
                </TabsTrigger>
                <TabsTrigger value="trails" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Trails
                </TabsTrigger>
                <TabsTrigger value="weather" className="flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  Weather
                </TabsTrigger>
                <TabsTrigger value="pricing" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Safety
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="snowline-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{analytics.visitorsToday.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Visitors Today</p>
                          <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{Math.round(((analytics.visitorsToday - analytics.visitorsYesterday) / analytics.visitorsYesterday) * 100)}% vs yesterday
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{analytics.liftUtilization}%</p>
                          <p className="text-sm text-muted-foreground">Lift Utilization</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {lifts.filter(l => l.status === 'operational').length} of {lifts.length} operational
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">${analytics.revenue.today.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Revenue Today</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ${analytics.revenue.thisWeek.toLocaleString()} this week
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                          <Snowflake className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{weather.snowDepth}cm</p>
                          <p className="text-sm text-muted-foreground">Snow Depth</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            +{weather.snowfall24h}cm last 24h
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5" />
                        <span>Live Operations Status</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Lifts</p>
                          <div className="flex space-x-1">
                            {lifts.map(lift => (
                              <div
                                key={lift.id}
                                className={`w-3 h-3 rounded-full ${
                                  lift.status === 'operational' ? 'bg-green-500' : 
                                  lift.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                title={`${lift.name}: ${lift.status}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {lifts.filter(l => l.status === 'operational').length} operational
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Trails</p>
                          <div className="flex space-x-1">
                            {trails.map(trail => (
                              <div
                                key={trail.id}
                                className={`w-3 h-3 rounded-full ${
                                  trail.status === 'open' ? 'bg-green-500' : 
                                  trail.status === 'groomed' ? 'bg-blue-500' :
                                  trail.status === 'powder' ? 'bg-purple-500' : 'bg-red-500'
                                }`}
                                title={`${trail.name}: ${trail.status}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {trails.filter(t => t.status === 'open' || t.status === 'groomed' || t.status === 'powder').length} open
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Overall Status</span>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Operational
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          All critical systems operational. Weather conditions: {weather.conditions}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Cloud className="w-5 h-5" />
                        <span>Current Weather</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Thermometer className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">Temperature</span>
                          </div>
                          <p className="text-xl font-bold">{weather.temperature}°C</p>
                          <p className="text-xs text-muted-foreground">Feels like {weather.feelsLike}°C</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Wind className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Wind</span>
                          </div>
                          <p className="text-xl font-bold">{weather.windSpeed} km/h</p>
                          <p className="text-xs text-muted-foreground">{weather.windDirection} direction</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">24h Snow</p>
                            <p className="text-lg font-semibold text-blue-600">{weather.snowfall24h}cm</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">7d Snow</p>
                            <p className="text-lg font-semibold text-blue-600">{weather.snowfall7d}cm</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Visibility</p>
                            <p className="text-lg font-semibold text-green-600">{weather.visibility}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="lifts" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Lift Operations</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage lift status, wait times, and maintenance schedules
                    </p>
                  </div>
                  <Button className="rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lift
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {lifts.map(lift => (
                    <Card key={lift.id} className="snowline-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <div>
                          <CardTitle className="text-lg">{lift.name}</CardTitle>
                          <CardDescription className="capitalize">{lift.type}</CardDescription>
                        </div>
                        <Badge className={getLiftStatusColor(lift.status)}>
                          {lift.status === 'operational' ? <Power className="w-3 h-3 mr-1" /> : 
                           lift.status === 'closed' ? <PowerOff className="w-3 h-3 mr-1" /> :
                           lift.status === 'maintenance' ? <Settings className="w-3 h-3 mr-1" /> :
                           <Clock className="w-3 h-3 mr-1" />}
                          {lift.status}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Capacity</p>
                            <p className="text-sm font-semibold">{lift.capacity} persons</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Wait Time</p>
                            <p className="text-sm font-semibold">{lift.waitTime} minutes</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vertical</p>
                            <p className="text-sm font-semibold">{lift.vertical}m</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Length</p>
                            <p className="text-sm font-semibold">{lift.length}m</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Select value={lift.status} onValueChange={(value) => handleLiftStatusChange(lift.id, value as LiftData['status'])}>
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="operational">Operational</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="delayed">Delayed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trails" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Trail Management</h2>
                    <p className="text-sm text-muted-foreground">
                      Monitor and update trail conditions and grooming status
                    </p>
                  </div>
                  <Button className="rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Trail
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trails.map(trail => (
                    <Card key={trail.id} className="snowline-card">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{trail.name}</CardTitle>
                          <Badge className={getDifficultyColor(trail.difficulty)}>
                            {trail.difficulty === 'double-black' ? '◆◆' : 
                             trail.difficulty === 'black' ? '◆' :
                             trail.difficulty === 'blue' ? '■' : '●'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={getTrailStatusColor(trail.status)}>
                            {trail.status === 'open' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                             trail.status === 'closed' ? <XCircle className="w-3 h-3 mr-1" /> :
                             trail.status === 'groomed' ? <Zap className="w-3 h-3 mr-1" /> :
                             <Snowflake className="w-3 h-3 mr-1" />}
                            {trail.status}
                          </Badge>
                          {trail.groomed && (
                            <Badge variant="secondary" className="text-xs">
                              Groomed
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Length:</span> {trail.length}m
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vertical:</span> {trail.vertical}m
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Select value={trail.status} onValueChange={(value) => handleTrailStatusChange(trail.id, value as TrailData['status'])}>
                            <SelectTrigger className="flex-1 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="groomed">Groomed</SelectItem>
                              <SelectItem value="powder">Fresh Powder</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="weather" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Weather Monitoring</h2>
                    <p className="text-sm text-muted-foreground">
                      Real-time weather data and snow conditions
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="rounded-xl">
                      <Camera className="w-4 h-4 mr-2" />
                      Weather Cam
                    </Button>
                    <Button className="rounded-xl">
                      <Edit className="w-4 h-4 mr-2" />
                      Update Conditions
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="snowline-card lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Current Conditions</CardTitle>
                      <CardDescription>
                        Last updated: {weather.lastUpdated.toLocaleTimeString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center space-y-2">
                          <Thermometer className="w-8 h-8 mx-auto text-blue-500" />
                          <p className="text-2xl font-bold">{weather.temperature}°C</p>
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="text-xs text-muted-foreground">Feels like {weather.feelsLike}°C</p>
                        </div>
                        <div className="text-center space-y-2">
                          <Wind className="w-8 h-8 mx-auto text-green-500" />
                          <p className="text-2xl font-bold">{weather.windSpeed}</p>
                          <p className="text-sm text-muted-foreground">km/h Wind</p>
                          <p className="text-xs text-muted-foreground">{weather.windDirection} Direction</p>
                        </div>
                        <div className="text-center space-y-2">
                          <Eye className="w-8 h-8 mx-auto text-purple-500" />
                          <p className="text-2xl font-bold">{weather.visibility}</p>
                          <p className="text-sm text-muted-foreground">Visibility</p>
                          <p className="text-xs text-muted-foreground">{weather.conditions}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-4">Snow Report</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-blue-600">{weather.snowDepth}cm</p>
                            <p className="text-sm text-muted-foreground">Base Depth</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-blue-600">{weather.snowfall24h}cm</p>
                            <p className="text-sm text-muted-foreground">24 Hours</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-blue-600">{weather.snowfall7d}cm</p>
                            <p className="text-sm text-muted-foreground">7 Days</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle>Weather Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-800">Wind Advisory</p>
                            <p className="text-xs text-yellow-700">Strong winds expected above 1400m elevation</p>
                            <p className="text-xs text-yellow-600 mt-1">Valid until 6:00 PM</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <Snowflake className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800">Fresh Snow</p>
                            <p className="text-xs text-blue-700">15-20cm expected overnight</p>
                            <p className="text-xs text-blue-600 mt-1">Starting at 10:00 PM</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Alert
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Pricing Management</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage lift ticket and service pricing
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="rounded-xl">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Pricing Analytics
                    </Button>
                    <Button className="rounded-xl">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle>Lift Tickets</CardTitle>
                      <CardDescription>Daily and seasonal pass pricing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Adult Day Pass</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.adultDay}
                              onChange={(e) => setPricing(prev => ({ ...prev, adultDay: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Child Day Pass</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.childDay}
                              onChange={(e) => setPricing(prev => ({ ...prev, childDay: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Senior Day Pass</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.seniorDay}
                              onChange={(e) => setPricing(prev => ({ ...prev, seniorDay: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Half Day Pass</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.halfDay}
                              onChange={(e) => setPricing(prev => ({ ...prev, halfDay: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Beginner Package</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.beginner}
                              onChange={(e) => setPricing(prev => ({ ...prev, beginner: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Night Skiing</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.night}
                              onChange={(e) => setPricing(prev => ({ ...prev, night: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle>Additional Services</CardTitle>
                      <CardDescription>Equipment rental and other services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Season Pass</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.seasonPass}
                              onChange={(e) => setPricing(prev => ({ ...prev, seasonPass: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Parking</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">NZD</span>
                            <Input
                              type="number"
                              value={pricing.parking}
                              onChange={(e) => setPricing(prev => ({ ...prev, parking: Number(e.target.value) }))}
                              className="w-20 text-right"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Dynamic Pricing</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Weekend Premium</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Holiday Surcharge</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Weather Discount</span>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle>Revenue Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">${analytics.revenue.today.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Today</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">${analytics.revenue.thisWeek.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">This Week</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">${analytics.revenue.thisMonth.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Safety & Emergency</h2>
                    <p className="text-sm text-muted-foreground">
                      Emergency protocols and safety management
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="rounded-xl">
                      <Radio className="w-4 h-4 mr-2" />
                      Patrol Radio
                    </Button>
                    <Button 
                      variant={emergencyMode ? "destructive" : "outline"}
                      className="rounded-xl"
                      onClick={handleEmergencyToggle}
                    >
                      <Siren className="w-4 h-4 mr-2" />
                      Emergency Mode
                    </Button>
                  </div>
                </div>

                {emergencyMode && (
                  <Card className="snowline-card border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-800 flex items-center space-x-2">
                        <Siren className="w-5 h-5" />
                        <span>Emergency Mode Active</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-red-700">
                          All safety protocols are in emergency mode. This affects lift operations, trail access, and guest communications.
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="destructive" className="rounded-xl">
                            Broadcast Emergency Alert
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl">
                            Contact Emergency Services
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle>Safety Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">All Systems Normal</p>
                              <p className="text-xs text-green-700">No active safety alerts</p>
                            </div>
                          </div>
                          <Switch checked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">High Wind Warning</p>
                              <p className="text-xs text-yellow-700">Ridge areas affected</p>
                            </div>
                          </div>
                          <Switch checked={true} />
                        </div>
                      </div>
                      
                      <Button className="w-full rounded-xl">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Safety Alert
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle>Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-xl">
                          <div>
                            <p className="text-sm font-medium">Ski Patrol</p>
                            <p className="text-xs text-muted-foreground">On-mountain emergency response</p>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            Call
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-xl">
                          <div>
                            <p className="text-sm font-medium">Medical Center</p>
                            <p className="text-xs text-muted-foreground">Base lodge medical facility</p>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            Call
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-xl">
                          <div>
                            <p className="text-sm font-medium">Emergency Services</p>
                            <p className="text-xs text-muted-foreground">111 - Police, Fire, Ambulance</p>
                          </div>
                          <Button size="sm" variant="destructive" className="rounded-lg">
                            Call 111
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle>Incident Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Minor Injury - Trail 5</p>
                            <p className="text-xs text-muted-foreground">Reported 2 hours ago • Ski Patrol responding</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-lg">View</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Lift 2 - Mechanical Check</p>
                            <p className="text-xs text-muted-foreground">Completed 4 hours ago • All clear</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-lg">View</Button>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Incident Report
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Resort Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure resort information and operational settings
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="rounded-xl" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button className="rounded-xl">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle>Resort Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Resort Name</label>
                        <Input
                          value={resortInfo.name}
                          onChange={(e) => setResortInfo(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={resortInfo.location}
                          onChange={(e) => setResortInfo(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Base Elevation (m)</label>
                          <Input
                            type="number"
                            value={resortInfo.elevation.base}
                            onChange={(e) => setResortInfo(prev => ({ 
                              ...prev, 
                              elevation: { ...prev.elevation, base: Number(e.target.value) }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Summit Elevation (m)</label>
                          <Input
                            type="number"
                            value={resortInfo.elevation.summit}
                            onChange={(e) => setResortInfo(prev => ({ 
                              ...prev, 
                              elevation: { ...prev.elevation, summit: Number(e.target.value) }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={resortInfo.description}
                          onChange={(e) => setResortInfo(prev => ({ ...prev, description: e.target.value }))}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          value={resortInfo.phone}
                          onChange={(e) => setResortInfo(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input
                          value={resortInfo.website}
                          onChange={(e) => setResortInfo(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Opening Time</label>
                          <Input
                            value={resortInfo.operatingHours.open}
                            onChange={(e) => setResortInfo(prev => ({ 
                              ...prev, 
                              operatingHours: { ...prev.operatingHours, open: e.target.value }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Closing Time</label>
                          <Input
                            value={resortInfo.operatingHours.close}
                            onChange={(e) => setResortInfo(prev => ({ 
                              ...prev, 
                              operatingHours: { ...prev.operatingHours, close: e.target.value }
                            }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Season Start</label>
                          <Input
                            value={resortInfo.seasonStart}
                            onChange={(e) => setResortInfo(prev => ({ ...prev, seasonStart: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Season End</label>
                          <Input
                            value={resortInfo.seasonEnd}
                            onChange={(e) => setResortInfo(prev => ({ ...prev, seasonEnd: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle>Operational Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Lift Operations</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Auto-update wait times</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Wind speed monitoring</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Capacity alerts</span>
                            <Switch />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Weather Updates</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Auto weather sync</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Snow depth sensors</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Avalanche alerts</span>
                            <Switch />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Guest Services</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Mobile notifications</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Live chat support</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Social media updates</span>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Safety Alert Dialog */}
      <AlertDialog open={showSafetyAlert} onOpenChange={setShowSafetyAlert}>
        <AlertDialogContent className="snowline-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
              <Siren className="w-5 h-5" />
              <span>Emergency Mode Activated</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to activate emergency mode. This will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Close all lifts immediately</li>
                <li>Restrict trail access</li>
                <li>Alert all staff and patrol</li>
                <li>Send emergency notifications to guests</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Confirm Emergency Mode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}