import { useState, useEffect, useCallback } from 'react';
import skiForACureService, { 
  type EventInfo, 
  type ParticipationInfo, 
  type JoinEventData,
  type TrackingUpdate,
  type LeaderboardEntry
} from '../utils/skiForACureService';

export interface EventStripData {
  eventTitle: string;
  dateRange: string;
  endDate: Date;
  participationType: 'individual' | 'team' | 'business';
  teamInfo?: {
    name: string;
    memberCount: number;
  };
  todayStats: {
    vertical: number;
    unit: string;
  };
  totalStats: {
    vertical: number;
    unit: string;
  };
  goal?: number;
  userRole?: 'admin' | 'member';
}

export interface EventManagementData {
  isJoined: boolean;
  participationType?: 'individual' | 'team' | 'business';
  skiField?: string;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  receiptId?: string;
  progress: {
    current: number;
    goal: number;
    unit: string;
    dailyData: Array<{
      date: string;
      vertical: number;
    }>;
  };
  teamInfo?: {
    name: string;
    joinCode: string;
    members: Array<{
      id: string;
      name: string;
      avatar?: string;
      vertical: number;
      isOnline: boolean;
    }>;
  };
  eventDetails: {
    title: string;
    dateRange: string;
    participantCount: number;
    raised?: number;
    goal?: number;
  };
}

