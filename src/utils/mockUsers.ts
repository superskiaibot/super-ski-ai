import { User } from '../types/index';

// Mock users for different account types with enhanced friend functionality
export const MOCK_USERS = {
  // Normal user account - Basic plan (Sarah Peterson)
  normalUser: {
    id: 'user_normal_001',
    username: 'sarahski',
    displayName: 'Sarah Peterson',
    name: 'Sarah Peterson',
    email: 'sarah@example.com',
    avatar: undefined,
    level: 'intermediate' as const,
    accountType: 'individual' as const,
    role: {
      type: 'user' as const,
      permissions: [
        'user:track_skiing',
        'user:social_features',
        'user:view_stats',
        'user:save_runs'
      ],
      isActive: true,
      assignedAt: new Date('2024-01-10')
    },
    isVerified: false, // Basic user
    followers: ['user_advanced_002'],
    following: ['user_advanced_002'],
    friends: ['user_advanced_002'],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    createdAt: new Date('2024-01-10T08:30:00Z'),
    updatedAt: new Date('2024-01-15T14:22:00Z'),
    preferences: {
      units: 'metric' as const,
      language: 'en',
      notifications: {
        push: true,
        email: true,
        weather: true,
        social: true,
        achievements: true,
        followers: true,
        comments: true,
        likes: true
      },
      privacy: {
        shareLocation: true,
        shareStats: true,
        publicProfile: true,
        allowFollowers: true,
        allowComments: true,
        allowDownloads: false
      },
      equipment: {
        type: 'alpine' as const,
        brand: 'Rossignol',
        model: 'Experience 88 TI',
        length: 160,
        bindings: 'Look SPX 12'
      },
      recording: {
        autoLiftDetection: true,
        jumpDetection: false,
        crashDetection: true,
        voiceCoaching: false,
        audioFeedback: true,
        gpsUpdateRate: 2,
        heartRateMonitoring: false,
        autoSave: true,
        videoRecording: false,
        shareByDefault: true
      }
    },
    profile: {
      displayName: 'Sarah Peterson',
      bio: 'Weekend warrior hitting the slopes of the South Island. Always up for fresh powder and new adventures!',
      location: 'Queenstown, South Island',
      website: '',
      isPublic: true,
      featuredRuns: [],
      badges: [],
      highlights: []
    },
    stats: {
      totalDistance: 45.2,
      totalVertical: 8600,
      totalRuns: 15,
      maxSpeed: 58.4,
      averageSpeed: 28.7,
      totalDuration: 14200, // ~4 hours
      favoriteResort: 'Coronet Peak',
      skillLevel: 'intermediate',
      totalDays: 6,
      totalVideos: 2,
      totalLikes: 89
    }
  },

  // Advanced user with Pro subscription (Mike Chen)
  advancedUser: {
    id: 'user_advanced_002',
    username: 'mikepowder',
    displayName: 'Mike Chen',
    name: 'Mike Chen', 
    email: 'mike@example.com',
    avatar: undefined,
    level: 'advanced' as const,
    accountType: 'individual' as const,
    role: {
      type: 'user' as const,
      permissions: [
        'user:track_skiing',
        'user:social_features',
        'user:view_stats',
        'user:save_runs',
        'user:pro_features'
      ],
      isActive: true,
      assignedAt: new Date('2023-11-15')
    },
    isVerified: true, // Pro user
    followers: ['user_normal_001'],
    following: ['user_normal_001'],
    friends: ['user_normal_001'],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    createdAt: new Date('2023-11-15T10:15:00Z'),
    updatedAt: new Date('2024-01-14T09:45:00Z'),
    preferences: {
      units: 'metric' as const,
      language: 'en',
      notifications: {
        push: true,
        email: true,
        weather: true,
        social: true,
        achievements: true,
        followers: true,
        comments: true,
        likes: true
      },
      privacy: {
        shareLocation: true,
        shareStats: true,
        publicProfile: true,
        allowFollowers: true,
        allowComments: true,
        allowDownloads: true
      },
      equipment: {
        type: 'alpine' as const,
        brand: 'Salomon',
        model: 'QST 106',
        length: 180,
        bindings: 'Salomon STH2 16'
      },
      recording: {
        autoLiftDetection: true,
        jumpDetection: true,
        crashDetection: true,
        voiceCoaching: true,
        audioFeedback: true,
        gpsUpdateRate: 1,
        heartRateMonitoring: true,
        autoSave: true,
        videoRecording: true,
        shareByDefault: true
      }
    },
    profile: {
      displayName: 'Mike Chen',
      bio: 'Chasing powder from Craigieburn to Treble Cone. Backcountry enthusiast and aspiring ski guide.',
      location: 'Christchurch, South Island',
      website: 'https://powderhunter.blog',
      isPublic: true,
      featuredRuns: ['run_advanced_001', 'run_advanced_002'],
      badges: [],
      highlights: []
    },
    stats: {
      totalDistance: 245.7,
      totalVertical: 32400,
      totalRuns: 89,
      maxSpeed: 84.7,
      averageSpeed: 41.3,
      totalDuration: 67200, // ~18.5 hours
      favoriteResort: 'Craigieburn',
      skillLevel: 'advanced',
      totalDays: 24,
      totalVideos: 15,
      totalLikes: 892
    }
  },



  // Ski Field Admin (Lisa Rodriguez)
  skiFieldAdmin: {
    id: 'admin_coronet_001',
    username: 'coronetadmin',
    displayName: 'Lisa Rodriguez',
    name: 'Lisa Rodriguez',
    email: 'lisa@coronetpeak.co.nz',
    avatar: undefined,
    level: 'expert' as const,
    accountType: 'business' as const,
    role: {
      type: 'ski_field_admin' as const,
      permissions: [
        'admin:manage_ski_field',
        'admin:view_analytics', 
        'admin:manage_lifts',
        'admin:manage_trails',
        'admin:weather_updates',
        'admin:staff_management',
        'user:track_skiing',
        'user:social_features',
        'user:view_stats',
        'user:save_runs',
        'user:pro_features'
      ],
      assignedSkiFields: ['coronetpeak', 'remarkables'],
      isActive: true,
      assignedAt: new Date('2023-06-15'),
      assignedBy: 'platform_admin_001'
    },
    isVerified: true, // Business account
    followers: ['user_normal_001', 'user_advanced_002'],
    following: ['user_normal_001', 'user_advanced_002'],
    friends: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    createdAt: new Date('2023-06-15T09:00:00Z'),
    updatedAt: new Date('2024-01-08T07:30:00Z'),
    businessProfile: {
      companyName: 'Coronet Peak Ski Area',
      companyType: 'resort' as const,
      website: 'https://coronetpeak.co.nz',
      description: 'Official operations account for Coronet Peak. Providing updates on lifts, trails, and mountain conditions.',
      location: 'Queenstown, South Island',
      services: ['Ski Area Operations', 'Lift Operations', 'Trail Management', 'Snow Making'],
      contactInfo: {
        phone: '+64 3 450 1970',
        email: 'info@coronetpeak.co.nz',
        address: 'Coronet Peak Road, Queenstown 9300'
      },
      socialMedia: {
        instagram: '@coronetpeak',
        facebook: 'CoronetPeak',
        youtube: 'CoronetPeakOfficial'
      },
      isVerified: true,
      certifications: ['NZSki Operations', 'Lift Safety Certified'],
      operatingHours: 'Daily 9:00am - 4:00pm (Winter Season)',
      seasonalInfo: 'Open June - October (Weather Dependent)'
    },
    preferences: {
      units: 'metric' as const,
      language: 'en',
      notifications: {
        push: true,
        email: true,
        weather: true,
        social: false,
        achievements: false,
        followers: false,
        comments: true,
        likes: false
      },
      privacy: {
        shareLocation: true,
        shareStats: false,
        publicProfile: true,
        allowFollowers: true,
        allowComments: true,
        allowDownloads: false
      },
      equipment: {
        type: 'alpine' as const,
        brand: 'Salomon',
        model: 'S/Max 12',
        length: 175,
        bindings: 'Salomon Z12'
      },
      recording: {
        autoLiftDetection: true,
        jumpDetection: false,
        crashDetection: true,
        voiceCoaching: false,
        audioFeedback: false,
        gpsUpdateRate: 2,
        heartRateMonitoring: false,
        autoSave: true,
        videoRecording: false,
        shareByDefault: false
      }
    },
    profile: {
      displayName: 'Lisa Rodriguez',
      bio: 'Ski Field Operations Manager at Coronet Peak & The Remarkables. Ensuring safe and enjoyable skiing for all our guests.',
      location: 'Queenstown, South Island',
      website: 'https://coronetpeak.co.nz',
      isPublic: true,
      featuredRuns: [],
      badges: [],
      highlights: []
    },
    stats: {
      totalDistance: 892.4,
      totalVertical: 78900,
      totalRuns: 189,
      maxSpeed: 76.4,
      averageSpeed: 42.1,
      totalDuration: 134400, // ~37 hours
      favoriteResort: 'Coronet Peak',
      skillLevel: 'expert',
      totalDays: 45,
      totalVideos: 12,
      totalLikes: 567
    }
  },

  // Platform Admin (Alex Rider)
  platformAdmin: {
    id: 'platform_admin_001',
    username: 'alexrider',
    displayName: 'Alex Rider',
    name: 'Alex Rider',
    email: 'alex@snowline.app',
    avatar: undefined,
    level: 'expert' as const,
    accountType: 'business' as const,
    role: {
      type: 'platform_admin' as const,
      permissions: [
        'admin:full_access',
        'admin:manage_users',
        'admin:manage_ski_fields',
        'admin:view_all_analytics',
        'admin:system_control',
        'admin:audit_logs',
        'admin:platform_settings',
        'user:track_skiing',
        'user:social_features',
        'user:view_stats',
        'user:save_runs',
        'user:pro_features'
      ],
      isActive: true,
      assignedAt: new Date('2023-01-01'),
    },
    isVerified: true, // Admin account
    followers: [],
    following: [],
    friends: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-07T12:00:00Z'),
    businessProfile: {
      companyName: 'Snowline Platform',
      companyType: 'other' as const,
      website: 'https://snowline.app',
      description: 'Platform administration account for Snowline ski tracking application.',
      location: 'New Zealand',
      services: ['Platform Administration', 'User Support', 'System Maintenance'],
      contactInfo: {
        email: 'support@snowline.app'
      },
      socialMedia: {},
      isVerified: true,
      certifications: ['Platform Administrator']
    },
    preferences: {
      units: 'metric' as const,
      language: 'en',
      notifications: {
        push: false,
        email: true,
        weather: false,
        social: false,
        achievements: false,
        followers: false,
        comments: false,
        likes: false
      },
      privacy: {
        shareLocation: false,
        shareStats: false,
        publicProfile: false,
        allowFollowers: false,
        allowComments: false,
        allowDownloads: false
      },
      equipment: {
        type: 'alpine' as const,
        brand: 'Administrator',
        model: 'System Account',
        length: 0,
        bindings: 'N/A'
      },
      recording: {
        autoLiftDetection: false,
        jumpDetection: false,
        crashDetection: false,
        voiceCoaching: false,
        audioFeedback: false,
        gpsUpdateRate: 5,
        heartRateMonitoring: false,
        autoSave: false,
        videoRecording: false,
        shareByDefault: false
      }
    },
    profile: {
      displayName: 'Alex Rider',
      bio: 'Platform administration account for system management and support.',
      location: 'New Zealand',
      website: 'https://snowline.app',
      isPublic: false,
      featuredRuns: [],
      badges: [],
      highlights: []
    },
    stats: {
      totalDistance: 0,
      totalVertical: 0,
      totalRuns: 0,
      maxSpeed: 0,
      averageSpeed: 0,
      totalDuration: 0,
      favoriteResort: '',
      skillLevel: 'expert',
      totalDays: 0,
      totalVideos: 0,
      totalLikes: 0
    }
  }
};

