import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Snowflake, 
  TrendingUp,
  Settings,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Calendar,
  ThermometerSun,
  Wind,
  Mountain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Progress } from '../../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../../ui/dropdown-menu';

interface TrailManagementProps {
  resortData: any;
}

interface Trail {
  id: string;
  name: string;
  difficulty: 'green' | 'blue' | 'black' | 'double-black';
  status: 'open' | 'closed' | 'maintenance' | 'grooming';
  length: number; // in meters
  vertical: number; // vertical drop in meters
  lastGroomed: Date;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  crowdLevel: 'low' | 'moderate' | 'high' | 'very-high';
  snowDepth: number; // in cm
  groomingPriority: 'high' | 'medium' | 'low';
  estimatedGroomingTime: number; // in minutes
}

const MOCK_TRAILS: Trail[] = [
  {
    id: 'trail-1',
    name: 'Big Easy',
    difficulty: 'green',
    status: 'open',
    length: 1200,
    vertical: 180,
    lastGroomed: new Date('2024-01-20T05:30:00'),
    condition: 'excellent',
    crowdLevel: 'moderate',
    snowDepth: 45,
    groomingPriority: 'medium',
    estimatedGroomingTime: 45
  },
  {
    id: 'trail-2',
    name: 'Coronet Express',
    difficulty: 'blue',
    status: 'open',
    length: 2100,
    vertical: 320,
    lastGroomed: new Date('2024-01-20T04:15:00'),
    condition: 'good',
    crowdLevel: 'high',
    snowDepth: 52,
    groomingPriority: 'high',
    estimatedGroomingTime: 65
  },
  {
    id: 'trail-3',
    name: 'Rocky Gully',
    difficulty: 'black',
    status: 'open',
    length: 1800,
    vertical: 420,
    lastGroomed: new Date('2024-01-19T22:45:00'),
    condition: 'fair',
    crowdLevel: 'low',
    snowDepth: 38,
    groomingPriority: 'high',
    estimatedGroomingTime: 85
  },
  {
    id: 'trail-4',
    name: 'Back Bowls',
    difficulty: 'double-black',
    status: 'grooming',
    length: 2800,
    vertical: 580,
    lastGroomed: new Date('2024-01-20T02:00:00'),
    condition: 'excellent',
    crowdLevel: 'low',
    snowDepth: 68,
    groomingPriority: 'medium',
    estimatedGroomingTime: 120
  },
  {
    id: 'trail-5',
    name: "Beginner's Bowl",
    difficulty: 'green',
    status: 'closed',
    length: 950,
    vertical: 120,
    lastGroomed: new Date('2024-01-19T18:30:00'),
    condition: 'poor',
    crowdLevel: 'low',
    snowDepth: 25,
    groomingPriority: 'high',
    estimatedGroomingTime: 60
  },
  {
    id: 'trail-6',
    name: 'Powder Paradise',
    difficulty: 'blue',
    status: 'maintenance',
    length: 1650,
    vertical: 280,
    lastGroomed: new Date('2024-01-19T14:20:00'),
    condition: 'fair',
    crowdLevel: 'low',
    snowDepth: 41,
    groomingPriority: 'medium',
    estimatedGroomingTime: 75
  }
];

