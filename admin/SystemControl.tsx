import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings,
  Power,
  Database,
  Shield,
  AlertTriangle,
  Users,
  Mountain,
  Globe,
  Lock,
  Unlock,
  Server,
  Activity,
  Bell,
  CreditCard,
  FileText,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Calendar,
  RotateCcw,
  AlertCircle,
  Info,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
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
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { User as UserType } from '../../src/types/index';

interface SystemControlProps {
  currentUser: UserType;
}

interface SystemMetrics {
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;
  responseTime: number;
}

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  description: string;
  value: any;
  type: 'boolean' | 'string' | 'number' | 'select';
  options?: string[];
  dangerous?: boolean;
  requiresRestart?: boolean;
}

const MOCK_SYSTEM_METRICS: SystemMetrics = {
  uptime: '15 days, 4 hours',
  cpuUsage: 68,
  memoryUsage: 72,
  diskUsage: 45,
  activeConnections: 847,
  requestsPerMinute: 1250,
  errorRate: 0.02,
  responseTime: 145
};

const SYSTEM_SETTINGS: SystemSetting[] = [
  // Authentication & Security
  {
    id: 'maintenance_mode',
    category: 'System',
    name: 'Maintenance Mode',
    description: 'Enable maintenance mode to prevent user access during updates',
    value: false,
    type: 'boolean',
    dangerous: true,
    requiresRestart: false
  },
  {
    id: 'emergency_lockdown',
    category: 'Security',
    name: 'Emergency Lockdown',
    description: 'Emergency lockdown prevents all user actions and API access',
    value: false,
    type: 'boolean',
    dangerous: true,
    requiresRestart: false
  },
  {
    id: 'force_password_reset',
    category: 'Security',
    name: 'Force Password Reset',
    description: 'Force all users to reset passwords on next login',
    value: false,
    type: 'boolean',
    dangerous: true,
    requiresRestart: false
  },
  {
    id: 'session_timeout',
    category: 'Security',
    name: 'Session Timeout (minutes)',
    description: 'Automatic session timeout for inactive users',
    value: 60,
    type: 'number',
    requiresRestart: false
  },
  {
    id: 'max_login_attempts',
    category: 'Security',
    name: 'Max Login Attempts',
    description: 'Maximum failed login attempts before account lockout',
    value: 5,
    type: 'number',
    requiresRestart: false
  },
  
  // User Management
  {
    id: 'registration_enabled',
    category: 'Users',
    name: 'User Registration',
    description: 'Allow new user registrations',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },
  {
    id: 'email_verification_required',
    category: 'Users',
    name: 'Email Verification Required',
    description: 'Require email verification for new accounts',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },
  {
    id: 'default_user_role',
    category: 'Users',
    name: 'Default User Role',
    description: 'Default role assigned to new users',
    value: 'basic',
    type: 'select',
    options: ['basic', 'pro', 'premium'],
    requiresRestart: false
  },
  {
    id: 'user_data_retention_days',
    category: 'Users',
    name: 'User Data Retention (days)',
    description: 'How long to retain deleted user data',
    value: 90,
    type: 'number',
    requiresRestart: false
  },

  // Ski Field Operations
  {
    id: 'tracking_enabled',
    category: 'Ski Fields',
    name: 'GPS Tracking Enabled',
    description: 'Enable GPS tracking functionality across all ski fields',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },
  {
    id: 'weather_sync_enabled',
    category: 'Ski Fields',
    name: 'Weather Data Sync',
    description: 'Automatically sync weather data for all ski fields',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },
  {
    id: 'lift_status_updates',
    category: 'Ski Fields',
    name: 'Live Lift Status Updates',
    description: 'Enable real-time lift status updates',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },
  {
    id: 'emergency_broadcast_enabled',
    category: 'Ski Fields',
    name: 'Emergency Broadcast System',
    description: 'Enable emergency broadcast system for all ski fields',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },

  // Performance & Limits
  {
    id: 'api_rate_limit',
    category: 'Performance',
    name: 'API Rate Limit (requests/minute)',
    description: 'Maximum API requests per minute per user',
    value: 100,
    type: 'number',
    requiresRestart: false
  },
  {
    id: 'max_file_upload_mb',
    category: 'Performance',
    name: 'Max File Upload Size (MB)',
    description: 'Maximum file upload size in megabytes',
    value: 50,
    type: 'number',
    requiresRestart: false
  },
  {
    id: 'cache_duration_hours',
    category: 'Performance',
    name: 'Cache Duration (hours)',
    description: 'How long to cache API responses',
    value: 24,
    type: 'number',
    requiresRestart: true
  },

  // Notifications & Communications
  {
    id: 'email_notifications_enabled',
    category: 'Communications',
    name: 'Email Notifications',
    description: 'Enable email notifications system-wide',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },
  {
    id: 'push_notifications_enabled',
    category: 'Communications',
    name: 'Push Notifications',
    description: 'Enable push notifications system-wide',
    value: true,
    type: 'boolean',
    requiresRestart: false
  },
  {
    id: 'system_announcements_enabled',
    category: 'Communications',
    name: 'System Announcements',
    description: 'Enable system-wide announcements',
    value: true,
    type: 'boolean',
    requiresRestart: false
  }
];

