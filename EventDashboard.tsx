import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mountain,
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  Flag,
  Target,
  Star,
  Heart,
  Share2,
  Settings,
  Plus,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Award,
  Medal,
  Crown,
  Zap,
  Activity,
  TrendingUp,
  Eye,
  MessageSquare,
  UserPlus,
  Check,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Timer,
  Route,
  Gauge,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { EventTracking } from './tracking/EventTracking';
import { User, SavedRun } from '../src/types/index';
import { Resort } from './tracking/types';
import { hasFeature } from '../src/utils/featureGates';

interface EventDetails {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  resort: Resort;
  type: 'race' | 'freeride' | 'challenge' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'active' | 'finished' | 'cancelled';
  organizer: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  rules?: string[];
  prizes?: string[];
  entryFee?: number;
  isJoined?: boolean;
  isOrganizer?: boolean;
  image?: string;
  tags?: string[];
  checkpoints?: Array<{
    id: string;
    name: string;
    location: { latitude: number; longitude: number };
    order: number;
  }>;
}

interface EventDashboardProps {
  currentUser: User;
  onUpgrade?: () => void;
  runs: SavedRun[];
  onSaveRun: (run: SavedRun) => void;
  onBack?: () => void;
}

// Mock events data
const mockEvents: EventDetails[] = [
  {
    id: 'event_1',
    name: 'Coronet Peak Spring Challenge',
    description: 'Join us for an epic spring skiing challenge down Coronet Peak\'s best runs. Test your skills against fellow skiers in this fun, competitive event.',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    resort: {
      id: 'coronetpeak',
      name: 'Coronet Peak',
      location: 'Queenstown, South Island',
      elevation: 1649,
      latitude: -45.032,
      longitude: 168.662,
      difficulty: 'intermediate',
      temperature: -5,
      weatherCondition: 'Fresh Snow',
      snowDepth: 85,
      trailsOpen: 24,
      totalTrails: 28,
      liftsOpen: 4,
      totalLifts: 4
    },
    type: 'challenge',
    difficulty: 'intermediate',
    maxParticipants: 50,
    currentParticipants: 23,
    status: 'upcoming',
    organizer: {
      id: 'organizer1',
      name: 'Sarah Chen',
      username: 'sarahski',
      avatar: '/avatars/sarah.jpg'
    },
    rules: [
      'Must complete at least 3 designated runs',
      'Speed and style will be judged',
      'Safety equipment required',
      'Respect other skiers and resort rules'
    ],
    prizes: ['$500 Gift Card', 'Snowline Pro Membership', 'Custom Ski Gear'],
    entryFee: 25,
    isJoined: false,
    isOrganizer: false,
    image: '/events/coronet-challenge.jpg',
    tags: ['Challenge', 'Intermediate', 'Prizes', 'Fun'],
    checkpoints: [
      { id: 'start', name: 'Start Line', location: { latitude: -45.032, longitude: 168.662 }, order: 1 },
      { id: 'checkpoint1', name: 'Mid Station', location: { latitude: -45.031, longitude: 168.663 }, order: 2 },
      { id: 'checkpoint2', name: 'Vista Point', location: { latitude: -45.030, longitude: 168.664 }, order: 3 },
      { id: 'finish', name: 'Finish Line', location: { latitude: -45.029, longitude: 168.665 }, order: 4 }
    ]
  },
  {
    id: 'event_2',
    name: 'The Remarkables Powder Hunt',
    description: 'Early morning powder hunting session at The Remarkables. Find the best untouched snow and show off your off-piste skills.',
    startTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    resort: {
      id: 'remarkables',
      name: 'The Remarkables',
      location: 'Queenstown, South Island',
      elevation: 2000,
      latitude: -45.031,
      longitude: 168.750,
      difficulty: 'advanced',
      temperature: -8,
      weatherCondition: 'Fresh Snow',
      snowDepth: 120,
      trailsOpen: 30,
      totalTrails: 35,
      liftsOpen: 5,
      totalLifts: 6
    },
    type: 'freeride',
    difficulty: 'advanced',
    maxParticipants: 20,
    currentParticipants: 8,
    status: 'upcoming',
    organizer: {
      id: 'organizer2',
      name: 'Marcus Johnson',
      username: 'powderhound',
      avatar: '/avatars/marcus.jpg'
    },
    rules: [
      'Advanced skiers only',
      'Must stay with group',
      'Avalanche safety gear required',
      'Early start - 6:00 AM'
    ],
    isJoined: true,
    isOrganizer: false,
    image: '/events/remarkables-powder.jpg',
    tags: ['Freeride', 'Advanced', 'Powder', 'Early Start']
  },
  {
    id: 'event_3',
    name: 'Social Sunday at Cardrona',
    description: 'Relaxed social skiing day at Cardrona. Perfect for meeting new people and enjoying the mountain together. All skill levels welcome!',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    resort: {
      id: 'cardrona',
      name: 'Cardrona Alpine Resort',
      location: 'Wānaka, South Island',
      elevation: 1894,
      latitude: -44.894,
      longitude: 169.181,
      difficulty: 'beginner',
      temperature: -3,
      weatherCondition: 'Partly Cloudy',
      snowDepth: 65,
      trailsOpen: 20,
      totalTrails: 25,
      liftsOpen: 3,
      totalLifts: 4
    },
    type: 'social',
    difficulty: 'beginner',
    maxParticipants: 100,
    currentParticipants: 45,
    status: 'upcoming',
    organizer: {
      id: 'organizer3',
      name: 'Emma Wilson',
      username: 'skiemma',
      avatar: '/avatars/emma.jpg'
    },
    rules: [
      'All skill levels welcome',
      'Group lunch included',
      'Respect mountain safety',
      'Have fun and make friends!'
    ],
    entryFee: 15,
    isJoined: false,
    isOrganizer: false,
    image: '/events/cardrona-social.jpg',
    tags: ['Social', 'All Levels', 'Lunch', 'Friends']
  },
  {
    id: 'event_4',
    name: 'Pro Ski Race Championship',
    description: 'Elite racing event featuring New Zealand\'s top ski racers. Spectators welcome to watch world-class skiing in action.',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (active)
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    resort: {
      id: 'coronetpeak',
      name: 'Coronet Peak',
      location: 'Queenstown, South Island',
      elevation: 1649,
      latitude: -45.032,
      longitude: 168.662,
      difficulty: 'expert',
      temperature: -6,
      weatherCondition: 'Clear',
      snowDepth: 90,
      trailsOpen: 28,
      totalTrails: 28,
      liftsOpen: 4,
      totalLifts: 4
    },
    type: 'race',
    difficulty: 'expert',
    maxParticipants: 30,
    currentParticipants: 28,
    status: 'active',
    organizer: {
      id: 'organizer4',
      name: 'Racing NZ',
      username: 'racingnz',
      avatar: '/avatars/racing.jpg'
    },
    rules: [
      'Professional racers only',
      'FIS certified equipment required',
      'Medical clearance mandatory',
      'Strictly timed event'
    ],
    prizes: ['$5000 Prize Pool', 'FIS Points', 'Sponsorship Opportunities'],
    isJoined: true,
    isOrganizer: false,
    image: '/events/pro-race.jpg',
    tags: ['Race', 'Professional', 'Elite', 'FIS']
  },
  {
    id: 'event_5',
    name: 'Beginner\'s First Tracks',
    description: 'A gentle introduction to skiing at Treble Cone. Perfect for absolute beginners with experienced instructors and buddy system.',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    resort: {
      id: 'treblecone',
      name: 'Treble Cone',
      location: 'Wānaka, South Island',
      elevation: 2088,
      latitude: -44.741,
      longitude: 169.058,
      difficulty: 'beginner',
      temperature: -4,
      weatherCondition: 'Overcast',
      snowDepth: 75,
      trailsOpen: 18,
      totalTrails: 22,
      liftsOpen: 3,
      totalLifts: 4
    },
    type: 'social',
    difficulty: 'beginner',
    maxParticipants: 25,
    currentParticipants: 12,
    status: 'upcoming',
    organizer: {
      id: 'organizer5',
      name: 'Katie Adams',
      username: 'learntoski',
      avatar: '/avatars/katie.jpg'
    },
    rules: [
      'Beginner level only',
      'Helmet required',
      'Instruction included',
      'No previous experience needed'
    ],
    entryFee: 40,
    isJoined: false,
    isOrganizer: false,
    image: '/events/beginner-tracks.jpg',
    tags: ['Beginner', 'Instruction', 'Safe', 'Learning']
  },
  {
    id: 'event_6',
    name: 'Midnight Mogul Madness',
    description: 'Night skiing adventure at Mt Hutt under the lights. Navigate challenging mogul fields in this unique after-dark experience.',
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    resort: {
      id: 'mthutt',
      name: 'Mt Hutt',
      location: 'Canterbury, South Island',
      elevation: 2086,
      latitude: -43.608,
      longitude: 171.569,
      difficulty: 'advanced',
      temperature: -7,
      weatherCondition: 'Clear',
      snowDepth: 110,
      trailsOpen: 25,
      totalTrails: 30,
      liftsOpen: 4,
      totalLifts: 5
    },
    type: 'challenge',
    difficulty: 'advanced',
    maxParticipants: 40,
    currentParticipants: 31,
    status: 'upcoming',
    organizer: {
      id: 'organizer6',
      name: 'Jake Thompson',
      username: 'nightskier',
      avatar: '/avatars/jake.jpg'
    },
    rules: [
      'Advanced skiing ability required',
      'Head torch mandatory',
      'Reflective gear provided',
      'No alcohol before event'
    ],
    prizes: ['Night Vision Goggles', 'Mt Hutt Season Pass', 'LED Ski Gear'],
    entryFee: 35,
    isJoined: false,
    isOrganizer: false,
    image: '/events/night-moguls.jpg',
    tags: ['Night Skiing', 'Advanced', 'Unique', 'Moguls']
  },
  {
    id: 'event_7',
    name: 'Family Fun Day',
    description: 'A perfect family skiing event at Porters with activities for all ages. Kids\' races, treasure hunts, and hot chocolate stations.',
    startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    resort: {
      id: 'porters',
      name: 'Porters Ski Area',
      location: 'Canterbury, South Island',
      elevation: 1950,
      latitude: -43.280,
      longitude: 171.876,
      difficulty: 'beginner',
      temperature: -2,
      weatherCondition: 'Sunny',
      snowDepth: 80,
      trailsOpen: 15,
      totalTrails: 18,
      liftsOpen: 3,
      totalLifts: 4
    },
    type: 'social',
    difficulty: 'beginner',
    maxParticipants: 80,
    currentParticipants: 55,
    status: 'upcoming',
    organizer: {
      id: 'organizer7',
      name: 'Family Ski Club',
      username: 'familyski',
      avatar: '/avatars/family.jpg'
    },
    rules: [
      'Family-friendly event',
      'Children must be supervised',
      'All skill levels welcome',
      'Free activities for kids under 10'
    ],
    entryFee: 20,
    isJoined: true,
    isOrganizer: false,
    image: '/events/family-fun.jpg',
    tags: ['Family', 'Kids', 'Fun', 'All Ages']
  },
  {
    id: 'event_8',
    name: 'Extreme Backcountry Expedition',
    description: 'Expert-only backcountry skiing adventure at Craigieburn Range. Helicopter access to untouched powder fields.',
    startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    resort: {
      id: 'craigieburn',
      name: 'Craigieburn Forest Park',
      location: 'Canterbury, South Island',
      elevation: 2200,
      latitude: -43.157,
      longitude: 171.724,
      difficulty: 'expert',
      temperature: -12,
      weatherCondition: 'Fresh Snow',
      snowDepth: 180,
      trailsOpen: 8,
      totalTrails: 12,
      liftsOpen: 2,
      totalLifts: 3
    },
    type: 'freeride',
    difficulty: 'expert',
    maxParticipants: 12,
    currentParticipants: 7,
    status: 'upcoming',
    organizer: {
      id: 'organizer8',
      name: 'Alpine Adventures NZ',
      username: 'alpineadv',
      avatar: '/avatars/alpine.jpg'
    },
    rules: [
      'Expert skiers only',
      'Avalanche certification required',
      'Full safety gear mandatory',
      'Weather dependent - may be cancelled'
    ],
    prizes: ['GoPro Hero12', 'Avalanche Safety Course', 'Heli-Ski Voucher'],
    entryFee: 150,
    isJoined: false,
    isOrganizer: false,
    image: '/events/backcountry.jpg',
    tags: ['Expert', 'Backcountry', 'Helicopter', 'Extreme']
  },
  {
    id: 'event_9',
    name: 'Women\'s Ski Meetup',
    description: 'Empowering women on the slopes! Join fellow female skiers for a supportive group session focused on building confidence and skills.',
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    resort: {
      id: 'remarkables',
      name: 'The Remarkables',
      location: 'Queenstown, South Island',
      elevation: 2000,
      latitude: -45.031,
      longitude: 168.750,
      difficulty: 'intermediate',
      temperature: -5,
      weatherCondition: 'Partly Cloudy',
      snowDepth: 95,
      trailsOpen: 32,
      totalTrails: 35,
      liftsOpen: 5,
      totalLifts: 6
    },
    type: 'social',
    difficulty: 'intermediate',
    maxParticipants: 30,
    currentParticipants: 18,
    status: 'upcoming',
    organizer: {
      id: 'organizer9',
      name: 'Lisa Chen',
      username: 'womenskiing',
      avatar: '/avatars/lisa.jpg'
    },
    rules: [
      'Women only event',
      'Intermediate skiing ability',
      'Supportive environment',
      'Skills coaching included'
    ],
    isJoined: false,
    isOrganizer: false,
    image: '/events/women-ski.jpg',
    tags: ['Women Only', 'Intermediate', 'Supportive', 'Skills']
  },
  {
    id: 'event_10',
    name: 'Photography Ski Safari',
    description: 'Combine your love of skiing and photography on this guided tour of Coronet Peak\'s most scenic spots. Perfect for content creators.',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    resort: {
      id: 'coronetpeak',
      name: 'Coronet Peak',
      location: 'Queenstown, South Island',
      elevation: 1649,
      latitude: -45.032,
      longitude: 168.662,
      difficulty: 'intermediate',
      temperature: -3,
      weatherCondition: 'Sunny',
      snowDepth: 85,
      trailsOpen: 26,
      totalTrails: 28,
      liftsOpen: 4,
      totalLifts: 4
    },
    type: 'social',
    difficulty: 'intermediate',
    maxParticipants: 15,
    currentParticipants: 9,
    status: 'upcoming',
    organizer: {
      id: 'organizer10',
      name: 'Photo Adventures',
      username: 'photoski',
      avatar: '/avatars/photo.jpg'
    },
    rules: [
      'Bring your own camera/phone',
      'Basic photography tips included',
      'Scenic stops planned',
      'Photo sharing encouraged'
    ],
    entryFee: 30,
    isJoined: false,
    isOrganizer: false,
    image: '/events/photo-safari.jpg',
    tags: ['Photography', 'Scenic', 'Creative', 'Social Media']
  },
  {
    id: 'event_11',
    name: 'Speed Demons Race Series',
    description: 'High-speed racing event at Mt Hutt. Multiple timed runs with live leaderboards. Perfect for adrenaline junkies and competitive skiers.',
    startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    resort: {
      id: 'mthutt',
      name: 'Mt Hutt',
      location: 'Canterbury, South Island',
      elevation: 2086,
      latitude: -43.608,
      longitude: 171.569,
      difficulty: 'advanced',
      temperature: -8,
      weatherCondition: 'Clear',
      snowDepth: 115,
      trailsOpen: 28,
      totalTrails: 30,
      liftsOpen: 5,
      totalLifts: 5
    },
    type: 'race',
    difficulty: 'advanced',
    maxParticipants: 60,
    currentParticipants: 42,
    status: 'upcoming',
    organizer: {
      id: 'organizer11',
      name: 'Speed Racing Club',
      username: 'speedrace',
      avatar: '/avatars/speed.jpg'
    },
    rules: [
      'Advanced skiing required',
      'Multiple timed runs',
      'Safety gear mandatory',
      'Live timing system'
    ],
    prizes: ['$1000 Prize Pool', 'Racing Equipment', 'Mt Hutt VIP Pass'],
    entryFee: 50,
    isJoined: false,
    isOrganizer: false,
    image: '/events/speed-race.jpg',
    tags: ['Racing', 'Speed', 'Competition', 'Prizes']
  },
  {
    id: 'event_12',
    name: 'Sunset Skiing & Après',
    description: 'End the day in style with sunset skiing followed by live music and drinks at Cardrona\'s mountain bar. Perfect for après-ski lovers.',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    resort: {
      id: 'cardrona',
      name: 'Cardrona Alpine Resort',
      location: 'Wānaka, South Island',
      elevation: 1894,
      latitude: -44.894,
      longitude: 169.181,
      difficulty: 'intermediate',
      temperature: -1,
      weatherCondition: 'Clear',
      snowDepth: 70,
      trailsOpen: 23,
      totalTrails: 25,
      liftsOpen: 4,
      totalLifts: 4
    },
    type: 'social',
    difficulty: 'intermediate',
    maxParticipants: 75,
    currentParticipants: 48,
    status: 'upcoming',
    organizer: {
      id: 'organizer12',
      name: 'Après Ski Society',
      username: 'apresski',
      avatar: '/avatars/apres.jpg'
    },
    rules: [
      'Evening skiing session',
      'Live music from 6pm',
      'Must be 18+ for bar',
      'Responsible drinking policy'
    ],
    entryFee: 25,
    isJoined: true,
    isOrganizer: false,
    image: '/events/sunset-apres.jpg',
    tags: ['Sunset', 'Après-ski', 'Music', 'Social']
  }
];

