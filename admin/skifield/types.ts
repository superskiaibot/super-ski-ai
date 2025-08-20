import { User as UserType } from '../../../src/types/index';

export interface SkiFieldAdminDashboardProps {
  currentUser: UserType;
  onClose: () => void;
  selectedSkiFieldId?: string | null;
}

export interface LiftDetails {
  id: number;
  name: string;
  status: 'operational' | 'maintenance';
  capacity: number;
  current: number;
}

export interface ResortData {
  name: string;
  location: string;
  status: 'operational' | 'maintenance';
  operatingHours: string;
  lifts: {
    operational: number;
    total: number;
    details: LiftDetails[];
  };
  trails: {
    open: number;
    total: number;
    conditions: {
      excellent: number;
      good: number;
      fair: number;
      closed: number;
    };
  };
  weather: {
    temperature: number;
    condition: string;
    windSpeed: number;
    visibility: string;
    snowDepth: number;
    newSnow: number;
    forecast: string;
  };
  visitors: {
    current: number;
    capacity: number;
    ticketsSold: number;
    seasonPasses: number;
  };
  staff: {
    total: number;
    onDuty: number;
    departments: {
      liftOps: number;
      patrol: number;
      maintenance: number;
      food: number;
      admin: number;
    };
  };
}

export interface AdminSection {
  id: string;
  label: string;
  icon: any;
  description: string;
}