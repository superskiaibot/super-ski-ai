import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Users,
  Target,
  Trophy,
  Star,
  Clock,
  ChevronRight,
  Calendar,
  MapPin,
  DollarSign,
  Flame,
  Medal,
  TrendingUp,
  UserPlus,
  Share2,
  Award,
  Activity,
  Mountain,
  Info,
  CheckCircle,
  Zap,
  Plus,
  Crown,
  Sparkles,
  Settings,
  Globe,
  Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { User } from '../src/types/index';
import { hasFeature } from '../src/utils/featureGates';
import { SkiForACureSignup } from './event/SkiForACureSignup';
import { IndividualAdminPanel } from './event/IndividualAdminPanel';
import { TeamAdminPanel } from './event/TeamAdminPanel';
import { BusinessAdminPanel } from './event/BusinessAdminPanel';
import { CustomizableMiniPage, mockTeamData, mockBusinessData } from './event/CustomizableMiniPage';

interface SkiForACureEventProps {
  currentUser: User;
  onUpgrade?: () => void;
  onJoinEvent?: (eventId: string) => void;
  onJoinTeam?: (teamId: string) => void;
  onCreateTeam?: () => void;
  onDonate?: (amount: number) => void;
  onClose?: () => void;
}

// Ski For A Cure Event Data
interface CharityEventData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  daysRemaining: number;
  totalParticipants: number;
  maxParticipants: number;
  totalFundsRaised: number;
  fundingGoal: number;
  userParticipating: boolean;
  userFundsRaised: number;
  userRank: number;
  resorts: string[];
  eventType: 'charity' | 'fundraiser';
  features: {
    fundraising: boolean;
    teamCompetition: boolean;
    individualCompetition: boolean;
    liveTracking: boolean;
    leaderboards: boolean;
    socialSharing: boolean;
  };
}

interface TeamData {
  id: string;
  name: string;
  captain: string;
  members: number;
  maxMembers: number;
  fundsRaised: number;
  averageDistance: number;
  totalVertical: number;
  rank: number;
  avatar?: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  fundsRaised: number;
  distance: number;
  vertical: number;
  rank: number;
  team?: string;
  badge?: 'bronze' | 'silver' | 'gold' | 'crown';
}

const skiForACureEvent: CharityEventData = {
  id: 'ski-for-a-cure',
  name: 'Ski For A Cure NZ 2025',
  description: 'Join New Zealand\'s largest charity ski event supporting cancer research. Every meter skied and every dollar raised makes a difference.',
  startDate: 'January 15, 2025',
  endDate: 'February 15, 2025',
  registrationDeadline: 'January 10, 2025',
  daysRemaining: 28,
  totalParticipants: 1247,
  maxParticipants: 2000,
  totalFundsRaised: 185000,
  fundingGoal: 500000,
  userParticipating: false,
  userFundsRaised: 0,
  userRank: 0,
  resorts: ['Coronet Peak', 'The Remarkables', 'Cardrona', 'Treble Cone', 'Mount Hutt', 'Whakapapa', 'Turoa'],
  eventType: 'charity',
  features: {
    fundraising: true,
    teamCompetition: true,
    individualCompetition: true,
    liveTracking: true,
    leaderboards: true,
    socialSharing: true
  }
};

