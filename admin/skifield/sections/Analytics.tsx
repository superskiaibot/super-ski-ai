import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Mountain,
  Clock,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Progress } from '../../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsProps {
  resortData: any;
}

// Mock data for charts
const visitorData = [
  { date: '2024-01-15', visitors: 1200, revenue: 145000, ticketsSold: 980 },
  { date: '2024-01-16', visitors: 1450, revenue: 178000, ticketsSold: 1180 },
  { date: '2024-01-17', visitors: 980, revenue: 125000, ticketsSold: 820 },
  { date: '2024-01-18', visitors: 1680, revenue: 198000, ticketsSold: 1350 },
  { date: '2024-01-19', visitors: 1850, revenue: 225000, ticketsSold: 1480 },
  { date: '2024-01-20', visitors: 1650, revenue: 189000, ticketsSold: 1320 },
  { date: '2024-01-21', visitors: 1420, revenue: 165000, ticketsSold: 1150 }
];

const liftUsageData = [
  { name: 'Express Quad', usage: 85, capacity: 2400, wait: 8 },
  { name: 'Coronet Six', usage: 92, capacity: 3000, wait: 12 },
  { name: 'Rocky Gully T-Bar', usage: 68, capacity: 800, wait: 5 },
  { name: 'Greengates T-Bar', usage: 75, capacity: 600, wait: 6 },
  { name: 'M1 Moving Carpet', usage: 58, capacity: 1200, wait: 3 },
  { name: 'Back Bowls Quad', usage: 0, capacity: 2000, wait: 0 }
];

const trailPopularityData = [
  { name: 'Big Easy', visits: 450, avgTime: 12, difficulty: 'Green' },
  { name: 'Coronet Express', visits: 680, avgTime: 18, difficulty: 'Blue' },
  { name: 'Rocky Gully', visits: 320, avgTime: 15, difficulty: 'Black' },
  { name: 'Back Bowls', visits: 180, avgTime: 25, difficulty: 'Double Black' },
  { name: 'Powder Paradise', visits: 520, avgTime: 20, difficulty: 'Blue' },
  { name: 'Beginner\'s Bowl', visits: 280, avgTime: 10, difficulty: 'Green' }
];

const peakTimesData = [
  { hour: '08:00', visitors: 120 },
  { hour: '09:00', visitors: 380 },
  { hour: '10:00', visitors: 620 },
  { hour: '11:00', visitors: 850 },
  { hour: '12:00', visitors: 920 },
  { hour: '13:00', visitors: 780 },
  { hour: '14:00', visitors: 680 },
  { hour: '15:00', visitors: 520 },
  { hour: '16:00', visitors: 280 }
];

const demographicsData = [
  { name: 'Adults (18-64)', value: 65, color: '#004cff' },
  { name: 'Seniors (65+)', value: 15, color: '#ff5500' },
  { name: 'Youth (13-17)', value: 12, color: '#22c55e' },
  { name: 'Children (5-12)', value: 8, color: '#f59e0b' }
];

const COLORS = ['#004cff', '#ff5500', '#22c55e', '#f59e0b'];

