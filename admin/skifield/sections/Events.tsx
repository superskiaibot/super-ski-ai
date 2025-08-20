import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Users, 
  Target, 
  DollarSign, 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  TrendingUp,
  Eye,
  Megaphone,
  Settings,
  Download,
  RefreshCw,
  Trophy,
  Award,
  Gift,
  Activity,
  Zap,
  CheckCircle,
  Mountain,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Progress } from '../../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';

interface SkiForACureEventsProps {
  resortData: any;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  registrationDate: Date;
  fundraisingGoal: number;
  amountRaised: number;
  verticalMetersDescended: number; // PRIMARY METRIC: Vertical meters descended
  runsCompleted: number;
  teamName?: string;
  isTeamLeader?: boolean;
}

interface TeamStats {
  teamName: string;
  memberCount: number;
  totalRaised: number;
  totalVerticalMeters: number; // PRIMARY METRIC: Total vertical meters descended
  totalRuns: number;
  avgPerMember: number;
  avgVerticalPerMember: number; // Average vertical meters per team member
}

const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    registrationDate: new Date('2024-01-10'),
    fundraisingGoal: 500,
    amountRaised: 450,
    verticalMetersDescended: 8420, // Impressive vertical descent!
    runsCompleted: 12,
    teamName: 'Mountain Warriors',
    isTeamLeader: true
  },
  {
    id: 'p2',
    name: 'Mike Chen',
    email: 'mike.c@email.com',
    registrationDate: new Date('2024-01-12'),
    fundraisingGoal: 300,
    amountRaised: 380,
    verticalMetersDescended: 6150, // Solid vertical achievement
    runsCompleted: 8,
    teamName: 'Mountain Warriors'
  },
  {
    id: 'p3',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    registrationDate: new Date('2024-01-15'),
    fundraisingGoal: 750,
    amountRaised: 620,
    verticalMetersDescended: 12750, // Incredible vertical descent!
    runsCompleted: 15,
    teamName: 'Powder Crusaders',
    isTeamLeader: true
  },
  {
    id: 'p4',
    name: 'David Lee',
    email: 'david.l@email.com',
    registrationDate: new Date('2024-01-08'),
    fundraisingGoal: 400,
    amountRaised: 425,
    verticalMetersDescended: 7280, // Great effort!
    runsCompleted: 10
  },
  {
    id: 'p5',
    name: 'Lisa Thompson',
    email: 'lisa.t@email.com',
    registrationDate: new Date('2024-01-14'),
    fundraisingGoal: 600,
    amountRaised: 340,
    verticalMetersDescended: 4920, // Getting started strong
    runsCompleted: 6,
    teamName: 'Powder Crusaders'
  }
];

