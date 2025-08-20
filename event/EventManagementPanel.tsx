import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Users, User, Building2, Trophy, Settings, Share2, 
  Copy, Check, Edit3, Trash2, Crown, UserMinus, MapPin,
  Target, TrendingUp, Award, Filter, ChevronDown, Play,
  Lock, CreditCard, AlertCircle, CheckCircle, Clock,
  Heart, DollarSign, Globe, Zap, BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface EventManagementPanelProps {
  eventData: EventManagementData;
  onJoinEvent?: () => void;
  onInviteTeamMember?: () => void;
  onViewLeaderboard?: () => void;
  onUpdateTeam?: (teamInfo: any) => void;
}

interface EventManagementData {
  isJoined: boolean;
  participationType?: 'individual' | 'team' | 'business';
  skiField?: string;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  receiptId?: string;
  progress: {
    current: number;
    goal: number;
    unit: string;
    dailyData: Array<{
      date: string;
      vertical: number;
    }>;
  };
  teamInfo?: {
    name: string;
    joinCode: string;
    members: Array<{
      id: string;
      name: string;
      avatar?: string;
      vertical: number;
      isOnline: boolean;
    }>;
  };
  eventDetails: {
    title: string;
    dateRange: string;
    participantCount: number;
    raised?: number;
    goal?: number;
  };
}

