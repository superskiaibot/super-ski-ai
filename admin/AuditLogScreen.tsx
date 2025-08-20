import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Settings,
  Users,
  MessageSquare,
  Calendar,
  Database,
  Globe,
  Clock,
  MapPin,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { User as UserType } from '../../src/types/index';

interface AuditLogScreenProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  metadata: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
}

export function AuditLogScreen({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: AuditLogScreenProps) {
  // Only Platform Admin can access this screen
  if (userRole !== 'platform_admin') {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">
            Only Platform Administrators can access audit logs.
          </p>
        </CardContent>
      </Card>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [actorFilter, setActorFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('24h');

  // Mock audit log entries
  const auditLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-20T14:25:00Z',
      actor: 'Sarah Mitchell',
      actorRole: 'Resort Administrator',
      action: 'view_user_profile',
      target: 'User ID: 12345',
      description: 'Viewed participant profile during event management',
      ipAddress: '203.97.54.123',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'Queenstown, NZ',
      metadata: { userId: '12345', eventId: 'fresh-powder-challenge', resortId: 'coronet-peak' },
      riskLevel: 'low'
    },
    {
      id: '2',
      timestamp: '2024-01-20T14:20:00Z',
      actor: 'Platform Administrator',
      actorRole: 'Platform Administrator',
      action: 'toggle_visibility',
      target: 'Cardrona Alpine Resort',
      description: 'Changed participant visibility to hidden for resort',
      ipAddress: '210.54.32.189',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Auckland, NZ',
      metadata: { resortId: 'cardrona', previousState: 'visible', newState: 'hidden', reason: 'Privacy review requested' },
      riskLevel: 'high'
    },
    {
      id: '3',
      timestamp: '2024-01-20T14:15:00Z',
      actor: 'Mike Johnson',
      actorRole: 'Event Manager',
      action: 'export_data',
      target: 'Event Participants CSV',
      description: 'Exported participant data for Fresh Powder Challenge event',
      ipAddress: '203.97.54.156',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'Queenstown, NZ',
      metadata: { eventId: 'fresh-powder-challenge', recordCount: 156, format: 'csv' },
      riskLevel: 'medium'
    },
    {
      id: '4',
      timestamp: '2024-01-20T14:10:00Z',
      actor: 'Alex Chen',
      actorRole: 'Resort Administrator',
      action: 'send_message',
      target: 'Event Participants',
      description: 'Sent weather update message to event participants',
      ipAddress: '203.97.54.145',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15',
      location: 'Wanaka, NZ',
      metadata: { recipientCount: 89, channels: ['in_app', 'push'], messageId: 'weather-update-001' },
      riskLevel: 'low'
    },
    {
      id: '5',
      timestamp: '2024-01-20T13:45:00Z',
      actor: 'Platform Administrator',
      actorRole: 'Platform Administrator',
      action: 'rotate_api_key',
      target: 'Resort API Integration',
      description: 'Rotated API key for security maintenance',
      ipAddress: '210.54.32.189',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Auckland, NZ',
      metadata: { keyId: 'sk_live_****nF2a', resortId: 'coronet-peak' },
      riskLevel: 'medium'
    },
    {
      id: '6',
      timestamp: '2024-01-20T13:30:00Z',
      actor: 'Emma Wilson',
      actorRole: 'Event Manager',
      action: 'freeze_event',
      target: 'Weekend Warriors Event',
      description: 'Froze event leaderboard for official results',
      ipAddress: '203.97.54.167',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'Christchurch, NZ',
      metadata: { eventId: 'weekend-warriors', participantCount: 89, leaderboardFrozen: true },
      riskLevel: 'low'
    },
    {
      id: '7',
      timestamp: '2024-01-20T13:15:00Z',
      actor: 'Platform Administrator',
      actorRole: 'Platform Administrator',
      action: 'global_anonymous_enable',
      target: 'All Resorts',
      description: 'Enabled global anonymous mode for 2 hours',
      ipAddress: '210.54.32.189',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Auckland, NZ',
      metadata: { duration: '2h', reason: 'Emergency privacy protection during system maintenance', affectedResorts: 25 },
      riskLevel: 'high'
    },
    {
      id: '8',
      timestamp: '2024-01-20T12:50:00Z',
      actor: 'David Kim',
      actorRole: 'Resort Administrator',
      action: 'update_selection_card',
      target: 'Mt Hutt Resort Card',
      description: 'Updated resort selection card configuration',
      ipAddress: '203.97.54.178',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'Canterbury, NZ',
      metadata: { resortId: 'mt-hutt', changes: ['title', 'description', 'heroImage'] },
      riskLevel: 'low'
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    const matchesActor = actorFilter === 'all' || log.actorRole === actorFilter;
    const matchesRisk = riskFilter === 'all' || log.riskLevel === riskFilter;

    return matchesSearch && matchesAction && matchesActor && matchesRisk;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('view') || action.includes('profile')) return <Eye className="w-4 h-4" />;
    if (action.includes('toggle') || action.includes('visibility')) return <Shield className="w-4 h-4" />;
    if (action.includes('export')) return <Download className="w-4 h-4" />;
    if (action.includes('message')) return <MessageSquare className="w-4 h-4" />;
    if (action.includes('event') || action.includes('freeze')) return <Calendar className="w-4 h-4" />;
    if (action.includes('api') || action.includes('key')) return <Database className="w-4 h-4" />;
    if (action.includes('global') || action.includes('anonymous')) return <Globe className="w-4 h-4" />;
    if (action.includes('update') || action.includes('card')) return <Settings className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('view') || action.includes('profile')) return 'text-blue-600';
    if (action.includes('toggle') || action.includes('visibility')) return 'text-red-600';
    if (action.includes('export')) return 'text-purple-600';
    if (action.includes('message')) return 'text-green-600';
    if (action.includes('event') || action.includes('freeze')) return 'text-orange-600';
    if (action.includes('api') || action.includes('key')) return 'text-yellow-600';
    if (action.includes('global') || action.includes('anonymous')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NZ', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('iPhone') || userAgent.includes('Android') || userAgent.includes('Mobile')) {
      return <Smartphone className="w-3 h-3" />;
    }
    return <Monitor className="w-3 h-3" />;
  };

  const exportAuditLog = async (format: 'csv' | 'json') => {
    // Simulate export
    console.log(`Exporting audit log as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600 mt-1">
            Complete activity trail for security and compliance
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className="bg-red-100 text-red-700 border-red-200">
            Platform Administrator Only
          </Badge>
          
          <Button
            onClick={() => exportAuditLog('csv')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{auditLogs.length}</div>
            <div className="text-sm text-gray-600">Total Events (24h)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {auditLogs.filter(log => log.riskLevel === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Risk Actions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {[...new Set(auditLogs.map(log => log.actor))].length}
            </div>
            <div className="text-sm text-gray-600">Unique Users</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {[...new Set(auditLogs.map(log => log.location))].length}
            </div>
            <div className="text-sm text-gray-600">Locations</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="view">View Actions</SelectItem>
                  <SelectItem value="toggle">Visibility Changes</SelectItem>
                  <SelectItem value="export">Data Exports</SelectItem>
                  <SelectItem value="message">Messages</SelectItem>
                  <SelectItem value="event">Event Actions</SelectItem>
                  <SelectItem value="api">API Actions</SelectItem>
                  <SelectItem value="global">Global Changes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Platform Administrator">Platform Admin</SelectItem>
                  <SelectItem value="Resort Administrator">Resort Admin</SelectItem>
                  <SelectItem value="Event Manager">Event Manager</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredLogs.length} of {auditLogs.length} events
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Chronological list of all platform administration activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-50 ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {formatAction(log.action)}
                          </h4>
                          <Badge className={getRiskBadgeColor(log.riskLevel)}>
                            {log.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700">{log.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Target: <span className="font-medium">{log.target}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Actor & Location Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <div>
                        <div className="font-medium text-gray-900">{log.actor}</div>
                        <div>{log.actorRole}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <div>{log.location}</div>
                        <div>{log.ipAddress}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      {getDeviceIcon(log.userAgent)}
                      <div className="truncate">
                        {log.userAgent.includes('Macintosh') && 'macOS'}
                        {log.userAgent.includes('Windows') && 'Windows'}
                        {log.userAgent.includes('iPhone') && 'iPhone'}
                        {log.userAgent.includes('Android') && 'Android'}
                        {' '}
                        {log.userAgent.includes('Chrome') ? 'Chrome' : 
                         log.userAgent.includes('Safari') ? 'Safari' : 
                         log.userAgent.includes('Firefox') ? 'Firefox' : 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  {Object.keys(log.metadata).length > 0 && (
                    <>
                      <Separator />
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Additional Details:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span className="font-mono text-gray-900">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No audit log entries match the current filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}