// Helper function to get user by account type
export const getUserByType = (type: 'user' | 'ski_field_admin' | 'platform_admin'): User => {
  switch (type) {
    case 'user':
      return MOCK_USERS.normalUser;
    case 'ski_field_admin':
      return MOCK_USERS.skiFieldAdmin;
    case 'platform_admin':
      return MOCK_USERS.platformAdmin;
    default:
      return MOCK_USERS.normalUser;
  }
};

// Get all users as an array for search functionality
export const getAllMockUsers = (): User[] => {
  return Object.values(MOCK_USERS);
};

// Get users by skill level
export const getUsersBySkillLevel = (level: 'beginner' | 'intermediate' | 'advanced' | 'expert'): User[] => {
  return getAllMockUsers().filter(user => user.level === level);
};

// Get users by subscription type
export const getUsersBySubscription = (isPro: boolean): User[] => {
  return getAllMockUsers().filter(user => user.isVerified === isPro);
};

// Get verified (Pro) users
export const getVerifiedUsers = (): User[] => {
  return getAllMockUsers().filter(user => user.isVerified);
};

// Get users by location (partial match)
export const getUsersByLocation = (location: string): User[] => {
  const searchLocation = location.toLowerCase();
  return getAllMockUsers().filter(user => 
    user.profile?.location?.toLowerCase().includes(searchLocation)
  );
};