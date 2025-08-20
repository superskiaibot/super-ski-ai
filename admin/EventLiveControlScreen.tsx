import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play,
  Pause,
  Users,
  Trophy,
  Clock,
  Filter,
  Megaphone,
  Eye,
  EyeOff,
  Mountain,
  TrendingUp,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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

interface EventLiveControlScreenProps {
  currentUser: UserType;
  userRole: 'platform_admin' | 'resort_admin' | 'event_manager';
  selectedResort: any;
  dateRange: string;
  onScreenChange: (screen: string) => void;
}

interface Participant {
  id: string;
  name: string;
  isAnonymous: boolean;
  team?: string;
  distance: number;
  vertical: number;
  lastPing: string;
  rank: number;
}

interface Announcement {
  id: string;
  message: string;
  timestamp: string;
}

export function EventLiveControlScreen({ 
  currentUser, 
  userRole, 
  selectedResort, 
  dateRange, 
  onScreenChange 
}: EventLiveControlScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [eventStatus, setEventStatus] = useState<'live' | 'frozen'>('live');
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<'distance' | 'vertical'>('distance');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [announcementText, setAnnouncementText] = useState('');
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  // Mock event data
  const mockEvent = {
    id: '1',
    name: 'Fresh Powder Challenge',
    startTime: '2024-01-20T08:00:00Z',
    endTime: '2024-01-20T16:00:00Z',
    totalParticipants: 156,
    activeParticipants: 142
  };

  // Mock participants data
  const [participants] = useState<Participant[]>([
    { id: '1', name: 'Sarah Mitchell', isAnonymous: false, team: 'Powder Hounds', distance: 24.7, vertical: 6840, lastPing: '2024-01-20T14:25:00Z', rank: 1 },
    { id: '2', name: 'Anonymous #1234', isAnonymous: true, team: undefined, distance: 23.9, vertical: 6720, lastPing: '2024-01-20T14:24:00Z', rank: 2 },
    { id: '3', name: 'Mike Johnson', isAnonymous: false, team: 'Alpine Addicts', distance: 23.2, vertical: 6580, lastPing: '2024-01-20T14:26:00Z', rank: 3 },
    { id: '4', name: 'Anonymous #5678', isAnonymous: true, team: undefined, distance: 22.8, vertical: 6450, lastPing: '2024-01-20T14:23:00Z', rank: 4 },
    { id: '5', name: 'Alex Chen', isAnonymous: false, team: 'Mountain Mavericks', distance: 22.1, vertical: 6320, lastPing: '2024-01-20T14:25:00Z', rank: 5 },
    { id: '6', name: 'Emma Wilson', isAnonymous: false, team: 'Snow Seekers', distance: 21.8, vertical: 6180, lastPing: '2024-01-20T14:22:00Z', rank: 6 },
    { id: '7', name: 'Anonymous #9012', isAnonymous: true, team: undefined, distance: 21.3, vertical: 6050, lastPing: '2024-01-20T14:27:00Z', rank: 7 },
    { id: '8', name: 'David Kim', isAnonymous: false, team: 'Ridge Runners', distance: 20.9, vertical: 5920, lastPing: '2024-01-20T14:21:00Z', rank: 8 },
    { id: '9', name: 'Lisa Zhang', isAnonymous: false, team: 'Powder Hounds', distance: 20.5, vertical: 5840, lastPing: '2024-01-20T14:26:00Z', rank: 9 },
    { id: '10', name: 'Anonymous #3456', isAnonymous: true, team: undefined, distance: 20.1, vertical: 5720, lastPing: '2024-01-20T14:24:00Z', rank: 10 }
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', message: 'Weather conditions are excellent! Fresh powder on upper mountain.', timestamp: '2024-01-20T10:30:00Z' },
    { id: '2', message: 'Lunch break at Coronet Express Base - hot drinks available!', timestamp: '2024-01-20T12:00:00Z' }
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getTeams = () => {
    const teams = [...new Set(participants.filter(p => p.team).map(p => p.team))];
    return teams.sort();
  };

  const filteredParticipants = participants.filter(participant => {
    if (teamFilter !== 'all' && participant.team !== teamFilter) return false;
    return true;
  });

  const sortedByMetric = [...filteredParticipants].sort((a, b) => {
    if (selectedLeaderboard === 'distance') {
      return b.distance - a.distance;
    } else {
      return b.vertical - a.vertical;
    }
  });

  const toggleEventStatus = () => {
    setEventStatus(prev => prev === 'live' ? 'frozen' : 'live');
  };

  const sendAnnouncement = () => {
    if (announcementText.trim()) {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        message: announcementText.trim(),
        timestamp: new Date().toISOString()
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setAnnouncementText('');
      setIsAnnouncementDialogOpen(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ${diffInMinutes % 60}m ago`;
  };

  const formatEventTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-NZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 2: return 'bg-gray-100 text-gray-700 border-gray-300';
      case 3: return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Event Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">{mockEvent.name}</h1>
            <Badge className={eventStatus === 'live' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
              {eventStatus === 'live' ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  Live (Unofficial)
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 mr-2" />
                  Frozen (Official)
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Local Time: {currentTime.toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mountain className="w-4 h-4" />
              <span>Event: {formatEventTime(mockEvent.startTime)} - {formatEventTime(mockEvent.endTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{mockEvent.activeParticipants} / {mockEvent.totalParticipants} active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Megaphone className="w-4 h-4" />
                <span>Announce</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Broadcast Announcement</DialogTitle>
                <DialogDescription>
                  Send a message to all event participants
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Textarea
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Type your announcement message..."
                  rows={3}
                />
                
                {announcementText && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-medium text-blue-900 mb-1">Preview:</div>
                    <div className="text-sm text-blue-700">{announcementText}</div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAnnouncementDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={sendAnnouncement} disabled={!announcementText.trim()}>
                  <Megaphone className="w-4 h-4 mr-2" />
                  Send to {mockEvent.activeParticipants} participants
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            onClick={toggleEventStatus}
            variant={eventStatus === 'live' ? 'destructive' : 'default'}
            className="flex items-center space-x-2"
          >
            {eventStatus === 'live' ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Freeze Event</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Unfreeze Event</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Event Status Alert */}
      {eventStatus === 'frozen' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Event Frozen</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Leaderboard updates are paused. Positions are now official until unfrozen.
          </p>
        </motion.div>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
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

              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gender</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="under18">Under 18</SelectItem>
                  <SelectItem value="18-25">18-25</SelectItem>
                  <SelectItem value="26-35">26-35</SelectItem>
                  <SelectItem value="36-50">36-50</SelectItem>
                  <SelectItem value="over50">Over 50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {sortedByMetric.length} participant{sortedByMetric.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span>Live Leaderboard</span>
          </CardTitle>
          <CardDescription>
            Real-time participant rankings and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLeaderboard} onValueChange={(value) => setSelectedLeaderboard(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="distance" className="flex items-center space-x-2">
                <Mountain className="w-4 h-4" />
                <span>Distance Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="vertical" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Vertical Leaderboard</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="distance" className="space-y-4 mt-6">
              <div className="space-y-2">
                {sortedByMetric.slice(0, 20).map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <Badge className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankBadgeColor(index + 1)}`}>
                        {index + 1}
                      </Badge>
                      
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center space-x-2">
                            <span>{participant.name}</span>
                            {participant.isAnonymous && (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          {participant.team && (
                            <div className="text-sm text-gray-500">{participant.team}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{participant.distance} km</div>
                        <div className="text-sm text-gray-500">Distance</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-gray-700">{participant.vertical} m</div>
                        <div className="text-sm text-gray-500">Vertical</div>
                      </div>
                      
                      <div className="text-right min-w-[80px]">
                        <div className="text-sm text-gray-600">
                          {formatTimeAgo(participant.lastPing)}
                        </div>
                        <div className="text-xs text-gray-500">Last ping</div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={participant.isAnonymous}
                        className="flex items-center space-x-1"
                      >
                        {participant.isAnonymous ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        <span className="hidden sm:inline">
                          {participant.isAnonymous ? 'Hidden' : 'Profile'}
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vertical" className="space-y-4 mt-6">
              <div className="space-y-2">
                {[...sortedByMetric].sort((a, b) => b.vertical - a.vertical).slice(0, 20).map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <Badge className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankBadgeColor(index + 1)}`}>
                        {index + 1}
                      </Badge>
                      
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center space-x-2">
                            <span>{participant.name}</span>
                            {participant.isAnonymous && (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          {participant.team && (
                            <div className="text-sm text-gray-500">{participant.team}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{participant.vertical} m</div>
                        <div className="text-sm text-gray-500">Vertical</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium text-gray-700">{participant.distance} km</div>
                        <div className="text-sm text-gray-500">Distance</div>
                      </div>
                      
                      <div className="text-right min-w-[80px]">
                        <div className="text-sm text-gray-600">
                          {formatTimeAgo(participant.lastPing)}
                        </div>
                        <div className="text-xs text-gray-500">Last ping</div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={participant.isAnonymous}
                        className="flex items-center space-x-1"
                      >
                        {participant.isAnonymous ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        <span className="hidden sm:inline">
                          {participant.isAnonymous ? 'Hidden' : 'Profile'}
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Announcements */}
      {announcements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              <span>Recent Announcements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.slice(0, 5).map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <Megaphone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-blue-900">{announcement.message}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      {formatTimeAgo(announcement.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}