export function EventManagementPanel({ 
  eventData, 
  onJoinEvent, 
  onInviteTeamMember, 
  onViewLeaderboard,
  onUpdateTeam 
}: EventManagementPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedJoinCode, setCopiedJoinCode] = useState(false);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState(eventData.teamInfo?.name || '');
  const [selectedSkiField, setSelectedSkiField] = useState('all');

  // Mock leaderboard data
  const leaderboardData = {
    individual: [
      { rank: 1, name: 'Sarah Chen', vertical: 15420, skiField: 'Coronet Peak' },
      { rank: 2, name: 'Mike Johnson', vertical: 14890, skiField: 'The Remarkables' },
      { rank: 3, name: 'Emma Wilson', vertical: 13560, skiField: 'Cardrona' },
      { rank: 4, name: 'You', vertical: eventData.progress.current, skiField: eventData.skiField || 'N/A' },
      { rank: 5, name: 'Tom Anderson', vertical: 12340, skiField: 'Treble Cone' }
    ],
    team: [
      { rank: 1, name: 'Snow Warriors', vertical: 45680, members: 5, skiField: 'Various' },
      { rank: 2, name: 'Alpine Crushers', vertical: 43210, members: 4, skiField: 'Various' },
      { rank: 3, name: eventData.teamInfo?.name || 'Your Team', vertical: 38950, members: 3, skiField: 'Various' },
      { rank: 4, name: 'Powder Legends', vertical: 35600, members: 6, skiField: 'Various' }
    ],
    business: [
      { rank: 1, name: 'Tech Slopes Inc', vertical: 125400, members: 15, skiField: 'Various' },
      { rank: 2, name: 'Alpine Ventures', vertical: 118900, members: 12, skiField: 'Various' },
      { rank: 3, name: 'Mountain Dynamics', vertical: 98750, members: 10, skiField: 'Various' }
    ]
  };

  const handleCopyJoinCode = () => {
    if (eventData.teamInfo?.joinCode) {
      navigator.clipboard.writeText(eventData.teamInfo.joinCode);
      setCopiedJoinCode(true);
      setTimeout(() => setCopiedJoinCode(false), 2000);
    }
  };

  const handleSaveTeamName = () => {
    if (newTeamName.trim() && onUpdateTeam) {
      onUpdateTeam({ name: newTeamName.trim() });
      setEditingTeamName(false);
    }
  };

  const progressPercentage = (eventData.progress.current / eventData.progress.goal) * 100;
  const isEventActive = true; // Mock active state

  return (
    <div className="space-y-8">
      {/* Event Hero Banner */}
      <Card className="overflow-hidden bg-gradient-to-r from-ultra-ice-blue to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold">{eventData.eventDetails.title}</h1>
                <Badge 
                  variant={isEventActive ? "secondary" : "outline"}
                  className={`${isEventActive ? 'bg-mountain-green' : 'bg-gray-500'} text-white`}
                >
                  {isEventActive ? 'LIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{eventData.eventDetails.dateRange}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{eventData.eventDetails.participantCount.toLocaleString()} participants</span>
                </div>
                {eventData.eventDetails.raised && (
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>${eventData.eventDetails.raised.toLocaleString()} raised</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                variant="secondary"
                onClick={onViewLeaderboard}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </div>
          </div>
          
          {eventData.eventDetails.goal && eventData.eventDetails.raised && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Fundraising Progress</span>
                <span>{((eventData.eventDetails.raised / eventData.eventDetails.goal) * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={(eventData.eventDetails.raised / eventData.eventDetails.goal) * 100} 
                className="h-3 bg-white/20"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participation">Join</TabsTrigger>
          <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {eventData.isJoined ? (
            <div className="space-y-6">
              {/* My Participation Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>My Participation</span>
                    <Badge variant={eventData.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                      {eventData.paymentStatus === 'paid' ? 'Active' : 'Payment Required'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {eventData.participationType === 'team' && <Users className="h-6 w-6 text-ultra-ice-blue" />}
                        {eventData.participationType === 'individual' && <User className="h-6 w-6 text-ultra-ice-blue" />}
                        {eventData.participationType === 'business' && <Building2 className="h-6 w-6 text-ultra-ice-blue" />}
                      </div>
                      <p className="font-semibold capitalize">{eventData.participationType}</p>
                      <p className="text-sm text-gray-600">Participation Type</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <MapPin className="h-6 w-6 text-ultra-ice-blue" />
                      </div>
                      <p className="font-semibold">{eventData.skiField || 'Not Set'}</p>
                      <p className="text-sm text-gray-600">Ski Field</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {eventData.paymentStatus === 'paid' ? (
                          <CheckCircle className="h-6 w-6 text-mountain-green" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-avalanche-orange" />
                        )}
                      </div>
                      <p className="font-semibold capitalize">{eventData.paymentStatus}</p>
                      <p className="text-sm text-gray-600">Status</p>
                    </div>
                  </div>

                  {eventData.paymentStatus !== 'paid' && (
                    <Alert className="border-avalanche-orange bg-orange-50">
                      <CreditCard className="h-4 w-4 text-avalanche-orange" />
                      <AlertDescription className="text-avalanche-orange">
                        Complete your payment to start tracking and participating in the event.
                        <Button size="sm" className="ml-2 bg-avalanche-orange hover:bg-avalanche-orange/90">
                          Pay Now
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>My Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Zap className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-blue-600">{eventData.progress.current.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Current {eventData.progress.unit}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Target className="h-6 w-6 text-green-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-green-600">{eventData.progress.goal.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Goal {eventData.progress.unit}</p>
                    </div>
                    
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-purple-600">{progressPercentage.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Complete</p>
                    </div>
                    
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Award className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                      <p className="text-2xl font-bold text-orange-600">#47</p>
                      <p className="text-sm text-gray-600">Global Rank</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Personal Goal Progress</span>
                      <span className="font-semibold">
                        {eventData.progress.current.toLocaleString()} / {eventData.progress.goal.toLocaleString()} {eventData.progress.unit}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Team Management */}
              {eventData.participationType === 'team' && eventData.teamInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Team Management</span>
                      </div>
                      <Button size="sm" onClick={onInviteTeamMember} className="rounded-lg">
                        <Users className="h-4 w-4 mr-1" />
                        Invite Member
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Team Name */}
                    <div className="flex items-center space-x-2">
                      {editingTeamName ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="rounded-lg"
                            placeholder="Team name"
                          />
                          <Button size="sm" onClick={handleSaveTeamName} className="rounded-lg">
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between flex-1">
                          <h3 className="text-xl font-semibold">{eventData.teamInfo.name}</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTeamName(true)}
                            className="rounded-lg"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Join Code */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Team Join Code</p>
                          <p className="text-lg font-bold text-ultra-ice-blue">{eventData.teamInfo.joinCode}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyJoinCode}
                          className="rounded-lg"
                        >
                          {copiedJoinCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                      <h4 className="font-semibold">Team Members ({eventData.teamInfo.members.length})</h4>
                      <div className="space-y-2">
                        {eventData.teamInfo.members.map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{member.name}</span>
                                  {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                                  <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                                </div>
                                <p className="text-sm text-gray-600">
                                  {member.vertical.toLocaleString()}{eventData.progress.unit}
                                </p>
                              </div>
                            </div>
                            {index > 0 && (
                              <Button size="sm" variant="outline" className="rounded-lg text-red-500 hover:text-red-600">
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Not Joined - Call to Action */
            <Card className="text-center p-8">
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-midnight mb-2">Join the Movement</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Be part of the global skiing community raising funds for cancer research. 
                    Every meter you ski makes a difference.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <User className="h-8 w-8 text-ultra-ice-blue mx-auto mb-2" />
                    <h4 className="font-semibold">Individual</h4>
                    <p className="text-sm text-gray-600 mt-1">Ski solo for the cause</p>
                    <Badge variant="secondary" className="mt-2">$25</Badge>
                  </Card>
                  
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <Users className="h-8 w-8 text-ultra-ice-blue mx-auto mb-2" />
                    <h4 className="font-semibold">Team</h4>
                    <p className="text-sm text-gray-600 mt-1">Create or join a team</p>
                    <Badge variant="secondary" className="mt-2">$100</Badge>
                  </Card>
                  
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <Building2 className="h-8 w-8 text-ultra-ice-blue mx-auto mb-2" />
                    <h4 className="font-semibold">Business</h4>
                    <p className="text-sm text-gray-600 mt-1">Corporate sponsorship</p>
                    <Badge variant="secondary" className="mt-2">$250</Badge>
                  </Card>
                </div>
                
                <Button 
                  size="lg" 
                  onClick={onJoinEvent}
                  className="rounded-xl px-8 py-3 bg-ultra-ice-blue hover:bg-ultra-ice-blue/90"
                >
                  Join Event Now
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Participation Tab */}
        <TabsContent value="participation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-ultra-ice-blue" />
                  <span>Individual</span>
                </CardTitle>
                <CardDescription>Perfect for solo skiers who want to make a personal impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-lg">$25 Registration</Badge>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Personal tracking dashboard</li>
                    <li>• Individual leaderboard ranking</li>
                    <li>• Achievement badges</li>
                    <li>• Digital certificate</li>
                  </ul>
                  <Button className="w-full rounded-xl" onClick={onJoinEvent}>
                    Join as Individual
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-ultra-ice-blue">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-ultra-ice-blue" />
                  <span>Team</span>
                  <Badge variant="default">Popular</Badge>
                </CardTitle>
                <CardDescription>Create or join a team for collaborative fundraising</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-lg">$100 Registration</Badge>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Team management tools</li>
                    <li>• Combined team metrics</li>
                    <li>• Team leaderboard</li>
                    <li>• Group achievements</li>
                  </ul>
                  <Button className="w-full rounded-xl" onClick={onJoinEvent}>
                    Create/Join Team
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-6 w-6 text-ultra-ice-blue" />
                  <span>Business</span>
                </CardTitle>
                <CardDescription>Corporate sponsorship with enhanced visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary" className="text-lg">$250 Registration</Badge>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Company branding</li>
                    <li>• Multiple team management</li>
                    <li>• Business leaderboard</li>
                    <li>• Custom recognition</li>
                  </ul>
                  <Button className="w-full rounded-xl" onClick={onJoinEvent}>
                    Register Business
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leaderboards Tab */}
        <TabsContent value="leaderboards" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Live Leaderboards</h2>
            <div className="flex items-center space-x-2">
              <Select value={selectedSkiField} onValueChange={setSelectedSkiField}>
                <SelectTrigger className="w-48 rounded-lg">
                  <SelectValue placeholder="Filter by ski field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ski Fields</SelectItem>
                  <SelectItem value="coronet-peak">Coronet Peak</SelectItem>
                  <SelectItem value="remarkables">The Remarkables</SelectItem>
                  <SelectItem value="cardrona">Cardrona</SelectItem>
                  <SelectItem value="treble-cone">Treble Cone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="individual">
            <TabsList>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="space-y-3">
              {leaderboardData.individual.map((entry, index) => (
                <Card key={index} className={`${entry.name === 'You' ? 'ring-2 ring-ultra-ice-blue bg-glacier-blue/10' : ''}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        entry.rank === 1 ? 'bg-yellow-500' : 
                        entry.rank === 2 ? 'bg-gray-400' : 
                        entry.rank === 3 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm text-gray-600">{entry.skiField}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.vertical.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">meters</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="team" className="space-y-3">
              {leaderboardData.team.map((entry, index) => (
                <Card key={index} className={`${entry.name === eventData.teamInfo?.name ? 'ring-2 ring-ultra-ice-blue bg-glacier-blue/10' : ''}`}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        entry.rank === 1 ? 'bg-yellow-500' : 
                        entry.rank === 2 ? 'bg-gray-400' : 
                        entry.rank === 3 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm text-gray-600">{entry.members} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.vertical.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">meters combined</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="business" className="space-y-3">
              {leaderboardData.business.map((entry, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        entry.rank === 1 ? 'bg-yellow-500' : 
                        entry.rank === 2 ? 'bg-gray-400' : 
                        entry.rank === 3 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm text-gray-600">{entry.members} employees</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.vertical.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">meters combined</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Rules & Guidelines</CardTitle>
              <CardDescription>
                Important information for all participants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Participation Rules</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Event runs from {eventData.eventDetails.dateRange}</p>
                  <p>• All tracked skiing must occur during official event hours</p>
                  <p>• GPS tracking must be enabled throughout your skiing sessions</p>
                  <p>• Minimum vertical requirement: 100m per run to count</p>
                  <p>• Maximum daily vertical cap: 5,000m per participant</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Safety Requirements</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Participants must follow all ski field safety rules</p>
                  <p>• Helmets are strongly recommended for all participants</p>
                  <p>• Check weather conditions before skiing</p>
                  <p>• Report any accidents or incidents immediately</p>
                  <p>• Emergency contact information must be provided</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Fair Play</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• GPS spoofing or manipulation will result in disqualification</p>
                  <p>• All skiing must be legitimate downhill runs</p>
                  <p>• Chairlift or gondola ascents do not count toward totals</p>
                  <p>• Suspicious activity will be investigated</p>
                  <p>• SnowLine reserves the right to verify GPS data</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Prizes & Recognition</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Top 3 individuals, teams, and businesses will be recognized</p>
                  <p>• Digital certificates for all participants</p>
                  <p>• Special recognition for fundraising milestones</p>
                  <p>• Results will be announced within 48 hours of event end</p>
                  <p>• Prizes cannot be transferred or exchanged for cash</p>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  By participating in this event, you agree to follow all rules and guidelines. 
                  Violation of any rules may result in disqualification from the event.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}