export function useEventState() {
  const [showJoinEventModal, setShowJoinEventModal] = useState(false);
  const [eventJoinData, setEventJoinData] = useState<JoinEventData | null>(null);
  const [eventStripData, setEventStripData] = useState<EventStripData | null>(null);
  const [eventManagementData, setEventManagementData] = useState<EventManagementData>({
    isJoined: false,
    paymentStatus: 'unpaid',
    progress: {
      current: 0,
      goal: 10000,
      unit: 'm',
      dailyData: []
    },
    eventDetails: {
      title: 'Ski for a Cure Global',
      dateRange: 'Sep 6–14, 2024',
      participantCount: 0,
      raised: 0,
      goal: 500000
    }
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Access token (should be managed by your auth system)
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Initialize event data on mount
  useEffect(() => {
    loadEventInfo();
  }, []);

  // Load user participation when access token is available
  useEffect(() => {
    if (accessToken) {
      loadUserParticipation();
    }
  }, [accessToken]);

  const loadEventInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const eventInfo = await skiForACureService.getEventInfo();
      
      setEventManagementData(prev => ({
        ...prev,
        eventDetails: {
          title: eventInfo.title,
          dateRange: eventInfo.dateRange,
          participantCount: eventInfo.stats.participantCount,
          raised: eventInfo.stats.totalRaised,
          goal: eventInfo.goal
        }
      }));

    } catch (err) {
      console.error('Error loading event info:', err);
      setError(skiForACureService.getUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserParticipation = useCallback(async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      setError(null);

      const participation = await skiForACureService.getParticipation(accessToken);
      
      if (participation.isJoined && participation.participant) {
        const p = participation.participant;
        
        // Update event management data
        const updatedEventData: EventManagementData = {
          isJoined: true,
          participationType: p.participationType,
          skiField: p.skiField,
          paymentStatus: p.paymentStatus,
          receiptId: p.receiptId,
          progress: {
            current: p.trackingStats?.totalVertical || 0,
            goal: p.targetAmount || 10000,
            unit: 'm',
            dailyData: [] // Would need to be tracked separately
          },
          teamInfo: participation.teamInfo ? {
            name: participation.teamInfo.name,
            joinCode: participation.teamInfo.id,
            members: participation.teamInfo.members || []
          } : undefined,
          eventDetails: {
            title: participation.eventConfig.title,
            dateRange: participation.eventConfig.dateRange,
            participantCount: eventManagementData.eventDetails.participantCount,
            raised: eventManagementData.eventDetails.raised,
            goal: participation.eventConfig.goal
          }
        };
        
        setEventManagementData(updatedEventData);

        // Set up event strip data for tracking page
        if (p.paymentStatus === 'paid') {
          const stripData: EventStripData = {
            eventTitle: participation.eventConfig.title,
            dateRange: participation.eventConfig.dateRange,
            endDate: new Date(participation.eventConfig.endDate),
            participationType: p.participationType,
            teamInfo: participation.teamInfo ? {
              name: participation.teamInfo.name,
              memberCount: participation.teamInfo.memberCount || 1
            } : undefined,
            todayStats: {
              vertical: 0, // Would need daily tracking
              unit: 'm'
            },
            totalStats: {
              vertical: p.trackingStats?.totalVertical || 0,
              unit: 'm'
            },
            goal: p.targetAmount,
            userRole: participation.teamInfo?.adminId === p.userId ? 'admin' : 'member'
          };
          
          setEventStripData(stripData);
        }
      } else {
        // User not joined
        setEventManagementData(prev => ({
          ...prev,
          isJoined: false
        }));
        setEventStripData(null);
      }

    } catch (err) {
      console.error('Error loading user participation:', err);
      setError(skiForACureService.getUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, eventManagementData.eventDetails.participantCount, eventManagementData.eventDetails.raised]);

  const handleEventJoinComplete = useCallback(async (joinData: JoinEventData) => {
    if (!accessToken) {
      setError('Authentication required to join event');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validate join data
      const validationErrors = skiForACureService.validateJoinData(joinData);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      // Submit join request to backend
      const response = await skiForACureService.joinEvent(joinData, accessToken);
      
      if (response.success) {
        setEventJoinData(joinData);
        
        // Reload participation data
        await loadUserParticipation();
        await loadEventInfo(); // Refresh event stats
        
        // Show success
        console.log('Successfully joined event:', response);
      } else {
        throw new Error(response.error || 'Failed to join event');
      }

    } catch (err) {
      console.error('Error joining event:', err);
      setError(skiForACureService.getUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, loadUserParticipation, loadEventInfo]);

  const updateTrackingStats = useCallback(async (trackingData: TrackingUpdate) => {
    if (!accessToken || !eventManagementData.isJoined) {
      return;
    }

    try {
      await skiForACureService.updateTracking(trackingData, accessToken);
      
      // Update local state
      setEventManagementData(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          current: prev.progress.current + trackingData.vertical
        }
      }));

      // Update strip data
      if (eventStripData) {
        setEventStripData(prev => prev ? {
          ...prev,
          totalStats: {
            ...prev.totalStats,
            vertical: prev.totalStats.vertical + trackingData.vertical
          },
          todayStats: {
            ...prev.todayStats,
            vertical: prev.todayStats.vertical + trackingData.vertical
          }
        } : null);
      }

    } catch (err) {
      console.error('Error updating tracking stats:', err);
      setError(skiForACureService.getUserFriendlyError(err));
    }
  }, [accessToken, eventManagementData.isJoined, eventStripData]);

  const inviteTeamMember = useCallback(async (email: string) => {
    if (!accessToken || !eventManagementData.teamInfo) {
      setError('Team admin access required');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await skiForACureService.inviteTeamMember(
        eventManagementData.teamInfo.joinCode, 
        email, 
        accessToken
      );

      if (response.success) {
        console.log('Team invitation sent successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to send invitation');
      }

    } catch (err) {
      console.error('Error inviting team member:', err);
      setError(skiForACureService.getUserFriendlyError(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, eventManagementData.teamInfo]);

  const updateTeam = useCallback(async (updates: { name?: string; targetAmount?: number }) => {
    if (!accessToken || !eventManagementData.teamInfo) {
      setError('Team admin access required');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await skiForACureService.updateTeam(
        eventManagementData.teamInfo.joinCode,
        updates,
        accessToken
      );

      if (response.success) {
        // Update local state
        if (updates.name) {
          setEventManagementData(prev => ({
            ...prev,
            teamInfo: prev.teamInfo ? {
              ...prev.teamInfo,
              name: updates.name!
            } : prev.teamInfo
          }));
        }

        await loadUserParticipation(); // Refresh data
        return true;
      } else {
        throw new Error(response.error || 'Failed to update team');
      }

    } catch (err) {
      console.error('Error updating team:', err);
      setError(skiForACureService.getUserFriendlyError(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, eventManagementData.teamInfo, loadUserParticipation]);

  const getLeaderboards = useCallback(async (
    type: 'individual' | 'team' | 'business' = 'individual',
    skiField: string = 'all'
  ) => {
    try {
      const response = await skiForACureService.getLeaderboards(type, skiField);
      return response.data;
    } catch (err) {
      console.error('Error fetching leaderboards:', err);
      setError(skiForACureService.getUserFriendlyError(err));
      return [];
    }
  }, []);

  const refreshEventData = useCallback(async () => {
    await Promise.all([
      loadEventInfo(),
      accessToken ? loadUserParticipation() : Promise.resolve()
    ]);
  }, [loadEventInfo, loadUserParticipation, accessToken]);

  // Method to set access token (call from auth system)
  const setUserAccessToken = useCallback((token: string | null) => {
    setAccessToken(token);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    showJoinEventModal,
    setShowJoinEventModal,
    eventJoinData,
    setEventJoinData,
    eventStripData,
    setEventStripData,
    eventManagementData,
    setEventManagementData,
    isLoading,
    error,

    // Actions
    handleEventJoinComplete,
    updateTrackingStats,
    inviteTeamMember,
    updateTeam,
    getLeaderboards,
    refreshEventData,
    setUserAccessToken,
    clearError,

    // Utilities
    isEventActive: () => eventManagementData.eventDetails.participantCount > 0,
    formatCurrency: skiForACureService.formatCurrency.bind(skiForACureService),
    formatNumber: skiForACureService.formatNumber.bind(skiForACureService)
  };
}