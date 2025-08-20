import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  TrendingUp, 
  Mountain, 
  Clock, 
  Trophy, 
  Users, 
  MapPin, 
  Crown,
  Zap,
  BarChart3,
  Calendar,
  Target,
  Award,
  ChevronRight,
  Cloud,
  CloudSnow,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Eye,
  Snowflake,
  CloudDrizzle,
  Cloudy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { UpgradePrompt, FeatureLockOverlay } from './UpgradePrompt';
import { User as UserType, SavedRun } from '../src/types/index';
import { hasFeature, getPlanLimits, FeatureUsageTracker } from '../src/utils/featureGates';

interface DashboardProps {
  currentUser: UserType;
  runs: SavedRun[];
  onUpgrade?: () => void;
}

interface WeatherCondition {
  condition: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  snowDepth: number;
  lastSnowfall: string;
  skiConditions: 'excellent' | 'good' | 'fair' | 'poor';
  resort: string;
  forecast: {
    today: { high: number; low: number; condition: string; icon: string; };
    tomorrow: { high: number; low: number; condition: string; icon: string; };
    dayAfter: { high: number; low: number; condition: string; icon: string; };
  };
}

interface DashboardStats {
  totalRuns: number;
  totalDistance: number;
  totalVertical: number;
  averageSpeed: number;
  maxSpeed: number;
  totalTime: number;
  favoriteResort: string;
  thisWeekRuns: number;
  thisWeekDistance: number;
}

