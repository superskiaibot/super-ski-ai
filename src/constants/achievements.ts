import { Achievement } from '../types/achievements';

export const ACHIEVEMENTS: Achievement[] = [
  // Distance Achievements
  {
    id: 'first-tracks',
    name: 'First Tracks',
    description: 'Complete your first ski run',
    icon: 'Snowflake',
    category: 'distance',
    rarity: 'common',
    requirement: {
      type: 'runs',
      value: 1,
      timeframe: 'total'
    },
    rewards: [
      {
        type: 'badge',
        value: 'rookie-skier',
        description: 'Rookie Skier badge'
      }
    ]
  },
  {
    id: 'distance-10k',
    name: '10K Cruiser',
    description: 'Ski a total of 10 kilometers',
    icon: 'Mountain',
    category: 'distance',
    rarity: 'common',
    requirement: {
      type: 'distance',
      value: 10,
      unit: 'km',
      timeframe: 'total'
    }
  },
  {
    id: 'distance-50k',
    name: 'Distance Warrior',
    description: 'Ski a total of 50 kilometers',
    icon: 'Trophy',
    category: 'distance',
    rarity: 'uncommon',
    requirement: {
      type: 'distance',
      value: 50,
      unit: 'km',
      timeframe: 'total'
    }
  },
  {
    id: 'distance-100k',
    name: 'Century Club',
    description: 'Ski a total of 100 kilometers',
    icon: 'Award',
    category: 'distance',
    rarity: 'rare',
    requirement: {
      type: 'distance',
      value: 100,
      unit: 'km',
      timeframe: 'total'
    },
    rewards: [
      {
        type: 'title',
        value: 'Century Skier',
        description: 'Century Skier title'
      }
    ]
  },
  {
    id: 'marathon-run',
    name: 'Marathon Skier',
    description: 'Complete a single run of 42+ kilometers',
    icon: 'Target',
    category: 'distance',
    rarity: 'epic',
    requirement: {
      type: 'distance',
      value: 42,
      unit: 'km',
      timeframe: 'single_run'
    }
  },

  // Speed Achievements
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Reach 80+ km/h in a single run',
    icon: 'Zap',
    category: 'speed',
    rarity: 'uncommon',
    requirement: {
      type: 'speed',
      value: 80,
      unit: 'km/h',
      timeframe: 'single_run'
    }
  },
  {
    id: 'warp-speed',
    name: 'Warp Speed',
    description: 'Reach 100+ km/h in a single run',
    icon: 'Rocket',
    category: 'speed',
    rarity: 'rare',
    requirement: {
      type: 'speed',
      value: 100,
      unit: 'km/h',
      timeframe: 'single_run'
    }
  },
  {
    id: 'speed-consistency',
    name: 'Consistent Cruiser',
    description: 'Maintain 50+ km/h average speed for a run',
    icon: 'Activity',
    category: 'speed',
    rarity: 'uncommon',
    requirement: {
      type: 'custom',
      value: 50,
      unit: 'km/h',
      condition: 'average_speed',
      timeframe: 'single_run'
    }
  },

  // Vertical Achievements
  {
    id: 'vertical-1000',
    name: 'Elevation Explorer',
    description: 'Gain 1000m vertical in total',
    icon: 'TrendingUp',
    category: 'vertical',
    rarity: 'common',
    requirement: {
      type: 'vertical',
      value: 1000,
      unit: 'm',
      timeframe: 'total'
    }
  },
  {
    id: 'vertical-5000',
    name: 'Mountain Climber',
    description: 'Gain 5000m vertical in total',
    icon: 'Mountain',
    category: 'vertical',
    rarity: 'uncommon',
    requirement: {
      type: 'vertical',
      value: 5000,
      unit: 'm',
      timeframe: 'total'
    }
  },
  {
    id: 'vertical-everest',
    name: 'Everest Conqueror',
    description: 'Gain 8848m vertical in total (Mount Everest height)',
    icon: 'Crown',
    category: 'vertical',
    rarity: 'epic',
    requirement: {
      type: 'vertical',
      value: 8848,
      unit: 'm',
      timeframe: 'total'
    },
    rewards: [
      {
        type: 'title',
        value: 'Summit Master',
        description: 'Summit Master title'
      }
    ]
  },
  {
    id: 'single-day-vertical',
    name: 'Vertical Beast',
    description: 'Gain 2000m vertical in a single day',
    icon: 'Flame',
    category: 'vertical',
    rarity: 'rare',
    requirement: {
      type: 'vertical',
      value: 2000,
      unit: 'm',
      timeframe: 'daily'
    }
  },

  // Resort Achievements
  {
    id: 'resort-explorer',
    name: 'Resort Explorer',
    description: 'Ski at 5 different resorts',
    icon: 'MapPin',
    category: 'resort',
    rarity: 'uncommon',
    requirement: {
      type: 'resorts',
      value: 5,
      timeframe: 'total'
    }
  },
  {
    id: 'nz-completionist',
    name: 'NZ Snow Master',
    description: 'Ski at 10 different New Zealand resorts',
    icon: 'Globe',
    category: 'resort',
    rarity: 'rare',
    requirement: {
      type: 'resorts',
      value: 10,
      timeframe: 'total'
    }
  },
  {
    id: 'queenstown-local',
    name: 'Queenstown Local',
    description: 'Complete 20 runs in Queenstown area (Coronet Peak & Remarkables)',
    icon: 'Heart',
    category: 'resort',
    rarity: 'uncommon',
    requirement: {
      type: 'custom',
      value: 20,
      condition: 'queenstown_runs',
      timeframe: 'total'
    }
  },

  // Social Achievements
  {
    id: 'social-starter',
    name: 'Social Starter',
    description: 'Share your first run publicly',
    icon: 'Share2',
    category: 'social',
    rarity: 'common',
    requirement: {
      type: 'social',
      value: 1,
      condition: 'shared_runs',
      timeframe: 'total'
    }
  },
  {
    id: 'crowd-favorite',
    name: 'Crowd Favorite',
    description: 'Get 50 total likes on your runs',
    icon: 'ThumbsUp',
    category: 'social',
    rarity: 'uncommon',
    requirement: {
      type: 'social',
      value: 50,
      condition: 'total_likes',
      timeframe: 'total'
    }
  },
  {
    id: 'viral-run',
    name: 'Viral Run',
    description: 'Get 25+ likes on a single run',
    icon: 'Star',
    category: 'social',
    rarity: 'rare',
    requirement: {
      type: 'social',
      value: 25,
      condition: 'single_run_likes',
      timeframe: 'single_run'
    }
  },

  // Streak Achievements
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Ski 2 consecutive days',
    icon: 'Calendar',
    category: 'streak',
    rarity: 'common',
    requirement: {
      type: 'streak',
      value: 2,
      unit: 'days',
      timeframe: 'daily'
    }
  },
  {
    id: 'week-long-passion',
    name: 'Week-Long Passion',
    description: 'Ski 7 consecutive days',
    icon: 'Clock',
    category: 'streak',
    rarity: 'rare',
    requirement: {
      type: 'streak',
      value: 7,
      unit: 'days',
      timeframe: 'daily'
    }
  },
  {
    id: 'dedication-master',
    name: 'Dedication Master',
    description: 'Ski 30 consecutive days',
    icon: 'Medal',
    category: 'streak',
    rarity: 'legendary',
    requirement: {
      type: 'streak',
      value: 30,
      unit: 'days',
      timeframe: 'daily'
    },
    rewards: [
      {
        type: 'title',
        value: 'Unstoppable',
        description: 'Unstoppable title'
      }
    ]
  },

  // Special Achievements
  {
    id: 'powder-hound',
    name: 'Powder Hound',
    description: 'Ski on 10 fresh snow days',
    icon: 'CloudSnow',
    category: 'special',
    rarity: 'uncommon',
    requirement: {
      type: 'custom',
      value: 10,
      condition: 'fresh_snow_days',
      timeframe: 'total'
    }
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Start skiing before 8 AM on 5 occasions',
    icon: 'Sunrise',
    category: 'special',
    rarity: 'uncommon',
    requirement: {
      type: 'custom',
      value: 5,
      condition: 'early_starts',
      timeframe: 'total'
    }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Ski after 6 PM on 3 occasions',
    icon: 'Moon',
    category: 'special',
    rarity: 'rare',
    requirement: {
      type: 'custom',
      value: 3,
      condition: 'late_finishes',
      timeframe: 'total'
    }
  },
  {
    id: 'weather-warrior',
    name: 'Weather Warrior',
    description: 'Ski in all weather conditions (snow, rain, sun, wind)',
    icon: 'Cloud',
    category: 'special',
    rarity: 'epic',
    requirement: {
      type: 'custom',
      value: 4,
      condition: 'weather_types',
      timeframe: 'total'
    }
  },

  // Seasonal Achievements
  {
    id: 'winter-opener',
    name: 'Season Opener',
    description: 'Ski on opening day of any resort',
    icon: 'Snowflake',
    category: 'seasonal',
    rarity: 'rare',
    requirement: {
      type: 'custom',
      value: 1,
      condition: 'opening_day',
      timeframe: 'seasonal'
    }
  },
  {
    id: 'closing-day-hero',
    name: 'Closing Day Hero',
    description: 'Ski on closing day of any resort',
    icon: 'Sunset',
    category: 'seasonal',
    rarity: 'rare',
    requirement: {
      type: 'custom',
      value: 1,
      condition: 'closing_day',
      timeframe: 'seasonal'
    }
  },

  // Pro Achievements (Snowline Pro exclusive)
  {
    id: 'pro-pioneer',
    name: 'Pro Pioneer',
    description: 'Upgrade to Snowline Pro',
    icon: 'Crown',
    category: 'pro',
    rarity: 'epic',
    requirement: {
      type: 'custom',
      value: 1,
      condition: 'pro_upgrade',
      timeframe: 'total'
    },
    rewards: [
      {
        type: 'title',
        value: 'Pro Skier',
        description: 'Pro Skier title'
      },
      {
        type: 'theme',
        value: 'pro-theme',
        description: 'Exclusive Pro theme'
      }
    ]
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'View detailed analytics 25 times',
    icon: 'BarChart3',
    category: 'pro',
    rarity: 'uncommon',
    requirement: {
      type: 'custom',
      value: 25,
      condition: 'analytics_views',
      timeframe: 'total'
    }
  }
];