const mockTeams: TeamData[] = [
  {
    id: 'team1',
    name: 'Powder Heroes',
    captain: 'Sarah Chen',
    members: 8,
    maxMembers: 10,
    fundsRaised: 4200,
    averageDistance: 45.2,
    totalVertical: 18600,
    rank: 1
  },
  {
    id: 'team2',
    name: 'Snow Warriors',
    captain: 'Marcus Johnson',
    members: 6,
    maxMembers: 8,
    fundsRaised: 3800,
    averageDistance: 42.1,
    totalVertical: 16800,
    rank: 2
  },
  {
    id: 'team3',
    name: 'Alpine Legends',
    captain: 'Emma Wilson',
    members: 7,
    maxMembers: 10,
    fundsRaised: 3500,
    averageDistance: 38.9,
    totalVertical: 15200,
    rank: 3
  },
  {
    id: 'team4',
    name: 'Mountain Mavericks',
    captain: 'Jake Miller',
    members: 5,
    maxMembers: 8,
    fundsRaised: 2900,
    averageDistance: 35.8,
    totalVertical: 14100,
    rank: 4
  }
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'leader1',
    name: 'Alex Thompson',
    username: 'alexthompson',
    fundsRaised: 2100,
    distance: 89.5,
    vertical: 12400,
    rank: 1,
    team: 'Powder Heroes',
    badge: 'crown'
  },
  {
    id: 'leader2',
    name: 'Sophie Martinez',
    username: 'sophieski',
    fundsRaised: 1850,
    distance: 82.3,
    vertical: 11200,
    rank: 2,
    team: 'Snow Warriors',
    badge: 'gold'
  },
  {
    id: 'leader3',
    name: 'Ryan O\'Connor',
    username: 'ryano',
    fundsRaised: 1650,
    distance: 78.9,
    vertical: 10800,
    rank: 3,
    team: 'Alpine Legends',
    badge: 'silver'
  },
  {
    id: 'leader4',
    name: 'Maya Patel',
    username: 'mayapatel',
    fundsRaised: 1400,
    distance: 71.2,
    vertical: 9900,
    rank: 4,
    team: 'Powder Heroes',
    badge: 'bronze'
  },
  {
    id: 'leader5',
    name: 'Chris Wilson',
    username: 'chriswilson',
    fundsRaised: 1200,
    distance: 68.7,
    vertical: 9400,
    rank: 5,
    team: 'Mountain Mavericks'
  }
];

