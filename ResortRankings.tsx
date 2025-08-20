import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Trophy,
  Crown,
  Medal,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  MapPin,
  Mountain,
  Thermometer,
  Zap,
  Target,
  Activity,
  Award,
  ChevronDown,
  MessageCircle,
  Share2,
  BarChart3,
  Map,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

// Import types
import { User, SavedRun, Resort } from '../src/types/index';

interface ResortRankingsProps {
  resort: Resort;
  currentUser?: User;
  runs?: SavedRun[];
  onBack: () => void;
  onUpgrade?: () => void;
}

interface SimpleLeaderboardEntry {
  user: User;
  value: number;
  rank: number;
  run: SavedRun;
  isCurrentUser: boolean;
}

// Simple mock data
const createMockUsers = () => {
  return [
    {
      id: 'mock-user-2',
      username: 'powderhunter',
      displayName: 'Sarah Chen',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      accountType: 'individual' as const,
      isVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'mock-user-3',
      username: 'mountainmaster',
      displayName: 'Jake Morrison',
      name: 'Jake Morrison',
      email: 'jake@example.com',
      accountType: 'individual' as const,
      isVerified: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'mock-user-4',
      username: 'alpinepro',
      displayName: 'Maria Rodriguez',
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      accountType: 'individual' as const,
      isVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];
};

const createSimpleMockData = (resort: Resort, currentUser?: User) => {
  const mockUsers = createMockUsers();
  if (currentUser) {
    mockUsers.unshift(currentUser);
  }

  const mockRuns: SavedRun[] = [];
  const baseDate = new Date('2024-01-01');
  
  for (let i = 0; i < mockUsers.length; i++) {
    const user = mockUsers[i];
    const numRuns = 3;
    
    for (let j = 0; j < numRuns; j++) {
      const speed = 25 + Math.random() * 35;
      const distance = 2 + Math.random() * 8;
      const vertical = 200 + Math.random() * 800;
      const duration = 300 + Math.random() * 1800;
      
      mockRuns.push({
        id: `mock-run-${user.id}-${j}`,
        userId: user.id,
        name: `${resort.name} Run ${j + 1}`,
        description: `Run at ${resort.name}`,
        startTime: baseDate,
        endTime: baseDate,
        resort: resort,
        stats: {
          duration: duration,
          distance: distance,
          vertical: vertical,
          maxSpeed: speed,
          averageSpeed: speed * 0.8,
          difficulty: 'blue' as const
        },
        likes: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 10),
        comments: Math.floor(Math.random() * 20),
        isPublic: true,
        privacy: 'public' as const
      });
    }
  }

  return { mockUsers, mockRuns };
};

