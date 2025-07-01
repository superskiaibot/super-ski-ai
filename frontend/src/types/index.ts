export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface GPSPoint {
  id: number;
  session_id: number;
  latitude: number;
  longitude: number;
  elevation?: number;
  speed?: number;
  timestamp: string;
}

export interface GPSPointCreate {
  latitude: number;
  longitude: number;
  elevation?: number;
  speed?: number;
}

export interface SkiSession {
  id: number;
  user_id: number;
  title: string;
  start_time: string;
  end_time?: string;
  total_distance: number;
  total_elevation_gain: number;
  max_speed: number;
  avg_speed: number;
  weather_temp?: number;
  weather_condition?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  gps_points: GPSPoint[];
}

export interface SkiSessionCreate {
  title: string;
  notes?: string;
}

export interface SkiSessionSummary {
  id: number;
  title: string;
  start_time: string;
  end_time?: string;
  total_distance: number;
  total_elevation_gain: number;
  max_speed: number;
  is_active: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  wind_speed: number;
}

export interface DashboardStats {
  total_sessions: number;
  total_distance: number;
  total_elevation: number;
  total_time: number;
  avg_speed: number;
}

export interface Position {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number;
    speed?: number;
  };
  timestamp: number;
}