export function Analytics({ resortData }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState('7days');
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Calculate current vs previous metrics
  const currentMetrics = {
    visitors: 1650,
    revenue: 189000,
    tickets: 1320,
    avgSpend: 143.18
  };

  const previousMetrics = {
    visitors: 1420,
    revenue: 165000,
    tickets: 1150,
    avgSpend: 143.48
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Performance insights and operational analytics for {resortData.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="season">This season</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold">{currentMetrics.visitors.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    +{calculateGrowth(currentMetrics.visitors, previousMetrics.visitors)}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(currentMetrics.revenue)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    +{calculateGrowth(currentMetrics.revenue, previousMetrics.revenue)}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
                <p className="text-2xl font-bold">{currentMetrics.tickets.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    +{calculateGrowth(currentMetrics.tickets, previousMetrics.tickets)}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Spend</p>
                <p className="text-2xl font-bold">{formatCurrency(currentMetrics.avgSpend)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600">
                    {calculateGrowth(currentMetrics.avgSpend, previousMetrics.avgSpend)}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visitor Trends */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle>Visitor Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [value.toLocaleString(), 'Visitors']}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="#004cff" fill="#004cff" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Peak Times */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle>Daily Peak Times</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={peakTimesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Visitors']} />
                    <Bar dataKey="visitors" fill="#ff5500" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Visitor Demographics */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle>Visitor Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={demographicsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {demographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lift Usage */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle>Lift Usage & Wait Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liftUsageData.map((lift) => (
                    <div key={lift.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{lift.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={lift.usage > 80 ? 'destructive' : lift.usage > 60 ? 'default' : 'secondary'}>
                            {lift.usage}% capacity
                          </Badge>
                          <span className="text-sm text-muted-foreground">{lift.wait}min wait</span>
                        </div>
                      </div>
                      <Progress value={lift.usage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trail Popularity */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle>Trail Popularity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trailPopularityData.map((trail, index) => (
                    <div key={trail.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{trail.name}</h4>
                          <p className="text-sm text-muted-foreground">{trail.difficulty} • {trail.avgTime}min avg</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{trail.visits}</p>
                        <p className="text-xs text-muted-foreground">visits today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visitor Stats */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Visitor Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current on mountain:</span>
                    <span className="font-medium">1,650</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today's total:</span>
                    <span className="font-medium">2,340</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Season passes:</span>
                    <span className="font-medium">892 (38%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Day tickets:</span>
                    <span className="font-medium">1,448 (62%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. visit duration:</span>
                    <span className="font-medium">4.2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacity Management */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mountain className="w-5 h-5" />
                  <span>Capacity Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">66%</p>
                    <p className="text-sm text-muted-foreground">Current capacity</p>
                    <Progress value={66} className="mt-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Optimal range:</span>
                      <span className="font-medium">60-80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max capacity:</span>
                      <span className="font-medium">2,500 visitors</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Remaining slots:</span>
                      <span className="font-medium">850 tickets</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Satisfaction Metrics */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Guest Satisfaction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">4.7</p>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                    <div className="flex justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className={`w-4 h-4 ${star <= 4.7 ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ⭐
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Trail conditions:</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lift wait times:</span>
                      <span className="font-medium">4.5/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Staff service:</span>
                      <span className="font-medium">4.9/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Overall experience:</span>
                      <span className="font-medium">4.7/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue Breakdown */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="text-base">Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(189000)}</p>
                    <p className="text-xs text-muted-foreground">Total revenue</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Day tickets:</span>
                      <span className="text-xs font-medium">{formatCurrency(142000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Season passes:</span>
                      <span className="text-xs font-medium">{formatCurrency(28000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Rentals:</span>
                      <span className="text-xs font-medium">{formatCurrency(12000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Food & beverage:</span>
                      <span className="text-xs font-medium">{formatCurrency(7000)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Season Performance */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="text-base">Season Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(8400000)}</p>
                    <p className="text-xs text-muted-foreground">Season total</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Target:</span>
                      <span className="text-xs font-medium">{formatCurrency(12000000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Progress:</span>
                      <span className="text-xs font-medium">70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Days remaining:</span>
                      <span className="text-xs font-medium">45 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Spend */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="text-base">Per Visitor Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatCurrency(143)}</p>
                    <p className="text-xs text-muted-foreground">Avg. spend per person</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Ticket price:</span>
                      <span className="text-xs font-medium">{formatCurrency(98)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Ancillary spend:</span>
                      <span className="text-xs font-medium">{formatCurrency(45)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">YoY growth:</span>
                      <span className="text-xs font-medium text-green-600">+8.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit Margin */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="text-base">Profitability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">42%</p>
                    <p className="text-xs text-muted-foreground">Gross margin</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Operating costs:</span>
                      <span className="text-xs font-medium">{formatCurrency(110000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Net profit:</span>
                      <span className="text-xs font-medium">{formatCurrency(79000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Margin trend:</span>
                      <span className="text-xs font-medium text-green-600">↗ +2.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}