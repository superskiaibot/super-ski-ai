export const INITIAL_TRACKING_STATS = {
  duration: 0,
  distance: 0,
  speed: 0,
  maxSpeed: 0,
  avgSpeed: 0,
  elevation: 1200,
  vertical: 0,
  liftAscent: 0, // New field for vertical meters ascended via lifts
  calories: 0,
  temperature: -5,
  runs: 0,
  liftRides: 0,
  chairTimePercent: 0,
  skiTimePercent: 0,
  restTimePercent: 0,
  speedZones: { slow: 0, moderate: 0, fast: 0, extreme: 0 },
  terrainTime: { flat: 0, gentle: 0, moderate: 0, steep: 0, extreme: 0 },
  verticalPerHour: 0,
  distancePerRun: 0,
  averageRunTime: 0,
  longestRun: 0,
  weather: { snowConditions: 'packed', visibility: 'good', windSpeed: 10 }
} as const;

export const TRACKING_UPDATE_INTERVAL = 1000; // 1 second
export const MIN_SESSION_DURATION_FOR_SAVE = 30; // 30 seconds