export function SkiForACureEvent({
  currentUser,
  onUpgrade,
  onJoinEvent,
  onJoinTeam,
  onCreateTeam,
  onDonate,
  onClose
}: SkiForACureEventProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'teams' | 'leaderboard' | 'fundraising'>('overview');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [fundsRaised, setFundsRaised] = useState(skiForACureEvent.userFundsRaised);
  const [showDonateOptions, setShowDonateOptions] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showMiniPage, setShowMiniPage] = useState(false);
  const [userParticipation, setUserParticipation] = useState<{
    type: 'individual' | 'team' | 'business' | null;
    data?: any;
  }>({ type: null });

  const hasProFeatures = hasFeature(currentUser, 'advanced_analytics');
  const fundingProgress = (skiForACureEvent.totalFundsRaised / skiForACureEvent.fundingGoal) * 100;
  const participantProgress = (skiForACureEvent.totalParticipants / skiForACureEvent.maxParticipants) * 100;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random increases to simulate live fundraising
      setFundsRaised(prev => prev + Math.random() * 10);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleJoinEvent = () => {
    onJoinEvent?.(skiForACureEvent.id);
    setShowJoinDialog(false);
  };

  const handleDonate = (amount: number) => {
    onDonate?.(amount);
    setFundsRaised(prev => prev + amount);
    setShowDonateOptions(false);
  };

  const handleSignupComplete = (signupData: any) => {
    console.log('Signup completed:', signupData);
    setUserParticipation({ 
      type: signupData.type, 
      data: signupData 
    });
    setShowSignup(false);
    // Show success message or redirect to admin panel
    setTimeout(() => setShowAdminPanel(true), 1000);
  };

  const handleShowAdminPanel = () => {
    setShowAdminPanel(true);
  };

  const handleShowMiniPage = () => {
    setShowMiniPage(true);
  };

  // If showing signup modal
  if (showSignup) {
    return (
      <SkiForACureSignup
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSignupComplete={handleSignupComplete}
      />
    );
  }

  // If showing admin panel
  if (showAdminPanel && userParticipation.type) {
    if (userParticipation.type === 'individual') {
      return (
        <IndividualAdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          participantData={{
            name: userParticipation.data?.name || 'John Doe',
            email: userParticipation.data?.email || 'john@example.com',
            joinDate: '2025-01-15',
            stats: {
              totalVertical: 3240,
              totalRuns: 28,
              totalTime: 14400,
              averageSpeed: 32.5,
              fundraised: 850,
              target: 2000,
              donations: 12,
              rank: 156,
              personalBest: 1240
            }
          }}
        />
      );
    } else if (userParticipation.type === 'team') {
      return (
        <TeamAdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          teamData={{
            name: userParticipation.data?.teamName || 'Powder Chasers',
            description: userParticipation.data?.description || 'Amazing team description',
            logo: undefined,
            website: userParticipation.data?.website,
            createdDate: '2025-01-15',
            stats: {
              totalVertical: 45680,
              totalMembers: 12,
              activeMembers: 10,
              totalFundraised: 8500,
              fundraisingTarget: 15000,
              teamRank: 3,
              averageVertical: 3807
            },
            members: [
              {
                id: '1',
                name: userParticipation.data?.name || 'Team Admin',
                email: userParticipation.data?.email || 'admin@team.com',
                joinDate: '2025-01-15',
                totalVertical: 12450,
                totalRuns: 45,
                fundraised: 2100,
                isActive: true,
                lastActivity: '2 hours ago',
                role: 'admin'
              }
              // Add more mock members as needed
            ]
          }}
        />
      );
    } else if (userParticipation.type === 'business') {
      return (
        <BusinessAdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          businessData={{
            name: userParticipation.data?.businessName || 'TechNova Solutions',
            description: userParticipation.data?.description || 'Amazing business description',
            logo: undefined,
            website: userParticipation.data?.website,
            industry: 'Technology',
            size: '50-100 employees',
            createdDate: '2025-01-15',
            stats: {
              totalVertical: 89450,
              totalEmployees: 28,
              activeEmployees: 24,
              totalFundraised: 25000,
              fundraisingTarget: 50000,
              corporateRank: 1,
              averageVertical: 3195,
              sponsorshipTier: 'Gold',
              totalTeams: 4
            },
            employees: [
              {
                id: '1',
                name: userParticipation.data?.name || 'Business Admin',
                email: userParticipation.data?.email || 'admin@business.com',
                department: 'Management',
                joinDate: '2025-01-15',
                totalVertical: 15200,
                totalRuns: 52,
                fundraised: 3500,
                isActive: true,
                lastActivity: '1 hour ago',
                role: 'admin'
              }
              // Add more mock employees as needed
            ],
            teams: [
              {
                id: '1',
                name: 'Engineering Team',
                department: 'Engineering',
                managerId: '1',
                memberCount: 8,
                totalVertical: 32400,
                totalFundraised: 8500,
                isActive: true
              }
              // Add more mock teams as needed
            ]
          }}
        />
      );
    }
  }

  // If showing mini page
  if (showMiniPage) {
    const miniPageData = userParticipation.type === 'team' ? mockTeamData : mockBusinessData;
    return (
      <CustomizableMiniPage
        data={miniPageData}
        isPreview={true}
        onEdit={() => setShowMiniPage(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{skiForACureEvent.name}</h1>
                <p className="text-red-100">Supporting Cancer Research NZ</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{skiForACureEvent.totalParticipants.toLocaleString()}</div>
              <div className="text-red-100 text-sm">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${(skiForACureEvent.totalFundsRaised / 1000).toFixed(0)}k</div>
              <div className="text-red-100 text-sm">Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{skiForACureEvent.daysRemaining}</div>
              <div className="text-red-100 text-sm">Days Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{skiForACureEvent.resorts.length}</div>
              <div className="text-red-100 text-sm">Ski Fields</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Event Description */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {skiForACureEvent.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    {skiForACureEvent.startDate} - {skiForACureEvent.endDate}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    <MapPin className="w-3 h-3 mr-1" />
                    All NZ Ski Fields
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    <Heart className="w-3 h-3 mr-1" />
                    Cancer Research
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  Fundraising Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{fundingProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={fundingProgress} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${skiForACureEvent.totalFundsRaised.toLocaleString()} raised</span>
                    <span>${skiForACureEvent.fundingGoal.toLocaleString()} goal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Participation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Registered</span>
                    <span>{participantProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={participantProgress} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{skiForACureEvent.totalParticipants.toLocaleString()} participants</span>
                    <span>{skiForACureEvent.maxParticipants.toLocaleString()} capacity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Event Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Charity Fundraising</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Team Competition</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">Individual Ranking</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium">Live Tracking</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium">Leaderboards</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Social Sharing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={() => setShowSignup(true)}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Join the Event
            </Button>
            
            {userParticipation.type && (
              <Button 
                onClick={handleShowAdminPanel}
                variant="outline" 
                className="flex-1"
                size="lg"
              >
                <Settings className="w-5 h-5 mr-2" />
                My Admin Panel
              </Button>
            )}
            
            {(userParticipation.type === 'team' || userParticipation.type === 'business') && (
              <Button 
                onClick={handleShowMiniPage}
                variant="outline" 
                className="flex-1"
                size="lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                View My Page
              </Button>
            )}
          </div>

          {/* Participation Status */}
          {userParticipation.type && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    You're participating as: {userParticipation.type === 'individual' ? 'Individual' : userParticipation.type === 'team' ? 'Team Leader' : 'Business Admin'}
                  </p>
                  <p className="text-sm text-green-600">
                    Access your admin panel to manage your participation and track progress
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}