export function Dashboard({ currentUser, runs, onUpgrade }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const isProUser = currentUser?.isVerified || false;
  const planLimits = getPlanLimits(currentUser);
  const usageTracker = FeatureUsageTracker.getInstance();

  // Calculate dashboard statistics
  useEffect(() => {
    if (runs.length > 0) {
      const totalDistance = runs.reduce((sum, run) => sum + run.stats.distance, 0);
      const totalVertical = runs.reduce((sum, run) => sum + run.stats.vertical, 0);
      const totalTime = runs.reduce((sum, run) => sum + run.stats.duration, 0);
      const maxSpeed = Math.max(...runs.map(run => run.stats.maxSpeed));
      const averageSpeed = runs.reduce((sum, run) => sum + run.stats.averageSpeed, 0) / runs.length;

      // Calculate this week's stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeekRuns = runs.filter(run => run.startTime >= oneWeekAgo);
      const thisWeekDistance = thisWeekRuns.reduce((sum, run) => sum + run.stats.distance, 0);

      // Find most frequent resort
      const resortCounts = runs.reduce((acc, run) => {
        acc[run.resort.name] = (acc[run.resort.name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const favoriteResort = Object.entries(resortCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

      setStats({
        totalRuns: runs.length,
        totalDistance,
        totalVertical,
        averageSpeed,
        maxSpeed,
        totalTime,
        favoriteResort,
        thisWeekRuns: thisWeekRuns.length,
        thisWeekDistance
      });
    } else {
      // Default stats if no runs
      setStats({
        totalRuns: 0,
        totalDistance: 0,
        totalVertical: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        totalTime: 0,
        favoriteResort: 'No data yet',
        thisWeekRuns: 0,
        thisWeekDistance: 0
      });
    }
  }, [runs]);

  // Initialize weather data
  useEffect(() => {
    // Mock weather data for the user's favorite resort
    const mockWeather: WeatherCondition = {
      condition: 'Fresh Snow',
      temperature: -8,
      feelsLike: -12,
      humidity: 78,
      windSpeed: 15,
      windDirection: 'NW',
      visibility: 8,
      snowDepth: 145,
      lastSnowfall: '6 hours ago',
      skiConditions: 'excellent',
      resort: stats?.favoriteResort || 'Whistler Blackcomb',
      forecast: {
        today: { high: -5, low: -12, condition: 'Snow Showers', icon: 'snow' },
        tomorrow: { high: -3, low: -9, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
        dayAfter: { high: -1, low: -7, condition: 'Sunny', icon: 'sunny' }
      }
    };
    setWeather(mockWeather);
  }, [stats?.favoriteResort]);

  // Weather icon helper function
  const getWeatherIcon = (iconType: string, size: number = 20) => {
    const iconProps = { className: `w-${size/4} h-${size/4}` };
    
    switch (iconType) {
      case 'snow':
        return <CloudSnow {...iconProps} />;
      case 'partly-cloudy':
        return <Cloud {...iconProps} />;
      case 'sunny':
        return <Sun {...iconProps} />;
      case 'cloudy':
        return <Cloudy {...iconProps} />;
      case 'rain':
        return <CloudRain {...iconProps} />;
      case 'drizzle':
        return <CloudDrizzle {...iconProps} />;
      default:
        return <Cloud {...iconProps} />;
    }
  };

  // Get ski condition color
  const getSkiConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDistance = (distance: number) => {
    return planLimits.analyticsLevel === 'advanced' 
      ? `${distance.toFixed(2)} km`
      : `${Math.round(distance)} km`;
  };

  // Add formatVertical function for consistent vertical meters display
  const formatVertical = (meters: number) => {
    if (meters >= 1000) {
      return planLimits.analyticsLevel === 'advanced' 
        ? `${(meters / 1000).toFixed(2)} km`
        : `${Math.round(meters / 1000)} km`;
    }
    return planLimits.analyticsLevel === 'advanced' 
      ? `${meters.toFixed(0)} m`
      : `${Math.round(meters)} m`;
  };

  const formatSpeed = (speed: number) => {
    return planLimits.analyticsLevel === 'advanced'
      ? `${speed.toFixed(1)} km/h`
      : `${Math.round(speed)} km/h`;
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {currentUser.displayName || currentUser.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's your skiing activity overview
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isProUser ? (
                <Badge className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Member
                </Badge>
              ) : (
                <Button variant="outline" onClick={onUpgrade} className="group">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalRuns}</p>
                    <p className="text-sm text-muted-foreground">Total Runs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Mountain className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatDistance(stats.totalDistance)}</p>
                    <p className="text-sm text-muted-foreground">Distance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round(stats.totalVertical)}m</p>
                    <p className="text-sm text-muted-foreground">Vertical</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatSpeed(stats.maxSpeed)}</p>
                    <p className="text-sm text-muted-foreground">Max Speed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Conditions */}
          {weather && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="snowline-card h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CloudSnow className="w-4 h-4 text-blue-600" />
                    </div>
                    Mountain Weather
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Current conditions at {weather.resort}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Conditions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        {getWeatherIcon('snow', 24)}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{weather.temperature}°C</p>
                        <p className="text-sm text-muted-foreground">{weather.condition}</p>
                      </div>
                    </div>
                    <Badge className={`px-3 py-1 ${getSkiConditionColor(weather.skiConditions)}`}>
                      {weather.skiConditions.charAt(0).toUpperCase() + weather.skiConditions.slice(1)}
                    </Badge>
                  </div>

                  {/* Weather Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Wind className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-muted-foreground font-medium">Wind</span>
                      </div>
                      <p className="text-sm font-semibold">{weather.windSpeed} km/h {weather.windDirection}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-muted-foreground font-medium">Visibility</span>
                      </div>
                      <p className="text-sm font-semibold">{weather.visibility} km</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Snowflake className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-muted-foreground font-medium">Snow Base</span>
                      </div>
                      <p className="text-sm font-semibold">{weather.snowDepth} cm</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-muted-foreground font-medium">Last Snow</span>
                      </div>
                      <p className="text-sm font-semibold">{weather.lastSnowfall}</p>
                    </div>
                  </div>

                  {/* 3-Day Forecast */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">3-Day Forecast</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Today', data: weather.forecast.today },
                        { label: 'Tomorrow', data: weather.forecast.tomorrow },
                        { label: 'Day After', data: weather.forecast.dayAfter }
                      ].map((day, index) => (
                        <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getWeatherIcon(day.data.icon, 16)}
                            <span className="text-sm font-medium text-foreground">{day.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{day.data.condition}</span>
                            <span className="text-sm font-semibold text-foreground">
                              {day.data.high}°/{day.data.low}°
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* This Week's Progress */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  This Week's Progress
                </CardTitle>
                <CardDescription>
                  Your skiing activity for the past 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stats.thisWeekRuns}</p>
                    <p className="text-sm text-muted-foreground">Runs completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatDistance(stats.thisWeekDistance)}</p>
                    <p className="text-sm text-muted-foreground">Distance covered</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Goal</span>
                    <span>{stats.thisWeekRuns}/5 runs</span>
                  </div>
                  <Progress value={(stats.thisWeekRuns / 5) * 100} className="h-2" />
                </div>

                {!isProUser && stats.thisWeekRuns >= 3 && (
                  <div className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary font-medium mb-1">
                      🚀 You're crushing it this week!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upgrade to Pro to unlock detailed weekly insights and personalized goals.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Analytics
                  {!isProUser && <Crown className="w-4 h-4 text-primary ml-auto" />}
                </CardTitle>
                <CardDescription>
                  {isProUser 
                    ? 'Advanced insights into your skiing performance'
                    : 'Basic performance overview (Upgrade for detailed analytics)'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProUser ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{formatSpeed(stats.averageSpeed)}</p>
                        <p className="text-sm text-muted-foreground">Avg Speed</p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{formatDuration(stats.totalTime)}</p>
                        <p className="text-sm text-muted-foreground">Total Time</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="font-medium">Favorite Resort</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{stats.favoriteResort}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium">Performance Trend</p>
                      <div className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Improving consistently</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FeatureLockOverlay
                    feature="Advanced Analytics"
                    description="Unlock detailed performance insights, trends, and personalized recommendations to improve your skiing."
                    onUpgrade={onUpgrade}
                  >
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{formatSpeed(stats.averageSpeed)}</p>
                          <p className="text-sm text-muted-foreground">Avg Speed</p>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{formatDuration(stats.totalTime)}</p>
                          <p className="text-sm text-muted-foreground">Total Time</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-medium">Advanced Metrics</p>
                        <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                          <p className="text-muted-foreground">Detailed charts and insights</p>
                        </div>
                      </div>
                    </div>
                  </FeatureLockOverlay>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Runs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest skiing adventures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {runs.slice(0, 3).map((run, index) => (
                  <div key={run.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mountain className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium truncate">{run.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatVertical(run.stats.vertical)}</span>
                        <span>•</span>
                        <span>{formatDistance(run.stats.distance)} distance</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {run.stats.difficulty}
                    </Badge>
                  </div>
                ))}
                
                {runs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mountain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No runs recorded yet</p>
                    <p className="text-sm">Start tracking to see your activity here!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                  {planLimits.achievementSystem === 'basic' && (
                    <Crown className="w-4 h-4 text-primary ml-auto" />
                  )}
                </CardTitle>
                <CardDescription>
                  {planLimits.achievementSystem === 'full'
                    ? 'Your skiing milestones and badges'
                    : 'Basic achievements (Upgrade for full system)'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {planLimits.achievementSystem === 'full' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800">Speed Demon</p>
                          <p className="text-xs text-yellow-600">Hit 60+ km/h</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Mountain className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800">Explorer</p>
                          <p className="text-xs text-blue-600">5 different resorts</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Next: Marathon Skier</span>
                        <span>{stats.totalDistance.toFixed(1)}/50 km</span>
                      </div>
                      <Progress value={(stats.totalDistance / 50) * 100} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                        <Award className="w-6 h-6 text-muted-foreground" />
                        <div>
                          <p className="font-medium">First Run</p>
                          <p className="text-xs text-muted-foreground">Complete 1 run</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg opacity-50">
                        <Mountain className="w-6 h-6 text-muted-foreground" />
                        <div>
                          <p className="font-medium">???</p>
                          <p className="text-xs text-muted-foreground">Unlock with Pro</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary font-medium mb-1">
                        🏆 Unlock Full Achievement System
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Get access to 25+ achievements, progress tracking, and exclusive badges.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upgrade Prompt for Basic Users */}
        {!isProUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8"
          >
            <UpgradePrompt
              feature="Advanced Dashboard Analytics"
              description="Unlock detailed performance insights, advanced achievements, comprehensive reports, and personalized recommendations to take your skiing to the next level."
              onUpgrade={onUpgrade}
              showDismiss={false}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}