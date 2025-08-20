// Fallback constants to ensure the app works even if imports fail
export const FALLBACK_LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: 'ski_tracer_preferences',
  DASHBOARD_SETTINGS: 'ski_tracer_dashboard',
  RECORDING_SETTINGS: 'ski_tracer_recording',
  AUTH_TOKEN: 'ski_tracer_token'
} as const;

export const FALLBACK_DEFAULT_SETTINGS = {
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