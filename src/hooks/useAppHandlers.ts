import { useCallback } from 'react';
import { User as UserType, SavedRun } from '../types/index';
import { TrackingStats, Resort } from '../../components/tracking/types';

import { RoleService } from '../utils/roleService';
import { STORAGE_KEYS, createSampleRuns } from '../constants/app';

interface UseAppHandlersProps {
  // State values
  currentUser: UserType | null;
  sessionStartTime: Date | null;
  isTracking: boolean;
  hasTrackingSession: boolean;
  
  // State setters
  setActiveTab: (tab: string) => void;
  setViewingUserProfile: (user: UserType | null) => void;
  setSessionStartTime: (time: Date | null) => void;
  setIsTracking: (tracking: boolean) => void;
  setHasTrackingSession: (hasSession: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setRuns: (updateFn: (prevRuns: SavedRun[]) => SavedRun[]) => void;
  setSelectedResort: (resort: Resort | null) => void;
  setTrackingComponentKey: (key: string) => void;
  setShowResetDialog: (show: boolean) => void;
  setShowResortSelector: (show: boolean) => void;
  setCurrentUser: (updateFn: (prev: UserType | null) => UserType | null) => void;
  setCurrentTrackingStats: (stats: TrackingStats) => void;
  setIsFullscreenTransition: (transition: boolean) => void;
  setIsMapFullscreen: (fullscreen: boolean) => void;
  setShowAdditionalCards: (updateFn: (prev: boolean) => boolean) => void;
  setShowPremiumPlans: (show: boolean) => void;
  setUnlockAnimationType: (type: 'pro') => void;
  setShowUnlockAnimation: (show: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;

  setShowAdminConsole: (show: boolean) => void;
  setShowSkiFieldAdmin: (show: boolean) => void;
  setSelectedSkiFieldForAdmin: (id: string | null) => void;
}

export function useAppHandlers(props: UseAppHandlersProps) {
  const {
    currentUser,
    sessionStartTime,
    isTracking,
    hasTrackingSession,
    setActiveTab,
    setViewingUserProfile,
    setSessionStartTime,
    setIsTracking,
    setHasTrackingSession,
    setIsPaused,
    setRuns,
    setSelectedResort,
    setTrackingComponentKey,
    setShowResetDialog,
    setShowResortSelector,
    setCurrentUser,
    setCurrentTrackingStats,
    setIsFullscreenTransition,
    setIsMapFullscreen,
    setShowAdditionalCards,
    setShowPremiumPlans,
    setUnlockAnimationType,
    setShowUnlockAnimation,
    setShowTutorial,
    setIsMobileMenuOpen,

    setShowAdminConsole,
    setShowSkiFieldAdmin,
    setSelectedSkiFieldForAdmin,
  } = props;

  // Handler for selecting a user from search to view their profile
  const handleUserSelect = useCallback((user: UserType) => {
    setViewingUserProfile(user);
    setActiveTab('profile');
  }, [setViewingUserProfile, setActiveTab]);

  // Memoized tracking handlers
  const handleStartTracking = useCallback(() => {
    const now = new Date();
    
    if (!sessionStartTime) {
      setSessionStartTime(now);
    }
    
    setIsTracking(true);
    setHasTrackingSession(true);
    setIsPaused(false);
  }, [sessionStartTime, setSessionStartTime, setIsTracking, setHasTrackingSession, setIsPaused]);

  const handlePauseTracking = useCallback(() => {
    setIsTracking(false);
    setIsPaused(true);
  }, [setIsTracking, setIsPaused]);

  const handleStopTracking = useCallback(() => {
    setIsTracking(false);
    setIsPaused(false);
  }, [setIsTracking, setIsPaused]);

  const handleSaveRun = useCallback((run: SavedRun) => {
    setRuns(prevRuns => [run, ...prevRuns]);
    
    setIsTracking(false);
    setIsPaused(false);
    setHasTrackingSession(false);
    setSessionStartTime(null);
    setSelectedResort(null);
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      // Silently handle localStorage errors
    }
    setTrackingComponentKey(`tracking-${Date.now()}`);
  }, [setRuns, setIsTracking, setIsPaused, setHasTrackingSession, setSessionStartTime, setSelectedResort, setTrackingComponentKey]);

  const handleChangeResort = useCallback(() => {
    if (isTracking || hasTrackingSession) {
      setShowResetDialog(true);
    } else {
      setShowResortSelector(true);
    }
  }, [isTracking, hasTrackingSession, setShowResetDialog, setShowResortSelector]);

  const confirmResetTrackingSession = useCallback(() => {
    setIsTracking(false);
    setIsPaused(false);
    setHasTrackingSession(false);
    setSessionStartTime(null);
    setSelectedResort(null);
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      // Silently handle localStorage errors
    }
    setTrackingComponentKey(`tracking-${Date.now()}`);
    
    setShowResetDialog(false);
    setShowResortSelector(true);
    setActiveTab('tracking');
  }, [setIsTracking, setIsPaused, setHasTrackingSession, setSessionStartTime, setSelectedResort, setTrackingComponentKey, setShowResetDialog, setShowResortSelector, setActiveTab]);

  const handleResortSelect = useCallback((resort: Resort) => {
    setSelectedResort(resort);
    setShowResortSelector(false);
  }, [setSelectedResort, setShowResortSelector]);