export function ResortRankings({ resort, currentUser, runs = [], onBack, onUpgrade }: ResortRankingsProps) {
  const [activeCategory, setActiveCategory] = useState<'speed' | 'distance' | 'vertical' | 'runs'>('speed');
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month' | 'season' | 'all_time'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Simple data generation
  const { mockUsers, mockRuns } = createSimpleMockData(resort, currentUser);
  const allRuns = [...runs, ...mockRuns];

  // Simple resort stats
  const resortRuns = allRuns.filter(run => run.resort.id === resort.id);
  const uniqueUsers = new Set(resortRuns.map(run => run.userId));
  const resortStats = {
    totalSkiers: uniqueUsers.size,
    totalRuns: resortRuns.length,
    averageSpeed: resortRuns.length > 0 ? resortRuns.reduce((acc, run) => acc + run.stats.maxSpeed, 0) / resortRuns.length : 0,
    topSpeed: resortRuns.length > 0 ? Math.max(...resortRuns.map(run => run.stats.maxSpeed)) : 0,
    totalDistance: resortRuns.reduce((acc, run) => acc + run.stats.distance, 0),
    totalVertical: resortRuns.reduce((acc, run) => acc + run.stats.vertical, 0),
    activeToday: Math.floor(uniqueUsers.size * 0.3),
    weatherConditions: {
      temperature: 2,
      conditions: 'Fresh Snow',
      windSpeed: 12,
      visibility: 'Good',
      snowfall: 8
    }
  };

  // Simple leaderboard processing
  const createSimpleLeaderboard = (category: 'speed' | 'distance' | 'vertical' | 'runs'): SimpleLeaderboardEntry[] => {
    const filteredRuns = resortRuns.filter(run => {
      if (selectedDifficulty !== 'all' && run.stats.difficulty !== selectedDifficulty) return false;
      if (searchQuery) {
        const user = mockUsers.find(u => u.id === run.userId);
        const searchTerm = searchQuery.toLowerCase();
        return user?.displayName?.toLowerCase().includes(searchTerm) ||
               user?.username?.toLowerCase().includes(searchTerm) ||
               run.name.toLowerCase().includes(searchTerm);
      }
      return true;
    });

    const userBest: { [userId: string]: { value: number, run: SavedRun } } = {};
    
    if (category === 'runs') {
      // Count runs per user
      const userRunCounts: { [userId: string]: number } = {};
      filteredRuns.forEach(run => {
        userRunCounts[run.userId] = (userRunCounts[run.userId] || 0) + 1;
      });
      
      Object.entries(userRunCounts).forEach(([userId, count]) => {
        const latestRun = filteredRuns.find(r => r.userId === userId);
        if (latestRun) {
          userBest[userId] = { value: count, run: latestRun };
        }
      });
    } else {
      filteredRuns.forEach(run => {
        const value = category === 'speed' ? run.stats.maxSpeed :
                     category === 'distance' ? run.stats.distance :
                     run.stats.vertical;
        
        if (!userBest[run.userId] || value > userBest[run.userId].value) {
          userBest[run.userId] = { value, run };
        }
      });
    }

    const entries: SimpleLeaderboardEntry[] = Object.entries(userBest).map(([userId, data]) => {
      const user = mockUsers.find(u => u.id === userId);
      if (!user) return null;
      
      return {
        user,
        value: data.value,
        rank: 0, // Will be set after sorting
        run: data.run,
        isCurrentUser: user.id === currentUser?.id
      };
    }).filter(Boolean) as SimpleLeaderboardEntry[];

    entries.sort((a, b) => b.value - a.value);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries.slice(0, 20); // Top 20
  };

  const speedLeaderboard = createSimpleLeaderboard('speed');
  const distanceLeaderboard = createSimpleLeaderboard('distance');
  const verticalLeaderboard = createSimpleLeaderboard('vertical');
  const runsLeaderboard = createSimpleLeaderboard('runs');

  const getCurrentLeaderboard = () => {
    switch (activeCategory) {
      case 'speed': return speedLeaderboard;
      case 'distance': return distanceLeaderboard;
      case 'vertical': return verticalLeaderboard;
      case 'runs': return runsLeaderboard;
      default: return speedLeaderboard;
    }
  };

  const currentLeaderboard = getCurrentLeaderboard();

  // Simple user stats
  const currentUserStats = currentUser ? (() => {
    const userRuns = allRuns.filter(run => run.userId === currentUser.id && run.resort.id === resort.id);
    if (userRuns.length === 0) return null;

    return {
      totalRuns: userRuns.length,
      bestSpeed: Math.max(...userRuns.map(r => r.stats.maxSpeed)),
      totalDistance: userRuns.reduce((acc, r) => acc + r.stats.distance, 0),
      totalVertical: userRuns.reduce((acc, r) => acc + r.stats.vertical, 0),
      averageSpeed: userRuns.reduce((acc, r) => acc + r.stats.maxSpeed, 0) / userRuns.length,
      rank: currentLeaderboard.find(e => e.isCurrentUser)?.rank || null
    };
  })() : null;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-600" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-600" />;
    if (rank === 3) return <Award className="w-4 h-4 text-orange-600" />;
    return <span className="text-sm font-bold">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-400 bg-yellow-50';
    if (rank === 2) return 'border-gray-400 bg-gray-50';
    if (rank === 3) return 'border-orange-400 bg-orange-50';
    if (rank <= 10) return 'border-blue-400 bg-blue-50';
    return 'border-gray-200 bg-gray-50';
  };

  const formatValue = (category: string, value: number) => {
    switch (category) {
      case 'speed': return `${value.toFixed(1)} km/h`;
      case 'distance': return `${value.toFixed(1)} km`;
      case 'vertical': return `${Math.round(value)}m`;
      case 'runs': return `${Math.round(value)} runs`;
      default: return value.toString();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speed': return <Zap className="w-4 h-4" />;
      case 'distance': return <Target className="w-4 h-4" />;
      case 'vertical': return <Mountain className="w-4 h-4" />;
      case 'runs': return <Activity className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rankings
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-foreground truncate">{resort.name}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{resort.location}</span>
                    </div>
                    {resort.elevation && (
                      <div className="flex items-center gap-1">
                        <Mountain className="w-3 h-3" />
                        <span>{resort.elevation.summit}m summit</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <Heart className="w-4 h-4 mr-2" />
                Follow Resort
              </Button>
            </div>
          </div>

          {/* Resort Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{resortStats.totalSkiers}</div>
              <div className="text-xs text-muted-foreground">Total Skiers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{resortStats.activeToday}</div>
              <div className="text-xs text-muted-foreground">Active Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{resortStats.topSpeed.toFixed(1)} km/h</div>
              <div className="text-xs text-muted-foreground">Top Speed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{Math.round(resortStats.totalDistance)} km</div>
              <div className="text-xs text-muted-foreground">Total Distance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{Math.round(resortStats.totalVertical)} m</div>
              <div className="text-xs text-muted-foreground">Total Vertical</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{resortStats.weatherConditions.temperature.toFixed(0)}°C</div>
              <div className="text-xs text-muted-foreground">{resortStats.weatherConditions.conditions}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Rankings */}
          <div className="lg:col-span-3 space-y-6">
            {/* Controls */}
            <Card className="snowline-card">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search skiers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={timePeriod} onValueChange={(value: any) => setTimePeriod(value)}>
                      <SelectTrigger className="w-32 rounded-xl">
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="season">This Season</SelectItem>
                        <SelectItem value="all_time">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="w-32 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulty</SelectItem>
                        <SelectItem value="green">Green Circle</SelectItem>
                        <SelectItem value="blue">Blue Square</SelectItem>
                        <SelectItem value="black">Black Diamond</SelectItem>
                        <SelectItem value="double_black">Double Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Tabs value={activeCategory} onValueChange={(value: any) => setActiveCategory(value)}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="speed" className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Speed
                      </TabsTrigger>
                      <TabsTrigger value="distance" className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Distance
                      </TabsTrigger>
                      <TabsTrigger value="vertical" className="flex items-center gap-2">
                        <Mountain className="w-4 h-4" />
                        Vertical
                      </TabsTrigger>
                      <TabsTrigger value="runs" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Runs
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="snowline-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(activeCategory)}
                    <CardTitle className="capitalize">{activeCategory} Leaderboard</CardTitle>
                  </div>
                  <Badge variant="outline">
                    {currentLeaderboard.length} competitors
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {currentLeaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        entry.isCurrentUser 
                          ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/20' 
                          : `${getRankColor(entry.rank)} hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-sm">
                            {getRankBadge(entry.rank)}
                          </div>
                          
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={entry.user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                              {(entry.user.displayName || entry.user.name || entry.user.username).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold truncate">
                                {entry.user.displayName || entry.user.name || entry.user.username}
                              </span>
                              {entry.user.isVerified && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                  <Star className="w-3 h-3 mr-1" />
                                  Pro
                                </Badge>
                              )}
                              {entry.isCurrentUser && (
                                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>@{entry.user.username}</span>
                              <span>•</span>
                              <span>{entry.run.name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {formatValue(activeCategory, entry.value)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{entry.run.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>{entry.run.comments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              <span>{entry.run.shares}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {currentLeaderboard.length > 15 && (
                  <div className="p-4 border-t border-border text-center">
                    <Button variant="outline" className="rounded-xl">
                      Load More Rankings
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current User Stats */}
            {currentUserStats && (
              <Card className="snowline-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        #{currentUserStats.rank || '--'}
                      </div>
                      <div className="text-xs text-muted-foreground">Current Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {currentUserStats.totalRuns}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Runs</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Best Speed</span>
                      <span className="font-semibold">{currentUserStats.bestSpeed.toFixed(1)} km/h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Distance</span>
                      <span className="font-semibold">{currentUserStats.totalDistance.toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Vertical</span>
                      <span className="font-semibold">{Math.round(currentUserStats.totalVertical)} m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Speed</span>
                      <span className="font-semibold">{currentUserStats.averageSpeed.toFixed(1)} km/h</span>
                    </div>
                  </div>
                  
                  <Button className="w-full rounded-xl snowline-button-primary">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Stats
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Weather Conditions */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-blue-500" />
                  Current Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {resortStats.weatherConditions.temperature.toFixed(0)}°C
                    </div>
                    <div className="text-xs text-muted-foreground">Temperature</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {resortStats.weatherConditions.snowfall.toFixed(0)}cm
                    </div>
                    <div className="text-xs text-muted-foreground">Fresh Snow</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conditions</span>
                    <span className="font-semibold">{resortStats.weatherConditions.conditions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Wind Speed</span>
                    <span className="font-semibold">{resortStats.weatherConditions.windSpeed.toFixed(0)} km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Visibility</span>
                    <span className="font-semibold">{resortStats.weatherConditions.visibility}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resort Information */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-purple-500" />
                  Resort Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resort.elevation && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Base Elevation</span>
                      <span className="font-semibold">{resort.elevation.base}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Summit</span>
                      <span className="font-semibold">{resort.elevation.summit}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Vertical Drop</span>
                      <span className="font-semibold">{resort.elevation.summit - resort.elevation.base}m</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full rounded-xl">
                    <Map className="w-4 h-4 mr-2" />
                    View Trail Map
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Resort Website
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pro Upgrade */}
            {currentUser && !currentUser.isVerified && (
              <Card className="snowline-card border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Crown className="w-5 h-5" />
                    Unlock Pro Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Detailed performance analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Historical trend analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Compare with friends</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Advanced leaderboards</span>
                    </div>
                  </div>
                  
                  <Button onClick={onUpgrade} className="w-full rounded-xl snowline-button-primary">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}