import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Activity,
  BarChart3,
  Settings,
  Search,
  Bell,
  User,
  Flag,
  Radio,
  ChevronDown,
  Menu,
  X,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Ban,
  UserCheck,
  Trash2,
  Download,
  RefreshCw,
  Plus,
  Send,
  Shield,
  Crown,
  MoreHorizontal,
  Calendar,
  Clock,
  Zap,
  Filter,
  SortAsc,
  Globe,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { StatCard, AdminDataTable, UserCard, RunCard, MapThumbnail, StatusPill, RolePill, EmptyState } from './Library';
import { User as UserType } from '../../src/types';
import { toast } from 'sonner@2.0.3';

// Admin-specific types extending the base types
interface AdminUser extends UserType {
  banned: boolean;
  created_at: string;
  last_login?: string;
  total_runs: number;
  reports_count: number;
}

interface AdminRun {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  resort: string;
  distance_m: number;
  vert_m: number;
  max_speed_kmh: number;
  duration: number;
  status: 'public' | 'private' | 'flagged';
  created_at: string;
  reports_count: number;
  geojson_path?: string;
}

interface Report {
  id: string;
  run_id: string;
  run_title: string;
  reporter_id: string;
  reporter_name: string;
  reason: string;
  description?: string;
  resolved: boolean;
  moderator_note?: string;
  moderator_id?: string;
  created_at: string;
  resolved_at?: string;
}

interface Broadcast {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'resort' | 'user_ids';
  resort_id?: string;
  resort_name?: string;
  user_ids?: string[];
  sent_at: string;
  status: 'draft' | 'sent' | 'scheduled';
  created_by: string;
}

interface WebAdminDashboardProps {
  currentUser: UserType;
  onClose?: () => void;
}

// Mock data for demonstration
const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    username: 'alexrider',
    displayName: 'Alex Rider',
    name: 'Alex Rider',
    email: 'alex@snowline.app',
    avatar: '/avatar.jpg',
    level: 'advanced',
    accountType: 'individual',
    isVerified: true,
    followers: ['2', '3', '4'],
    following: ['2', '3'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    banned: false,
    created_at: '2024-01-01T10:00:00Z',
    last_login: '2024-01-15T14:30:00Z',
    total_runs: 42,
    reports_count: 0,
    preferences: {} as any,
    settings: {} as any,
    stats: {} as any,
    profile: {} as any
  },
  {
    id: '2',
    username: 'sarah_shreds',
    displayName: 'Sarah Johnson',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    level: 'intermediate',
    accountType: 'individual',
    isVerified: false,
    followers: ['1', '3'],
    following: ['1'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date(),
    banned: false,
    created_at: '2024-01-05T12:00:00Z',
    last_login: '2024-01-14T16:20:00Z',
    total_runs: 28,
    reports_count: 1,
    preferences: {} as any,
    settings: {} as any,
    stats: {} as any,
    profile: {} as any
  }
];

const mockAdminRuns: AdminRun[] = [
  {
    id: 'run_1',
    user_id: '1',
    user_name: 'Alex Rider',
    resort: 'Whistler Blackcomb',
    distance_m: 12300,
    vert_m: 1240,
    max_speed_kmh: 62,
    duration: 8100,
    status: 'public',
    created_at: '2024-01-15T09:30:00Z',
    reports_count: 0
  },
  {
    id: 'run_2',
    user_id: '2',
    user_name: 'Sarah Johnson',
    resort: 'Vail Resort',
    distance_m: 8700,
    vert_m: 890,
    max_speed_kmh: 48,
    duration: 6600,
    status: 'flagged',
    created_at: '2024-01-14T14:20:00Z',
    reports_count: 2
  }
];

const mockReports: Report[] = [
  {
    id: 'report_1',
    run_id: 'run_2',
    run_title: 'Morning Glory Run',
    reporter_id: '3',
    reporter_name: 'Mike Chen',
    reason: 'inappropriate_content',
    description: 'Run contains inappropriate language in description',
    resolved: false,
    created_at: '2024-01-14T15:30:00Z'
  }
];