export function Events({ resortData }: SkiForACureEventsProps) {
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate event statistics
  const eventStats = {
    totalParticipants: participants.length,
    totalRaised: participants.reduce((sum, p) => sum + p.amountRaised, 0),
    totalGoal: participants.reduce((sum, p) => sum + p.fundraisingGoal, 0),
    totalRuns: participants.reduce((sum, p) => sum + p.runsCompleted, 0),
    totalVerticalMeters: participants.reduce((sum, p) => sum + p.verticalMetersDescended, 0), // PRIMARY METRIC
    avgPerParticipant: participants.reduce((sum, p) => sum + p.amountRaised, 0) / participants.length,
    avgVerticalPerParticipant: participants.reduce((sum, p) => sum + p.verticalMetersDescended, 0) / participants.length,
    completionRate: (participants.reduce((sum, p) => sum + p.amountRaised, 0) / participants.reduce((sum, p) => sum + p.fundraisingGoal, 0)) * 100
  };

  // Calculate team statistics
  const teamStats: TeamStats[] = participants
    .filter(p => p.teamName)
    .reduce((teams: TeamStats[], participant) => {
      const existingTeam = teams.find(t => t.teamName === participant.teamName);
      if (existingTeam) {
        existingTeam.memberCount++;
        existingTeam.totalRaised += participant.amountRaised;
        existingTeam.totalRuns += participant.runsCompleted;
        existingTeam.avgPerMember = existingTeam.totalRaised / existingTeam.memberCount;
        existingTeam.totalVerticalMeters += participant.verticalMetersDescended;
        existingTeam.avgVerticalPerMember = existingTeam.totalVerticalMeters / existingTeam.memberCount;
      } else {
        teams.push({
          teamName: participant.teamName!,
          memberCount: 1,
          totalRaised: participant.amountRaised,
          totalRuns: participant.runsCompleted,
          avgPerMember: participant.amountRaised,
          totalVerticalMeters: participant.verticalMetersDescended,
          avgVerticalPerMember: participant.verticalMetersDescended
        });
      }
      return teams;
    }, [])
    .sort((a, b) => b.totalRaised - a.totalRaised);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Ski For A Cure NZ</h1>
              <p className="text-sm text-muted-foreground">
                Charity ski event supporting cancer research • {resortData.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Event Info Banner */}
      <Card className="snowline-card border-pink-200 bg-gradient-to-r from-pink-50 to-red-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-sm text-muted-foreground">Event Date</p>
                <p className="font-semibold">February 15, 2024</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-sm text-muted-foreground">Event Time</p>
                <p className="font-semibold">9:00 AM - 3:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">Main Lodge</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{eventStats.totalParticipants}</p>
              <p className="text-xs text-muted-foreground">Participants</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{formatCurrency(eventStats.totalRaised)}</p>
              <p className="text-xs text-muted-foreground">Raised</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{formatCurrency(eventStats.totalGoal)}</p>
              <p className="text-xs text-muted-foreground">Goal</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{Math.round(eventStats.completionRate)}%</p>
              <p className="text-xs text-muted-foreground">Goal Reached</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{eventStats.totalRuns}</p>
              <p className="text-xs text-muted-foreground">Total Runs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="snowline-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-2">
                <Award className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold">{formatCurrency(eventStats.avgPerParticipant)}</p>
              <p className="text-xs text-muted-foreground">Avg/Person</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Progress Section */}
      <Card className="snowline-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <span>Fundraising Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                {formatCurrency(eventStats.totalRaised)} raised of {formatCurrency(eventStats.totalGoal)} goal
              </span>
              <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                {Math.round(eventStats.completionRate)}% Complete
              </Badge>
            </div>
            <Progress 
              value={eventStats.completionRate} 
              className="h-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-semibold">{formatCurrency(eventStats.totalRaised)}</p>
                <p className="text-green-600">Amount Raised</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-semibold">{formatCurrency(eventStats.totalGoal - eventStats.totalRaised)}</p>
                <p className="text-blue-600">Still Needed</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-800 font-semibold">{participants.length}</p>
                <p className="text-purple-600">Active Fundraisers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRIMARY METRIC: Vertical Meters Descended - Featured Section */}
      <Card className="snowline-card border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mountain className="w-5 h-5 text-blue-600" />
            <span>Vertical Meters Descended</span>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              PRIMARY METRIC
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Hero Stat */}
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {eventStats.totalVerticalMeters.toLocaleString()}m
              </div>
              <p className="text-lg text-muted-foreground">
                Total vertical meters descended by all participants
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Average: {Math.round(eventStats.avgVerticalPerParticipant).toLocaleString()}m per participant
              </p>
            </div>
            
            {/* Visual Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                <Mountain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-800 font-semibold text-lg">{Math.round(eventStats.totalVerticalMeters / 1829)}x</p>
                <p className="text-blue-600">CN Tower height equivalent</p>
                <p className="text-xs text-muted-foreground mt-1">1,829m per tower</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                <TrendingDown className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-indigo-800 font-semibold text-lg">{Math.round(eventStats.totalVerticalMeters / 8848)}x</p>
                <p className="text-indigo-600">Mount Everest equivalent</p>
                <p className="text-xs text-muted-foreground mt-1">8,848m per peak</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-purple-800 font-semibold text-lg">{Math.round(eventStats.totalVerticalMeters / eventStats.totalRuns)}m</p>
                <p className="text-purple-600">Average per run</p>
                <p className="text-xs text-muted-foreground mt-1">Vertical per completed run</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Event Status */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span>Live Event Status</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
                    LIVE
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Currently on mountain:</span>
                    <span className="font-semibold">32 participants</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active runs in progress:</span>
                    <span className="font-semibold">8 runs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completed runs today:</span>
                    <span className="font-semibold">24 runs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Real-time donations:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(145)} in last hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Milestones */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>Achievement Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">50% of fundraising goal reached!</p>
                      <p className="text-sm text-muted-foreground">Achieved 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">100+ participants registered</p>
                      <p className="text-sm text-muted-foreground">Achieved this morning</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Next: 75% goal milestone</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(1875)} needed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <div className="space-y-4">
            {participants.map((participant) => (
              <Card key={participant.id} className="snowline-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{participant.name}</h3>
                          {participant.isTeamLeader && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Star className="w-3 h-3 mr-1" />
                              Team Leader
                            </Badge>
                          )}
                          {participant.teamName && (
                            <Badge variant="outline" className="text-xs">
                              {participant.teamName}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm">
                          {/* PRIMARY METRIC: Vertical Descent */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Vertical:</span>
                              <span className="font-semibold text-blue-600">{participant.verticalMetersDescended.toLocaleString()}m</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Runs:</span>
                              <span className="font-medium">{participant.runsCompleted}</span>
                            </div>
                          </div>
                          
                          {/* Registration Info */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Registered:</span>
                              <span className="font-medium">{formatDate(participant.registrationDate)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Email:</span>
                              <span className="font-medium truncate">{participant.email}</span>
                            </div>
                          </div>
                          
                          {/* Fundraising Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Raised:</span>
                              <span className="font-medium text-green-600">{formatCurrency(participant.amountRaised)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Goal:</span>
                              <span className="font-medium">{formatCurrency(participant.fundraisingGoal)}</span>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <Progress 
                              value={(participant.amountRaised / participant.fundraisingGoal) * 100} 
                              className="h-2"
                            />
                            <div className="text-xs text-center text-muted-foreground">
                              {formatCurrency(participant.fundraisingGoal - participant.amountRaised)} remaining
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                      >
                        <Megaphone className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="space-y-4">
            {teamStats.map((team, index) => (
              <Card key={team.teamName} className="snowline-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-semibold">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{team.teamName}</h3>
                        <p className="text-sm text-muted-foreground">{team.memberCount} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{team.totalVerticalMeters.toLocaleString()}m</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(team.avgVerticalPerMember).toLocaleString()}m/member avg
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 font-semibold">{team.totalVerticalMeters.toLocaleString()}m</p>
                      <p className="text-blue-600">Total Vertical</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-purple-800 font-semibold">{team.memberCount}</p>
                      <p className="text-purple-600">Members</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 font-semibold">{formatCurrency(team.totalRaised)}</p>
                      <p className="text-green-600">Total Raised</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-orange-800 font-semibold">{team.totalRuns}</p>
                      <p className="text-orange-600">Total Runs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FEATURED: Vertical Descent Champions - PRIMARY METRIC */}
            <Card className="snowline-card border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mountain className="w-5 h-5 text-blue-600" />
                  <span>Vertical Descent Champions</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    PRIMARY
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants
                    .sort((a, b) => b.verticalMetersDescended - a.verticalMetersDescended)
                    .slice(0, 5)
                    .map((participant, index) => (
                      <div key={participant.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-blue-600' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-blue-400' : 'bg-blue-300'
                        }`}>
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">{participant.teamName || 'Individual'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{participant.verticalMetersDescended.toLocaleString()}m</p>
                          <p className="text-xs text-muted-foreground">
                            {participant.runsCompleted} runs
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Fundraisers */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>Top Fundraisers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants
                    .sort((a, b) => b.amountRaised - a.amountRaised)
                    .slice(0, 5)
                    .map((participant, index) => (
                      <div key={participant.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' : 'bg-gray-500'
                        }`}>
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">{participant.teamName || 'Individual'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(participant.amountRaised)}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((participant.amountRaised / participant.fundraisingGoal) * 100)}% of goal
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Active Skiers */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>Most Active Skiers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants
                    .sort((a, b) => b.runsCompleted - a.runsCompleted)
                    .slice(0, 5)
                    .map((participant, index) => (
                      <div key={participant.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-purple-600' :
                          index === 1 ? 'bg-purple-500' :
                          index === 2 ? 'bg-purple-400' : 'bg-purple-300'
                        }`}>
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-muted-foreground">{participant.teamName || 'Individual'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{participant.runsCompleted} runs</p>
                          <p className="text-xs text-muted-foreground">
                            {participant.verticalMetersDescended.toLocaleString()}m vertical
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}