export function TrailManagement({ resortData }: TrailManagementProps) {
  const [trails, setTrails] = useState<Trail[]>(MOCK_TRAILS);
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getDifficultyBadge = (difficulty: Trail['difficulty']) => {
    switch (difficulty) {
      case 'green':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Green Circle</Badge>;
      case 'blue':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Blue Square</Badge>;
      case 'black':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Black Diamond</Badge>;
      case 'double-black':
        return <Badge className="bg-black text-white border-gray-400">Double Black</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: Trail['status']) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Open</Badge>;
      case 'closed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Closed</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maintenance</Badge>;
      case 'grooming':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Grooming</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConditionBadge = (condition: Trail['condition']) => {
    switch (condition) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Poor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCrowdLevelBadge = (crowdLevel: Trail['crowdLevel']) => {
    switch (crowdLevel) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      case 'moderate':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Moderate</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
      case 'very-high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Very High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleTrailStatusChange = (trailId: string, newStatus: Trail['status']) => {
    setTrails(prev => prev.map(trail => 
      trail.id === trailId ? { ...trail, status: newStatus } : trail
    ));
  };

  const trailStats = {
    total: trails.length,
    open: trails.filter(t => t.status === 'open').length,
    closed: trails.filter(t => t.status === 'closed').length,
    grooming: trails.filter(t => t.status === 'grooming').length,
    maintenance: trails.filter(t => t.status === 'maintenance').length,
    averageCondition: trails.filter(t => t.condition === 'excellent' || t.condition === 'good').length / trails.length * 100
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Trail Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage trail conditions, grooming schedules, and status updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Grooming
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{trailStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Trails</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{trailStats.open}</p>
              <p className="text-xs text-muted-foreground">Open</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
                <Snowflake className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{trailStats.grooming}</p>
              <p className="text-xs text-muted-foreground">Grooming</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mx-auto mb-2">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{trailStats.maintenance}</p>
              <p className="text-xs text-muted-foreground">Maintenance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{trailStats.closed}</p>
              <p className="text-xs text-muted-foreground">Closed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{Math.round(trailStats.averageCondition)}%</p>
              <p className="text-xs text-muted-foreground">Good+ Condition</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Trail Overview</TabsTrigger>
          <TabsTrigger value="grooming">Grooming Schedule</TabsTrigger>
          <TabsTrigger value="conditions">Live Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Trail List */}
          <div className="space-y-4">
            {trails.map((trail) => (
              <Card key={trail.id} className="snowline-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Mountain className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{trail.name}</h3>
                          {getDifficultyBadge(trail.difficulty)}
                          {getStatusBadge(trail.status)}
                          {getConditionBadge(trail.condition)}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm">
                          {/* Basic Info */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Length:</span>
                              <span className="font-medium">{(trail.length / 1000).toFixed(1)}km</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Vertical:</span>
                              <span className="font-medium">{trail.vertical}m</span>
                            </div>
                          </div>
                          
                          {/* Conditions */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Snow Depth:</span>
                              <span className="font-medium">{trail.snowDepth}cm</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Crowd Level:</span>
                              {getCrowdLevelBadge(trail.crowdLevel)}
                            </div>
                          </div>
                          
                          {/* Grooming */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Last Groomed:</span>
                              <span className="font-medium">
                                {Math.round((Date.now() - trail.lastGroomed.getTime()) / (1000 * 60 * 60))}h ago
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Priority:</span>
                              <Badge variant={trail.groomingPriority === 'high' ? 'destructive' : 
                                           trail.groomingPriority === 'medium' ? 'default' : 'secondary'}>
                                {trail.groomingPriority}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Est. Grooming:</span>
                              <span className="font-medium">{trail.estimatedGroomingTime}min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTrailId(trail.id)}
                        className="rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-lg"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleTrailStatusChange(trail.id, 'open')}
                            className="cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Open
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleTrailStatusChange(trail.id, 'grooming')}
                            className="cursor-pointer"
                          >
                            <Snowflake className="w-4 h-4 mr-2" />
                            Start Grooming
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleTrailStatusChange(trail.id, 'maintenance')}
                            className="cursor-pointer"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Maintenance Mode
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            onClick={() => handleTrailStatusChange(trail.id, 'closed')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Close Trail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grooming" className="space-y-4">
          <Card className="snowline-card">
            <CardHeader>
              <CardTitle>Grooming Schedule & Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trails
                  .filter(trail => trail.groomingPriority === 'high' || trail.status === 'grooming')
                  .map((trail) => (
                    <div key={trail.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Snowflake className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{trail.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Priority: {trail.groomingPriority} • Est. {trail.estimatedGroomingTime} minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(trail.status)}
                        {trail.status === 'grooming' && (
                          <Progress value={65} className="w-20" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Weather Overview */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ThermometerSun className="w-5 h-5" />
                  <span>Weather Conditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Temperature:</span>
                    <span className="font-medium">-5°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Wind Speed:</span>
                    <span className="font-medium">15 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Visibility:</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">New Snow:</span>
                    <span className="font-medium">8cm (24h)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Snow Report */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Snowflake className="w-5 h-5" />
                  <span>Snow Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Base Depth:</span>
                    <span className="font-medium">85cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mid Mountain:</span>
                    <span className="font-medium">125cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Summit:</span>
                    <span className="font-medium">180cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Surface:</span>
                    <span className="font-medium">Fresh Powder</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trail Conditions Summary */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Conditions Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Excellent:</span>
                    <span className="font-medium">{trails.filter(t => t.condition === 'excellent').length} trails</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Good:</span>
                    <span className="font-medium">{trails.filter(t => t.condition === 'good').length} trails</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fair:</span>
                    <span className="font-medium">{trails.filter(t => t.condition === 'fair').length} trails</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Poor:</span>
                    <span className="font-medium">{trails.filter(t => t.condition === 'poor').length} trails</span>
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