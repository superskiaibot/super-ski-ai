import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType, SavedRun } from '../src/types/index';
import { 
  Mountain, 
  Users, 
  Heart, 
  Crown, 
  Star, 
  Trophy, 
  UserPlus, 
  ArrowRight,
  Zap,
  Target,
  ChevronRight,
  ChevronDown,
  Gift,
  Sparkles,
  Award,
  Check,
  Building2,
  CreditCard,
  DollarSign,
  X,
  Settings,
  BarChart3,
  Lock,
  Calendar,
  Users2,
  TrendingUp,
  Home,
  User,
  AlertCircle,
  Plus,
  ChevronLeft,
  Edit,
  Eye,
  Share2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';

// Import container components - restored AnalyticsCardsSection, removed CommunityStatsSection
import { AnalyticsCardsSection } from './social/AnalyticsCardsSection';
import { JoinEventSection } from './social/JoinEventSection';
import { EventDashboard } from './EventDashboard';

// Import the comprehensive signup system
import { SkiForACureSignup } from './event/SkiForACureSignup';
import { IndividualAdminPanel } from './event/IndividualAdminPanel';
import { TeamAdminPanel } from './event/TeamAdminPanel';
import { BusinessAdminPanel } from './event/BusinessAdminPanel';
import { EventJoinModule, EventJoinData } from './event/EventJoinModule';

interface SignupData {
  type: 'individual' | 'team' | 'business';
  name: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  logo?: File;
  description?: string;
  teamName?: string;
  businessName?: string;
  targetAmount?: number;
  isPublic: boolean;
}

interface ParticipationData {
  id: string;
  type: 'individual' | 'team' | 'business';
  name: string;
  role: 'owner' | 'member' | 'admin';
  fundraisingAmount: number;
  targetAmount: number;
  isActive: boolean;
  joinedDate: string;
  teamMembers?: number;
  businessDetails?: {
    website?: string;
    logo?: string;
    description?: string;
  };
}

interface SocialProps {
  currentUser: UserType;
  onUpgrade: () => void;
  runs: SavedRun[];
  onSaveRun: (run: SavedRun) => void;
  onShowFundraiserSignup?: () => void;
  // New event management props
  eventManagementData?: any;
  onInviteTeamMember?: () => void;
  onViewLeaderboard?: () => void;
  onJoinEvent?: () => void;
  onUpdateTeam?: (teamInfo: any) => void;
  // Event join redirect handler
  onRedirectToTracking?: (mode: 'individual' | 'team' | 'business') => void;
}

export function Social({ 
  currentUser, 
  onUpgrade, 
  runs, 
  onSaveRun,
  eventManagementData,
  onInviteTeamMember,
  onViewLeaderboard,
  onJoinEvent,
  onUpdateTeam,
  onRedirectToTracking
}: SocialProps) {
  // Community data state - restored for AnalyticsCardsSection
  const [amountRaised, setAmountRaised] = useState(124750);
  const [fundraisingGoal] = useState(200000);
  const [daysRemaining] = useState(7);
  const [participantCount, setParticipantCount] = useState(1847);
  const [recentJoins, setRecentJoins] = useState(0);
  const [showEventDashboard, setShowEventDashboard] = useState(false);

  // Modal states for action buttons
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // New signup system states
  const [showSkiForACureSignup, setShowSkiForACureSignup] = useState(false);
  const [preSelectedSignupType, setPreSelectedSignupType] = useState<'individual' | 'team' | 'business' | null>(null);
  const [userSignupData, setUserSignupData] = useState<SignupData | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Event join module state
  const [showEventJoinModule, setShowEventJoinModule] = useState(false);

  // Enhanced participation state - support for multiple participations
  const [userParticipations, setUserParticipations] = useState<ParticipationData[]>([]);
  const [activeEventTab, setActiveEventTab] = useState('overview');

  // Mock multiple participations for demonstration
  useEffect(() => {
    if (userSignupData) {
      // Simulate multiple participations
      const participations: ParticipationData[] = [
        {
          id: '1',
          type: 'individual',
          name: 'Individual Participation',
          role: 'owner',
          fundraisingAmount: 2450,
          targetAmount: 5000,
          isActive: true,
          joinedDate: '2024-01-15',
        },
        {
          id: '2',
          type: 'team',
          name: 'Snow Warriors',
          role: 'admin',
          fundraisingAmount: 8750,
          targetAmount: 15000,
          isActive: true,
          joinedDate: '2024-01-18',
          teamMembers: 12,
        },
        {
          id: '3',
          type: 'business',
          name: 'Alpine Tech Solutions',
          role: 'owner',
          fundraisingAmount: 12500,
          targetAmount: 25000,
          isActive: true,
          joinedDate: '2024-01-20',
          businessDetails: {
            website: 'www.alpinetech.co.nz',
            description: 'Leading technology solutions for ski resorts across New Zealand'
          }
        }
      ];
      setUserParticipations(participations);
    } else {
      setUserParticipations([]);
    }
  }, [userSignupData]);

  // Live updates for community metrics (background activity simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate background community activity
      if (Math.random() > 0.8) { // 20% chance of update every 5 seconds
        setParticipantCount(prev => {
          const newCount = prev + 1;
          setRecentJoins(current => current + 1);
          // Also increase fundraising from community donations
          const donation = Math.floor(Math.random() * 100) + 25; // Random donation $25-$125
          setAmountRaised(current => current + donation);
          return newCount;
        });
      }
    }, 5000); // Update every 5 seconds

    // Reset recent activity counter periodically
    const resetInterval = setInterval(() => {
      setRecentJoins(0);
    }, 30000); // Reset every 30 seconds

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fundraisingProgress = Math.min((amountRaised / fundraisingGoal) * 100, 100);

  // Handle signup completion
  const handleSkiForACureSignupComplete = (data: SignupData) => {
    console.log('🎿 Ski For A Cure signup completed:', data);
    setUserSignupData(data);
    setShowSkiForACureSignup(false);
    setShowJoinModal(false);
    setPreSelectedSignupType(null);
    
    // Increment participant count
    setParticipantCount(prev => prev + 1);
    setRecentJoins(prev => prev + 1);
    
    // Show success message and redirect to admin panel
    setTimeout(() => {
      setShowAdminPanel(true);
    }, 1000);
  };

  // Handle direct signup type selection from modal
  const handleDirectSignup = (signupType: 'individual' | 'team' | 'business') => {
    console.log('🎿 Direct signup type selected:', signupType);
    setPreSelectedSignupType(signupType);
    setShowJoinModal(false);
    setShowSkiForACureSignup(true);
  };

  // Handle signup modal close
  const handleSignupClose = () => {
    setShowSkiForACureSignup(false);
    setPreSelectedSignupType(null);
  };

  // Handle event join completion from new system
  const handleEventJoinComplete = (joinData: EventJoinData) => {
    console.log('🎿 Event join completed:', joinData);
    
    // Convert to old system format for compatibility
    const signupData: SignupData = {
      type: joinData.participationType,
      name: joinData.userInfo.name,
      email: joinData.userInfo.email,
      phone: '', // Default values for compatibility
      location: '',
      teamName: joinData.teamInfo?.teamName,
      businessName: joinData.businessInfo?.companyName,
      targetAmount: joinData.participationType === 'individual' ? 5000 : 
                    joinData.participationType === 'team' ? 15000 : 25000,
      isPublic: true
    };
    
    setUserSignupData(signupData);
    setShowEventJoinModule(false);
    
    // Increment participant count
    setParticipantCount(prev => prev + 1);
    setRecentJoins(prev => prev + 1);
    
    // Show admin panel after join
    setTimeout(() => {
      setShowAdminPanel(true);
    }, 1000);
  };

  // Handle redirect to tracking page for event join
  const handleRedirectToTracking = (mode: 'individual' | 'team' | 'business') => {
    console.log('🎿 Redirecting to tracking with mode:', mode);
    if (onRedirectToTracking) {
      onRedirectToTracking(mode);
    }
  };

  // Render admin panel based on signup type
  const renderAdminPanel = () => {
    if (!userSignupData) return null;

    const commonProps = {
      onBack: () => setShowAdminPanel(false),
      userData: userSignupData,
      currentUser: currentUser
    };

    switch (userSignupData.type) {
      case 'individual':
        return <IndividualAdminPanel {...commonProps} />;
      case 'team':
        return <TeamAdminPanel {...commonProps} />;
      case 'business':
        return <BusinessAdminPanel {...commonProps} />;
      default:
        return null;
    }
  };

  // Enhanced Event Management Panel Component - NEW
  const EventManagementPanel = () => {
    const totalFundraisingAmount = userParticipations.reduce((sum, p) => sum + p.fundraisingAmount, 0);
    const totalTargetAmount = userParticipations.reduce((sum, p) => sum + p.targetAmount, 0);
    const overallProgress = totalTargetAmount > 0 ? (totalFundraisingAmount / totalTargetAmount) * 100 : 0;

    // Check if user is joined via the new event system
    const isJoinedViaNewSystem = eventManagementData?.isJoined;

    if (userParticipations.length > 0 || isJoinedViaNewSystem) {
      // Show full event management panel for participants
      return (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Event Management</h3>
            <p className="text-muted-foreground">Manage your participation across all your roles</p>
          </div>

          <Card className="snowline-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Your Participations</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {userParticipations.length} active participation{userParticipations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                {/* Overall Progress */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(totalFundraisingAmount)}</div>
                  <div className="text-sm text-muted-foreground">of {formatCurrency(totalTargetAmount)} goal</div>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(overallProgress, 100)}%` }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={activeEventTab} onValueChange={setActiveEventTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="teams" className="text-xs">Teams</TabsTrigger>
                  <TabsTrigger value="fundraising" className="text-xs">Fundraising</TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs">Schedule</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-4">
                  {/* Participation Cards */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground mb-3">Your Participations</h4>
                    {userParticipations.map((participation) => (
                      <div key={participation.id} className="border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              {participation.type === 'individual' ? <User className="w-5 h-5 text-primary" /> :
                               participation.type === 'team' ? <Users2 className="w-5 h-5 text-primary" /> :
                               <Building2 className="w-5 h-5 text-primary" />}
                            </div>
                            <div>
                              <div className="font-medium">{participation.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs">{participation.role}</Badge>
                                {participation.teamMembers && (
                                  <span>{participation.teamMembers} members</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(participation.fundraisingAmount)}</div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((participation.fundraisingAmount / participation.targetAmount) * 100)}% of goal
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Button
                      onClick={() => setShowAdminPanel(true)}
                      className="bg-primary hover:bg-primary/90 min-h-[44px]"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Full Admin Panel
                    </Button>
                    <Button variant="outline" className="min-h-[44px]">
                      <Plus className="w-4 h-4 mr-2" />
                      Join Another
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="teams" className="mt-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Team Memberships</h4>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Join Team
                      </Button>
                    </div>
                    
                    {userParticipations.filter(p => p.type === 'team').map((team) => (
                      <Card key={team.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users2 className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold">{team.name}</div>
                                <div className="text-sm text-muted-foreground">{team.teamMembers} members</div>
                              </div>
                            </div>
                            <Badge variant={team.role === 'admin' ? 'default' : 'secondary'}>
                              {team.role}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Team Progress</span>
                              <span>{Math.round((team.fundraisingAmount / team.targetAmount) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min((team.fundraisingAmount / team.targetAmount) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{formatCurrency(team.fundraisingAmount)}</span>
                              <span>{formatCurrency(team.targetAmount)}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Users className="w-4 h-4 mr-2" />
                              Members
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Stats
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="fundraising" className="mt-6 space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Fundraising Overview</h4>
                    
                    {/* Fundraising Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalFundraisingAmount)}</div>
                          <div className="text-sm text-muted-foreground">Total Raised</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalTargetAmount)}</div>
                          <div className="text-sm text-muted-foreground">Total Goal</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">{Math.round(overallProgress)}%</div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Individual Fundraising Details */}
                    <div className="space-y-3">
                      {userParticipations.map((participation) => (
                        <div key={participation.id} className="border rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">{participation.name}</div>
                            <Button variant="outline" size="sm">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round((participation.fundraisingAmount / participation.targetAmount) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${Math.min((participation.fundraisingAmount / participation.targetAmount) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{formatCurrency(participation.fundraisingAmount)}</span>
                              <span>{formatCurrency(participation.targetAmount)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="mt-6 space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Event Schedule</h4>
                    
                    <div className="space-y-3">
                      <div className="border rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div className="font-medium">Event Weekend</div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">30th - 31st August 2025</div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Registration & Check-in</span>
                            </div>
                            <span className="text-sm text-muted-foreground">8:00 AM</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Opening Ceremony</span>
                            </div>
                            <span className="text-sm text-muted-foreground">9:00 AM</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center space-x-2">
                              <Mountain className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Skiing Activities Begin</span>
                            </div>
                            <span className="text-sm text-muted-foreground">10:00 AM</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                              <Heart className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Closing & Awards</span>
                            </div>
                            <span className="text-sm text-muted-foreground">4:00 PM</span>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6 space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Participation Settings</h4>
                    
                    <div className="space-y-3">
                      {userParticipations.map((participation) => (
                        <div key={participation.id} className="border rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">{participation.name}</div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Page
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>Role: {participation.role}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Joined: {new Date(participation.joinedDate).toLocaleDateString()}</span>
                            </div>
                            {participation.businessDetails?.website && (
                              <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4" />
                                <span>{participation.businessDetails.website}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      // Show placeholder for non-signed up users
      return (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Event Management</h3>
            <p className="text-muted-foreground">Join the event to access your personal management dashboard</p>
          </div>

          <Card className="snowline-card">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                {/* Locked Icon */}
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Lock className="w-10 h-10 text-gray-400" />
                </div>

                {/* Placeholder Content */}
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-foreground">Management Panel Locked</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Register for Ski For A Cure NZ to unlock your personal management dashboard where you can handle multiple participations, manage teams, track fundraising progress, and access exclusive event features.
                  </p>
                </div>

                {/* Preview Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
                    <Home className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-600">Overview</div>
                    <div className="text-xs text-gray-500">Multi-participation dashboard</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
                    <Users2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-600">Teams</div>
                    <div className="text-xs text-gray-500">Team management</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
                    <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-600">Fundraising</div>
                    <div className="text-xs text-gray-500">Progress tracking</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
                    <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-600">Schedule</div>
                    <div className="text-xs text-gray-500">Event planning</div>
                  </div>
                </div>

                {/* Join Button */}
                <Button
                  onClick={() => setShowJoinModal(true)}
                  className="bg-primary hover:bg-primary/90 min-h-[44px] px-8"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Event to Unlock
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  // If showing event dashboard, render that instead
  if (showEventDashboard) {
    return (
      <EventDashboard 
        currentUser={currentUser}
        onUpgrade={onUpgrade}
        runs={runs}
        onSaveRun={onSaveRun}
        onBack={() => setShowEventDashboard(false)}
      />
    );
  }

  // If showing admin panel, render that instead
  if (showAdminPanel && userSignupData) {
    return renderAdminPanel();
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Simple White Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-white"
      >
        {/* Content Container */}
        <div className="relative z-10 px-4 py-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Simple Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              {/* Navigation-style Title Container */}
              <div className="inline-block space-y-3">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-xl border border-border bg-background text-foreground shadow-sm min-h-[44px]">
                  <Mountain className="w-5 h-5 flex-shrink-0 text-primary" />
                  <span className="text-lg font-semibold">Ski For A Cure NZ</span>
                </div>
                
                {/* Event Date */}
                <div className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl border border-border bg-muted/50 text-muted-foreground shadow-sm min-h-[36px]">
                  <span className="text-sm font-medium">30th - 31st August 2025</span>
                </div>

                {/* Show signup status if user has signed up */}
                {userParticipations.length > 0 && (
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 shadow-sm min-h-[36px]">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {userParticipations.length} active participation{userParticipations.length !== 1 ? 's' : ''}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdminPanel(true)}
                      className="text-green-700 hover:text-green-800 hover:bg-green-100 -mr-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto p-6 lg:p-8 pt-2 lg:pt-4">
        {/* Analytics Cards Section - Restored */}
        <AnalyticsCardsSection
          amountRaised={amountRaised}
          participantCount={participantCount}
          fundraisingProgress={fundraisingProgress}
          daysRemaining={daysRemaining}
          recentJoins={recentJoins}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />

        {/* Action Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <div className="w-full max-w-md">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] text-muted-foreground hover:bg-muted hover:text-foreground border border-border hover:border-green-500 hover:bg-green-50"
              >
                <UserPlus className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left text-sm">
                  {userParticipations.length > 0 ? 'Manage Participations' : 'Join'}
                </span>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </button>
              <button
                onClick={() => setShowSponsorModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] text-muted-foreground hover:bg-muted hover:text-foreground border border-border hover:border-blue-500 hover:bg-blue-50"
              >
                <Trophy className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left text-sm">Sponsor</span>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </button>
              <button
                onClick={() => setShowDonateModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] text-muted-foreground hover:bg-muted hover:text-foreground border border-border hover:border-orange-500 hover:bg-orange-50"
              >
                <Heart className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left text-sm">Donate</span>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* NEW: Enhanced Event Management Panel */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-12">
        <EventManagementPanel />
      </div>

      {/* Join Modal - Shows signup type selection */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className="w-[95vw] max-w-md mx-auto sm:max-w-md">
          <DialogHeader className="text-center space-y-3 pb-2">
            <DialogTitle className="flex items-center justify-center space-x-2 text-xl sm:text-2xl">
              <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              <span>
                {userParticipations.length > 0 ? 'Manage Participations' : 'Join Ski For A Cure NZ'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base leading-relaxed px-2">
              {userParticipations.length > 0 ? 
                'Manage your existing participations or join additional ways' :
                'Choose how you\'d like to participate in the charity event'
              }
            </DialogDescription>
          </DialogHeader>
          
          {userParticipations.length > 0 ? (
            // Show management options if already signed up
            <div className="space-y-3 py-4 px-2 sm:px-0">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-900">Active Participations</div>
                  <div className="text-sm text-green-700 mt-1">
                    {userParticipations.length} participation{userParticipations.length !== 1 ? 's' : ''} registered
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  setShowJoinModal(false);
                  setShowAdminPanel(true);
                }}
                className="w-full min-h-[56px] bg-primary hover:bg-primary/90"
              >
                <Crown className="w-5 h-5 mr-2" />
                Open Management Panel
              </Button>

              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground text-center mb-3">Join additional ways:</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleDirectSignup('individual')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-green-50 border border-border text-sm"
                  >
                    <UserPlus className="w-4 h-4 text-green-600" />
                    <span>Individual</span>
                  </button>
                  <button 
                    onClick={() => handleDirectSignup('team')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-blue-50 border border-border text-sm"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Team</span>
                  </button>
                  <button 
                    onClick={() => handleDirectSignup('business')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-50 border border-border text-sm"
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>Business</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Show signup options if not signed up
            <div className="space-y-3 py-4 px-2 sm:px-0">
              <button 
                onClick={() => handleDirectSignup('individual')}
                className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all border border-border hover:border-green-500 hover:bg-green-50 min-h-[64px] sm:min-h-[56px] active:scale-98"
              >
                <UserPlus className="w-6 h-6 sm:w-5 sm:h-5 flex-shrink-0 text-green-600" />
                <div className="flex-1 text-left space-y-1">
                  <div className="text-base sm:text-sm font-semibold">Individual</div>
                  <div className="text-sm sm:text-xs text-muted-foreground">Join as a solo participant</div>
                </div>
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
              </button>
              
              <button 
                onClick={() => handleDirectSignup('team')}
                className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all border border-border hover:border-blue-500 hover:bg-blue-50 min-h-[64px] sm:min-h-[56px] active:scale-98"
              >
                <Users className="w-6 h-6 sm:w-5 sm:h-5 flex-shrink-0 text-blue-600" />
                <div className="flex-1 text-left space-y-1">
                  <div className="text-base sm:text-sm font-semibold">Team</div>
                  <div className="text-sm sm:text-xs text-muted-foreground">Create or join a team</div>
                </div>
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
              </button>
              
              <button 
                onClick={() => handleDirectSignup('business')}
                className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all border border-border hover:border-purple-500 hover:bg-purple-50 min-h-[64px] sm:min-h-[56px] active:scale-98"
              >
                <Building2 className="w-6 h-6 sm:w-5 sm:h-5 flex-shrink-0 text-purple-600" />
                <div className="flex-1 text-left space-y-1">
                  <div className="text-base sm:text-sm font-semibold">Business</div>
                  <div className="text-sm sm:text-xs text-muted-foreground">Corporate participation</div>
                </div>
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sponsor Modal */}
      <Dialog open={showSponsorModal} onOpenChange={setShowSponsorModal}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center space-y-3 pb-2">
            <DialogTitle className="flex items-center justify-center space-x-2 text-xl sm:text-2xl">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              <span>Become a Sponsor</span>
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base leading-relaxed px-2">
              Support Ski For A Cure NZ and help us reach our fundraising goal
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 px-2 sm:px-0">
            {/* Sponsorship Tiers */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-4 py-4 rounded-xl border-2 border-purple-500 bg-purple-50 min-h-[72px] sm:min-h-[64px]">
                <Crown className="w-7 h-7 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-purple-600 text-base sm:text-sm">Platinum Sponsor</div>
                  <div className="text-sm sm:text-xs text-purple-600 mt-1">$50,000+ • Premium branding & benefits</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 px-4 py-4 rounded-xl border-2 border-yellow-500 bg-yellow-50 min-h-[72px] sm:min-h-[64px]">
                <Award className="w-7 h-7 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-yellow-600 text-base sm:text-sm">Gold Sponsor</div>
                  <div className="text-sm sm:text-xs text-yellow-600 mt-1">$25,000+ • Major partner recognition</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 px-4 py-4 rounded-xl border-2 border-gray-500 bg-gray-50 min-h-[72px] sm:min-h-[64px]">
                <Star className="w-7 h-7 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-600 text-base sm:text-sm">Silver Sponsor</div>
                  <div className="text-sm sm:text-xs text-gray-600 mt-1">$15,000+ • Supporting partner benefits</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 px-4 py-4 rounded-xl border-2 border-orange-500 bg-orange-50 min-h-[72px] sm:min-h-[64px]">
                <Building2 className="w-7 h-7 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-orange-600 text-base sm:text-sm">Bronze Sponsor</div>
                  <div className="text-sm sm:text-xs text-orange-600 mt-1">$10,000+ • Community partner recognition</div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-xl">
              <h4 className="font-semibold mb-3 text-base sm:text-sm">Sponsor Benefits Include:</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Logo placement on event materials</li>
                <li>• Social media recognition</li>
                <li>• VIP event access</li>
                <li>• Tax-deductible contribution</li>
                <li>• Community impact visibility</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button onClick={() => setShowSponsorModal(false)} variant="outline" className="w-full min-h-[48px] text-base sm:text-sm">
              Contact Our Sponsorship Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Donate Modal */}
      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent className="w-[95vw] max-w-md mx-auto sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center space-y-3 pb-2">
            <DialogTitle className="flex items-center justify-center space-x-2 text-xl sm:text-2xl">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              <span>Make a Donation</span>
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base leading-relaxed px-2">
              Every dollar helps support cancer research and patient care
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 px-2 sm:px-0">
            {/* Quick Donation Amounts */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all min-h-[80px] sm:min-h-[72px] active:scale-95">
                <DollarSign className="w-6 h-6 sm:w-5 sm:h-5 text-primary mb-2" />
                <span className="font-semibold text-lg sm:text-base">$5</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all min-h-[80px] sm:min-h-[72px] active:scale-95">
                <DollarSign className="w-6 h-6 sm:w-5 sm:h-5 text-primary mb-2" />
                <span className="font-semibold text-lg sm:text-base">$10</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all min-h-[80px] sm:min-h-[72px] active:scale-95">
                <DollarSign className="w-6 h-6 sm:w-5 sm:h-5 text-primary mb-2" />
                <span className="font-semibold text-lg sm:text-base">$25</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all min-h-[80px] sm:min-h-[72px] active:scale-95">
                <Gift className="w-6 h-6 sm:w-5 sm:h-5 text-primary mb-2" />
                <span className="font-semibold text-sm sm:text-xs">Custom</span>
              </button>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-xl">
              <h4 className="font-semibold mb-3 text-base sm:text-sm">Your Impact:</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• $5 supports basic research materials</li>
                <li>• $10 funds 30 minutes of research</li>
                <li>• $25 funds 1 hour of research</li>
                <li>• 100% of donations go directly to cancer care</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-green-50 p-4 rounded-xl">
              <Check className="w-5 h-5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="text-center">Tax-deductible • Secure payment • Instant receipt</span>
            </div>
          </div>
          
          <DialogFooter className="space-y-3 pt-4">
            <Button onClick={() => setShowDonateModal(false)} className="w-full bg-primary hover:bg-primary/90 min-h-[48px] text-base sm:text-sm">
              <CreditCard className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
              Continue to Payment
            </Button>
            <Button onClick={() => setShowDonateModal(false)} variant="outline" className="w-full min-h-[48px] text-base sm:text-sm">
              Learn More About Our Cause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ski For A Cure Signup Modal - with pre-selected type */}
      <SkiForACureSignup
        isOpen={showSkiForACureSignup}
        onClose={handleSignupClose}
        onSignupComplete={handleSkiForACureSignupComplete}
        preSelectedType={preSelectedSignupType}
      />
    </div>
  );
}