import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users,
  Eye,
  EyeOff,
  Filter,
  Search,
  MapPin,
  Clock,
  Shield,
  Info,
  Settings,
  Download,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Separator } from '../ui/separator';
import { User as UserType } from '../../src/types/index';

interface AudienceManagementProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface AudienceUser {
  id: string;
  name: string;
  team?: string;
  distance: number;
  vertical: number;
  lastPing: string;
  isOnMountain: boolean;
  isInEvent: boolean;
  hasConsent: boolean;
  isVisible: boolean;
}

interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  filters: {
    currentlyOnMountain?: boolean;
    eventId?: string;
    minDistance?: number;
    maxDistance?: number;
    minVertical?: number;
    maxVertical?: number;
    hasConsent?: boolean;
    day?: string;
  };
  userCount: number;
}

export function AudienceManagement({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: AudienceManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityMode, setVisibilityMode] = useState<'allowed' | 'hidden'>('allowed');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSegmentBuilderOpen, setIsSegmentBuilderOpen] = useState(false);

  // Mock privacy policy status (would come from platform admin settings)
  const privacySettings = {
    forcedAnonymousMode: false,
    platformAdminHidden: false,
    reason: ''
  };

  // Mock users data
  const [users] = useState<AudienceUser[]>([
    { id: '1', name: 'Sarah Mitchell', team: 'Powder Hounds', distance: 24.7, vertical: 6840, lastPing: '2024-01-20T14:25:00Z', isOnMountain: true, isInEvent: true, hasConsent: true, isVisible: true },
    { id: '2', name: 'Mike Johnson', team: 'Alpine Addicts', distance: 23.2, vertical: 6580, lastPing: '2024-01-20T14:26:00Z', isOnMountain: true, isInEvent: true, hasConsent: true, isVisible: true },
    { id: '3', name: 'Alex Chen', team: 'Mountain Mavericks', distance: 22.1, vertical: 6320, lastPing: '2024-01-20T14:25:00Z', isOnMountain: true, isInEvent: false, hasConsent: false, isVisible: false },
    { id: '4', name: 'Emma Wilson', team: 'Snow Seekers', distance: 21.8, vertical: 6180, lastPing: '2024-01-20T14:22:00Z', isOnMountain: false, isInEvent: true, hasConsent: true, isVisible: true },
    { id: '5', name: 'David Kim', team: 'Ridge Runners', distance: 20.9, vertical: 5920, lastPing: '2024-01-20T14:21:00Z', isOnMountain: true, isInEvent: true, hasConsent: true, isVisible: true },
    { id: '6', name: 'Lisa Zhang', team: 'Powder Hounds', distance: 20.5, vertical: 5840, lastPing: '2024-01-20T14:26:00Z', isOnMountain: false, isInEvent: false, hasConsent: false, isVisible: false },
  ]);

  const [savedSegments] = useState<AudienceSegment[]>([
    { 
      id: '1', 
      name: 'Active On-Mountain Users', 
      description: 'Currently on mountain with recent activity',
      filters: { currentlyOnMountain: true },
      userCount: 4
    },
    { 
      id: '2', 
      name: 'Event Participants', 
      description: 'Users participating in current events',
      filters: { eventId: 'fresh-powder-challenge' },
      userCount: 5
    },
    { 
      id: '3', 
      name: 'High Distance Skiers', 
      description: 'Users with over 20km today',
      filters: { minDistance: 20 },
      userCount: 6
    }
  ]);

  const getTeams = () => {
    const teams = [...new Set(users.filter(u => u.team).map(u => u.team))];
    return teams.sort();
  };

  const filteredUsers = users.filter(user => {
    if (!user.isVisible && visibilityMode === 'allowed') return false;
    
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.team && user.team.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTeam = teamFilter === 'all' || user.team === teamFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'on_mountain' && user.isOnMountain) ||
                         (statusFilter === 'in_event' && user.isInEvent) ||
                         (statusFilter === 'consented' && user.hasConsent);
    
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ${diffInMinutes % 60}m ago`;
  };

  const getConsentBadgeColor = (hasConsent: boolean) => {
    return hasConsent 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  // Calculate aggregate stats for hidden mode
  const aggregateStats = {
    totalUsers: users.length,
    onMountain: users.filter(u => u.isOnMountain).length,
    inEvents: users.filter(u => u.isInEvent).length,
    totalDistance: users.reduce((sum, u) => sum + u.distance, 0),
    totalVertical: users.reduce((sum, u) => sum + u.vertical, 0),
    avgDistance: users.length > 0 ? users.reduce((sum, u) => sum + u.distance, 0) / users.length : 0,
    avgVertical: users.length > 0 ? users.reduce((sum, u) => sum + u.vertical, 0) / users.length : 0
  };

  const renderAllowedMode = () => (
    <div className="space-y-6">
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Current Users</span>
            </div>
            <Badge className="bg-green-100 text-green-700">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} visible
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      {user.team || 'No team'} • ID: {user.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Metrics */}
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{user.distance} km</div>
                    <div className="text-sm text-gray-500">Distance</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{user.vertical} m</div>
                    <div className="text-sm text-gray-500">Vertical</div>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="text-sm text-gray-600">{formatTimeAgo(user.lastPing)}</div>
                    <div className="text-xs text-gray-500">Last ping</div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      {user.isOnMountain && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          On Mountain
                        </Badge>
                      )}
                      {user.isInEvent && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          In Event
                        </Badge>
                      )}
                    </div>
                    
                    <Badge className={`text-xs ${getConsentBadgeColor(user.hasConsent)}`}>
                      {user.hasConsent ? (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Consented
                        </>
                      ) : (
                        'No Consent'
                      )}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No users match the current filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHiddenMode = () => (
    <div className="space-y-6">
      {/* Privacy Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-yellow-800 mb-2">
          <EyeOff className="w-5 h-5" />
          <span className="font-medium">Participants Hidden</span>
        </div>
        <p className="text-yellow-700 text-sm">
          {privacySettings.platformAdminHidden 
            ? "Individual participants are hidden by Platform Administrator privacy policy." 
            : "Participants are in Anonymous Mode or have not provided consent for data sharing."}
        </p>
        {privacySettings.reason && (
          <p className="text-yellow-600 text-sm mt-1">
            Reason: {privacySettings.reason}
          </p>
        )}
      </div>

      {/* Aggregate Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{aggregateStats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{aggregateStats.onMountain}</div>
            <div className="text-sm text-gray-600">Currently On Mountain</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">{aggregateStats.totalDistance.toFixed(1)} km</div>
            <div className="text-sm text-gray-600">Total Distance</div>
            <div className="text-xs text-gray-500 mt-1">
              Avg: {aggregateStats.avgDistance.toFixed(1)} km
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">{aggregateStats.totalVertical.toLocaleString()} m</div>
            <div className="text-sm text-gray-600">Total Vertical</div>
            <div className="text-xs text-gray-500 mt-1">
              Avg: {aggregateStats.avgVertical.toFixed(0)} m
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audience Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and segment your active user base
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Sheet open={isSegmentBuilderOpen} onOpenChange={setIsSegmentBuilderOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Segment</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-96">
              <SheetHeader>
                <SheetTitle>Segment Builder</SheetTitle>
                <SheetDescription>
                  Create a custom audience segment based on user behavior and attributes
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="segment-name">Segment Name</Label>
                    <Input id="segment-name" placeholder="e.g. High Activity Users" />
                  </div>
                  
                  <div>
                    <Label>Filters</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="on-mountain">Currently on Mountain</Label>
                        <Switch id="on-mountain" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="in-event">In Active Event</Label>
                        <Switch id="in-event" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="has-consent">Has Data Consent</Label>
                        <Switch id="has-consent" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Distance Filters</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="min-distance" className="text-xs">Min (km)</Label>
                        <Input id="min-distance" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="max-distance" className="text-xs">Max (km)</Label>
                        <Input id="max-distance" type="number" placeholder="100" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Vertical Filters</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="min-vertical" className="text-xs">Min (m)</Label>
                        <Input id="min-vertical" type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label htmlFor="max-vertical" className="text-xs">Max (m)</Label>
                        <Input id="max-vertical" type="number" placeholder="10000" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-blue-900 mb-1">Preview</div>
                  <div className="text-sm text-blue-700">
                    This segment will include approximately <strong>4 users</strong> based on current filters.
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">Save Segment</Button>
                  <Button variant="outline" onClick={() => setIsSegmentBuilderOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button 
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => onScreenChange('messaging')}
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {getTeams().map(team => (
                    <SelectItem key={team} value={team!}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on_mountain">On Mountain</SelectItem>
                  <SelectItem value="in_event">In Event</SelectItem>
                  <SelectItem value="consented">Consented</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility-mode" className="text-sm font-medium">
                  View Mode:
                </Label>
                <Select value={visibilityMode} onValueChange={(value) => setVisibilityMode(value as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allowed">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-3 h-3" />
                        <span>Allowed</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hidden">
                      <div className="flex items-center space-x-2">
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <span>Saved Segments</span>
          </CardTitle>
          <CardDescription>
            Quick access to your custom audience segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedSegments.map((segment, index) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{segment.name}</h4>
                      <Badge variant="outline">{segment.userCount} users</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Apply Filters
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => onScreenChange('messaging')}
                        className="flex items-center space-x-1"
                      >
                        <span>Message</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {visibilityMode === 'allowed' ? renderAllowedMode() : renderHiddenMode()}

      {/* Privacy Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-blue-900">
              <div className="font-medium mb-2">Privacy & Data Handling</div>
              <div className="text-sm space-y-1 text-blue-800">
                <p>• Users can opt out of data sharing with resort administrators at any time</p>
                <p>• Anonymous mode participants are never shown in individual listings</p>
                <p>• Platform Administrators can enable global privacy controls</p>
                <p>• All data access is logged for audit purposes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}