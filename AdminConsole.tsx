import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  Shield, 
  Users, 
  Settings,
  BarChart3,
  MessageSquare,
  Calendar,
  FileText,
  Globe,
  Database,
  Mountain,
  Activity,
  AlertTriangle,
  Zap,
  TrendingUp,
  MapPin,
  X,
  Eye,
  Lock,
  DollarSign,
  Monitor,
  Code,
  BookOpen,
  ChevronRight,
  Server,
  Bell,
  Home,
  Layers,
  Briefcase,
  ShieldCheck,
  CheckCircle,
  WifiOff,
  Cpu,
  HardDrive,
  Clock,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { User as UserType } from '../src/types/index';

// Import admin modules
import { AdminDashboard } from './admin/AdminDashboard';
import { AudienceManagement } from './admin/AudienceManagement';
import { EventsManagement } from './admin/EventsManagement';
import { MessagingSystem } from './admin/MessagingSystem';
import { WebsiteIntegrations } from './admin/WebsiteIntegrations';
import { AuditLogScreen } from './admin/AuditLogScreen';
import { AnalyticsFullView } from './admin/AnalyticsFullView';
import { SystemControl } from './admin/SystemControl';
import { ComprehensiveSkiFieldManagement } from './admin/ComprehensiveSkiFieldManagement';
import { SkiFieldAdminManagement } from './admin/SkiFieldAdminManagement';
import { SkiForACureAdminManagement } from './admin/SkiForACureAdminManagement';

interface AdminConsoleProps {
  currentUser: UserType;
  onClose: () => void;
  onSelectSkiField?: (skiFieldId: string) => void;
  onShowDocumentation?: () => void;
}

type AdminModule = 
  | 'overview'
  | 'dashboard' 
  | 'users' 
  | 'events' 
  | 'ski-for-a-cure'
  | 'messaging' 
  | 'integrations' 
  | 'audit'
  | 'analytics'
  | 'skifield'
  | 'skifield-admins'
  | 'system-control'
  | 'billing'
  | 'monitoring'
  | 'security'
  | 'developer'
  | 'emergency';