export const ACHIEVEMENT_CATEGORIES = {
  distance: {
    name: 'Distance',
    icon: 'Route',
    color: '#22c55e',
    description: 'Achievements for skiing distances'
  },
  speed: {
    name: 'Speed',
    icon: 'Zap',
    color: '#f59e0b',
    description: 'Achievements for speed records'
  },
  vertical: {
    name: 'Vertical',
    icon: 'TrendingUp',
    color: '#3b82f6',
    description: 'Achievements for elevation gain'
  },
  social: {
    name: 'Social',
    icon: 'Users',
    color: '#8b5cf6',
    description: 'Achievements for social engagement'
  },
  resort: {
    name: 'Resort',
    icon: 'MapPin',
    color: '#06b6d4',
    description: 'Achievements for exploring resorts'
  },
  streak: {
    name: 'Streak',
    icon: 'Calendar',
    color: '#ef4444',
    description: 'Achievements for consistency'
  },
  special: {
    name: 'Special',
    icon: 'Star',
    color: '#84cc16',
    description: 'Special and unique achievements'
  },
  seasonal: {
    name: 'Seasonal',
    icon: 'Snowflake',
    color: '#0ea5e9',
    description: 'Season-specific achievements'
  },
  pro: {
    name: 'Pro',
    icon: 'Crown',
    color: '#004cff',
    description: 'Snowline Pro exclusive achievements'
  }
};

export const ACHIEVEMENT_RARITIES = {
  common: {
    name: 'Common',
    color: '#64748b',
    points: 10
  },
  uncommon: {
    name: 'Uncommon',
    color: '#22c55e',
    points: 25
  },
  rare: {
    name: 'Rare',
    color: '#3b82f6',
    points: 50
  },
  epic: {
    name: 'Epic',
    color: '#8b5cf6',
    points: 100
  },
  legendary: {
    name: 'Legendary',
    color: '#f59e0b',
    points: 250
  }
};

export const ACHIEVEMENT_POINTS = {
  common: 10,
  uncommon: 25,
  rare: 50,
  epic: 100,
  legendary: 250
};