  const handleCloseResortSelector = useCallback(() => {
    setShowResortSelector(false);
  }, [setShowResortSelector]);

  const handleUpdateUser = useCallback((updates: Partial<UserType>) => {
    setCurrentUser(prevUser => prevUser ? { ...prevUser, ...updates } : prevUser);
  }, [setCurrentUser]);

  const handleTrackingStatsUpdate = useCallback((stats: TrackingStats) => {
    setCurrentTrackingStats(stats);
  }, [setCurrentTrackingStats]);

  // Fullscreen handler
  const handleMapFullscreenChange = useCallback((shouldBeFullscreen: boolean) => {
    setIsFullscreenTransition(true);
    setIsMapFullscreen(shouldBeFullscreen);
    
    if (shouldBeFullscreen) {
      document.body.classList.add('fullscreen-mode');
    } else {
      document.body.classList.remove('fullscreen-mode');
    }
    
    const timeoutId = setTimeout(() => {
      setIsFullscreenTransition(false);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [setIsFullscreenTransition, setIsMapFullscreen]);

  // Analytics handlers
  const handleToggleAnalytics = useCallback(() => {
    setShowAdditionalCards(prev => !prev);
  }, [setShowAdditionalCards]);

  const handleUpgrade = useCallback((plan: 'basic' | 'pro') => {
    if (plan === 'pro' && currentUser) {
      const wasBasicUser = !currentUser.isVerified;
      
      setCurrentUser(prevUser => prevUser ? ({ 
        ...prevUser, 
        isVerified: true
      }) : prevUser);
      setShowPremiumPlans(false);
      
      if (wasBasicUser) {
        setUnlockAnimationType('pro');
        setShowUnlockAnimation(true);
      }
    }
  }, [currentUser, setCurrentUser, setShowPremiumPlans, setUnlockAnimationType, setShowUnlockAnimation]);

  const handleShowUpgrade = useCallback(() => {
    setShowPremiumPlans(true);
  }, [setShowPremiumPlans]);

  const handleCloseUnlockAnimation = useCallback(() => {
    setShowUnlockAnimation(false);
  }, [setShowUnlockAnimation]);

  // Tutorial handlers
  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false);
  }, [setShowTutorial]);

  const handleTutorialTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, [setActiveTab]);

  const handleShowTutorial = useCallback(() => {
    setShowTutorial(true);
    setIsMobileMenuOpen(false);
  }, [setShowTutorial, setIsMobileMenuOpen]);



  // User switching handler
  const handleUserChange = useCallback((newUser: UserType) => {
    console.log('🔄 Switching user:', {
      from: currentUser?.username,
      to: newUser.username,
      newRole: newUser.role?.type
    });
    
    setCurrentUser(() => newUser);
    setRuns(() => createSampleRuns(newUser.id));
    
    // Reset any tracking session when switching users
    setIsTracking(false);
    setIsPaused(false);
    setHasTrackingSession(false);
    setSessionStartTime(null);
    setSelectedResort(null);
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      // Silently handle localStorage errors
    }
    setTrackingComponentKey(`tracking-${Date.now()}`);
    
    // Clear any viewed profile
    setViewingUserProfile(null);
    
    // Navigate to dashboard to see the new user
    setActiveTab('dashboard');
  }, [currentUser, setCurrentUser, setRuns, setIsTracking, setIsPaused, setHasTrackingSession, setSessionStartTime, setSelectedResort, setTrackingComponentKey, setViewingUserProfile, setActiveTab]);

  const handleAdminAccess = useCallback(() => {
    if (!currentUser) return;

    const hasAdminAccess = RoleService.hasAdminAccess(currentUser);
    const isPlatformAdmin = RoleService.isPlatformAdmin(currentUser);
    const isSkiFieldAdmin = RoleService.isSkiFieldAdmin(currentUser);

    console.log('🔧 Admin access attempt:', {
      userEmail: currentUser?.email,
      userRole: currentUser?.role?.type,
      hasAdminAccess,
      isPlatformAdmin,
      isSkiFieldAdmin
    });
    
    if (hasAdminAccess) {
      console.log('✅ Admin access granted via role system');
      
      // Platform admins get full admin console
      if (isPlatformAdmin) {
        console.log('🔧 Opening Platform Admin Console');
        setShowAdminConsole(true);
      } 
      // Ski field admins get their specific admin dashboard
      else if (isSkiFieldAdmin) {
        console.log('🔧 Opening Ski Field Admin Dashboard');
        setShowSkiFieldAdmin(true);
      }
    } else {
      console.log('❌ Admin access denied - insufficient role permissions');
      alert('Admin access requires proper role assignment. Contact support.');
    }
  }, [currentUser, setShowAdminConsole, setShowSkiFieldAdmin]);

  return {
    handleUserSelect,
    handleStartTracking,
    handlePauseTracking,
    handleStopTracking,
    handleSaveRun,
    handleChangeResort,
    confirmResetTrackingSession,
    handleResortSelect,
    handleCloseResortSelector,
    handleUpdateUser,
    handleTrackingStatsUpdate,
    handleMapFullscreenChange,
    handleToggleAnalytics,
    handleUpgrade,
    handleShowUpgrade,
    handleCloseUnlockAnimation,
    handleCloseTutorial,
    handleTutorialTabChange,
    handleShowTutorial,

    handleUserChange,
    handleAdminAccess,
  };
}