const mockBroadcasts: Broadcast[] = [
  {
    id: 'broadcast_1',
    title: 'Weather Alert: Heavy Snow Expected',
    body: 'Significant snowfall expected at all resorts. Exercise caution on advanced runs.',
    audience: 'all',
    status: 'sent',
    sent_at: '2024-01-15T08:00:00Z',
    created_by: 'Admin'
  }
];

export const WebAdminDashboard: React.FC<WebAdminDashboardProps> = ({ currentUser, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [runDetailOpen, setRunDetailOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<AdminRun | null>(null);
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);
  const [resolveReportOpen, setResolveReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Search and filter states
  const [userSearch, setUserSearch] = useState('');
  const [runSearch, setRunSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [runStatusFilter, setRunStatusFilter] = useState<string>('all');
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('unresolved');

  // Mock statistics
  const dashboardStats = {
    activeUsers24h: 1234,
    runsToday: 456,
    flaggedRuns: 12,
    pendingReports: 8,
    systemHealth: 99.9,
    avgResponseTime: 245
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'users', label: 'Users', icon: Users, badge: null },
    { id: 'runs', label: 'Runs', icon: Activity, badge: mockReports.filter(r => !r.resolved).length },
    { id: 'reports', label: 'Reports', icon: Flag, badge: mockReports.filter(r => !r.resolved).length },
    { id: 'broadcasts', label: 'Broadcasts', icon: Radio, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const handleUserAction = (action: string, userId: string) => {
    const user = mockAdminUsers.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'view':
        setSelectedUser(user);
        setUserDrawerOpen(true);
        break;
      case 'ban':
        toast.success(`User ${user.displayName} has been banned`);
        break;
      case 'unban':
        toast.success(`User ${user.displayName} has been unbanned`);
        break;
      case 'make_admin':
        toast.success(`${user.displayName} is now an admin`);
        break;
      default:
        break;
    }
  };

  const handleRunAction = (action: string, runId: string) => {
    const run = mockAdminRuns.find(r => r.id === runId);
    if (!run) return;

    switch (action) {
      case 'view':
        setSelectedRun(run);
        setRunDetailOpen(true);
        break;
      case 'set_private':
        toast.success('Run set to private');
        break;
      case 'approve':
        toast.success('Run approved');
        break;
      case 'delete':
        toast.error('Run deleted');
        break;
      default:
        break;
    }
  };

  const handleReportAction = (action: string, reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (!report) return;

    switch (action) {
      case 'resolve':
        setSelectedReport(report);
        setResolveReportOpen(true);
        break;
      default:
        break;
    }
  };

  const handleBroadcast = (data: { title: string; body: string; audience: string; resort?: string }) => {
    toast.success('Broadcast sent successfully');
    setBroadcastDialogOpen(false);
  };

  const handleResolveReport = (reportId: string, note: string) => {
    toast.success('Report resolved');
    setResolveReportOpen(false);
    setSelectedReport(null);
  };

  // Filter data based on search and filters
  const filteredUsers = mockAdminUsers.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || 
                       (userRoleFilter === 'banned' && user.banned) ||
                       (userRoleFilter === 'verified' && user.isVerified);
    return matchesSearch && matchesRole;
  });

  const filteredRuns = mockAdminRuns.filter(run => {
    const matchesSearch = run.user_name.toLowerCase().includes(runSearch.toLowerCase()) ||
                         run.resort.toLowerCase().includes(runSearch.toLowerCase());
    const matchesStatus = runStatusFilter === 'all' || run.status === runStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.run_title.toLowerCase().includes(reportSearch.toLowerCase()) ||
                         report.reporter_name.toLowerCase().includes(reportSearch.toLowerCase());
    const matchesStatus = reportStatusFilter === 'all' || 
                         (reportStatusFilter === 'resolved' && report.resolved) ||
                         (reportStatusFilter === 'unresolved' && !report.resolved);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-screen bg-[#0B1220] text-[#E8F0FF] flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-16'} transition-all duration-300 bg-[#121A2A] border-r border-[#233047] flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-[#233047]">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4FB3F6] to-[#4FB3F6]/80 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[#E8F0FF]">Admin Console</h1>
                  <p className="text-xs text-[#9DB2CE]">Snowline Platform</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#4FB3F6] to-[#4FB3F6]/80 rounded-xl flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-[#9DB2CE] hover:text-[#E8F0FF]"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Environment Badge */}
        <div className="px-6 py-3">
          <Badge className="bg-green-900 text-green-300 border-green-700">
            Production
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} space-x-3 px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#4FB3F6] text-white shadow-lg' 
                    : 'text-[#9DB2CE] hover:text-[#E8F0FF] hover:bg-[#172238]'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-[#233047]">
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#4FB3F6] to-[#4FB3F6]/80 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#E8F0FF] truncate">{currentUser.displayName}</p>
                <p className="text-xs text-[#9DB2CE] truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#121A2A] border-b border-[#233047] flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9DB2CE]" />
              <Input
                placeholder="Search users, runs, or reports..."
                className="pl-10 bg-[#172238] border-[#233047] text-[#E8F0FF] placeholder-[#9DB2CE]"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-[#9DB2CE] hover:text-[#E8F0FF]">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-[#9DB2CE] hover:text-[#E8F0FF] relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B6B] rounded-full"></div>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#9DB2CE] hover:text-[#E8F0FF]">
                  <User className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#172238] border-[#233047]">
                <DropdownMenuItem className="text-[#E8F0FF] hover:bg-[#233047]">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#233047]" />
                <DropdownMenuItem 
                  onClick={onClose}
                  className="text-[#E8F0FF] hover:bg-[#233047]"
                >
                  Exit Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-[#0B1220] p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-[#E8F0FF]">Dashboard</h1>
                    <p className="text-[#9DB2CE]">Platform overview and key metrics</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button className="bg-[#4FB3F6] hover:bg-[#4FB3F6]/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Broadcast
                    </Button>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-[#172238] border-[#233047]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#9DB2CE] mb-1">Active Users (24h)</p>
                          <p className="text-3xl font-bold text-[#E8F0FF]">{dashboardStats.activeUsers24h.toLocaleString()}</p>
                          <div className="flex items-center mt-2 text-sm text-[#7CFBDD]">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>+12%</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4FB3F6]/20 to-[#4FB3F6]/10 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-[#4FB3F6]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#172238] border-[#233047]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#9DB2CE] mb-1">Runs Today</p>
                          <p className="text-3xl font-bold text-[#E8F0FF]">{dashboardStats.runsToday}</p>
                          <div className="flex items-center mt-2 text-sm text-[#7CFBDD]">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>+8%</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7CFBDD]/20 to-[#7CFBDD]/10 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-[#7CFBDD]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#172238] border-[#233047]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#9DB2CE] mb-1">Flagged Runs</p>
                          <p className="text-3xl font-bold text-[#E8F0FF]">{dashboardStats.flaggedRuns}</p>
                          <div className="flex items-center mt-2 text-sm text-[#FFD166]">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span>Needs attention</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF6B6B]/10 rounded-xl flex items-center justify-center">
                          <Flag className="w-6 h-6 text-[#FF6B6B]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#172238] border-[#233047]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#9DB2CE] mb-1">System Health</p>
                          <p className="text-3xl font-bold text-[#E8F0FF]">{dashboardStats.systemHealth}%</p>
                          <div className="flex items-center mt-2 text-sm text-[#7CFBDD]">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span>All systems operational</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#7CFBDD]/20 to-[#7CFBDD]/10 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-[#7CFBDD]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#172238] border-[#233047]">
                    <CardHeader>
                      <CardTitle className="text-[#E8F0FF]">Runs by Hour (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-[#0B1220]/50 rounded-lg">
                        <p className="text-[#9DB2CE]">Chart: Runs by Hour (Bar Chart)</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#172238] border-[#233047]">
                    <CardHeader>
                      <CardTitle className="text-[#E8F0FF]">Average Speed (7d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-[#0B1220]/50 rounded-lg">
                        <p className="text-[#9DB2CE]">Chart: Average Speed Trend (Line Chart)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-[#172238] border-[#233047]">
                  <CardHeader>
                    <CardTitle className="text-[#E8F0FF]">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-[#0B1220]/50 rounded-lg">
                      <div className="w-8 h-8 bg-[#7CFBDD]/20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#7CFBDD]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#E8F0FF]">New user joined: <span className="font-medium">Emma Watson</span></p>
                        <p className="text-xs text-[#9DB2CE]">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-[#0B1220]/50 rounded-lg">
                      <div className="w-8 h-8 bg-[#FF6B6B]/20 rounded-full flex items-center justify-center">
                        <Flag className="w-4 h-4 text-[#FF6B6B]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#E8F0FF]">Run flagged for review: <span className="font-medium">Powder Paradise</span></p>
                        <p className="text-xs text-[#9DB2CE]">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-[#0B1220]/50 rounded-lg">
                      <div className="w-8 h-8 bg-[#FFD166]/20 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[#FFD166]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#E8F0FF]">Badge awarded: <span className="font-medium">Mountain Explorer</span></p>
                        <p className="text-xs text-[#9DB2CE]">8 minutes ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-[#4FB3F6] hover:bg-[#4FB3F6]/90"
                    onClick={() => setBroadcastDialogOpen(true)}
                  >
                    <Radio className="w-4 h-4 mr-2" />
                    Create Broadcast
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#233047] text-[#E8F0FF] hover:bg-[#172238]"
                    onClick={() => setActiveTab('reports')}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    View Flags
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#233047] text-[#E8F0FF] hover:bg-[#172238]"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Open Live Map
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Users Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-[#E8F0FF]">Users</h1>
                    <p className="text-[#9DB2CE]">Manage user accounts and permissions</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9DB2CE]" />
                    <Input
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10 bg-[#172238] border-[#233047] text-[#E8F0FF]"
                    />
                  </div>
                  <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                    <SelectTrigger className="w-40 bg-[#172238] border-[#233047] text-[#E8F0FF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#172238] border-[#233047]">
                      <SelectItem value="all" className="text-[#E8F0FF]">All Users</SelectItem>
                      <SelectItem value="verified" className="text-[#E8F0FF]">Verified</SelectItem>
                      <SelectItem value="banned" className="text-[#E8F0FF]">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <Card className="bg-[#172238] border-[#233047]">
                  <CardContent className="p-0">
                    {selectedUsers.length > 0 && (
                      <div className="p-4 border-b border-[#233047] bg-[#0B1220]/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#9DB2CE]">
                            {selectedUsers.length} users selected
                          </span>
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/10">
                              <Ban className="w-4 h-4 mr-2" />
                              Ban Selected
                            </Button>
                            <Button size="sm" className="bg-[#4FB3F6] hover:bg-[#4FB3F6]/90">
                              <Shield className="w-4 h-4 mr-2" />
                              Make Moderator
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#0B1220] sticky top-0">
                          <tr>
                            <th className="text-left p-4 w-12">
                              <input
                                type="checkbox"
                                checked={selectedUsers.length === filteredUsers.length}
                                onChange={() => {
                                  if (selectedUsers.length === filteredUsers.length) {
                                    setSelectedUsers([]);
                                  } else {
                                    setSelectedUsers(filteredUsers.map(u => u.id));
                                  }
                                }}
                                className="rounded border-[#233047]"
                              />
                            </th>
                            <th className="text-left p-4 text-[#E8F0FF] font-medium">User</th>
                            <th className="text-left p-4 text-[#E8F0FF] font-medium">Email</th>
                            <th className="text-left p-4 text-[#E8F0FF] font-medium">Role</th>
                            <th className="text-left p-4 text-[#E8F0FF] font-medium">Status</th>
                            <th className="text-left p-4 text-[#E8F0FF] font-medium">Joined</th>
                            <th className="text-left p-4 text-[#E8F0FF] font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t border-[#233047] hover:bg-[#0B1220]/50">
                              <td className="p-4">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => {
                                    if (selectedUsers.includes(user.id)) {
                                      setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                    } else {
                                      setSelectedUsers([...selectedUsers, user.id]);
                                    }
                                  }}
                                  className="rounded border-[#233047]"
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#4FB3F6]/20 to-[#4FB3F6]/10 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-[#4FB3F6]" />
                                  </div>
                                  <div>
                                    <p className="text-[#E8F0FF] font-medium">{user.displayName}</p>
                                    <p className="text-[#9DB2CE] text-sm">@{user.username}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-[#E8F0FF]">{user.email}</td>
                              <td className="p-4">
                                <Badge
                                  variant="outline"
                                  className={
                                    user.isVerified 
                                      ? 'bg-blue-900/20 text-blue-300 border-blue-700'
                                      : 'bg-gray-900/20 text-gray-300 border-gray-700'
                                  }
                                >
                                  {user.isVerified ? (
                                    <>
                                      <Crown className="w-3 h-3 mr-1" />
                                      Pro
                                    </>
                                  ) : (
                                    'Basic'
                                  )}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge
                                  variant={user.banned ? 'destructive' : 'secondary'}
                                  className={
                                    user.banned 
                                      ? 'bg-red-900/20 text-red-300 border-red-700'
                                      : 'bg-green-900/20 text-green-300 border-green-700'
                                  }
                                >
                                  {user.banned ? 'Banned' : 'Active'}
                                </Badge>
                              </td>
                              <td className="p-4 text-[#9DB2CE]">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="p-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-[#9DB2CE] hover:text-[#E8F0FF]">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-[#172238] border-[#233047]">
                                    <DropdownMenuItem 
                                      onClick={() => handleUserAction('view', user.id)}
                                      className="text-[#E8F0FF] hover:bg-[#233047]"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleUserAction(user.banned ? 'unban' : 'ban', user.id)}
                                      className="text-[#E8F0FF] hover:bg-[#233047]"
                                    >
                                      {user.banned ? (
                                        <>
                                          <UserCheck className="w-4 h-4 mr-2" />
                                          Unban User
                                        </>
                                      ) : (
                                        <>
                                          <Ban className="w-4 h-4 mr-2" />
                                          Ban User
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleUserAction('make_admin', user.id)}
                                      className="text-[#E8F0FF] hover:bg-[#233047]"
                                    >
                                      <Crown className="w-4 h-4 mr-2" />
                                      Make Admin
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Similar implementations for other tabs would go here */}
            {activeTab === 'runs' && (
              <motion.div
                key="runs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-[#E8F0FF]">Run Moderation</h1>
                  <p className="text-[#9DB2CE]">Review and moderate user-generated runs</p>
                </div>
                
                <EmptyState
                  icon={<Activity className="w-8 h-8 text-[#9DB2CE]" />}
                  title="Run Moderation Interface"
                  description="Full run moderation interface would be implemented here with detailed run analysis, GPS track visualization, and moderation tools."
                />
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-[#E8F0FF]">Reports Queue</h1>
                  <p className="text-[#9DB2CE]">Review and resolve user reports</p>
                </div>
                
                <EmptyState
                  icon={<Flag className="w-8 h-8 text-[#9DB2CE]" />}
                  title="Reports Management Interface"
                  description="Full reports queue interface would be implemented here with report details, resolution workflows, and batch actions."
                />
              </motion.div>
            )}

            {activeTab === 'broadcasts' && (
              <motion.div
                key="broadcasts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-[#E8F0FF]">Broadcasts</h1>
                  <p className="text-[#9DB2CE]">Send announcements and alerts to users</p>
                </div>
                
                <EmptyState
                  icon={<Radio className="w-8 h-8 text-[#9DB2CE]" />}
                  title="Broadcast Management Interface"
                  description="Full broadcast system would be implemented here with message composer, audience targeting, and delivery tracking."
                />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-[#E8F0FF]">Settings</h1>
                  <p className="text-[#9DB2CE]">Platform configuration and system settings</p>
                </div>
                
                <EmptyState
                  icon={<Settings className="w-8 h-8 text-[#9DB2CE]" />}
                  title="System Settings Interface"
                  description="Full system settings interface would be implemented here with role permissions, privacy defaults, and system configuration."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* User Detail Drawer */}
      <Sheet open={userDrawerOpen} onOpenChange={setUserDrawerOpen}>
        <SheetContent className="bg-[#172238] border-[#233047] text-[#E8F0FF] w-96">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle className="text-[#E8F0FF]">User Details</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4FB3F6]/20 to-[#4FB3F6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-[#4FB3F6]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#E8F0FF]">{selectedUser.displayName}</h3>
                  <p className="text-[#9DB2CE]">@{selectedUser.username}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#9DB2CE]">Email</label>
                    <p className="text-[#E8F0FF]">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#9DB2CE]">Account Type</label>
                    <div className="mt-1">
                      <Badge className={selectedUser.isVerified ? 'bg-blue-900/20 text-blue-300 border-blue-700' : 'bg-gray-900/20 text-gray-300 border-gray-700'}>
                        {selectedUser.isVerified ? 'Pro' : 'Basic'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#9DB2CE]">Total Runs</label>
                    <p className="text-[#E8F0FF]">{selectedUser.total_runs}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#9DB2CE]">Member Since</label>
                    <p className="text-[#E8F0FF]">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#9DB2CE]">Status</label>
                    <div className="mt-1">
                      <Badge variant={selectedUser.banned ? 'destructive' : 'secondary'}>
                        {selectedUser.banned ? 'Banned' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#233047]">
                  <Button className="w-full bg-[#4FB3F6] hover:bg-[#4FB3F6]/90">
                    <Crown className="w-4 h-4 mr-2" />
                    Make Admin
                  </Button>
                  <Button variant="outline" className="w-full border-[#233047] text-[#E8F0FF] hover:bg-[#233047]">
                    Reset Password
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                  >
                    {selectedUser.banned ? 'Unban User' : 'Ban User'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
        <DialogContent className="bg-[#172238] border-[#233047] text-[#E8F0FF] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#E8F0FF]">Create Broadcast</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#9DB2CE]">Title</label>
              <Input 
                placeholder="Broadcast title..." 
                className="mt-1 bg-[#0B1220] border-[#233047] text-[#E8F0FF]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DB2CE]">Message</label>
              <Textarea 
                placeholder="Your message..." 
                className="mt-1 bg-[#0B1220] border-[#233047] text-[#E8F0FF] min-h-24"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DB2CE]">Audience</label>
              <Select>
                <SelectTrigger className="mt-1 bg-[#0B1220] border-[#233047] text-[#E8F0FF]">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent className="bg-[#172238] border-[#233047]">
                  <SelectItem value="all" className="text-[#E8F0FF]">All Users</SelectItem>
                  <SelectItem value="resort" className="text-[#E8F0FF]">Specific Resort</SelectItem>
                  <SelectItem value="users" className="text-[#E8F0FF]">Selected Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-[#233047] text-[#E8F0FF] hover:bg-[#233047]"
              >
                Send Test
              </Button>
              <Button 
                className="flex-1 bg-[#4FB3F6] hover:bg-[#4FB3F6]/90"
                onClick={() => setBroadcastDialogOpen(false)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebAdminDashboard;