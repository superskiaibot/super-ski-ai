import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Users, TrendingUp, DollarSign, Calendar, Settings,
  Award, MapPin, Clock, Target, BarChart3, Download,
  Mail, Bell, Edit, Trash2, Eye, Plus, Search, Filter,
  Play, Pause, Square, RefreshCw, AlertCircle, CheckCircle,
  UserCheck, UserX, Crown, Building2, User, Share2,
  MessageSquare, FileText, Send, Copy, ExternalLink, Trophy
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { User as UserType } from '../../src/types/index';

interface SkiForACureAdminManagementProps {
  currentUser: UserType;
}

export function SkiForACureAdminManagement({ currentUser }: SkiForACureAdminManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [eventStatus, setEventStatus] = useState<'draft' | 'active' | 'paused' | 'ended'>('active');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [showBroadcastModal, setBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock event data - in real app would come from backend
  const eventData = {
    id: 'ski-for-a-cure-2024',
    title: 'Ski for a Cure Global 2024',
    dateRange: 'Sep 6–14, 2024',
    status: eventStatus,
    participants: {
      total: 2847,
      individual: 1456,
      team: 847,
      business: 544
    },
    fundraising: {
      raised: 285000,
      goal: 500000,
      donations: 1243
    },
    tracking: {
      totalVertical: 8547200, // meters
      totalRuns: 15847,
      averageSpeed: 42.5
    },
    teams: {
      total: 156,
      averageSize: 5.4,
      largestTeam: 24
    },
    leaderboards: {
      topIndividual: { name: 'Sarah Chen', vertical: 15420 },
      topTeam: { name: 'Snow Warriors', vertical: 45680, members: 5 },
      topBusiness: { name: 'Tech Slopes Inc', vertical: 125400, members: 15 }
    }
  };

  // Mock participants data
  const mockParticipants = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      type: 'individual',
      status: 'active',
      paid: true,
      vertical: 15420,
      runs: 47,
      joinedDate: '2024-09-01',
      lastActive: '2024-09-14T10:30:00Z',
      fundraising: 125
    },
    {
      id: '2',
      name: 'Snow Warriors',
      email: 'contact@snowwarriors.com',
      type: 'team',
      status: 'active',
      paid: true,
      vertical: 45680,
      runs: 134,
      members: 5,
      joinedDate: '2024-08-28',
      lastActive: '2024-09-14T09:15:00Z',
      fundraising: 890
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      type: 'individual',
      status: 'unpaid',
      paid: false,
      vertical: 0,
      runs: 0,
      joinedDate: '2024-09-13',
      lastActive: '2024-09-13T16:45:00Z',
      fundraising: 25
    }
  ];

  const handleEventStatusChange = (newStatus: typeof eventStatus) => {
    setEventStatus(newStatus);
    // In real app, would update backend
    console.log('Event status changed to:', newStatus);
  };

  const handleParticipantAction = (action: string, participantId: string) => {
    console.log(`${action} participant:`, participantId);
    // In real app, would call backend API
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    
    console.log('Sending broadcast:', broadcastMessage);
    setBroadcastMessage('');
    setBroadcastModal(false);
    // In real app, would send to all participants
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-mountain-green text-white';
      case 'paused': return 'bg-warning-yellow text-midnight';
      case 'ended': return 'bg-gray-500 text-white';
      case 'unpaid': return 'bg-avalanche-orange text-white';
      default: return 'bg-gray-300 text-midnight';
    }
  };

  const getParticipantTypeIcon = (type: string) => {
    switch (type) {
      case 'team': return <Users className="h-4 w-4" />;
      case 'business': return <Building2 className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const filteredParticipants = mockParticipants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-midnight flex items-center space-x-3">
              <Heart className="h-8 w-8 text-ultra-ice-blue" />
              <span>Ski for a Cure Management</span>
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Comprehensive event administration and participant management
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={`${getStatusColor(eventStatus)} px-4 py-2 text-sm font-semibold`}>
              {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
            </Badge>
            
            <Select value={eventStatus} onValueChange={handleEventStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-3xl font-bold text-midnight">{eventData.participants.total.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-ultra-ice-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Funds Raised</p>
                  <p className="text-3xl font-bold text-mountain-green">
                    ${eventData.fundraising.raised.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-mountain-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vertical</p>
                  <p className="text-3xl font-bold text-ultra-ice-blue">
                    {(eventData.tracking.totalVertical / 1000).toFixed(1)}km
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-ultra-ice-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="snowline-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                  <p className="text-3xl font-bold text-midnight">
                    {Math.round((eventData.fundraising.raised / eventData.fundraising.goal) * 100)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-ultra-ice-blue" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Progress */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Fundraising Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Progress</span>
                    <span className="font-semibold">
                      ${eventData.fundraising.raised.toLocaleString()} / ${eventData.fundraising.goal.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(eventData.fundraising.raised / eventData.fundraising.goal) * 100} 
                    className="h-3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-mountain-green">{eventData.fundraising.donations}</p>
                    <p className="text-sm text-gray-600">Total Donations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-ultra-ice-blue">
                      ${Math.round(eventData.fundraising.raised / eventData.fundraising.donations)}
                    </p>
                    <p className="text-sm text-gray-600">Avg Donation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participation Breakdown */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Participation Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-ultra-ice-blue" />
                      <span className="text-sm font-medium">Individual</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{eventData.participants.individual}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({Math.round((eventData.participants.individual / eventData.participants.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-mountain-green" />
                      <span className="text-sm font-medium">Team</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{eventData.participants.team}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({Math.round((eventData.participants.team / eventData.participants.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-avalanche-orange" />
                      <span className="text-sm font-medium">Business</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{eventData.participants.business}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({Math.round((eventData.participants.business / eventData.participants.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Summary */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Current Leaders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold">{eventData.leaderboards.topIndividual.name}</p>
                        <p className="text-sm text-gray-600">Top Individual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{eventData.leaderboards.topIndividual.vertical.toLocaleString()}m</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{eventData.leaderboards.topTeam.name}</p>
                        <p className="text-sm text-gray-600">Top Team ({eventData.leaderboards.topTeam.members} members)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{eventData.leaderboards.topTeam.vertical.toLocaleString()}m</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold">{eventData.leaderboards.topBusiness.name}</p>
                        <p className="text-sm text-gray-600">Top Business ({eventData.leaderboards.topBusiness.members} employees)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{eventData.leaderboards.topBusiness.vertical.toLocaleString()}m</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setBroadcastModal(true)}
                  className="w-full justify-start rounded-xl"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Send Broadcast Message
                </Button>
                
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Download className="h-4 w-4 mr-2" />
                  Export Participant Data
                </Button>
                
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Event Report
                </Button>
                
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 rounded-xl"
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>

          <Card className="snowline-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">Participant</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Progress</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Fundraising</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Joined</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((participant, index) => (
                      <tr key={participant.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900">{participant.name}</p>
                            <p className="text-sm text-gray-600">{participant.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getParticipantTypeIcon(participant.type)}
                            <span className="capitalize">{participant.type}</span>
                            {participant.type === 'team' && participant.members && (
                              <Badge variant="secondary" className="text-xs">
                                {participant.members} members
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(participant.paid ? 'active' : 'unpaid')}>
                            {participant.paid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{participant.vertical.toLocaleString()}m</p>
                            <p className="text-sm text-gray-600">{participant.runs} runs</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-mountain-green">${participant.fundraising}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{new Date(participant.joinedDate).toLocaleDateString()}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedParticipant(participant);
                                setShowParticipantModal(true);
                              }}
                              className="rounded-lg"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleParticipantAction('message', participant.id)}
                              className="rounded-lg"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would continue here... */}
        <TabsContent value="teams" className="space-y-6">
          <Card className="snowline-card">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600">Detailed team management functionality coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="snowline-card">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Comprehensive analytics dashboard coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card className="snowline-card">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Communications Center</h3>
              <p className="text-gray-600">Participant communication tools coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="snowline-card">
            <CardContent className="p-8 text-center">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Settings</h3>
              <p className="text-gray-600">Event configuration options coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Participant Detail Modal */}
      <Dialog open={showParticipantModal} onOpenChange={setShowParticipantModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Participant Details</DialogTitle>
            <DialogDescription>
              Detailed information for {selectedParticipant?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedParticipant && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-lg font-semibold">{selectedParticipant.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-lg">{selectedParticipant.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-lg capitalize">{selectedParticipant.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedParticipant.paid ? 'active' : 'unpaid')}>
                    {selectedParticipant.paid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-ultra-ice-blue">{selectedParticipant.vertical.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Vertical (meters)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-mountain-green">{selectedParticipant.runs}</p>
                  <p className="text-sm text-gray-600">Total Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-avalanche-orange">${selectedParticipant.fundraising}</p>
                  <p className="text-sm text-gray-600">Fundraising</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowParticipantModal(false)}>
              Close
            </Button>
            <Button onClick={() => handleParticipantAction('message', selectedParticipant?.id)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast Message Modal */}
      <Dialog open={showBroadcastModal} onOpenChange={setBroadcastModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Broadcast Message</DialogTitle>
            <DialogDescription>
              Send a message to all event participants
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBroadcastModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendBroadcast} disabled={!broadcastMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}