export function EventDashboard({ currentUser, onUpgrade, runs, onSaveRun, onBack }: EventDashboardProps) {
  const [events, setEvents] = useState<EventDetails[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'joined' | 'create'>('browse');
  const [filterType, setFilterType] = useState<'all' | 'race' | 'freeride' | 'challenge' | 'social'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Event tracking states
  const [isEventTracking, setIsEventTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isFullscreenTransition, setIsFullscreenTransition] = useState(false);

  // If showing event tracking, render that instead
  if (selectedEvent && selectedEvent.status === 'active') {
    return (
      <EventTracking
        currentUser={currentUser}
        event={selectedEvent}
        isTracking={isEventTracking}
        isPaused={isPaused}
        hasActiveSession={hasActiveSession}
        sessionStartTime={sessionStartTime}
        onStartTracking={() => {
          setIsEventTracking(true);
          setHasActiveSession(true);
          setSessionStartTime(new Date());
        }}
        onPauseTracking={() => {
          setIsEventTracking(false);
          setIsPaused(true);
        }}
        onStopTracking={() => {
          setIsEventTracking(false);
          setIsPaused(false);
        }}
        onSaveRun={onSaveRun}
        onLeaveEvent={() => {
          setSelectedEvent(null);
          setIsEventTracking(false);
          setIsPaused(false);
          setHasActiveSession(false);
          setSessionStartTime(null);
        }}
        onUpgrade={onUpgrade}
        runs={runs}
        isMapFullscreen={isMapFullscreen}
        isFullscreenTransition={isFullscreenTransition}
        onMapFullscreenChange={(fullscreen) => {
          setIsFullscreenTransition(true);
          setIsMapFullscreen(fullscreen);
          setTimeout(() => setIsFullscreenTransition(false), 100);
        }}
      />
    );
  }

  const handleJoinEvent = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, isJoined: true, currentParticipants: event.currentParticipants + 1 }
          : event
      )
    );
  };

  const handleLeaveEvent = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, isJoined: false, currentParticipants: Math.max(0, event.currentParticipants - 1) }
          : event
      )
    );
  };

  const handleStartEvent = (event: EventDetails) => {
    setSelectedEvent(event);
  };

  // Filter events based on current filters
  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || event.difficulty === filterDifficulty;
    const matchesSearch = searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.resort.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesDifficulty && matchesSearch;
  });

  const joinedEvents = events.filter(event => event.isJoined);
  const activeEvents = events.filter(event => event.status === 'active');
  const upcomingEvents = events.filter(event => event.status === 'upcoming');

  const hasProFeatures = hasFeature(currentUser, 'advanced_analytics');

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'race': return 'bg-red-100 text-red-800 border-red-200';
      case 'freeride': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'challenge': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'social': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white animate-pulse';
      case 'upcoming': return 'bg-blue-500 text-white';
      case 'finished': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Ski Events</h1>
              <p className="text-muted-foreground">Join exciting skiing events and competitions</p>
            </div>
          </div>
          
          {activeEvents.length > 0 && (
            <Badge className="bg-green-500 text-white animate-pulse">
              {activeEvents.length} Live Event{activeEvents.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="snowline-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold text-foreground">{events.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="snowline-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold text-green-600">{activeEvents.length}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="snowline-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="text-2xl font-bold text-primary">{joinedEvents.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="snowline-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-orange-600">{upcomingEvents.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Events Banner */}
        {activeEvents.length > 0 && (
          <Card className="snowline-card border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Live Events Happening Now!</h3>
                    <p className="text-green-700">Join active events and compete with other skiers in real-time</p>
                  </div>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-white shadow-lg">
                  <Activity className="w-4 h-4 mr-2" />
                  View Live Events
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger 
              value="browse" 
              className="rounded-lg text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Events
            </TabsTrigger>
            <TabsTrigger 
              value="joined"
              className="rounded-lg text-sm font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Joined Events ({joinedEvents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="create"
              className="rounded-lg text-sm font-medium data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <Card className="snowline-card">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search events, resorts, or organizers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="sm:w-auto"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {showFilters ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Event Type</label>
                        <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="All types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="race">Race</SelectItem>
                            <SelectItem value="freeride">Freeride</SelectItem>
                            <SelectItem value="challenge">Challenge</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
                        <Select value={filterDifficulty} onValueChange={(value) => setFilterDifficulty(value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="All levels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <Card key={event.id} className="snowline-card hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(event.status)}>
                            {event.status === 'active' && <Activity className="w-3 h-3 mr-1" />}
                            {event.status}
                          </Badge>
                          <Badge variant="outline" className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                          <Badge variant="outline" className={getDifficultyColor(event.difficulty)}>
                            {event.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl leading-tight">{event.name}</CardTitle>
                        <CardDescription className="mt-2">{event.description}</CardDescription>
                      </div>
                      
                      {event.isJoined && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                          <Check className="w-3 h-3 mr-1" />
                          Joined
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground truncate">{event.resort.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">
                          {event.startTime.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-muted-foreground">
                          {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-muted-foreground">
                          {event.currentParticipants}/{event.maxParticipants}
                        </span>
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                          {event.organizer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{event.organizer.name}</p>
                        <p className="text-xs text-gray-500">@{event.organizer.username}</p>
                      </div>
                      {event.isOrganizer && (
                        <Badge variant="outline" className="text-xs">
                          Organizer
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Entry Fee */}
                    {event.entryFee && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="text-sm text-yellow-800">Entry Fee:</span>
                        <span className="font-semibold text-yellow-900">${event.entryFee}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {event.status === 'active' ? (
                        <Button 
                          onClick={() => handleStartEvent(event)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          Join Live Event
                        </Button>
                      ) : event.isJoined ? (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={() => handleLeaveEvent(event.id)}
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Leave
                          </Button>
                          <Button variant="outline" className="px-3">
                            <Info className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            onClick={() => handleJoinEvent(event.id)}
                            className="flex-1"
                            disabled={event.currentParticipants >= event.maxParticipants}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            {event.currentParticipants >= event.maxParticipants ? 'Full' : 'Join Event'}
                          </Button>
                          <Button variant="outline" className="px-3">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <Card className="snowline-card">
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search terms or filters to find more events.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterDifficulty('all');
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="joined" className="space-y-6 mt-6">
            {joinedEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {joinedEvents.map(event => (
                  <Card key={event.id} className="snowline-card border-green-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(event.status)}>
                              {event.status === 'active' && <Activity className="w-3 h-3 mr-1" />}
                              {event.status}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <Check className="w-3 h-3 mr-1" />
                              Joined
                            </Badge>
                          </div>
                          <CardTitle>{event.name}</CardTitle>
                          <CardDescription>{event.resort.name}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{event.startTime.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span>{event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {event.status === 'active' ? (
                            <Button 
                              onClick={() => handleStartEvent(event)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Activity className="w-4 h-4 mr-2" />
                              Join Live Event
                            </Button>
                          ) : (
                            <Button variant="outline" className="flex-1">
                              <Info className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            onClick={() => handleLeaveEvent(event.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="snowline-card">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No joined events</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't joined any events yet. Browse available events to get started!
                  </p>
                  <Button onClick={() => setActiveTab('browse')}>
                    <Search className="w-4 h-4 mr-2" />
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6 mt-6">
            <Card className="snowline-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Create New Event
                </CardTitle>
                <CardDescription>
                  Organize your own skiing event and invite others to join
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasProFeatures ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Event Name</label>
                        <Input placeholder="Enter event name..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Event Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="race">Race</SelectItem>
                            <SelectItem value="freeride">Freeride</SelectItem>
                            <SelectItem value="challenge">Challenge</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                      <textarea 
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none"
                        rows={3}
                        placeholder="Describe your event..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Resort</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select resort" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coronetpeak">Coronet Peak</SelectItem>
                            <SelectItem value="remarkables">The Remarkables</SelectItem>
                            <SelectItem value="cardrona">Cardrona Alpine Resort</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Time</label>
                        <Input type="time" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Max Participants</label>
                        <Input type="number" placeholder="50" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Entry Fee ($)</label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                      </Button>
                      <Button variant="outline">
                        Save as Draft
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Pro Feature Required</h3>
                    <p className="text-muted-foreground mb-6">
                      Upgrade to Snowline Pro to create and organize your own skiing events.
                    </p>
                    <Button onClick={onUpgrade}>
                      <Mountain className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}