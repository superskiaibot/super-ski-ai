export interface TrackingStats {
  // Basic GPS Stats
  duration: number;
  distance: number;
  speed: number;
  maxSpeed: number;
  avgSpeed: number;
  elevation: number;
  vertical: number;
  liftAscent?: number; // New field for vertical meters ascended via lifts
  calories: number;
  temperature: number;
  
  // Advanced Performance Metrics
  runs: number;
  liftRides: number;
  chairTimePercent: number;
  skiTimePercent: number;
  restTimePercent: number;
  
  // Speed Analysis
  speedZones: {
    slow: number;    // 0-20 km/h
    moderate: number; // 20-40 km/h  
    fast: number;    // 40-60 km/h
    extreme: number; // 60+ km/h
  };
  
  // Terrain Analysis (based on slope)
  terrainTime: {
    flat: number;      // 0-5 degrees
    gentle: number;    // 5-15 degrees
    moderate: number;  // 15-25 degrees
    steep: number;     // 25-35 degrees
    extreme: number;   // 35+ degrees
  };
  
  // Efficiency Metrics
  verticalPerHour: number;
  distancePerRun: number;
  averageRunTime: number;
  longestRun: number;
  
  // Environmental
  weather: {
    snowConditions: 'powder' | 'packed' | 'icy' | 'slushy';
    visibility: 'poor' | 'fair' | 'good' | 'excellent';
    windSpeed: number;
  };
}

export interface TrackingPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: Date;
  speed?: number;
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
  temperature?: number;
  weatherCondition?: string;
}