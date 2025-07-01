import axios from 'axios';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  SkiSession,
  SkiSessionCreate,
  SkiSessionSummary,
  GPSPoint,
  GPSPointCreate,
  WeatherData,
  DashboardStats
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/token', formData);
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Sessions API
export const sessionsAPI = {
  getSessions: async (): Promise<SkiSessionSummary[]> => {
    const response = await api.get('/sessions/');
    return response.data;
  },

  getSession: async (sessionId: number): Promise<SkiSession> => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  createSession: async (data: SkiSessionCreate): Promise<SkiSession> => {
    const response = await api.post('/sessions/', data);
    return response.data;
  },

  endSession: async (sessionId: number): Promise<SkiSession> => {
    const response = await api.post(`/sessions/${sessionId}/end`);
    return response.data;
  },

  deleteSession: async (sessionId: number): Promise<void> => {
    await api.delete(`/sessions/${sessionId}`);
  },

  getActiveSession: async (): Promise<SkiSession> => {
    const response = await api.get('/sessions/active');
    return response.data;
  },

  addGPSPoint: async (sessionId: number, point: GPSPointCreate): Promise<GPSPoint> => {
    const response = await api.post(`/sessions/${sessionId}/gps`, point);
    return response.data;
  },

  getSessionGPSPoints: async (sessionId: number): Promise<GPSPoint[]> => {
    const response = await api.get(`/sessions/${sessionId}/gps`);
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/sessions/stats/dashboard');
    return response.data;
  },
};

// Weather API
export const weatherAPI = {
  getCurrentWeather: async (lat: number, lon: number): Promise<WeatherData> => {
    const response = await api.get('/weather/current', {
      params: { lat, lon }
    });
    return response.data;
  },
};

export default api;