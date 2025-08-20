import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Copy,
  Archive,
  Users,
  Clock,
  MapPin,
  Settings,
  Play,
  Pause,
  MoreVertical,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { User as UserType } from '../../src/types/index';

interface EventsManagementProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface Event {
  id: string;
  name: string;
  status: 'scheduled' | 'live' | 'ended';
  startDate: string;
  endDate: string;
  participants: number;
  visibility: 'platform_only' | 'resort_platform' | 'anon_only';
  description: string;
  rules: string;
  metrics: string[];
  enrollment: 'open' | 'code';
  enrollmentCode?: string;
  consentDefault: boolean;
}

export function EventsManagement({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: EventsManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Fresh Powder Challenge',
      status: 'live',
      startDate: '2024-01-20T08:00:00Z',
      endDate: '2024-01-20T16:00:00Z',
      participants: 156,
      visibility: 'resort_platform',
      description: 'A day-long challenge to see who can cover the most distance in fresh powder conditions.',
      rules: 'All skill levels welcome. Must complete at least 3 runs to qualify. Fair play encouraged.',
      metrics: ['distance', 'vertical'],
      enrollment: 'open',
      consentDefault: true
    },
    {
      id: '2',
      name: 'Weekend Warriors',
      status: 'scheduled',
      startDate: '2024-01-27T07:00:00Z',
      endDate: '2024-01-28T17:00:00Z',
      participants: 89,
      visibility: 'anon_only',
      description: 'Two-day weekend competition for dedicated skiers.',
      rules: 'Intermediate and advanced skiers only. Team participation encouraged.',
      metrics: ['distance', 'vertical'],
      enrollment: 'code',
      enrollmentCode: 'WEEKEND2024',
      consentDefault: false
    },
    {
      id: '3',
      name: 'New Year Sprint',
      status: 'ended',
      startDate: '2024-01-01T09:00:00Z',
      endDate: '2024-01-01T15:00:00Z',
      participants: 234,
      visibility: 'platform_only',
      description: 'Start the year right with a New Year\'s Day skiing sprint!',
      rules: 'Quick 6-hour event. Focus on speed and technique.',
      metrics: ['distance'],
      enrollment: 'open',
      consentDefault: true
    }
  ]);

  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: '',
    description: '',
    rules: '',
    visibility: 'resort_platform',
    metrics: ['distance'],
    enrollment: 'open',
    consentDefault: true
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ended': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'platform_only': return 'Platform Only';
      case 'resort_platform': return 'Resort + Platform';
      case 'anon_only': return 'Anonymous Only';
      default: return visibility;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'platform_only': return 'bg-red-100 text-red-700';
      case 'resort_platform': return 'bg-blue-100 text-blue-700';
      case 'anon_only': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NZ', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent as Event,
      status: 'scheduled',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
      participants: 0
    };
    
    setEvents(prev => [event, ...prev]);
    setIsCreateDialogOpen(false);
    setNewEvent({
      name: '',
      description: '',
      rules: '',
      visibility: 'resort_platform',
      metrics: ['distance'],
      enrollment: 'open',
      consentDefault: true
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
  };

  const handleSaveEdit = () => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? editingEvent : e));
      setEditingEvent(null);
    }
  };

  const handleDuplicateEvent = (event: Event) => {
    const duplicated: Event = {
      ...event,
      id: Date.now().toString(),
      name: `${event.name} (Copy)`,
      status: 'scheduled',
      participants: 0
    };
    setEvents(prev => [duplicated, ...prev]);
  };

  const handleToggleEventStatus = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: event.status === 'live' ? 'scheduled' : 'live' as any }
        : event
    ));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage skiing events and competitions
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Set up a new skiing event or competition
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name *</Label>
                    <Input
                      id="event-name"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Fresh Powder Challenge"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility Mode *</Label>
                    <Select
                      value={newEvent.visibility}
                      onValueChange={(value) => setNewEvent(prev => ({ ...prev, visibility: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platform_only">Platform Only</SelectItem>
                        <SelectItem value="resort_platform">Resort + Platform</SelectItem>
                        <SelectItem value="anon_only">Anonymous Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your event..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rules">Rules & Guidelines</Label>
                  <Textarea
                    id="rules"
                    value={newEvent.rules}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, rules: e.target.value }))}
                    placeholder="Event rules and guidelines..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                <Label>Tracked Metrics</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="distance"
                      checked={newEvent.metrics?.includes('distance')}
                      onChange={(e) => {
                        const metrics = newEvent.metrics || [];
                        setNewEvent(prev => ({
                          ...prev,
                          metrics: e.target.checked 
                            ? [...metrics, 'distance']
                            : metrics.filter(m => m !== 'distance')
                        }));
                      }}
                    />
                    <Label htmlFor="distance">Distance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="vertical"
                      checked={newEvent.metrics?.includes('vertical')}
                      onChange={(e) => {
                        const metrics = newEvent.metrics || [];
                        setNewEvent(prev => ({
                          ...prev,
                          metrics: e.target.checked 
                            ? [...metrics, 'vertical']
                            : metrics.filter(m => m !== 'vertical')
                        }));
                      }}
                    />
                    <Label htmlFor="vertical">Vertical Descent</Label>
                  </div>
                </div>
              </div>

              {/* Enrollment */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Enrollment Type</Label>
                    <Select
                      value={newEvent.enrollment}
                      onValueChange={(value) => setNewEvent(prev => ({ ...prev, enrollment: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open Enrollment</SelectItem>
                        <SelectItem value="code">Code Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newEvent.enrollment === 'code' && (
                    <div className="space-y-2">
                      <Label htmlFor="enrollment-code">Enrollment Code</Label>
                      <Input
                        id="enrollment-code"
                        value={newEvent.enrollmentCode || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, enrollmentCode: e.target.value }))}
                        placeholder="EVENTCODE2024"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="consent-default">Visible to Resort by Default</Label>
                  <Switch
                    id="consent-default"
                    checked={newEvent.consentDefault}
                    onCheckedChange={(checked) => setNewEvent(prev => ({ ...prev, consentDefault: checked }))}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  When enabled, participants will be visible to resort administrators unless they opt out.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} disabled={!newEvent.name}>
                Create Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Event Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          <Badge variant="outline" className={getVisibilityColor(event.visibility)}>
                            {getVisibilityLabel(event.visibility)}
                          </Badge>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <div>
                            <div>{formatDateTime(event.startDate)}</div>
                            <div>to {formatDateTime(event.endDate)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.participants} participant{event.participants !== 1 ? 's' : ''}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>Tracking: {event.metrics.join(', ')}</span>
                        </div>
                      </div>

                      {/* Rules Preview */}
                      {event.rules && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium">Rules: </span>
                          {event.rules}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-6">
                      {event.status === 'live' && (
                        <Button
                          onClick={() => onScreenChange('event-live')}
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Live View</span>
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Event
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleToggleEventStatus(event.id)}>
                            {event.status === 'live' ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Freeze Event
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start Event
                              </>
                            )}
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleDuplicateEvent(event)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem className="text-red-600">
                            <Archive className="w-4 h-4 mr-2" />
                            Archive Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No events match your current filters.' 
                  : 'Get started by creating your first event.'}
              </p>
              {(!searchQuery && statusFilter === 'all') && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Event
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event settings and configuration
            </DialogDescription>
          </DialogHeader>
          
          {editingEvent && (
            <div className="space-y-6">
              {/* Similar form fields as create, but populated with editingEvent data */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Event Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingEvent.name}
                    onChange={(e) => setEditingEvent(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}