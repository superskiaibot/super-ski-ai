import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  BarChart3, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Zap,
  Mountain,
  MapPin,
  Timer,
  Activity,
  ChevronRight,
  ChevronDown,
  Filter,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Import types from the main types file
import { User, SavedRun, Resort } from '../src/types/index';

// Import the new ResortRankings component
import { ResortRankings } from './ResortRankings';

interface LeaderboardsProps {
  currentUser?: User;
  runs?: SavedRun[];
  onUpgrade?: () => void;
}

interface ResortLeaderboard {
  resort: Resort;
  rankings: {
    speed: LeaderboardEntry[];
    distance: LeaderboardEntry[];
    vertical: LeaderboardEntry[];
    runs: LeaderboardEntry[];
  };
  totalSkiers: number;
  topRun: SavedRun | null;
}

interface LeaderboardEntry {
  user: User;
  value: number;
  rank: number;
  run: SavedRun;
  isCurrentUser: boolean;
}

// Mock additional users for realistic leaderboards
const mockUsers: User[] = [
  {
    id: 'user-2',
    username: 'powderhunter',
    displayName: 'Sarah Chen',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    accountType: 'individual',
    isVerified: true,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date()
  },
  {
    id: 'user-3',
    username: 'mountainmaster',
    displayName: 'Jake Morrison',
    name: 'Jake Morrison',
    email: 'jake@example.com',
    accountType: 'individual',
    isVerified: false,
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date()
  },
  {
    id: 'user-4',
    username: 'alpinepro',
    displayName: 'Maria Rodriguez',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    accountType: 'individual',
    isVerified: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date()
  },
  {
    id: 'user-5',
    username: 'speedster',
    displayName: 'Tom Wilson',
    name: 'Tom Wilson',
    email: 'tom@example.com',
    accountType: 'individual',
    isVerified: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date()
  }
];

