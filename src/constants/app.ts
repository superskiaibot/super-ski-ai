import { Home, Activity, Users, Settings as SettingsIcon, BarChart3, User, Heart } from 'lucide-react';
import { SavedRun } from '../types/index';

// Session and storage keys
export const STORAGE_KEYS = {
  SESSION: 'snowline-tracking-session',
  TUTORIAL_COMPLETED: 'snowline-tutorial-completed',
  USER_FIRST_VISIT: 'snowline-user-first-visit',
} as const;

// Navigation configuration - Updated to swap Social and Ski For A Cure
export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
  { id: 'social', label: 'Social', icon: Users, badge: null },
  { id: 'tracking', label: 'Track', icon: Activity, badge: null },
  { id: 'skiforacure', label: 'Ski For A Cure', icon: Heart, badge: null },
  { id: 'leaderboards', label: 'Rankings', icon: BarChart3, badge: null },
  { id: 'profile', label: 'Profile', icon: User, badge: null },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: null }
] as const;

// Sample runs data factory
export const createSampleRuns = (userId: string): SavedRun[] => [
  {
    id: 'run_1',
    userId,
    name: 'Morning Glory Run',
    description: 'Perfect powder conditions on the upper mountain',
    startTime: new Date('2024-01-15T09:30:00'),
    endTime: new Date('2024-01-15T11:45:00'),
    stats: {
      duration: 8100,
      distance: 12.3,
      vertical: 1240,
      maxSpeed: 62.4,
      averageSpeed: 28.7,
      difficulty: 'black'
    },
    resort: {
      id: 'coronetpeak',
      name: 'Coronet Peak',
      location: 'Queenstown, South Island'
    },
    likes: 18,
    shares: 3,
    comments: 5,
    isPublic: true,
    isFeatured: true,
    privacy: 'public',
    weather: {
      temperature: -5,
      conditions: 'Fresh Snow',
      visibility: 'excellent'
    }
  },
  {
    id: 'run_2',
    userId,
    name: 'Afternoon Cruiser',
    description: 'Relaxed run down the blues with friends',
    startTime: new Date('2024-01-14T14:20:00'),
    endTime: new Date('2024-01-14T16:10:00'),
    stats: {
      duration: 6600,
      distance: 8.7,
      vertical: 890,
      maxSpeed: 48.2,
      averageSpeed: 24.1,
      difficulty: 'blue'
    },
    resort: {
      id: 'remarkables',
      name: 'The Remarkables',
      location: 'Queenstown, South Island'
    },
    likes: 12,
    shares: 2,
    comments: 3,
    isPublic: true,
    isFeatured: false,
    privacy: 'public',
    weather: {
      temperature: -2,
      conditions: 'Partly Cloudy',
      visibility: 'good'
    }
  }
];

// App configuration
export const APP_CONFIG = {
  MOBILE_BREAKPOINT: 1024,
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  TUTORIAL_DELAY: 2000,
  RESIZE_THROTTLE_DELAY: 100,
  SESSION_SAVE_THROTTLE: 500,
} as const;