export function AdminConsole({ currentUser, onClose, onSelectSkiField, onShowDocumentation }: AdminConsoleProps) {
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');

  // System status for overview
  const systemStatus = {
    isOnline: true,
    serverLoad: 68,
    activeUsers: 847,
    totalUsers: 2487,
    securityAlerts: 0,
    pendingMaintenance: false,
    uptime: '99.9%',
    responseTime: '124ms',
    memoryUsage: 54,
    diskUsage: 31,
    apiCalls: 15847,
    errorsToday: 3
  };

  // Admin sections for sidebar navigation - sleek minimal design
  const adminSections = [
    {
      title: 'Platform Control',
      modules: [
        {
          id: 'overview' as AdminModule,
          title: 'Overview',
          description: 'System status and metrics',
          icon: Home
        },
        {
          id: 'dashboard' as AdminModule,
          title: 'Dashboard',
          description: 'Operations center',
          icon: BarChart3
        },
        {
          id: 'emergency' as AdminModule,
          title: 'Emergency',
          description: 'Critical controls',
          icon: AlertTriangle
        },
        {
          id: 'system-control' as AdminModule,
          title: 'System',
          description: 'Configuration',
          icon: Settings
        },
        {
          id: 'monitoring' as AdminModule,
          title: 'Monitoring',
          description: 'Performance metrics',
          icon: Monitor
        }
      ]
    },
    {
      title: 'Management',
      modules: [
        {
          id: 'users' as AdminModule,
          title: 'Users',
          description: 'Account management',
          icon: Users
        },
        {
          id: 'skifield' as AdminModule,
          title: 'Ski Fields',
          description: 'Resort operations',
          icon: Mountain
        },
        {
          id: 'events' as AdminModule,
          title: 'Events',
          description: 'Campaign management',
          icon: Calendar
        },
        {
          id: 'ski-for-a-cure' as AdminModule,
          title: 'Ski for a Cure',
          description: 'Event management',
          icon: Heart
        },
        {
          id: 'messaging' as AdminModule,
          title: 'Messaging',
          description: 'Communication hub',
          icon: MessageSquare
        }
      ]
    },
    {
      title: 'Business',
      modules: [
        {
          id: 'analytics' as AdminModule,
          title: 'Analytics',
          description: 'Business intelligence',
          icon: TrendingUp
        },
        {
          id: 'billing' as AdminModule,
          title: 'Revenue',
          description: 'Financial operations',
          icon: DollarSign
        }
      ]
    },
    {
      title: 'Security',
      modules: [
        {
          id: 'security' as AdminModule,
          title: 'Security',
          description: 'Security operations',
          icon: Lock
        },
        {
          id: 'audit' as AdminModule,
          title: 'Audit',
          description: 'Activity logs',
          icon: FileText
        },
        {
          id: 'integrations' as AdminModule,
          title: 'Integrations',
          description: 'External services',
          icon: Globe
        }
      ]
    }
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <AdminDashboard
            currentUser={currentUser}
            userRole={currentUser.role?.type === 'platform_admin' ? 'platform_admin' : 'resort_admin'}
            selectedResort={null}
            dateRange="last_30_days"
            onScreenChange={(screen: string) => setActiveModule(screen as AdminModule)}
          />
        );
      
      case 'users':
        return <AudienceManagement currentUser={currentUser} />;
      
      case 'events':
        return <EventsManagement currentUser={currentUser} />;
      
      case 'ski-for-a-cure':
        return <SkiForACureAdminManagement currentUser={currentUser} />;
        
      case 'messaging':
        return <MessagingSystem currentUser={currentUser} />;
        
      case 'integrations':
        return <WebsiteIntegrations currentUser={currentUser} />;
        
      case 'audit':
        return <AuditLogScreen currentUser={currentUser} />;
        
      case 'analytics':
        return <AnalyticsFullView currentUser={currentUser} />;
        
      case 'system-control':
        return <SystemControl currentUser={currentUser} />;
        
      case 'skifield':
        return <ComprehensiveSkiFieldManagement 
          currentUser={currentUser} 
          onSelectSkiField={onSelectSkiField || (() => {})}
        />;
        
      case 'skifield-admins':
        return <SkiFieldAdminManagement currentUser={currentUser} />;
        
      case 'emergency':
        return (
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-midnight">Emergency Controls</h1>
              <p className="text-lg text-gray-600">Critical platform management and emergency response</p>
            </div>
            
            <Card className="snowline-card border-gray-200">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center space-x-3 text-gray-900">
                  <AlertTriangle className="w-6 h-6" />
                  <span>Emergency Response Systems</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Critical controls for platform-wide emergency situations. Use with extreme caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="snowline-card hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                        <Shield className="w-8 h-8 text-gray-700" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Platform Lockdown</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Immediately disable all user access and freeze platform operations</p>
                      <Badge className="mt-4 bg-gray-100 text-gray-700 border-gray-200">
                        Critical
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="snowline-card hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                        <Bell className="w-8 h-8 text-gray-700" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Emergency Alert</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Send critical notification to all users and administrators</p>
                      <Badge className="mt-4 bg-gray-100 text-gray-700 border-gray-200">
                        High Priority
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="snowline-card hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                        <Database className="w-8 h-8 text-gray-700" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Emergency Backup</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Force immediate backup of all critical platform data</p>
                      <Badge className="mt-4 bg-gray-100 text-gray-700 border-gray-200">
                        Data Protection
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'billing':
        return (
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-midnight">Revenue Management</h1>
              <p className="text-lg text-gray-600">Financial operations and billing administration</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="snowline-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-700" />
                    <span>Monthly Revenue</span>
                  </CardTitle>
                  <CardDescription>Current billing period performance</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">$24,847</div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      +12% growth
                    </Badge>
                    <span className="text-sm text-gray-600">vs last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="snowline-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-700" />
                    <span>Pro Subscribers</span>
                  </CardTitle>
                  <CardDescription>Active premium subscriptions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">1,247</div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      Active
                    </Badge>
                    <span className="text-sm text-gray-600">subscription accounts</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="snowline-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-gray-700" />
                    <span>Conversion Rate</span>
                  </CardTitle>
                  <CardDescription>Free to Pro upgrade rate</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">8.4%</div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      Above target
                    </Badge>
                    <span className="text-sm text-gray-600">monthly average</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'monitoring':
        return (
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-midnight">System Monitoring</h1>
              <p className="text-lg text-gray-600">Real-time platform health and performance metrics</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="snowline-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <Server className="w-5 h-5 text-gray-700" />
                    <span>Server Performance</span>
                  </CardTitle>
                  <CardDescription>Core infrastructure metrics</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">CPU Usage</span>
                      <span className="text-sm font-bold text-gray-900">{systemStatus.serverLoad}%</span>
                    </div>
                    <Progress value={systemStatus.serverLoad} className="h-3 bg-gray-100" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Memory Usage</span>
                      <span className="text-sm font-bold text-gray-900">{systemStatus.memoryUsage}%</span>
                    </div>
                    <Progress value={systemStatus.memoryUsage} className="h-3 bg-gray-100" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Disk Usage</span>
                      <span className="text-sm font-bold text-gray-900">{systemStatus.diskUsage}%</span>
                    </div>
                    <Progress value={systemStatus.diskUsage} className="h-3 bg-gray-100" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="snowline-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-gray-700" />
                    <span>System Health</span>
                  </CardTitle>
                  <CardDescription>Platform operational status</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Platform Status</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">API Services</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">Healthy</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">GPS Services</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Security Alerts</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">None</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-midnight">Security Center</h1>
              <p className="text-lg text-gray-600">Platform security monitoring and threat management</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="snowline-card border-gray-200">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3 text-gray-900">
                    <Shield className="w-6 h-6" />
                    <span>Security Status</span>
                  </CardTitle>
                  <CardDescription>Current platform security posture</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">All Systems Secure</h3>
                    <p className="text-gray-600">No active threats or vulnerabilities detected</p>
                    <Badge className="mt-4 bg-gray-100 text-gray-700 border-gray-200 px-4 py-2">
                      Security Level: High
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="snowline-card">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-gray-700" />
                    <span>Security Metrics</span>
                  </CardTitle>
                  <CardDescription>Recent security activity and alerts</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <WifiOff className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Failed Login Attempts</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">3 today</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">API Rate Limit Hits</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">12 today</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Threats Blocked</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">0 today</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Uptime</span>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">{systemStatus.uptime}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // If a specific module is selected, show it in the main content area
  if (activeModule !== 'overview') {
    return (
      <div className="h-screen bg-white flex">
        {/* Sleek Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Clean Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Admin Console</h2>
                  <p className="text-sm text-gray-600">Platform Control</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              <span className="text-sm font-medium text-gray-700">System Online</span>
              <Badge className="ml-auto bg-gray-100 text-gray-700 border-gray-200 text-xs">
                {systemStatus.uptime}
              </Badge>
            </div>
          </div>

          {/* Clean Sidebar Navigation */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {adminSections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-1">
                    {section.modules.map((module) => (
                      <Button
                        key={module.id}
                        variant={activeModule === module.id ? "default" : "ghost"}
                        className={`w-full justify-start h-11 px-3 rounded-lg text-sm transition-all duration-200 ${
                          activeModule === module.id 
                            ? 'bg-gray-900 text-white hover:bg-gray-800' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveModule(module.id)}
                      >
                        <module.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-xs opacity-70">{module.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Clean Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.displayName || currentUser.name}
                </p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
            </div>
            
            {onShowDocumentation && (
              <Button 
                onClick={onShowDocumentation}
                variant="outline"
                size="sm"
                className="w-full rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-auto"
            >
              {renderModuleContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Overview screen - sleek minimal design
  return (
    <div className="h-screen bg-white flex">
      {/* Sleek Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Clean Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Admin Console</h2>
                <p className="text-sm text-gray-600">Platform Control</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
            <span className="text-sm font-medium text-gray-700">System Online</span>
            <Badge className="ml-auto bg-gray-100 text-gray-700 border-gray-200 text-xs">
              {systemStatus.uptime}
            </Badge>
          </div>
        </div>

        {/* Clean Sidebar Navigation */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {adminSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                
                <div className="space-y-1">
                  {section.modules.map((module) => (
                    <Button
                      key={module.id}
                      variant="ghost"
                      className="w-full justify-start h-11 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setActiveModule(module.id)}
                    >
                      <module.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{module.title}</div>
                        <div className="text-xs opacity-70">{module.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Clean Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
              <Shield className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.displayName || currentUser.name}
              </p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
          </div>
          
          {onShowDocumentation && (
            <Button 
              onClick={onShowDocumentation}
              variant="outline"
              size="sm"
              className="w-full rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - Clean Overview */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Clean Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
                <p className="text-lg text-gray-600">SnowLine administrative control center</p>
              </div>
            </div>
          </motion.div>

          {/* Clean Admin Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="snowline-card border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Platform Administrator</h2>
                    <p className="text-lg text-gray-700">{currentUser.displayName || currentUser.name}</p>
                    <p className="text-sm text-gray-600 mt-1">Full system access • {currentUser.email}</p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                    Administrator
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Clean System Overview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="snowline-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{systemStatus.activeUsers}</p>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="snowline-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{(systemStatus.totalUsers / 1000).toFixed(1)}K</p>
                      <p className="text-sm text-gray-600">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="snowline-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Server className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{systemStatus.serverLoad}%</p>
                      <p className="text-sm text-gray-600">Server Load</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="snowline-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{systemStatus.securityAlerts}</p>
                      <p className="text-sm text-gray-600">Security Alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Clean Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card 
                className="snowline-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveModule('dashboard')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                    <BarChart3 className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Dashboard</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Real-time platform operations</p>
                </CardContent>
              </Card>

              <Card 
                className="snowline-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveModule('users')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                    <Users className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Users</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Account administration</p>
                </CardContent>
              </Card>

              <Card 
                className="snowline-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveModule('skifield')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                    <Mountain className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Ski Fields</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Resort management</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}