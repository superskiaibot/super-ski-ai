import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, FunnelChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User as UserType } from '../../src/types/index';

interface AnalyticsFullViewProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

export function AnalyticsFullView({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: AnalyticsFullViewProps) {
  const [selectedMetric, setSelectedMetric] = useState('daily_active');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for charts
  const dailyActiveSkiers = [
    { date: '2024-01-01', users: 145, runs: 890, distance: 45.2 },
    { date: '2024-01-02', users: 178, runs: 1120, distance: 58.7 },
    { date: '2024-01-03', users: 203, runs: 1340, distance: 72.1 },
    { date: '2024-01-04', users: 189, runs: 1180, distance: 64.3 },
    { date: '2024-01-05', users: 234, runs: 1560, distance: 89.4 },
    { date: '2024-01-06', users: 267, runs: 1890, distance: 102.6 },
    { date: '2024-01-07', users: 312, runs: 2140, distance: 124.8 },
    { date: '2024-01-08', users: 289, runs: 1980, distance: 98.7 },
    { date: '2024-01-09', users: 198, runs: 1450, distance: 76.5 },
    { date: '2024-01-10', users: 167, runs: 1230, distance: 63.2 },
    { date: '2024-01-11', users: 189, runs: 1340, distance: 68.9 },
    { date: '2024-01-12', users: 223, runs: 1580, distance: 84.3 },
    { date: '2024-01-13', users: 278, runs: 1890, distance: 97.6 },
    { date: '2024-01-14', users: 345, runs: 2340, distance: 132.4 }
  ];

  const distanceVsVertical = [
    { day: 'Mon', distance: 45.2, vertical: 12680 },
    { day: 'Tue', distance: 58.7, vertical: 16420 },
    { day: 'Wed', distance: 72.1, vertical: 20150 },
    { day: 'Thu', distance: 64.3, vertical: 17890 },
    { day: 'Fri', distance: 89.4, vertical: 24570 },
    { day: 'Sat', distance: 102.6, vertical: 28940 },
    { day: 'Sun', distance: 124.8, vertical: 35200 }
  ];

  const conversionFunnel = [
    { stage: 'Selections', count: 5247, percentage: 100 },
    { stage: 'Visits', count: 3892, percentage: 74.2 },
    { stage: 'Runs', count: 2156, percentage: 41.1 },
    { stage: 'Event Joins', count: 847, percentage: 16.1 }
  ];

  const topTeams = [
    { team: 'Powder Hounds', members: 23, totalDistance: 234.5, avgDistance: 10.2 },
    { team: 'Mountain Mavericks', members: 18, totalDistance: 189.7, avgDistance: 10.5 },
    { team: 'Alpine Addicts', members: 31, totalDistance: 298.3, avgDistance: 9.6 },
    { team: 'Snow Seekers', members: 15, totalDistance: 156.8, avgDistance: 10.5 },
    { team: 'Ridge Runners', members: 27, totalDistance: 245.9, avgDistance: 9.1 }
  ];

  const topHours = [
    { hour: '09:00', sessions: 342, percentage: 15.8 },
    { hour: '10:00', sessions: 456, percentage: 21.1 },
    { hour: '11:00', sessions: 389, percentage: 18.0 },
    { hour: '13:00', sessions: 298, percentage: 13.8 },
    { hour: '14:00', sessions: 267, percentage: 12.3 },
    { hour: '15:00', sessions: 234, percentage: 10.8 }
  ];

  // Mock heatmap data (simplified)
  const heatmapData = Array.from({ length: 10 }, (_, row) => 
    Array.from({ length: 12 }, (_, col) => ({
      x: col,
      y: row,
      intensity: Math.random() * 100
    }))
  ).flat();

  const colors = ['#004cff', '#ff5500', '#10b981', '#f59e0b', '#ef4444'];

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive performance insights and metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {userRole === 'platform_admin' && (
            <Select value={selectedResort?.id || ''} onValueChange={(value) => {
              // Handle resort change
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Resorts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resorts</SelectItem>
                <SelectItem value="coronet-peak">Coronet Peak</SelectItem>
                <SelectItem value="remarkables">The Remarkables</SelectItem>
                <SelectItem value="cardrona">Cardrona</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-sm font-medium text-gray-600">Total Skiers</div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-green-600">+12.5% vs last period</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <div className="text-sm font-medium text-gray-600">Runs Completed</div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">15,678</div>
              <div className="text-sm text-green-600">+8.2% vs last period</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div className="text-sm font-medium text-gray-600">Distance (km)</div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">8,924</div>
              <div className="text-sm text-green-600">+15.7% vs last period</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <div className="text-sm font-medium text-gray-600">Vertical (m)</div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">245,670</div>
              <div className="text-sm text-red-600">-2.1% vs last period</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Activity Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="funnel">Conversion</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        {/* Activity Trends */}
        <TabsContent value="activity">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Daily Active Skiers</span>
                </CardTitle>
                <CardDescription>
                  Active users on the mountain over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyActiveSkiers}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })}
                        className="text-gray-600"
                      />
                      <YAxis className="text-gray-600" />
                      <Tooltip 
                        formatter={(value, name) => [value, name === 'users' ? 'Active Skiers' : name]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('en-NZ', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#004cff" 
                        strokeWidth={3}
                        dot={{ fill: '#004cff', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#004cff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>Runs Per Day</span>
                </CardTitle>
                <CardDescription>
                  Total ski runs recorded daily
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyActiveSkiers}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="runs" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Distance vs Vertical (Weekly)</CardTitle>
                <CardDescription>
                  Comparative performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distanceVsVertical}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="distance" fill="#004cff" name="Distance (km)" />
                      <Bar yAxisId="right" dataKey="vertical" fill="#ff5500" name="Vertical (m)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Activity</CardTitle>
                <CardDescription>
                  Most popular skiing times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topHours}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="sessions"
                        label={(entry) => `${entry.hour}: ${entry.percentage}%`}
                      >
                        {topHours.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Conversion Funnel */}
        <TabsContent value="funnel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Funnel</CardTitle>
                <CardDescription>
                  From selection to event participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{stage.count.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{stage.percentage}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stage.percentage}%` }}
                          transition={{ delay: index * 0.2, duration: 0.8 }}
                          className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Heatmap */}
        <TabsContent value="heatmap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>On-Mountain Activity Heatmap</CardTitle>
                <CardDescription>
                  Density map of skier activity across the mountain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  {/* Simplified heatmap visualization */}
                  <div className="grid grid-cols-12 gap-1 p-4">
                    {heatmapData.map((cell, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded"
                        style={{
                          backgroundColor: `rgba(0, 76, 255, ${cell.intensity / 100})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-center items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 rounded" />
                    <span className="text-sm text-gray-600">Low Activity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-400 rounded" />
                    <span className="text-sm text-gray-600">Medium Activity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-600 rounded" />
                    <span className="text-sm text-gray-600">High Activity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Teams</CardTitle>
              <CardDescription>
                Teams with highest activity levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTeams.map((team, index) => (
                  <div key={team.team} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium text-gray-900">{team.team}</div>
                        <div className="text-sm text-gray-500">{team.members} members</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{team.totalDistance} km</div>
                      <div className="text-sm text-gray-500">{team.avgDistance} km avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Peak Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Peak Activity Hours</CardTitle>
              <CardDescription>
                Busiest times on the mountain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topHours.map((hour, index) => (
                  <div key={hour.hour} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div className="font-medium text-gray-900">{hour.hour}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${(hour.percentage / 25) * 100}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{hour.sessions}</div>
                        <div className="text-sm text-gray-500">{hour.percentage}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}