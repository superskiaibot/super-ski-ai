import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Mountain, 
  Calendar,
  BarChart3,
  MessageSquare,
  Eye,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ExternalLink,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { KpiCard } from './components/KpiCard';
import { User as UserType } from '../../src/types/index';

interface AdminDashboardProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort?: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

export function AdminDashboard({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: AdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Mock KPI data
  const kpiData = [
    {
      title: 'Unique Selects',
      value: '2,847',
      change: '+12.5%',
      trend: 'up' as const,
      sparklineData: [20, 25, 22, 30, 28, 35, 32, 38, 42, 45, 48, 52],
      description: 'Resort selections this period'
    },
    {
      title: 'DAU On-Mountain',
      value: '1,234',
      change: '+8.2%',
      trend: 'up' as const,
      sparklineData: [15, 18, 16, 22, 20, 25, 28, 30, 35, 32, 38, 40],
      description: 'Daily active users on mountain'
    },
    {
      title: 'Total Runs',
      value: '15,678',
      change: '+15.7%',
      trend: 'up' as const,
      sparklineData: [100, 120, 115, 140, 135, 160, 155, 180, 175, 195, 190, 210],
      description: 'Skiing runs recorded'
    },
    {
      title: 'Distance (km)',
      value: '8,924',
      change: '+6.3%',
      trend: 'up' as const,
      sparklineData: [50, 55, 52, 60, 58, 65, 68, 72, 75, 78, 82, 85],
      description: 'Total distance covered'
    },
    {
      title: 'Vertical (m)',
      value: '245,670',
      change: '-2.1%',
      trend: 'down' as const,
      sparklineData: [800, 850, 820, 900, 880, 920, 900, 950, 930, 920, 910, 900],
      description: 'Total vertical descent'
    },
    {
      title: 'Referral Clicks',
      value: '3,456',
      change: '+24.8%',
      trend: 'up' as const,
      sparklineData: [10, 15, 12, 20, 18, 25, 22, 30, 28, 35, 40, 45],
      description: 'External referrals received'
    }
  ];

  // Mock recent activity data
  const recentActivity = [
    {
      id: '1',
      action: 'Created Event',
      details: '"Fresh Powder Challenge" event created',
      user: 'Sarah Mitchell',
      timestamp: '2 minutes ago',
      icon: Calendar,
      type: 'event'
    },
    {
      id: '2',
      action: 'Rotated API Key',
      details: 'Weather API key rotated for security',
      user: 'Alex Chen',
      timestamp: '15 minutes ago',
      icon: Zap,
      type: 'security'
    },
    {
      id: '3',
      action: 'Freeze Event',
      details: '"Weekend Warriors" leaderboard frozen',
      user: 'Mike Johnson',
      timestamp: '1 hour ago',
      icon: Eye,
      type: 'moderation'
    },
    {
      id: '4',
      action: 'Message Sent',
      details: 'Broadcast sent to 1,234 active users',
      user: 'Sarah Mitchell',
      timestamp: '2 hours ago',
      icon: MessageSquare,
      type: 'communication'
    },
    {
      id: '5',
      action: 'Analytics Export',
      details: 'Monthly report exported (CSV)',
      user: 'David Kim',
      timestamp: '3 hours ago',
      icon: BarChart3,
      type: 'data'
    },
    {
      id: '6',
      action: 'User Unfreeze',
      details: 'User "skimaster99" participation unfrozen',
      user: 'Alex Chen',
      timestamp: '4 hours ago',
      icon: Users,
      type: 'moderation'
    },
    {
      id: '7',
      action: 'Resort Config',
      details: 'Updated selection card for Coronet Peak',
      user: 'Sarah Mitchell',
      timestamp: '5 hours ago',
      icon: Mountain,
      type: 'configuration'
    },
    {
      id: '8',
      action: 'Integration Test',
      details: 'Webhook connection tested successfully',
      user: 'Mike Johnson',
      timestamp: '6 hours ago',
      icon: ExternalLink,
      type: 'integration'
    }
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-700';
      case 'security': return 'bg-yellow-100 text-yellow-700';
      case 'moderation': return 'bg-red-100 text-red-700';
      case 'communication': return 'bg-green-100 text-green-700';
      case 'data': return 'bg-purple-100 text-purple-700';
      case 'configuration': return 'bg-indigo-100 text-indigo-700';
      case 'integration': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Start a new skiing event',
      icon: Calendar,
      action: () => onScreenChange('events'),
      color: 'from-blue-500 to-blue-600',
      enabled: true
    },
    {
      title: 'Open Live Leaderboard',
      description: 'View real-time rankings',
      icon: BarChart3,
      action: () => onScreenChange('event-live'),
      color: 'from-green-500 to-green-600',
      enabled: true
    },
    {
      title: 'Compose Message',
      description: 'Send broadcast to users',
      icon: MessageSquare,
      action: () => onScreenChange('messaging'),
      color: 'from-purple-500 to-purple-600',
      enabled: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {selectedResort ? `Overview for ${selectedResort.name}` : 'Platform overview'} • {dateRange ? dateRange.replace(/_/g, ' ') : 'Current period'}
          </p>
        </div>
        
        {userRole === 'platform_admin' && (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            Platform Administrator
          </Badge>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              trend={kpi.trend}
              sparklineData={kpi.sparklineData}
              description={kpi.description}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Frequently used admin functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  disabled={!action.enabled}
                  className={`w-full justify-start space-x-3 h-auto p-4 bg-gradient-to-r ${action.color} hover:opacity-90 text-white`}
                >
                  <action.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm opacity-90">{action.description}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 ml-auto flex-shrink-0" />
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest admin actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 8).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityTypeColor(activity.type)}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{activity.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span>by {activity.user}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onScreenChange('audit')}
                  disabled={userRole !== 'platform_admin'}
                >
                  View Full Activity Log
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">98.5%</div>
                <div className="text-sm text-blue-600">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">45ms</div>
                <div className="text-sm text-blue-600">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">12</div>
                <div className="text-sm text-blue-600">Active Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">2.1K</div>
                <div className="text-sm text-blue-600">Online Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}