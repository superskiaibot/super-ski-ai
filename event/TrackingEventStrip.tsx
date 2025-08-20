import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Trophy, Share, MapPin, Users, User, 
  Building2, ChevronUp, ChevronDown, Play, Pause, Lock,
  Zap, Target, TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';

interface TrackingEventStripProps {
  isVisible: boolean;
  eventData: EventStripData;
  onInvite?: () => void;
  onLeaderboard?: () => void;
  onPauseTracking?: () => void;
  onUnlockTracking?: () => void;
  isTrackingActive?: boolean;
  isPaid?: boolean;
}

interface EventStripData {
  eventTitle: string;
  dateRange: string;
  endDate: Date;
  participationType: 'individual' | 'team' | 'business';
  teamInfo?: {
    name: string;
    memberCount: number;
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
}

export function TrackingEventStrip({ 
  isVisible, 
  eventData, 
  onInvite, 
  onLeaderboard, 
  onPauseTracking,
  onUnlockTracking,
  isTrackingActive = false,
  isPaid = false
}: TrackingEventStripProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isLiveLocationShared, setIsLiveLocationShared] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = eventData.endDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m`);
        }
      } else {
        setTimeRemaining('Event ended');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [eventData.endDate]);

  const getParticipationIcon = () => {
    switch (eventData.participationType) {
      case 'team': return <Users className="h-4 w-4" />;
      case 'business': return <Building2 className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getParticipationLabel = () => {
    if (eventData.participationType === 'team' && eventData.teamInfo) {
      return `${eventData.teamInfo.name} (${eventData.teamInfo.memberCount})`;
    }
    return eventData.participationType.charAt(0).toUpperCase() + eventData.participationType.slice(1);
  };

  const progressPercentage = eventData.goal 
    ? (eventData.totalStats.vertical / eventData.goal) * 100 
    : 0;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
      {/* Compact View */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : '80px' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {/* Header - Always Visible */}
        <div className="flex items-center justify-between p-4 min-h-[80px]">
          {/* Event Info */}
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-ultra-ice-blue rounded-full animate-pulse" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-midnight text-sm">{eventData.eventTitle}</h3>
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {eventData.dateRange}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className="text-xs border-ultra-ice-blue text-ultra-ice-blue"
                >
                  {getParticipationIcon()}
                  <span className="ml-1">{getParticipationLabel()}</span>
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{timeRemaining}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {!isPaid && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={onUnlockTracking}
                className="rounded-lg border-avalanche-orange text-avalanche-orange hover:bg-avalanche-orange/10"
              >
                <Lock className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Unlock</span>
              </Button>
            )}
            
            {isPaid && (
              <Button 
                size="sm"
                variant={isTrackingActive ? "destructive" : "default"}
                onClick={onPauseTracking}
                className="rounded-lg"
              >
                {isTrackingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="hidden sm:inline ml-1">
                  {isTrackingActive ? 'Pause' : 'Resume'}
                </span>
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-4 space-y-4"
            >
              <Separator />
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Today</p>
                        <p className="text-lg font-bold text-blue-600">
                          {eventData.todayStats.vertical.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">{eventData.todayStats.unit}</p>
                      </div>
                      <Zap className="h-6 w-6 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="text-lg font-bold text-green-600">
                          {eventData.totalStats.vertical.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">{eventData.totalStats.unit}</p>
                      </div>
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                {eventData.goal && (
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600">Goal</p>
                          <p className="text-lg font-bold text-purple-600">
                            {progressPercentage.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-600">Complete</p>
                        </div>
                        <Target className="h-6 w-6 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Rank</p>
                        <p className="text-lg font-bold text-orange-600">#47</p>
                        <p className="text-xs text-gray-600">Global</p>
                      </div>
                      <Trophy className="h-6 w-6 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Bar */}
              {eventData.goal && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Personal Goal Progress</span>
                    <span className="font-semibold text-ultra-ice-blue">
                      {eventData.totalStats.vertical.toLocaleString()} / {eventData.goal.toLocaleString()} {eventData.totalStats.unit}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              {/* Team Section */}
              {eventData.participationType === 'team' && eventData.teamInfo && (
                <Card className="bg-glacier-blue/10">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-midnight">{eventData.teamInfo.name}</p>
                        <p className="text-sm text-gray-600">
                          {eventData.teamInfo.memberCount} members • 
                          {eventData.userRole === 'admin' ? ' Team Admin' : ' Team Member'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {eventData.userRole === 'admin' && (
                          <Button size="sm" variant="outline" onClick={onInvite} className="rounded-lg">
                            <Users className="h-4 w-4 mr-1" />
                            Invite
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onLeaderboard}
                  className="flex-1 rounded-lg"
                >
                  <Trophy className="h-4 w-4 mr-1" />
                  Leaderboard
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsLiveLocationShared(!isLiveLocationShared)}
                  className={`flex-1 rounded-lg ${
                    isLiveLocationShared ? 'bg-ultra-ice-blue/10 border-ultra-ice-blue' : ''
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {isLiveLocationShared ? 'Stop Sharing' : 'Share Live'}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="rounded-lg"
                >
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Payment Status */}
              {!isPaid && (
                <Card className="border-2 border-dashed border-avalanche-orange bg-orange-50/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-5 w-5 text-avalanche-orange" />
                        <div>
                          <p className="font-semibold text-avalanche-orange">Payment Required</p>
                          <p className="text-sm text-gray-600">Complete payment to unlock tracking</p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={onUnlockTracking}
                        className="bg-avalanche-orange hover:bg-avalanche-orange/90 rounded-lg"
                      >
                        Pay Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}