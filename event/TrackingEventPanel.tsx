import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Users, Building2, User, Trophy, Target, BarChart3,
  MapPin, Share2, Copy, UserPlus, Settings, ExternalLink,
  Clock, TrendingUp, Award, ChevronDown, ChevronUp, Crown,
  Zap, Eye, EyeOff, Globe, Lock, AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';

export interface TrackingEventPanelProps {
  isVisible: boolean;
  eventData: {
    eventTitle: string;
    dateRange: string;
    endDate: Date;
    participationType: 'individual' | 'team' | 'business';
    teamInfo?: {
      name: string;
      memberCount: number;
      joinCode?: string;
      members?: Array<{
        id: string;
        name: string;
        avatar?: string;
        vertical: number;
        isOnline: boolean;
      }>;
    };
    todayStats: {
      vertical: number;
      unit: string;
    };
    totalStats: {
      vertical: number;
      unit: string;
    };
    goal?: number;
    userRole?: 'admin' | 'member';
  };
  isPaid: boolean;
  onInvite?: () => void;
  onLeaderboard?: () => void;
  onOpenEventHub?: () => void;
  onCompletePayment?: () => void;
  onManageTeam?: () => void;
}

export function TrackingEventPanel({
  isVisible,
  eventData,
  isPaid,
  onInvite,
  onLeaderboard,
  onOpenEventHub,
  onCompletePayment,
  onManageTeam
}: TrackingEventPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareLocationEnabled, setShareLocationEnabled] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  if (!isVisible) return null;

  const getParticipationIcon = () => {
    switch (eventData.participationType) {
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'business':
        return <Building2 className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getParticipationLabel = () => {
    if (eventData.participationType === 'individual') return 'Individual';
    if (eventData.teamInfo) {
      return `${eventData.teamInfo.name} ${eventData.userRole === 'admin' ? '(Admin)' : '(Member)'}`;
    }
    return eventData.participationType.charAt(0).toUpperCase() + eventData.participationType.slice(1);
  };

  const handleInviteSubmit = () => {
    if (inviteEmail && onInvite) {
      console.log('Inviting:', inviteEmail);
      onInvite();
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const copyJoinCode = () => {
    if (eventData.teamInfo?.joinCode) {
      navigator.clipboard.writeText(eventData.teamInfo.joinCode);
    }
  };

  const progressPercentage = eventData.goal 
    ? Math.min((eventData.totalStats.vertical / eventData.goal) * 100, 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-20 bg-white border-b border-gray-200"
    >
      <Card className="snowline-card shadow-md">
        <CardContent className="p-4">
          {/* Unpaid Banner */}
          {!isPaid && (
            <Alert className="mb-4 bg-avalanche-orange/10 border-avalanche-orange">
              <AlertCircle className="h-4 w-4 text-avalanche-orange" />
              <AlertDescription className="text-avalanche-orange">
                Complete payment to unlock all event features
                <Button 
                  size="sm" 
                  className="ml-2 bg-avalanche-orange hover:bg-avalanche-orange/90"
                  onClick={onCompletePayment}
                >
                  Complete Payment
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Event Info */}
          <div className="space-y-4">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ultra-ice-blue to-blue-600 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-midnight">{eventData.eventTitle}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {eventData.dateRange}
                    </Badge>
                    <Badge className="bg-ultra-ice-blue text-white text-xs">
                      {getParticipationIcon()}
                      <span className="ml-1">{getParticipationLabel()}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-full"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ultra-ice-blue">
                  {eventData.todayStats.vertical.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Today ({eventData.todayStats.unit})</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-mountain-green">
                  {eventData.totalStats.vertical.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Total ({eventData.totalStats.unit})</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-avalanche-orange">
                  {progressPercentage.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Goal Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            {eventData.goal && (
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{eventData.totalStats.vertical.toLocaleString()}{eventData.totalStats.unit}</span>
                  <span>{eventData.goal.toLocaleString()}{eventData.totalStats.unit} goal</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onLeaderboard}
                  className="rounded-xl"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  Leaderboard
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenEventHub}
                  className="rounded-xl"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Event Hub
                </Button>
              </div>

              {/* Team Actions */}
              {isPaid && (eventData.participationType === 'team' || eventData.participationType === 'business') && (
                <div className="flex space-x-2">
                  {eventData.userRole === 'admin' && (
                    <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="rounded-xl bg-mountain-green hover:bg-mountain-green/90">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Invite
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Invite Team Member</DialogTitle>
                          <DialogDescription>
                            Add a new member to {eventData.teamInfo?.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="inviteEmail">Email Address</Label>
                            <Input
                              id="inviteEmail"
                              type="email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              placeholder="team.member@email.com"
                              className="rounded-xl"
                            />
                          </div>
                          
                          {eventData.teamInfo?.joinCode && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <Label className="text-sm">Or share your team code:</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <code className="bg-white px-2 py-1 rounded text-ultra-ice-blue font-bold text-sm">
                                  {eventData.teamInfo.joinCode}
                                </code>
                                <Button size="sm" variant="ghost" onClick={copyJoinCode}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            onClick={handleInviteSubmit} 
                            className="w-full rounded-xl"
                            disabled={!inviteEmail}
                          >
                            Send Invitation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {eventData.userRole === 'admin' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onManageTeam}
                      className="rounded-xl"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Manage
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  {/* Team Members (if team/business) */}
                  {isPaid && (eventData.participationType === 'team' || eventData.participationType === 'business') && eventData.teamInfo?.members && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-gray-700">
                          Team Members ({eventData.teamInfo.members.length})
                        </h4>
                        {eventData.teamInfo.members.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {eventData.teamInfo.members.filter(m => m.isOnline).length} online
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {eventData.teamInfo.members.slice(0, 5).map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{member.name}</span>
                              {member.isOnline && (
                                <div className="w-2 h-2 bg-mountain-green rounded-full" />
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{member.vertical.toLocaleString()}m</div>
                            </div>
                          </div>
                        ))}
                        
                        {eventData.teamInfo.members.length > 5 && (
                          <div className="text-center py-2">
                            <Button variant="ghost" size="sm" className="text-xs">
                              +{eventData.teamInfo.members.length - 5} more members
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location Sharing Toggle */}
                  {isPaid && (eventData.participationType === 'team' || eventData.participationType === 'business') && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <div>
                          <Label className="text-sm font-medium">Share Live Location</Label>
                          <p className="text-xs text-gray-600">Visible to team members only</p>
                        </div>
                      </div>
                      <Switch
                        checked={shareLocationEnabled}
                        onCheckedChange={setShareLocationEnabled}
                      />
                    </div>
                  )}

                  {/* Suggestion for Individual Users */}
                  {isPaid && eventData.participationType === 'individual' && (
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Join a Team</span>
                      </div>
                      <p className="text-xs text-blue-700 mb-2">
                        Team up with friends for more fun and better fundraising results!
                      </p>
                      <Button size="sm" variant="outline" className="text-xs">
                        Create or Join Team
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}