export function SystemControl({ currentUser }: SystemControlProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<SystemMetrics>(MOCK_SYSTEM_METRICS);
  const [settings, setSettings] = useState<SystemSetting[]>(SYSTEM_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDangerousDialog, setShowDangerousDialog] = useState(false);
  const [pendingSetting, setPendingSetting] = useState<SystemSetting | null>(null);
  const [pendingValue, setPendingValue] = useState<any>(null);
  const [systemAnnouncement, setSystemAnnouncement] = useState('');
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Filter settings
  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         setting.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || setting.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(settings.map(s => s.category)))];

  const handleSettingChange = (setting: SystemSetting, newValue: any) => {
    if (setting.dangerous) {
      setPendingSetting(setting);
      setPendingValue(newValue);
      setShowDangerousDialog(true);
    } else {
      updateSetting(setting.id, newValue);
    }
  };

  const updateSetting = (settingId: string, newValue: any) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId ? { ...setting, value: newValue } : setting
    ));
  };

  const confirmDangerousChange = () => {
    if (pendingSetting && pendingValue !== null) {
      updateSetting(pendingSetting.id, pendingValue);
    }
    setShowDangerousDialog(false);
    setPendingSetting(null);
    setPendingValue(null);
  };

  const handleSystemRestart = () => {
    // This would trigger a system restart in a real implementation
    alert('System restart initiated. This is a demo - no actual restart will occur.');
  };

  const handleEmergencyShutdown = () => {
    alert('Emergency shutdown initiated. This is a demo - no actual shutdown will occur.');
  };

  const handleDatabaseBackup = () => {
    setIsBackingUp(true);
    setShowBackupDialog(true);
    
    // Simulate backup progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBackupProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsBackingUp(false);
          setShowBackupDialog(false);
          setBackupProgress(0);
        }, 1000);
      }
    }, 300);
  };

  const handleBroadcastAnnouncement = () => {
    if (systemAnnouncement.trim()) {
      alert(`System announcement broadcast: "${systemAnnouncement}"`);
      setSystemAnnouncement('');
      setShowAnnouncementDialog(false);
    }
  };

  const getSystemHealthStatus = () => {
    const avgUsage = (metrics.cpuUsage + metrics.memoryUsage + metrics.diskUsage) / 3;
    if (avgUsage < 50) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (avgUsage < 75) return { status: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Warning', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const healthStatus = getSystemHealthStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">System Control Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ultimate platform administration and system management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${healthStatus.bg} ${healthStatus.color} border-0`}>
            <Activity className="w-3 h-3 mr-1" />
            System {healthStatus.status}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Online
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Controls</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        {/* System Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="snowline-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPU Usage</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{metrics.cpuUsage}%</p>
                      <Progress value={metrics.cpuUsage} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="snowline-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Memory Usage</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">{metrics.memoryUsage}%</p>
                      <Progress value={metrics.memoryUsage} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="snowline-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{metrics.activeConnections.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Current sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="snowline-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requests/min</p>
                    <p className="text-2xl font-bold">{metrics.requestsPerMinute.toLocaleString()}</p>
                    <p className="text-xs text-green-600">↑ 15% from yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="secondary">{metrics.uptime}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">{metrics.responseTime}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium text-green-600">{metrics.errorRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disk Usage</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{metrics.diskUsage}%</span>
                      <Progress value={metrics.diskUsage} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Platform Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">All Services Operational</p>
                    <p className="text-xs text-green-700">GPS tracking, weather sync, and user management</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <Mountain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">25 Ski Fields Online</p>
                    <p className="text-xs text-blue-700">All New Zealand resorts connected and reporting</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800">Security Systems Active</p>
                    <p className="text-xs text-purple-700">Authentication, encryption, and monitoring</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Global Settings */}
        <TabsContent value="settings" className="space-y-6">
          {/* Settings Filters */}
          <Card className="snowline-card">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search settings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Settings List */}
          <div className="space-y-4">
            {filteredSettings.map((setting) => (
              <Card key={setting.id} className={`snowline-card ${setting.dangerous ? 'border-red-200 bg-red-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{setting.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {setting.category}
                        </Badge>
                        {setting.dangerous && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Dangerous
                          </Badge>
                        )}
                        {setting.requiresRestart && (
                          <Badge variant="secondary" className="text-xs">
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Requires Restart
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      {setting.type === 'boolean' ? (
                        <Switch
                          checked={setting.value}
                          onCheckedChange={(checked) => handleSettingChange(setting, checked)}
                        />
                      ) : setting.type === 'select' && setting.options ? (
                        <Select 
                          value={setting.value} 
                          onValueChange={(value) => handleSettingChange(setting, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {setting.options.map(option => (
                              <SelectItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={setting.type === 'number' ? 'number' : 'text'}
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting, 
                            setting.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
                          )}
                          className="w-24"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Emergency Controls */}
        <TabsContent value="emergency" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Actions */}
            <Card className="snowline-card border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Emergency Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSettingChange(
                      { id: 'maintenance_mode', dangerous: true } as SystemSetting, 
                      !settings.find(s => s.id === 'maintenance_mode')?.value
                    )}
                    variant="outline"
                    className="w-full justify-start border-orange-200 hover:bg-orange-50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Toggle Maintenance Mode
                  </Button>
                  
                  <Button
                    onClick={() => handleSettingChange(
                      { id: 'emergency_lockdown', dangerous: true } as SystemSetting, 
                      true
                    )}
                    variant="outline"
                    className="w-full justify-start border-red-200 hover:bg-red-50"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Emergency Lockdown
                  </Button>
                  
                  <Button
                    onClick={handleSystemRestart}
                    variant="outline"
                    className="w-full justify-start border-yellow-200 hover:bg-yellow-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    System Restart
                  </Button>
                  
                  <Button
                    onClick={handleEmergencyShutdown}
                    variant="outline"
                    className="w-full justify-start border-red-300 hover:bg-red-100 text-red-700"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    Emergency Shutdown
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Broadcast System */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>System Broadcast</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Send urgent system-wide announcements to all users and administrators.
                </p>
                <Button
                  onClick={() => setShowAnnouncementDialog(true)}
                  className="w-full"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Broadcast System Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Overrides */}
          <Card className="snowline-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Administrative Overrides</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Override User Permissions
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mountain className="w-4 h-4 mr-2" />
                  Force Ski Field Sync
                </Button>
                <Button variant="outline" className="justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Bypass Rate Limits
                </Button>
                <Button variant="outline" className="justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Reset API Keys
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Force Event Sync
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Clear Message Queue
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Management */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-primary" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleDatabaseBackup}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isBackingUp}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isBackingUp ? 'Backing up...' : 'Create Database Backup'}
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Restore from Backup
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Export System Logs
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Analytics Report
                </Button>
              </CardContent>
            </Card>

            {/* System Maintenance */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>System Maintenance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear System Cache
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Database
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clean Temporary Files
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Run Health Check
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="snowline-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" size="sm" className="justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Active Users
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Server className="w-4 h-4 mr-2" />
                  Server Status
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  System Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dangerous Action Confirmation Dialog */}
      <AlertDialog open={showDangerousDialog} onOpenChange={setShowDangerousDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Dangerous Action</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to modify a critical system setting: <strong>{pendingSetting?.name}</strong>
              <br /><br />
              This action could affect all users and system functionality. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDangerousChange}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* System Announcement Dialog */}
      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>System Broadcast</span>
            </DialogTitle>
            <DialogDescription>
              Send an urgent message to all active users and administrators.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="announcement">Announcement Message</Label>
              <Textarea
                id="announcement"
                value={systemAnnouncement}
                onChange={(e) => setSystemAnnouncement(e.target.value)}
                placeholder="Enter urgent system message..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBroadcastAnnouncement}
              disabled={!systemAnnouncement.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <Bell className="w-4 h-4 mr-2" />
              Broadcast Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Progress Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={() => !isBackingUp && setShowBackupDialog(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Database Backup</span>
            </DialogTitle>
            <DialogDescription>
              Creating a complete backup of all system data...
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Backup Progress</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="h-3" />
            </div>
            
            {backupProgress === 100 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Backup completed successfully!</span>
              </div>
            )}
          </div>
          
          {!isBackingUp && (
            <DialogFooter>
              <Button onClick={() => setShowBackupDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}