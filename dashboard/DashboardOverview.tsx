import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mountain, 
  Clock, 
  TrendingUp, 
  Target, 
  Thermometer, 
  Wind, 
  AlertTriangle,
  Zap,
  Eye,
  Snowflake,
  Sun,
  CloudSnow,
  BarChart3,
  Route,
  Gauge,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, CartesianGrid } from 'recharts';
import { User, SavedRun } from '../../src/types';

interface DashboardOverviewProps {
  currentUser: User;
  runs?: SavedRun[];
  selectedPeriod: 'week' | 'month' | 'season';
  onPeriodChange: (period: 'week' | 'month' | 'season') => void;
}

const StatCard = ({ 
  title, 
  value, 
  unit, 
  change, 
  trend, 
  icon: Icon, 
  color = "primary"
}: {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: any;
  color?: string;
}) => (
  <div className={`p-4 rounded-lg ${
    color === 'primary' ? 'bg-primary/10' :
    color === 'success' ? 'bg-green-100' :
    color === 'warning' ? 'bg-yellow-100' :
    color === 'danger' ? 'bg-red-100' :
    'bg-gray-100'
  } text-center hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-center mb-2">
      <Icon className={`w-6 h-6 ${
        color === 'primary' ? 'text-primary' :
        color === 'success' ? 'text-green-500' :
        color === 'warning' ? 'text-yellow-500' :
        color === 'danger' ? 'text-red-500' :
        'text-gray-500'
      }`} />
    </div>
    <div className="text-2xl font-bold">{value}{unit}</div>
    <div className="text-sm text-muted-foreground">{title}</div>
    {change && (
      <div className={`flex items-center justify-center space-x-1 text-xs mt-1 ${
        trend === 'up' ? 'text-green-500' :
        trend === 'down' ? 'text-red-500' :
        'text-muted-foreground'
      }`}>
        {trend === 'up' && <ArrowUp className="w-3 h-3" />}
        {trend === 'down' && <ArrowDown className="w-3 h-3" />}
        <span>{change}</span>
      </div>
    )}
  </div>
);

export function DashboardOverview({ currentUser, runs = [], selectedPeriod, onPeriodChange }: DashboardOverviewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stats from actual runs data
  const periodRuns = runs.filter(run => {
    const runDate = new Date(run.startTime);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - runDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (selectedPeriod) {
      case 'week': return daysDiff <= 7;
      case 'month': return daysDiff <= 30;
      case 'season': return daysDiff <= 180;
      default: return true;
    }
  });

  const todayStats = {
    verticalDescent: periodRuns.reduce((sum, run) => sum + (run.stats?.vertical || 0), 0),
    runs: periodRuns.length,
    topSpeed: periodRuns.length > 0 ? Math.max(...periodRuns.map(run => run.stats?.maxSpeed || 0)) : 0,
    totalDistance: periodRuns.reduce((sum, run) => sum + (run.stats?.distance || 0), 0),
    avgSpeed: periodRuns.length > 0 ? periodRuns.reduce((sum, run) => sum + (run.stats?.averageSpeed || run.stats?.avgSpeed || 0), 0) / periodRuns.length : 0,
    totalTime: periodRuns.reduce((sum, run) => sum + (run.stats?.duration || 0), 0),
    calories: Math.floor(periodRuns.reduce((sum, run) => sum + (run.stats?.duration || 0), 0) / 60 * 12)
  };

  const liveConditions = {
    temperature: -3,
    feelsLike: -8,
    snowDepth: 142,
    newSnow: 12,
    windSpeed: 15,
    windDirection: 'NW',
    visibility: 'Excellent',
    avalancheRisk: 'Moderate',
    snowQuality: 'Powder',
    uvIndex: 6,
    lastUpdated: '5 min ago'
  };

  const goals = [
    { 
      id: 1, 
      title: `${selectedPeriod === 'season' ? 'Season' : selectedPeriod === 'month' ? 'Monthly' : 'Weekly'} Vertical Goal`, 
      current: todayStats.verticalDescent, 
      target: selectedPeriod === 'season' ? 50000 : selectedPeriod === 'month' ? 8000 : 2000, 
      unit: 'm', 
      progress: Math.min(100, (todayStats.verticalDescent / (selectedPeriod === 'season' ? 50000 : selectedPeriod === 'month' ? 8000 : 2000)) * 100) 
    },
    { 
      id: 2, 
      title: 'Runs Target', 
      current: todayStats.runs, 
      target: selectedPeriod === 'season' ? 100 : selectedPeriod === 'month' ? 20 : 5, 
      unit: ' runs', 
      progress: Math.min(100, (todayStats.runs / (selectedPeriod === 'season' ? 100 : selectedPeriod === 'month' ? 20 : 5)) * 100) 
    },
    { 
      id: 3, 
      title: 'Speed Challenge', 
      current: todayStats.topSpeed, 
      target: 80, 
      unit: ' km/h', 
      progress: Math.min(100, (todayStats.topSpeed / 80) * 100) 
    },
    { 
      id: 4, 
      title: 'Distance Goal', 
      current: todayStats.totalDistance, 
      target: selectedPeriod === 'season' ? 200 : selectedPeriod === 'month' ? 40 : 10, 
      unit: ' km', 
      progress: Math.min(100, (todayStats.totalDistance / (selectedPeriod === 'season' ? 200 : selectedPeriod === 'month' ? 40 : 10)) * 100) 
    }
  ];

  const weeklyData = [
    { day: 'Mon', vertical: 1200, runs: 8, speed: 45.2, distance: 12.5 },
    { day: 'Tue', vertical: 1800, runs: 12, speed: 52.1, distance: 18.3 },
    { day: 'Wed', vertical: 2200, runs: 15, speed: 48.7, distance: 22.1 },
    { day: 'Thu', vertical: 1600, runs: 10, speed: 41.3, distance: 15.8 },
    { day: 'Fri', vertical: 2400, runs: 18, speed: 55.8, distance: 28.4 },
    { day: 'Sat', vertical: 2800, runs: 22, speed: 67.2, distance: 35.2 },
    { day: 'Sun', vertical: 2600, runs: 20, speed: 59.4, distance: 31.7 },
  ];

  const skillBreakdown = [
    { name: 'Beginner', value: 15, color: '#22c55e' },
    { name: 'Intermediate', value: 45, color: '#3b82f6' },
    { name: 'Advanced', value: 30, color: '#f59e0b' },
    { name: 'Expert', value: 10, color: '#ef4444' },
  ];

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'powder': return <Snowflake className="w-5 h-5 text-blue-300" />;
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'cloudy': return <CloudSnow className="w-5 h-5 text-gray-400" />;
      default: return <Snowflake className="w-5 h-5 text-blue-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold">Detailed Analytics</h2>
        <div className="flex rounded-lg border">
          {(['week', 'month', 'season'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => onPeriodChange(period)}
              className="capitalize rounded-none first:rounded-l-lg last:rounded-r-lg"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard
          title={`${selectedPeriod} Vertical`}
          value={todayStats.verticalDescent.toLocaleString()}
          unit="m"
          change={todayStats.verticalDescent > 1000 ? "+12% vs last period" : "Getting started!"}
          trend={todayStats.verticalDescent > 1000 ? "up" : "neutral"}
          icon={Mountain}
          color="primary"
        />
        <StatCard
          title="Total Runs"
          value={todayStats.runs}
          change={todayStats.runs > 5 ? "Great progress!" : "Keep it up!"}
          icon={Route}
          color="success"
        />
        <StatCard
          title="Top Speed"
          value={todayStats.topSpeed.toFixed(1)}
          unit=" km/h"
          change={todayStats.topSpeed > 50 ? "Impressive!" : "Push harder!"}
          trend={todayStats.topSpeed > 50 ? "up" : "neutral"}
          icon={Gauge}
          color="warning"
        />
        <StatCard
          title="Avg Speed"
          value={todayStats.avgSpeed.toFixed(1)}
          unit=" km/h"
          icon={Target}
          color="primary"
        />
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Live Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  {getConditionIcon(liveConditions.snowQuality)}
                  <span>Live Mountain Conditions</span>
                </div>
                <Badge variant="outline">Whistler Blackcomb</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Thermometer className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">{liveConditions.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                  <div className="text-xs text-muted-foreground">Feels {liveConditions.feelsLike}°C</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Snowflake className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">{liveConditions.snowDepth}cm</div>
                  <div className="text-sm text-muted-foreground">Snow Depth</div>
                  <div className="text-xs text-green-500">+{liveConditions.newSnow}cm new</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Wind className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">{liveConditions.windSpeed}</div>
                  <div className="text-sm text-muted-foreground">Wind km/h</div>
                  <div className="text-xs text-muted-foreground">{liveConditions.windDirection}</div>
                </div>
                
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <Sun className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">{liveConditions.uvIndex}</div>
                  <div className="text-sm text-muted-foreground">UV Index</div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-bold">{liveConditions.avalancheRisk}</div>
                  <div className="text-sm text-muted-foreground">Avalanche</div>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm font-bold">{liveConditions.visibility}</div>
                  <div className="text-sm text-muted-foreground">Visibility</div>
                  <div className="text-xs text-muted-foreground">Perfect</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <Badge variant="outline">
                      {Math.round(goal.progress)}%
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{goal.current.toFixed(goal.unit.includes('km/h') ? 1 : 0)}{goal.unit} / {goal.target.toLocaleString()}{goal.unit}</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {goal.progress >= 100 ? '🎉 Goal Achieved!' :
                     goal.progress >= 75 ? '🔥 Almost there!' :
                     goal.progress >= 50 ? '💪 Keep pushing!' :
                     '🎯 Getting started'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="vertical" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Skill Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {skillBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}