export function Leaderboards({ currentUser, runs = [], onUpgrade }: LeaderboardsProps) {
  const [activeCategory, setActiveCategory] = useState<'speed' | 'distance' | 'vertical' | 'runs'>('speed');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'season' | 'all_time'>('month');
  const [expandedResorts, setExpandedResorts] = useState<Set<string>>(new Set());
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);

  // Generate mock runs for each resort to create realistic leaderboards
  const generateMockRuns = (resort: Resort): SavedRun[] => {
    const mockRuns: SavedRun[] = [];
    
    mockUsers.forEach((user, index) => {
      // Generate 2-4 runs per user per resort
      const numRuns = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numRuns; i++) {
        const baseSpeed = 25 + Math.random() * 45; // 25-70 km/h
        const baseDistance = 2 + Math.random() * 15; // 2-17 km
        const baseVertical = 200 + Math.random() * 1500; // 200-1700m
        const baseDuration = 300 + Math.random() * 3600; // 5-65 minutes
        
        mockRuns.push({
          id: `mock-${user.id}-${resort.id}-${i}`,
          userId: user.id,
          name: `${resort.name} Run ${i + 1}`,
          description: `Great run on ${resort.name}`,
          startTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
          endTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 + baseDuration * 1000),
          resort: resort,
          stats: {
            duration: baseDuration,
            distance: baseDistance,
            vertical: baseVertical,
            maxSpeed: baseSpeed,
            averageSpeed: baseSpeed * 0.8,
            difficulty: ['green', 'blue', 'black', 'double_black'][Math.floor(Math.random() * 4)] as any
          },
          likes: Math.floor(Math.random() * 50),
          shares: Math.floor(Math.random() * 10),
          comments: Math.floor(Math.random() * 15),
          isPublic: true,
          privacy: 'public'
        });
      }
    });
    
    return mockRuns;
  };

  // Process runs by resort and create leaderboards
  const resortLeaderboards = useMemo(() => {
    const resortMap = new Map<string, ResortLeaderboard>();
    
    // Group runs by resort
    const allRuns = [...runs];
    
    // Add mock data for demonstration if we have few real runs
    if (runs.length < 5) {
      // Add some popular ski resorts with mock data
      const popularResorts: Resort[] = [
        {
          id: 'whistler',
          name: 'Whistler Blackcomb',
          location: 'Whistler, BC, Canada',
          coordinates: { lat: 50.1163, lng: -122.9574 },
          elevation: { base: 675, summit: 2284 }
        },
        {
          id: 'chamonix',
          name: 'Chamonix Mont-Blanc',
          location: 'Chamonix, France',
          coordinates: { lat: 45.9237, lng: 6.8694 },
          elevation: { base: 1035, summit: 3842 }
        },
        {
          id: 'st-moritz',
          name: 'St. Moritz',
          location: 'St. Moritz, Switzerland',
          coordinates: { lat: 46.4908, lng: 9.8355 },
          elevation: { base: 1856, summit: 3303 }
        },
        {
          id: 'aspen',
          name: 'Aspen Snowmass',
          location: 'Aspen, Colorado, USA',
          coordinates: { lat: 39.1911, lng: -106.8175 },
          elevation: { base: 2422, summit: 3813 }
        }
      ];
      
      popularResorts.forEach(resort => {
        const mockRuns = generateMockRuns(resort);
        allRuns.push(...mockRuns);
      });
    }
    
    allRuns.forEach(run => {
      const resortId = run.resort.id;
      
      if (!resortMap.has(resortId)) {
        resortMap.set(resortId, {
          resort: run.resort,
          rankings: {
            speed: [],
            distance: [],
            vertical: [],
            runs: []
          },
          totalSkiers: 0,
          topRun: null
        });
      }
      
      const leaderboard = resortMap.get(resortId)!;
      
      // Find the user for this run
      const user = run.userId === currentUser?.id ? currentUser : mockUsers.find(u => u.id === run.userId);
      if (!user) return;
      
      // Create leaderboard entries for different categories
      const createEntry = (value: number): LeaderboardEntry => ({
        user,
        value,
        rank: 0, // Will be set after sorting
        run,
        isCurrentUser: user.id === currentUser?.id
      });
      
      // Add entries for each category
      leaderboard.rankings.speed.push(createEntry(run.stats.maxSpeed));
      leaderboard.rankings.distance.push(createEntry(run.stats.distance));
      leaderboard.rankings.vertical.push(createEntry(run.stats.vertical));
      
      // Update top run
      if (!leaderboard.topRun || run.stats.maxSpeed > leaderboard.topRun.stats.maxSpeed) {
        leaderboard.topRun = run;
      }
    });
    
    // Sort and rank entries for each resort and category
    resortMap.forEach(leaderboard => {
      Object.keys(leaderboard.rankings).forEach(category => {
        const rankings = leaderboard.rankings[category as keyof typeof leaderboard.rankings];
        
        // Sort by value (descending)
        rankings.sort((a, b) => b.value - a.value);
        
        // Keep only top entries per user (best performance)
        const userBest = new Map<string, LeaderboardEntry>();
        rankings.forEach(entry => {
          const existing = userBest.get(entry.user.id);
          if (!existing || entry.value > existing.value) {
            userBest.set(entry.user.id, entry);
          }
        });
        
        // Convert back to array and assign ranks
        const finalRankings = Array.from(userBest.values()).sort((a, b) => b.value - a.value);
        finalRankings.forEach((entry, index) => {
          entry.rank = index + 1;
        });
        
        // Update the leaderboard
        (leaderboard.rankings[category as keyof typeof leaderboard.rankings] as LeaderboardEntry[]) = finalRankings.slice(0, 10); // Top 10
      });
      
      // Count total unique skiers
      const allUsers = new Set<string>();
      Object.values(leaderboard.rankings).forEach(rankings => {
        rankings.forEach(entry => allUsers.add(entry.user.id));
      });
      leaderboard.totalSkiers = allUsers.size;
    });
    
    return Array.from(resortMap.values()).sort((a, b) => b.totalSkiers - a.totalSkiers);
  }, [runs, currentUser]);

  const toggleResortExpansion = (resortId: string) => {
    const newExpanded = new Set(expandedResorts);
    if (newExpanded.has(resortId)) {
      newExpanded.delete(resortId);
    } else {
      newExpanded.add(resortId);
    }
    setExpandedResorts(newExpanded);
  };

  const handleResortClick = (resort: Resort) => {
    setSelectedResort(resort);
  };

  const handleBackToOverview = () => {
    setSelectedResort(null);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 2: return 'text-gray-600 bg-gray-50 border-gray-200';
      case 3: return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4" />;
      case 2: return <Medal className="w-4 h-4" />;
      case 3: return <Award className="w-4 h-4" />;
      default: return <span className="text-xs font-bold">#{rank}</span>;
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

  const formatValue = (category: string, value: number) => {
    switch (category) {
      case 'speed': return `${value.toFixed(1)} km/h`;
      case 'distance': return `${value.toFixed(1)} km`;
      case 'vertical': return `${Math.round(value)}m`;
      case 'runs': return `${Math.round(value)} runs`;
      default: return value.toString();
    }
  };

  // If a resort is selected, show the detailed rankings page
  if (selectedResort) {
    return (
      <ResortRankings
        resort={selectedResort}
        currentUser={currentUser}
        runs={runs}
        onBack={handleBackToOverview}
        onUpgrade={onUpgrade}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-border bg-background/80 backdrop-filter backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight">
                  Resort Rankings
                </h1>
                <p className="text-muted-foreground font-medium">
                  Compete with skiers at each resort and climb the mountain leaderboards
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timePeriod} onValueChange={(value: any) => setTimePeriod(value)}>
                <SelectTrigger className="w-40 rounded-xl">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="season">This Season</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Tabs value={activeCategory} onValueChange={(value: any) => setActiveCategory(value)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="speed" className="text-xs">Speed</TabsTrigger>
                  <TabsTrigger value="distance" className="text-xs">Distance</TabsTrigger>
                  <TabsTrigger value="vertical" className="text-xs">Vertical</TabsTrigger>
                  <TabsTrigger value="runs" className="text-xs">Runs</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resort Leaderboards */}
      <div className="max-w-6xl mx-auto p-6">
        {resortLeaderboards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <Card className="snowline-card max-w-md w-full text-center p-8">
              <CardContent className="space-y-6">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                    <Mountain className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">No Rankings Yet</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Start skiing and recording runs to see how you rank against other skiers at each resort!
                  </p>
                </div>
                
                <Button className="snowline-button-primary w-full rounded-xl">
                  <Activity className="w-4 h-4 mr-2" />
                  Start Tracking Runs
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {resortLeaderboards.map((resortBoard, index) => {
              const isExpanded = expandedResorts.has(resortBoard.resort.id);
              const rankings = resortBoard.rankings[activeCategory];
              const currentUserRank = rankings.find(entry => entry.isCurrentUser);
              
              return (
                <motion.div
                  key={resortBoard.resort.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="snowline-card overflow-hidden hover:shadow-lg transition-all duration-200">
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center gap-4 flex-1 min-w-0"
                          onClick={() => handleResortClick(resortBoard.resort)}
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Mountain className="w-7 h-7 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-xl font-bold mb-1 truncate">{resortBoard.resort.name}</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-xl px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20"
                              >
                                <ArrowRight className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{resortBoard.resort.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{resortBoard.totalSkiers} skiers</span>
                              </div>
                              {resortBoard.resort.elevation && (
                                <div className="flex items-center gap-1">
                                  <Mountain className="w-3 h-3" />
                                  <span>{resortBoard.resort.elevation.summit}m summit</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {currentUserRank && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              Your Rank: #{currentUserRank.rank}
                            </Badge>
                          )}
                          
                          <div className="text-right">
                            <div className="text-sm font-medium text-muted-foreground">Top {activeCategory}</div>
                            <div className="text-lg font-bold text-primary">
                              {rankings.length > 0 ? formatValue(activeCategory, rankings[0].value) : 'N/A'}
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl"
                            onClick={() => toggleResortExpansion(resortBoard.resort.id)}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  {getCategoryIcon(activeCategory)}
                                  <h4 className="font-semibold capitalize">{activeCategory} Leaderboard</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {timePeriod.replace('_', ' ')}
                                  </Badge>
                                </div>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResortClick(resortBoard.resort)}
                                  className="rounded-xl"
                                >
                                  <BarChart3 className="w-4 h-4 mr-2" />
                                  View All Rankings
                                </Button>
                              </div>
                              
                              {rankings.slice(0, 5).map((entry, rankIndex) => (
                                <motion.div
                                  key={`${entry.user.id}-${rankIndex}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: rankIndex * 0.05 }}
                                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                                    entry.isCurrentUser 
                                      ? 'bg-primary/5 border-primary/20' 
                                      : 'bg-background border-border hover:bg-muted/30'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-semibold text-sm ${getRankColor(entry.rank)}`}>
                                      {getRankIcon(entry.rank)}
                                    </div>
                                    
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={entry.user.avatar} />
                                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                                        {(entry.user.displayName || entry.user.name || entry.user.username).charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">
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
                                      <div className="text-xs text-muted-foreground">
                                        @{entry.user.username} • {entry.run.name}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-primary">
                                      {formatValue(activeCategory, entry.value)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {entry.run.likes} likes • {entry.run.shares} shares
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                              
                              {rankings.length > 5 && (
                                <div className="text-center p-4 text-sm text-muted-foreground">
                                  <Button
                                    variant="ghost"
                                    onClick={() => handleResortClick(resortBoard.resort)}
                                    className="rounded-xl"
                                  >
                                    View all {rankings.length} skiers competing at this resort
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}