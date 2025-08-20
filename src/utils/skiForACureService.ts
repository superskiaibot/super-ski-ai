import { projectId, publicAnonKey } from '../../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7c3f937b/ski-for-a-cure`;

interface EventInfo {
  id: string;
  title: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  goal: number;
  prices: {
    individual: number;
    team: number;
    business: number;
  };
  stats: {
    participantCount: number;
    totalRaised: number;
    recentJoins: number;
    progressPercentage: number;
    isActive: boolean;
  };
}

interface ParticipationInfo {
  isJoined: boolean;
  participant: any;
  teamInfo?: any;
  eventConfig: any;
}

interface JoinEventData {
  participationType: 'individual' | 'team' | 'business';
  userInfo: {
    name: string;
    email: string;
  };
  teamInfo?: {
    teamName?: string;
    joinCode?: string;
    action: 'create' | 'join';
  };
  businessInfo?: {
    companyName: string;
    teamSize: number;
  };
  paymentCompleted: boolean;
  donationAmount?: number;
  skiField?: string;
}

interface TrackingUpdate {
  vertical: number;
  distance: number;
  time: number;
  speed: number;
  runs: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  vertical: number;
  skiField?: string;
  members?: number;
  participationType?: string;
}

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
}

class SkiForACureService {
  private async makeRequest<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${BASE_URL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private getAuthHeaders(accessToken?: string) {
    return accessToken 
      ? { 'Authorization': `Bearer ${accessToken}` }
      : { 'Authorization': `Bearer ${publicAnonKey}` };
  }

  // Get event information (public)
  async getEventInfo(): Promise<EventInfo> {
    return this.makeRequest<EventInfo>('/event');
  }

  // Join the event (requires auth)
  async joinEvent(
    joinData: JoinEventData, 
    accessToken: string
  ): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/join', {
      method: 'POST',
      headers: this.getAuthHeaders(accessToken),
      body: JSON.stringify(joinData),
    });
  }

  // Get user's participation info (requires auth)
  async getParticipation(accessToken: string): Promise<ParticipationInfo> {
    return this.makeRequest<ParticipationInfo>('/participation', {
      headers: this.getAuthHeaders(accessToken),
    });
  }

  // Update tracking stats (requires auth)
  async updateTracking(
    trackingData: TrackingUpdate, 
    accessToken: string
  ): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/tracking/update', {
      method: 'POST',
      headers: this.getAuthHeaders(accessToken),
      body: JSON.stringify(trackingData),
    });
  }

  // Get leaderboards (public)
  async getLeaderboards(
    type: 'individual' | 'team' | 'business' = 'individual',
    skiField: string = 'all'
  ): Promise<{ type: string; data: LeaderboardEntry[] }> {
    const params = new URLSearchParams({
      type,
      ...(skiField !== 'all' && { skiField })
    });

    return this.makeRequest<{ type: string; data: LeaderboardEntry[] }>(
      `/leaderboards?${params.toString()}`
    );
  }

  // Invite team member (requires auth, team admin only)
  async inviteTeamMember(
    teamCode: string, 
    email: string, 
    accessToken: string
  ): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/team/invite', {
      method: 'POST',
      headers: this.getAuthHeaders(accessToken),
      body: JSON.stringify({ teamCode, email }),
    });
  }

  // Update team information (requires auth, team admin only)
  async updateTeam(
    teamCode: string, 
    updates: { name?: string; targetAmount?: number }, 
    accessToken: string
  ): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/team/update', {
      method: 'PUT',
      headers: this.getAuthHeaders(accessToken),
      body: JSON.stringify({ teamCode, updates }),
    });
  }

  // Get comprehensive event statistics (public)
  async getEventStats(): Promise<{
    participants: any;
    teams: any;
    fundraising: any;
    tracking: any;
    skiFields: Record<string, number>;
  }> {
    return this.makeRequest('/stats');
  }

  // Helper method to check if event is currently active
  async isEventActive(): Promise<boolean> {
    try {
      const eventInfo = await this.getEventInfo();
      return eventInfo.stats.isActive;
    } catch (error) {
      console.error('Error checking event status:', error);
      return false;
    }
  }

  // Helper method to get event progress percentage
  async getEventProgress(): Promise<number> {
    try {
      const eventInfo = await this.getEventInfo();
      return eventInfo.stats.progressPercentage;
    } catch (error) {
      console.error('Error getting event progress:', error);
      return 0;
    }
  }

  // Helper method to format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Helper method to format large numbers
  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  // Helper method to calculate time remaining
  calculateTimeRemaining(endDate: string): {
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
  } {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, isExpired: false };
  }

  // Helper method to validate join data
  validateJoinData(data: Partial<JoinEventData>): string[] {
    const errors: string[] = [];

    if (!data.participationType) {
      errors.push('Participation type is required');
    }

    if (!data.userInfo?.name?.trim()) {
      errors.push('Name is required');
    }

    if (!data.userInfo?.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userInfo.email)) {
      errors.push('Valid email is required');
    }

    if (data.participationType === 'team' && data.teamInfo) {
      if (data.teamInfo.action === 'create' && !data.teamInfo.teamName?.trim()) {
        errors.push('Team name is required when creating a team');
      }
      if (data.teamInfo.action === 'join' && !data.teamInfo.joinCode?.trim()) {
        errors.push('Join code is required when joining a team');
      }
    }

    if (data.participationType === 'business') {
      if (!data.businessInfo?.companyName?.trim()) {
        errors.push('Company name is required for business participation');
      }
      if (!data.businessInfo?.teamSize || data.businessInfo.teamSize < 1) {
        errors.push('Valid team size is required for business participation');
      }
    }

    return errors;
  }

  // Method to get user-friendly error messages
  getUserFriendlyError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      // Map technical errors to user-friendly messages
      const errorMappings: Record<string, string> = {
        'Participant not found': 'You need to join the event first.',
        'Team not found': 'The team code you entered is invalid.',
        'Team is full': 'This team has reached its maximum capacity.',
        'User already participated': 'You have already joined this event.',
        'Not authorized': 'You do not have permission to perform this action.',
        'Authorization required': 'Please log in to continue.',
        'Invalid or expired token': 'Your session has expired. Please log in again.',
      };

      return errorMappings[error.message] || error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }
}

// Export singleton instance
export const skiForACureService = new SkiForACureService();
export default skiForACureService;

// Export types for use in components
export type {
  EventInfo,
  ParticipationInfo,
  JoinEventData,
  TrackingUpdate,
  LeaderboardEntry,
  ApiResponse,
};