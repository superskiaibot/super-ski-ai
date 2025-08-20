import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Users, 
  Clock, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  MapPin,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SocialAnalyticsProps {
  userId: string;
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

const mockEngagementData = [
  { date: '2024-01-01', likes: 45, comments: 12, shares: 8, views: 234 },
  { date: '2024-01-02', likes: 52, comments: 18, shares: 6, views: 289 },
  { date: '2024-01-03', likes: 38, comments: 9, shares: 12, views: 198 },
  { date: '2024-01-04', likes: 67, comments: 25, shares: 15, views: 345 },
  { date: '2024-01-05', likes: 58, comments: 20, shares: 9, views: 312 },
  { date: '2024-01-06', likes: 73, comments: 28, shares: 18, views: 398 },
  { date: '2024-01-07', likes: 81, comments: 32, shares: 22, views: 456 },
];

const mockFollowerGrowth = [
  { date: '2024-01-01', followers: 1234 },
  { date: '2024-01-02', followers: 1248 },
  { date: '2024-01-03', followers: 1252 },
  { date: '2024-01-04', followers: 1267 },
  { date: '2024-01-05', followers: 1278 },
  { date: '2024-01-06', followers: 1294 },
  { date: '2024-01-07', followers: 1312 },
];

const mockContentTypes = [
  { name: 'Ski Videos', value: 35, color: '#004cff' },
  { name: 'Photos', value: 28, color: '#ff5500' },
  { name: 'Stories', value: 20, color: '#00c4ff' },
  { name: 'Text Posts', value: 17, color: '#7c3aed' },
];

const mockTopPosts = [
  {
    id: '1',
    title: 'Epic powder day at Whistler!',
    thumbnail: 'https://images.unsplash.com/photo-1551524164-6cf2ac007fac?w=60&h=60&fit=crop',
    engagement: { likes: 156, comments: 34, shares: 28, views: 2340 },
    date: '2024-01-06',
    performance: 'top'
  },
  {
    id: '2',
    title: 'First successful 720!',
    thumbnail: 'https://images.unsplash.com/photo-1578926375022-79c2e04f5e89?w=60&h=60&fit=crop',
    engagement: { likes: 89, comments: 18, shares: 12, views: 1456 },
    date: '2024-01-04',
    performance: 'good'
  },
  {
    id: '3',
    title: 'Backcountry adventure',
    thumbnail: 'https://images.unsplash.com/photo-1498427128722-d8e54555adde?w=60&h=60&fit=crop',
    engagement: { likes: 67, comments: 12, shares: 8, views: 987 },
    date: '2024-01-02',
    performance: 'average'
  },
];

const mockAudienceInsights = {
  demographics: [
    { age: '18-24', percentage: 25 },
    { age: '25-34', percentage: 35 },
    { age: '35-44', percentage: 23 },
    { age: '45-54', percentage: 12 },
    { age: '55+', percentage: 5 },
  ],
  locations: [
    { country: 'Canada', percentage: 32 },
    { country: 'United States', percentage: 28 },
    { country: 'Switzerland', percentage: 15 },
    { country: 'Austria', percentage: 12 },
    { country: 'France', percentage: 8 },
    { country: 'Others', percentage: 5 },
  ],
  interests: [
    { interest: 'Alpine Skiing', percentage: 45 },
    { interest: 'Snowboarding', percentage: 32 },
    { interest: 'Backcountry', percentage: 18 },
    { interest: 'Racing', percentage: 5 },
  ]
};

const AnalyticsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any; 
  trend: 'up' | 'down' | 'neutral';
}) => (
  <Card className="apple-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {trend === 'up' && <ArrowUp className="w-3 h-3" />}
            {trend === 'down' && <ArrowDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function SocialAnalytics({ 
  userId, 
  timeRange, 
  onTimeRangeChange 
}: SocialAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'top': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Analytics</h2>
          <p className="text-muted-foreground">Track your social media performance</p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Likes"
          value="2,847"
          change="+12.5% vs last period"
          icon={Heart}
          trend="up"
        />
        <AnalyticsCard
          title="Total Comments"
          value="456"
          change="+8.2% vs last period"
          icon={MessageCircle}
          trend="up"
        />
        <AnalyticsCard
          title="Profile Views"
          value="12.3K"
          change="+15.7% vs last period"
          icon={Eye}
          trend="up"
        />
        <AnalyticsCard
          title="Followers"
          value="1,312"
          change="+6.3% vs last period"
          icon={Users}
          trend="up"
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        {/* Engagement Analytics */}
        <TabsContent value="engagement" className="space-y-6">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Engagement Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="likes"
                      stackId="1"
                      stroke="#004cff"
                      fill="#004cff"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="comments"
                      stackId="1"
                      stroke="#ff5500"
                      fill="#ff5500"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="shares"
                      stackId="1"
                      stroke="#00c4ff"
                      fill="#00c4ff"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Top Performing Posts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="relative">
                      <img 
                        src={post.thumbnail} 
                        alt={post.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <Badge 
                        className={`absolute -top-1 -right-1 text-xs ${getPerformanceColor(post.performance)}`}
                      >
                        {index + 1}
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{post.title}</h4>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.engagement.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.engagement.comments}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.engagement.views}</span>
                        </span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={getPerformanceColor(post.performance)}>
                      {post.performance}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Analytics */}
        <TabsContent value="growth" className="space-y-6">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Follower Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockFollowerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="followers"
                      stroke="#004cff"
                      strokeWidth={3}
                      dot={{ fill: '#004cff', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">78</p>
                  <p className="text-sm text-muted-foreground">New followers this week</p>
                  <div className="flex items-center justify-center space-x-1 text-green-600 text-sm mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.2%</p>
                  <p className="text-sm text-muted-foreground">Engagement rate</p>
                  <div className="flex items-center justify-center space-x-1 text-green-600 text-sm mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+0.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">2.3h</p>
                  <p className="text-sm text-muted-foreground">Avg. watch time</p>
                  <div className="flex items-center justify-center space-x-1 text-green-600 text-sm mt-1">
                    <ArrowUp className="w-3 h-3" />
                    <span>+12m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Analytics */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Content Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={mockContentTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockContentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="w-5 h-5" />
                  <span>Top Hashtags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tag: 'powder', posts: 45, growth: '+12%' },
                    { tag: 'whistler', posts: 32, growth: '+8%' },
                    { tag: 'skiing', posts: 28, growth: '+15%' },
                    { tag: 'backcountry', posts: 21, growth: '+5%' },
                    { tag: 'snowboarding', posts: 18, growth: '+22%' },
                  ].map((hashtag, index) => (
                    <div key={hashtag.tag} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">#{index + 1}</span>
                        <Badge variant="outline">#{hashtag.tag}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{hashtag.posts} posts</p>
                        <p className="text-xs text-green-600">{hashtag.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Analytics */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Age Demographics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAudienceInsights.demographics.map((demo) => (
                    <div key={demo.age} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{demo.age}</span>
                        <span>{demo.percentage}%</span>
                      </div>
                      <Progress value={demo.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Top Locations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAudienceInsights.locations.map((location) => (
                    <div key={location.country} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{location.country}</span>
                        <span>{location.percentage}%</span>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Audience Interests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockAudienceInsights.interests.map((interest) => (
                  <div key={interest.interest} className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{interest.percentage}%</p>
                    <p className="text-sm text-muted-foreground">{interest.interest}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}