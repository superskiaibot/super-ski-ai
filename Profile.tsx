import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Edit3, MapPin, Calendar, Award, TrendingUp, 
  Activity, Trophy, Users, Settings, Share, MoreHorizontal,
  ExternalLink, Phone, Mail, Globe, Camera, MessageCircle,
  UserPlus, UserMinus, Lock, Eye, EyeOff, Star, Mountain,
  Clock, Route, Gauge, Zap, Target, BarChart3, UserCheck,
  UserX, Send, Check, X, AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ProfileEditor } from './profile/ProfileEditor';
import { User as UserType, SavedRun } from '../src/types/index';
import { formatDistance, formatTime, formatVertical } from './tracking/utils';
import { userService } from '../src/utils/userService';

interface ProfileProps {
  user: UserType;
  currentUser: UserType;
  isOwnProfile: boolean;
  runs: SavedRun[];
  onUpdateProfile: (updates: Partial<UserType>) => void;
}

// Friend request status type
type FriendStatus = 'none' | 'following' | 'friend_request_sent' | 'friend_request_received' | 'friends';

export function Profile({ user, currentUser, isOwnProfile, runs, onUpdateProfile }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [userRuns, setUserRuns] = useState<SavedRun[]>([]);
  const [showFriendRequestDialog, setShowFriendRequestDialog] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');

  // Initialize user runs and friend status
  useEffect(() => {
    // Filter runs for this user
    const filteredRuns = runs.filter(run => run.userId === user.id);
    setUserRuns(filteredRuns);
    
    // Determine friend status
    if (!isOwnProfile) {
      const isFollowing = currentUser.following?.includes(user.id) || false;
      const isFriend = currentUser.friends?.includes(user.id) || false;
      const hasRequestSent = currentUser.friendRequestsSent?.includes(user.id) || false;
      const hasRequestReceived = currentUser.friendRequestsReceived?.includes(user.id) || false;

      if (isFriend) {
        setFriendStatus('friends');
      } else if (hasRequestSent) {
        setFriendStatus('friend_request_sent');
      } else if (hasRequestReceived) {
        setFriendStatus('friend_request_received');
      } else if (isFollowing) {
        setFriendStatus('following');
      } else {
        setFriendStatus('none');
      }
    }
  }, [user.id, runs, isOwnProfile, currentUser]);

  const getInitials = () => {
    const displayName = user.displayName || user.name || user.username;
    const names = displayName.split(' ');
    return names.map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase();
  };

  const handleEditProfile = () => {
    setShowProfileEditor(true);
  };

  const handleSaveProfile = async (updates: Partial<UserType>) => {
    try {
      const result = await userService.updateUser(user.id, updates);
      if (result.success) {
        onUpdateProfile(updates);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!isOwnProfile) {
      setIsLoading(true);
      try {
        const result = await userService.sendFriendRequest(currentUser.id, user.id, friendRequestMessage);
        if (result.success) {
          setFriendStatus('friend_request_sent');
          setShowFriendRequestDialog(false);
          setFriendRequestMessage('');
        }
      } catch (error) {
        console.error('Failed to send friend request:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAcceptFriendRequest = async () => {
    setIsLoading(true);
    try {
      const result = await userService.acceptFriendRequest(currentUser.id, user.id);
      if (result.success) {
        setFriendStatus('friends');
      }
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineFriendRequest = async () => {
    setIsLoading(true);
    try {
      const result = await userService.declineFriendRequest(currentUser.id, user.id);
      if (result.success) {
        setFriendStatus('none');
      }
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setIsLoading(true);
    try {
      const result = await userService.removeFriend(currentUser.id, user.id);
      if (result.success) {
        setFriendStatus('none');
      }
    } catch (error) {
      console.error('Failed to remove friend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelFriendRequest = async () => {
    setIsLoading(true);
    try {
      const result = await userService.cancelFriendRequest(currentUser.id, user.id);
      if (result.success) {
        setFriendStatus('none');
      }
    } catch (error) {
      console.error('Failed to cancel friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isOwnProfile) {
      setIsLoading(true);
      try {
        const result = await userService.toggleFollowUser(currentUser.id, user.id);
        if (result.success) {
          setFriendStatus(result.isFollowing ? 'following' : 'none');
        }
      } catch (error) {
        console.error('Failed to toggle follow:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderFriendButton = () => {
    if (isOwnProfile) {
      return (
        <Button 
          onClick={handleEditProfile}
          variant="secondary"
          className="bg-white/90 text-gray-900 hover:bg-white min-h-[44px]"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      );
    }

    switch (friendStatus) {
      case 'friends':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isLoading}
                className="bg-mountain-green hover:bg-mountain-green/90 text-white min-h-[44px]"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Friends
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 snowline-glass-strong">
              <DropdownMenuItem 
                onClick={handleRemoveFriend}
                className="text-danger-red hover:bg-danger-red/10 cursor-pointer"
              >
                <UserX className="w-4 h-4 mr-2" />
                Remove Friend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case 'friend_request_sent':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isLoading}
                variant="secondary"
                className="bg-warning-yellow/10 text-warning-yellow border-warning-yellow/30 hover:bg-warning-yellow/20 min-h-[44px]"
              >
                <Send className="w-4 h-4 mr-2" />
                Request Sent
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 snowline-glass-strong">
              <DropdownMenuItem 
                onClick={handleCancelFriendRequest}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Request
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      case 'friend_request_received':
        return (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleAcceptFriendRequest}
              disabled={isLoading}
              className="bg-mountain-green hover:bg-mountain-green/90 text-white min-h-[44px]"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button
              onClick={handleDeclineFriendRequest}
              disabled={isLoading}
              variant="outline"
              className="min-h-[44px]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      
      case 'following':
        return (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowFriendRequestDialog(true)}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 min-h-[44px]"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
            <Button
              onClick={handleFollowToggle}
              disabled={isLoading}
              variant="outline"
              className="min-h-[44px]"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Unfollow
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowFriendRequestDialog(true)}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 min-h-[44px]"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
            <Button
              onClick={handleFollowToggle}
              disabled={isLoading}
              variant="outline"
              className="min-h-[44px]"
            >
              <Users className="w-4 h-4 mr-2" />
              Follow
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray">
      {/* Cover Photo Section */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary via-primary/90 to-primary/70 relative overflow-hidden">
          {user.profile?.coverImage && (
            <img 
              src={user.profile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Profile Header Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div className="flex items-end space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-xl">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Pro Badge */}
                  {user.isVerified && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    </div>
                  )}

                  {/* Friend Status Indicator */}
                  {!isOwnProfile && friendStatus === 'friends' && (
                    <div className="absolute -bottom-1 -right-1">
                      <Badge className="bg-mountain-green text-white shadow-lg h-6 w-6 p-0 flex items-center justify-center rounded-full">
                        <UserCheck className="w-3 h-3" />
                      </Badge>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="text-white">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {user.displayName || user.name}
                  </h1>
                  <p className="text-white/80 text-sm md:text-base">
                    @{user.username}
                  </p>
                  {user.profile?.location && (
                    <div className="flex items-center space-x-1 mt-1 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {renderFriendButton()}
                
                {!isOwnProfile && (
                  <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white min-h-[44px] min-w-[44px]">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white min-h-[44px] min-w-[44px]">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 snowline-glass-strong">
                    <DropdownMenuItem>
                      <Share className="w-4 h-4 mr-2" />
                      Share Profile
                    </DropdownMenuItem>
                    {!isOwnProfile && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Report User
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* About Card */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.profile?.bio && (
                  <p className="text-muted-foreground leading-relaxed">
                    {user.profile.bio}
                  </p>
                )}

                {/* Contact Info */}
                <div className="space-y-3">
                  {user.profile?.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{user.profile.location}</span>
                    </div>
                  )}
                  
                  {user.profile?.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={user.profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-NZ', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Social Stats */}
                <div className="flex items-center space-x-6 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{user.friends?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Friends</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{user.following?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{user.followers?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{userRuns.length}</div>
                    <div className="text-xs text-muted-foreground">Runs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skiing Info Card */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mountain className="w-5 h-5 mr-2 text-primary" />
                  Skiing Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Skill Level</span>
                    <Badge variant={
                      user.level === 'expert' ? 'destructive' :
                      user.level === 'advanced' ? 'default' :
                      user.level === 'intermediate' ? 'secondary' : 'outline'
                    }>
                      {user.level?.charAt(0).toUpperCase() + user.level?.slice(1)}
                    </Badge>
                  </div>
                  
                  {user.preferences?.equipment?.type && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Equipment</span>
                      <span className="text-sm font-medium">
                        {user.preferences.equipment.type.charAt(0).toUpperCase() + 
                         user.preferences.equipment.type.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  
                  {user.stats?.favoriteResort && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Favorite Resort</span>
                      <span className="text-sm font-medium">{user.stats.favoriteResort}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Days</span>
                    <span className="text-sm font-medium">{user.stats?.totalDays || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <Route className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-lg font-semibold">
                      {formatDistance(user.stats?.totalDistance || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Distance</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-500/5 rounded-lg">
                    <Mountain className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <div className="text-lg font-semibold">
                      {formatVertical(user.stats?.totalVertical || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Vertical</div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-500/5 rounded-lg">
                    <Gauge className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <div className="text-lg font-semibold">
                      {(user.stats?.maxSpeed || 0).toFixed(1)} km/h
                    </div>
                    <div className="text-xs text-muted-foreground">Max Speed</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-500/5 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <div className="text-lg font-semibold">
                      {formatTime(user.stats?.totalDuration || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Main Profile Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="runs">Runs</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="achievements">Awards</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Recent Activity */}
                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userRuns.length > 0 ? (
                      <div className="space-y-4">
                        {userRuns.slice(0, 3).map((run) => (
                          <div key={run.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Activity className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{run.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {run.resort.name} • {formatDistance(run.stats.distance)} • {formatTime(run.stats.duration)}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {run.stats.difficulty.charAt(0).toUpperCase() + run.stats.difficulty.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No runs recorded yet</p>
                        {isOwnProfile && (
                          <p className="text-sm mt-2">Start tracking your skiing adventures!</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Runs Tab */}
              <TabsContent value="runs" className="space-y-6">
                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle className="text-lg">All Runs</CardTitle>
                    <CardDescription>
                      {userRuns.length} total runs recorded
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userRuns.length > 0 ? (
                      <div className="space-y-4">
                        {userRuns.map((run) => (
                          <div key={run.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{run.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {run.description || 'No description'}
                                </p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                  <span>{run.resort.name}</span>
                                  <span>•</span>
                                  <span>{new Date(run.startTime).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="text-center">
                                  <div className="font-medium">{formatDistance(run.stats.distance)}</div>
                                  <div className="text-xs text-muted-foreground">Distance</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium">{formatVertical(run.stats.vertical)}</div>
                                  <div className="text-xs text-muted-foreground">Vertical</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium">{run.stats.maxSpeed.toFixed(1)} km/h</div>
                                  <div className="text-xs text-muted-foreground">Max Speed</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Mountain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No runs recorded yet</p>
                        {isOwnProfile && (
                          <p className="text-sm mt-2">Start tracking your skiing adventures!</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="stats" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Runs</span>
                          <span className="font-medium">{user.stats?.totalRuns || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Distance</span>
                          <span className="font-medium">{formatDistance(user.stats?.totalDistance || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Vertical</span>
                          <span className="font-medium">{formatVertical(user.stats?.totalVertical || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Max Speed</span>
                          <span className="font-medium">{(user.stats?.maxSpeed || 0).toFixed(1)} km/h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Average Speed</span>
                          <span className="font-medium">{(user.stats?.averageSpeed || 0).toFixed(1)} km/h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="snowline-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Time Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Time</span>
                          <span className="font-medium">{formatTime(user.stats?.totalDuration || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Days on Slopes</span>
                          <span className="font-medium">{user.stats?.totalDays || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Average Run Time</span>
                          <span className="font-medium">
                            {user.stats?.totalRuns && user.stats.totalRuns > 0 
                              ? formatTime((user.stats.totalDuration || 0) / user.stats.totalRuns)
                              : '0:00'
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <Card className="snowline-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-orange-500" />
                      Achievements
                    </CardTitle>
                    <CardDescription>
                      Unlock achievements by completing skiing milestones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No achievements unlocked yet</p>
                      {isOwnProfile && (
                        <p className="text-sm mt-2">Keep skiing to earn your first achievement!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Friend Request Dialog */}
      <Dialog open={showFriendRequestDialog} onOpenChange={setShowFriendRequestDialog}>
        <DialogContent className="mx-auto max-w-md w-[90vw] sm:w-full snowline-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <UserPlus className="w-6 h-6 text-primary" />
              <span>Send Friend Request</span>
            </DialogTitle>
            <DialogDescription className="leading-relaxed pt-4">
              Send a friend request to <span className="font-medium text-foreground">{user.displayName || user.name}</span>? 
              You can include an optional message.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={friendRequestMessage}
              onChange={(e) => setFriendRequestMessage(e.target.value)}
              placeholder="Hi! I'd like to connect and share skiing adventures together."
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {friendRequestMessage.length}/200
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setShowFriendRequestDialog(false)}
              disabled={isLoading}
              className="w-full sm:w-auto min-w-24 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendFriendRequest}
              disabled={isLoading}
              className="w-full sm:w-auto min-w-24 bg-primary hover:bg-primary/90 rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Editor Modal */}
      {showProfileEditor && (
        <ProfileEditor
          user={user}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileEditor(false)}
          isOwnProfile={isOwnProfile}
        />
      )}
    </div>
  );
}