import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Flag,
  Radio,
  Search,
  Shield,
  Ban,
  CheckCircle,
  AlertTriangle,
  MapPin,
  RefreshCcw,
  Send,
  Eye,
  UserCheck,
  Crown,
  Clock,
  Activity,
  TrendingUp,
  Bell,
  Settings,
  X,
  ChevronRight,
  Plus,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { User as UserType } from '../../src/types';
import { toast } from 'sonner@2.0.3';

interface MobileAdminInterfaceProps {
  currentUser: UserType;
  onClose?: () => void;
}

// Mobile-optimized admin data structures
interface QuickStat {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface FlaggedRun {
  id: string;
  user_name: string;
  user_avatar?: string;
  resort: string;
  reason: string;
  created_at: string;
  reports_count: number;
}

interface QuickUser {
  id: string;
  display_name: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  banned: boolean;
  avatar?: string;
}

// Mock data for mobile interface
const mockQuickStats: QuickStat[] = [
  {
    label: 'Runs Today',
    value: 234,
    trend: 'up',
    icon: <Activity className="w-5 h-5" />,
    color: 'text-green-400'
  },
  {
    label: 'Active Flags',
    value: 8,
    trend: 'down',
    icon: <Flag className="w-5 h-5" />,
    color: 'text-red-400'
  },
  {
    label: 'Online Mods',
    value: 12,
    trend: 'neutral',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-blue-400'
  }
];

const mockFlaggedRuns: FlaggedRun[] = [
  {
    id: 'run_1',
    user_name: 'Alex Rider',
    resort: 'Whistler Blackcomb',
    reason: 'Inappropriate content',
    created_at: '2024-01-15T10:30:00Z',
    reports_count: 2
  },
  {
    id: 'run_2',
    user_name: 'Sarah Johnson',
    resort: 'Vail Resort',
    reason: 'Dangerous behavior',
    created_at: '2024-01-15T09:15:00Z',
    reports_count: 3
  }
];

const mockQuickUsers: QuickUser[] = [
  {
    id: '1',
    display_name: 'Alex Rider',
    username: 'alexrider',
    email: 'alex@snowline.app',
    role: 'admin',
    banned: false
  },
  {
    id: '2',
    display_name: 'Sarah Johnson',
    username: 'sarah_shreds',
    email: 'sarah@example.com',
    role: 'user',
    banned: false
  }
];

export const MobileAdminInterface: React.FC<MobileAdminInterfaceProps> = ({ currentUser, onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRun, setSelectedRun] = useState<FlaggedRun | null>(null);
  const [selectedUser, setSelectedUser] = useState<QuickUser | null>(null);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [runResolveOpen, setRunResolveOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    body: '',
    audience: 'all'
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleQuickAction = (action: string, id?: string) => {
    switch (action) {
      case 'resolve_flags':
        setActiveTab('flags');
        break;
      case 'broadcast':
        setBroadcastOpen(true);
        break;
      case 'find_user':
        setActiveTab('users');
        break;
      case 'resolve_run':
        if (id) {
          const run = mockFlaggedRuns.find(r => r.id === id);
          if (run) {
            setSelectedRun(run);
            setRunResolveOpen(true);
          }
        }
        break;
      case 'view_user':
        if (id) {
          const user = mockQuickUsers.find(u => u.id === id);
          if (user) {
            setSelectedUser(user);
            setUserDrawerOpen(true);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleResolveRun = () => {
    if (selectedRun) {
      toast.success(`Run from ${selectedRun.user_name} resolved`);
      setRunResolveOpen(false);
      setSelectedRun(null);
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    const user = mockQuickUsers.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'ban':
        toast.success(`${user.display_name} has been banned`);
        break;
      case 'unban':
        toast.success(`${user.display_name} has been unbanned`);
        break;
      case 'make_mod':
        toast.success(`${user.display_name} is now a moderator`);
        break;
      default:
        break;
    }
    setUserDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleSendBroadcast = () => {
    if (broadcastData.title && broadcastData.body) {
      toast.success('Broadcast sent successfully');
      setBroadcastOpen(false);
      setBroadcastData({ title: '', body: '', audience: 'all' });
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const filteredUsers = mockQuickUsers.filter(user =>
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-[#0B1220] text-[#E8F0FF] flex flex-col">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-[#121A2A] border-b border-[#233047] pt-safe">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4FB3F6] to-[#4FB3F6]/80 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#E8F0FF]">Admin</h1>
              <p className="text-xs text-[#9DB2CE]">Snowline Mobile</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-[#9DB2CE] hover:text-[#E8F0FF] p-2"
            >
              <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#9DB2CE] hover:text-[#E8F0FF] p-2"
            >
              <Bell className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-[#9DB2CE] hover:text-[#E8F0FF] p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <TabsContent value="home" className="p-4 space-y-6 m-0">
              {/* Admin Home */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {mockQuickStats.map((stat, index) => (
                    <Card key={index} className="bg-[#172238] border-[#233047]">
                      <CardContent className="p-4 text-center">
                        <div className={`${stat.color} mb-2 flex justify-center`}>
                          {stat.icon}
                        </div>
                        <p className="text-lg font-bold text-[#E8F0FF]">{stat.value}</p>
                        <p className="text-xs text-[#9DB2CE]">{stat.label}</p>
                        {stat.trend && (
                          <div className={`text-xs mt-1 ${
                            stat.trend === 'up' ? 'text-green-400' : 
                            stat.trend === 'down' ? 'text-red-400' : 
                            'text-[#9DB2CE]'
                          }`}>
                            {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card className="bg-[#172238] border-[#233047]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[#E8F0FF] text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => handleQuickAction('resolve_flags')}
                      className="w-full justify-between bg-gradient-to-r from-red-600/20 to-red-600/10 border border-red-600/30 text-[#E8F0FF] hover:bg-red-600/20"
                    >
                      <div className="flex items-center space-x-3">
                        <Flag className="w-5 h-5 text-red-400" />
                        <span>Resolve Flags</span>
                      </div>
                      <Badge variant="destructive" className="bg-red-600">
                        {mockFlaggedRuns.length}
                      </Badge>
                    </Button>

                    <Button
                      onClick={() => handleQuickAction('broadcast')}
                      className="w-full justify-between bg-gradient-to-r from-blue-600/20 to-blue-600/10 border border-blue-600/30 text-[#E8F0FF] hover:bg-blue-600/20"
                    >
                      <div className="flex items-center space-x-3">
                        <Radio className="w-5 h-5 text-blue-400" />
                        <span>Send Broadcast</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9DB2CE]" />
                    </Button>

                    <Button
                      onClick={() => handleQuickAction('find_user')}
                      className="w-full justify-between bg-gradient-to-r from-green-600/20 to-green-600/10 border border-green-600/30 text-[#E8F0FF] hover:bg-green-600/20"
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="w-5 h-5 text-green-400" />
                        <span>Find User</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9DB2CE]" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-[#172238] border-[#233047]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[#E8F0FF] text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-[#0B1220]/50 rounded-lg">
                      <div className="w-8 h-8 bg-red-600/20 rounded-full flex items-center justify-center">
                        <Flag className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#E8F0FF] truncate">Run flagged: Powder Paradise</p>
                        <p className="text-xs text-[#9DB2CE]">2 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-[#0B1220]/50 rounded-lg">
                      <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#E8F0FF] truncate">New user verified: Emma Watson</p>
                        <p className="text-xs text-[#9DB2CE]">5 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-[#0B1220]/50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Radio className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#E8F0FF] truncate">Broadcast sent: Weather Alert</p>
                        <p className="text-xs text-[#9DB2CE]">8 minutes ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="flags" className="p-4 space-y-4 m-0">
              {/* Flags Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#E8F0FF]">Flagged Runs</h2>
                  <Badge variant="destructive" className="bg-red-600">
                    {mockFlaggedRuns.length} pending
                  </Badge>
                </div>

                <div className="space-y-3">
                  {mockFlaggedRuns.map((run) => (
                    <Card key={run.id} className="bg-[#172238] border-[#233047]">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#4FB3F6]/20 to-[#4FB3F6]/10 rounded-full flex items-center justify-center">
                                <Activity className="w-4 h-4 text-[#4FB3F6]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#E8F0FF] truncate">{run.user_name}</p>
                                <p className="text-xs text-[#9DB2CE] truncate">{run.resort}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="destructive" className="text-xs bg-red-600/20 text-red-400 border-red-600/30">
                                  {run.reason}
                                </Badge>
                                <span className="text-xs text-[#9DB2CE]">
                                  {run.reports_count} report{run.reports_count !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <p className="text-xs text-[#9DB2CE]">
                                {new Date(run.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#233047] text-[#E8F0FF] hover:bg-[#233047] px-3"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleQuickAction('resolve_run', run.id)}
                              className="bg-[#4FB3F6] hover:bg-[#4FB3F6]/90 px-3"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {mockFlaggedRuns.length === 0 && (
                  <Card className="bg-[#172238] border-[#233047]">
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#E8F0FF] mb-2">All Clear!</h3>
                      <p className="text-[#9DB2CE]">No flagged runs to review at this time.</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="users" className="p-4 space-y-4 m-0">
              {/* User Lookup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#E8F0FF] mb-3">User Lookup</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9DB2CE]" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#172238] border-[#233047] text-[#E8F0FF]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <Card 
                      key={user.id} 
                      className="bg-[#172238] border-[#233047] cursor-pointer hover:bg-[#1A2B42]"
                      onClick={() => handleQuickAction('view_user', user.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4FB3F6]/20 to-[#4FB3F6]/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-[#4FB3F6]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-[#E8F0FF] truncate">{user.display_name}</p>
                                {user.role !== 'user' && (
                                  <Badge
                                    variant="outline"
                                    className={
                                      user.role === 'admin'
                                        ? 'bg-blue-900/20 text-blue-300 border-blue-700 text-xs'
                                        : 'bg-yellow-900/20 text-yellow-300 border-yellow-700 text-xs'
                                    }
                                  >
                                    {user.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                                    {user.role === 'moderator' && <Shield className="w-3 h-3 mr-1" />}
                                    {user.role}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-[#9DB2CE] truncate">@{user.username}</p>
                              <p className="text-xs text-[#9DB2CE] truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.banned && (
                              <Badge variant="destructive" className="text-xs">
                                Banned
                              </Badge>
                            )}
                            <ChevronRight className="w-4 h-4 text-[#9DB2CE]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredUsers.length === 0 && searchQuery && (
                  <Card className="bg-[#172238] border-[#233047]">
                    <CardContent className="p-8 text-center">
                      <Search className="w-12 h-12 text-[#9DB2CE] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-[#E8F0FF] mb-2">No Users Found</h3>
                      <p className="text-[#9DB2CE]">No users match your search criteria.</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="broadcast" className="p-4 space-y-4 m-0">
              {/* Broadcast Interface */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-[#E8F0FF] mb-4">Send Broadcast</h2>
                
                <Card className="bg-[#172238] border-[#233047]">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#9DB2CE]">Title</label>
                      <Input
                        placeholder="Broadcast title..."
                        value={broadcastData.title}
                        onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                        className="mt-1 bg-[#0B1220] border-[#233047] text-[#E8F0FF]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-[#9DB2CE]">Message</label>
                      <Textarea
                        placeholder="Your message to users..."
                        value={broadcastData.body}
                        onChange={(e) => setBroadcastData({ ...broadcastData, body: e.target.value })}
                        className="mt-1 bg-[#0B1220] border-[#233047] text-[#E8F0FF] min-h-24"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-[#9DB2CE]">Audience</label>
                      <Select 
                        value={broadcastData.audience} 
                        onValueChange={(value) => setBroadcastData({ ...broadcastData, audience: value })}
                      >
                        <SelectTrigger className="mt-1 bg-[#0B1220] border-[#233047] text-[#E8F0FF]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#172238] border-[#233047]">
                          <SelectItem value="all" className="text-[#E8F0FF]">All Users</SelectItem>
                          <SelectItem value="resort" className="text-[#E8F0FF]">Current Resort</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      onClick={handleSendBroadcast}
                      className="w-full bg-[#4FB3F6] hover:bg-[#4FB3F6]/90 mt-6"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Broadcast
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-[#233047] bg-[#121A2A] pb-safe">
            <TabsList className="grid grid-cols-4 w-full h-16 bg-transparent">
              <TabsTrigger 
                value="home" 
                className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-[#4FB3F6]/10 data-[state=active]:text-[#4FB3F6] text-[#9DB2CE]"
              >
                <Shield className="w-5 h-5" />
                <span className="text-xs">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="flags" 
                className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-[#4FB3F6]/10 data-[state=active]:text-[#4FB3F6] text-[#9DB2CE] relative"
              >
                <Flag className="w-5 h-5" />
                <span className="text-xs">Flags</span>
                {mockFlaggedRuns.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-[#4FB3F6]/10 data-[state=active]:text-[#4FB3F6] text-[#9DB2CE]"
              >
                <Users className="w-5 h-5" />
                <span className="text-xs">Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="broadcast" 
                className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-[#4FB3F6]/10 data-[state=active]:text-[#4FB3F6] text-[#9DB2CE]"
              >
                <Radio className="w-5 h-5" />
                <span className="text-xs">Broadcast</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* User Detail Drawer */}
      <Sheet open={userDrawerOpen} onOpenChange={setUserDrawerOpen}>
        <SheetContent side="bottom" className="bg-[#172238] border-[#233047] text-[#E8F0FF] h-[80vh] rounded-t-xl">
          {selectedUser && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-[#E8F0FF]">User Details</SheetTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserDrawerOpen(false)}
                    className="text-[#9DB2CE] hover:text-[#E8F0FF]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </SheetHeader>
              
              <ScrollArea className="h-full pb-20">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4FB3F6]/20 to-[#4FB3F6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-[#4FB3F6]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#E8F0FF]">{selectedUser.display_name}</h3>
                    <p className="text-[#9DB2CE]">@{selectedUser.username}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0B1220]/50 rounded-lg">
                      <label className="text-sm font-medium text-[#9DB2CE]">Email</label>
                      <p className="text-[#E8F0FF] mt-1">{selectedUser.email}</p>
                    </div>
                    
                    <div className="p-4 bg-[#0B1220]/50 rounded-lg">
                      <label className="text-sm font-medium text-[#9DB2CE]">Role</label>
                      <div className="mt-2">
                        <Select defaultValue={selectedUser.role}>
                          <SelectTrigger className="bg-[#172238] border-[#233047] text-[#E8F0FF]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#172238] border-[#233047]">
                            <SelectItem value="user" className="text-[#E8F0FF]">User</SelectItem>
                            <SelectItem value="moderator" className="text-[#E8F0FF]">Moderator</SelectItem>
                            <SelectItem value="admin" className="text-[#E8F0FF]">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-[#0B1220]/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-[#9DB2CE]">Account Status</label>
                        <Switch 
                          checked={!selectedUser.banned}
                          className="data-[state=checked]:bg-[#4FB3F6]"
                        />
                      </div>
                      <p className="text-xs text-[#9DB2CE] mt-2">
                        Account is currently {selectedUser.banned ? 'banned' : 'active'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full bg-[#4FB3F6] hover:bg-[#4FB3F6]/90"
                      onClick={() => handleUserAction('make_mod', selectedUser.id)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Make Moderator
                    </Button>
                    
                    <Button
                      variant="destructive"
                      className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
                      onClick={() => handleUserAction(selectedUser.banned ? 'unban' : 'ban', selectedUser.id)}
                    >
                      {selectedUser.banned ? (
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
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Run Resolve Dialog */}
      <Dialog open={runResolveOpen} onOpenChange={setRunResolveOpen}>
        <DialogContent className="bg-[#172238] border-[#233047] text-[#E8F0FF] mx-4">
          <DialogHeader>
            <DialogTitle className="text-[#E8F0FF]">Resolve Flagged Run</DialogTitle>
          </DialogHeader>
          {selectedRun && (
            <div className="space-y-4">
              <div className="p-4 bg-[#0B1220]/50 rounded-lg">
                <h4 className="font-medium text-[#E8F0FF] mb-2">Run Details</h4>
                <p className="text-sm text-[#9DB2CE]">User: {selectedRun.user_name}</p>
                <p className="text-sm text-[#9DB2CE]">Resort: {selectedRun.resort}</p>
                <p className="text-sm text-[#9DB2CE]">Reason: {selectedRun.reason}</p>
                <p className="text-sm text-[#9DB2CE]">Reports: {selectedRun.reports_count}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#9DB2CE]">Resolution Note</label>
                <Textarea
                  placeholder="Add a note about the resolution..."
                  className="mt-1 bg-[#0B1220] border-[#233047] text-[#E8F0FF]"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#233047] text-[#E8F0FF] hover:bg-[#233047]"
                  onClick={() => setRunResolveOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#4FB3F6] hover:bg-[#4FB3F6]/90"
                  onClick={handleResolveRun}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileAdminInterface;