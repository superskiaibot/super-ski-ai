// Application constants
export const APP_CONFIG = {
  name: 'SKI TRACER',
  description: 'Elite Snow Sports Tracking',
  version: '2.0.0',
  author: 'SKI TRACER Team',
  website: 'https://skitracer.app',
  support: 'support@skitracer.app'
} as const;

export const BRAND_COLORS = {
  ultraIceBlue: '#004cff',
  midnight: '#07111a', 
  snow: '#ffffff',
  avalancheOrange: '#ff5500'
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  RECORDING: '/recording',
  SOCIAL: '/social',
  LEADERBOARDS: '/leaderboards',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  WEB: '/web'
} as const;

export const DIFFICULTY_COLORS = {
  green: '#22c55e',
  blue: '#3b82f6',
  black: '#1f2937',
  double_black: '#ef4444'
} as const;

export const ACTIVITY_TYPES = {
  alpine: { label: 'Alpine Skiing', icon: 'Mountain' },
  snowboard: { label: 'Snowboarding', icon: 'Snowflake' },
  telemark: { label: 'Telemark', icon: 'Star' },
  cross_country: { label: 'Cross Country', icon: 'Route' }
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
} as const;

export const TYPOGRAPHY = {
  fontFamily: 'Inter Variable, system-ui, sans-serif',
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  }
} as const;

export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '250ms', 
    slow: '500ms'
  },
  easing: {
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080
} as const;

export const API_ENDPOINTS = {
  BASE_URL: typeof process !== 'undefined' && process.env?.REACT_APP_API_URL || 'https://api.skitracer.app',
  AUTH: '/auth',
  USERS: '/users',
  SESSIONS: '/sessions',
  SOCIAL: '/social',
  LEADERBOARDS: '/leaderboards',
  WEATHER: '/weather',
  RESORTS: '/resorts'
} as const;

// Mapbox Configuration
export const MAPBOX_CONFIG = {
  // Snowline Development Mapbox Access Token
  ACCESS_TOKEN: 'pk.eyJ1Ijoic25vd2xpbmUtZGV2IiwiYSI6ImNtY3libWxucjAzcG4ycnEyNG5xOTIxazAifQ.aF2OiCnT9_rBHXHMsnBM0w',
  
  // Default map styles optimized for skiing
  STYLES: {
    terrain: 'mapbox://styles/mapbox/outdoors-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    hybrid: 'mapbox://styles/mapbox/satellite-streets-v12',
    ski_terrain: 'mapbox://styles/mapbox/outdoors-v12' // Custom ski-optimized style
  },
  
  // Map configuration defaults
  DEFAULTS: {
    zoom: 14,
    minZoom: 8,
    maxZoom: 18,
    center: [172.0, -42.0], // Default center for New Zealand ski areas (Canterbury region)
    pitch: 45, // 3D tilt for better terrain visualization
    bearing: 0
  },
  
  // Ski-specific layer configurations
  LAYERS: {
    trails: {
      type: 'line',
      paint: {
        'line-color': [
          'match',
          ['get', 'difficulty'],
          'green', '#22c55e',
          'blue', '#3b82f6', 
          'black', '#1f2937',
          'double-black', '#ef4444',
          '#64748b' // Default gray
        ],
        'line-width': 3,
        'line-opacity': 0.8
      }
    },
    lifts: {
      type: 'line',
      paint: {
        'line-color': '#f59e0b',
        'line-width': 2,
        'line-dasharray': [4, 2]
      }
    }
  }
} as const;

export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: 'ski_tracer_preferences',
  DASHBOARD_SETTINGS: 'ski_tracer_dashboard',
  RECORDING_SETTINGS: 'ski_tracer_recording',
  AUTH_TOKEN: 'ski_tracer_token'
} as const;

export const DEFAULT_SETTINGS = {
  units: 'metric',
  language: 'en',
  notifications: {
    push: true,
    email: true,
    weather: true,
    social: true,
    achievements: true
  },
  privacy: {
    shareLocation: false,
    shareStats: true,
    publicProfile: true
  },
  recording: {
    autoLiftDetection: true,
    jumpDetection: true,
    crashDetection: true,
    voiceCoaching: false,
    audioFeedback: true,
    gpsUpdateRate: 1000,
    heartRateMonitoring: true
  }
} as const;

export const HEART_RATE_ZONES = {
  zone1: { min: 0, max: 68, name: 'Recovery', color: '#9ca3af' },
  zone2: { min: 69, max: 83, name: 'Aerobic', color: '#3b82f6' },
  zone3: { min: 84, max: 94, name: 'Threshold', color: '#f59e0b' },
  zone4: { min: 95, max: 105, name: 'Anaerobic', color: '#ef4444' },
  zone5: { min: 106, max: 120, name: 'Neuromuscular', color: '#7c3aed' }
} as const;

export const WEATHER_CONDITIONS = {
  clear: { label: 'Clear', icon: 'Sun' },
  cloudy: { label: 'Cloudy', icon: 'Cloud' },
  overcast: { label: 'Overcast', icon: 'CloudSnow' },
  light_snow: { label: 'Light Snow', icon: 'Snowflake' },
  heavy_snow: { label: 'Heavy Snow', icon: 'CloudSnow' },
  blizzard: { label: 'Blizzard', icon: 'CloudSnow' },
  fog: { label: 'Fog', icon: 'Cloud' }
} as const;