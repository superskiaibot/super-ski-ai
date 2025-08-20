import { Home, BarChart3, MapPin, Palette, Calendar } from 'lucide-react';

// Sample resort data for the ski field admin dashboard
export const RESORT_DATA = {
  name: 'Coronet Peak',
  location: 'Queenstown, South Island',
  status: 'operational' as const,
  operatingHours: '9:00 AM - 4:00 PM',
  lifts: {
    operational: 5,
    total: 6,
    details: [
      { id: 1, name: 'Express Quad', status: 'operational' as const, capacity: 2400, current: 1850 },
      { id: 2, name: 'Rocky Gully T-Bar', status: 'operational' as const, capacity: 800, current: 620 },
      { id: 3, name: 'Greengates T-Bar', status: 'operational' as const, capacity: 600, current: 480 },
      { id: 4, name: 'Coronet Six', status: 'operational' as const, capacity: 3000, current: 2650 },
      { id: 5, name: 'M1 Moving Carpet', status: 'operational' as const, capacity: 1200, current: 890 },
      { id: 6, name: 'Back Bowls Quad', status: 'maintenance' as const, capacity: 2000, current: 0 }
    ]
  },
  trails: {
    open: 23,
    total: 28,
    conditions: {
      excellent: 18,
      good: 5,
      fair: 0,
      closed: 5
    }
  },
  weather: {
    temperature: -5,
    condition: 'Fresh Snow',
    windSpeed: 15,
    visibility: 'excellent',
    snowDepth: 85,
    newSnow: 8,
    forecast: 'Snow continuing overnight'
  },
  visitors: {
    current: 1247,
    capacity: 2500,
    ticketsSold: 1580,
    seasonPasses: 892
  },
  staff: {
    total: 45,
    onDuty: 38,
    departments: {
      liftOps: 12,
      patrol: 8,
      maintenance: 6,
      food: 7,
      admin: 5
    }
  }
};

// Navigation items for the admin dashboard
export const ADMIN_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Home, description: 'Resort status & key metrics' },
  { id: 'customization', label: 'Resort Customization', icon: Palette, description: 'Customize resort branding & content' },
  { id: 'trails', label: 'Trail Management', icon: MapPin, description: 'Trail conditions & grooming' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Performance insights & reporting' },
  { id: 'events', label: 'Events', icon: Calendar, description: 'Event management & scheduling' }
];