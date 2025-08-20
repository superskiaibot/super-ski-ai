import { useState, useEffect, useRef } from 'react';
import { User as UserType, SavedRun } from '../types/index';
import { AppState } from '../types/app';
import { TrackingStats, Resort } from '../../components/tracking/types';

import { MOCK_USERS } from '../utils/mockUsers';
import { STORAGE_KEYS, APP_CONFIG, createSampleRuns } from '../constants/app';

export function useAppState() {
  // Core app state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTracking, setIsTracking] = useState(false);
  const [hasTrackingSession, setHasTrackingSession] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPremiumPlans, setShowPremiumPlans] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [runs, setRuns] = useState<SavedRun[]>([]);

  // Modal and dialog states
  const [showTutorial, setShowTutorial] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockAnimationType, setUnlockAnimationType] = useState<'pro'>('pro');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showResortSelector, setShowResortSelector] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);

  const [showSkiFieldAdmin, setShowSkiFieldAdmin] = useState(false);
  const [selectedSkiFieldForAdmin, setSelectedSkiFieldForAdmin] = useState<string | null>(null);

  // Profile viewing state
  const [viewingUserProfile, setViewingUserProfile] = useState<UserType | null>(null);



  // Device and UI states
  const [isMobile, setIsMobile] = useState(false);
  const [tutorialInitialized, setTutorialInitialized] = useState(false);

  // Tracking-specific states
  const [hasVisitedTracking, setHasVisitedTracking] = useState(false);
  const [trackingComponentKey, setTrackingComponentKey] = useState('tracking-1');
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentTrackingStats, setCurrentTrackingStats] = useState<TrackingStats | null>(null);
  
  // Fullscreen state management
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isFullscreenTransition, setIsFullscreenTransition] = useState(false);

  // Analytics states
  const [showAdditionalCards, setShowAdditionalCards] = useState(false);
  const [showAnalyticsSection] = useState(true);

  // Refs to prevent infinite loops
  const isInitializedRef = useRef(false);
  const sessionLoadedRef = useRef(false);
  const saveSessionTimeoutRef = useRef<NodeJS.Timeout>();

  // Mobile detection with proper cleanup
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < APP_CONFIG.MOBILE_BREAKPOINT);
    };

    checkIsMobile();
    
    const throttledResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(checkIsMobile, APP_CONFIG.RESIZE_THROTTLE_DELAY);
    };

    window.addEventListener('resize', throttledResize);
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(window.resizeTimeout);
    };
  }, []);

  // Initialize user with proper Snowline branding
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initializeUser = () => {
      const mockUser = MOCK_USERS.normalUser;
      setCurrentUser(mockUser);
      setRuns(createSampleRuns(mockUser.id));
    };

    initializeUser();
  }, []);

  // Tutorial auto-show logic
  useEffect(() => {
    if (!currentUser || !isMobile || tutorialInitialized) return;

    setTutorialInitialized(true);
    
    try {
      const hasVisitedBefore = localStorage.getItem(STORAGE_KEYS.USER_FIRST_VISIT);
      const tutorialCompleted = localStorage.getItem(STORAGE_KEYS.TUTORIAL_COMPLETED);
      
      const shouldAutoShowTutorial = !hasVisitedBefore || (!tutorialCompleted && !hasVisitedBefore);
      
      if (shouldAutoShowTutorial) {
        localStorage.setItem(STORAGE_KEYS.USER_FIRST_VISIT, 'true');
        
        const timer = setTimeout(() => {
          setShowTutorial(true);
        }, APP_CONFIG.TUTORIAL_DELAY);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      // Silently handle localStorage errors
    }
  }, [currentUser?.id, isMobile, tutorialInitialized]);

  // Load existing tracking session
  useEffect(() => {
    if (sessionLoadedRef.current) return;
    sessionLoadedRef.current = true;

    const loadTrackingSession = () => {
      try {
        const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          
          const sessionAge = Date.now() - (sessionData.timestamp || 0);
          
          if (sessionAge < APP_CONFIG.SESSION_MAX_AGE && sessionData.hasActiveSession) {
            setHasTrackingSession(true);
            setIsTracking(sessionData.isTracking || false);
            setIsPaused(sessionData.isPaused || false);
            setHasVisitedTracking(true);
            
            if (sessionData.sessionStartTime) {
              setSessionStartTime(new Date(sessionData.sessionStartTime));
            }
            
            if (sessionData.selectedResort) {
              setSelectedResort(sessionData.selectedResort);
            }
            
            if (sessionData.hasActiveSession) {
              setActiveTab('tracking');
            }
          } else {
            localStorage.removeItem(STORAGE_KEYS.SESSION);
          }
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    };

    loadTrackingSession();
  }, []);

  // Save session state when it changes (throttled)
  useEffect(() => {
    if (saveSessionTimeoutRef.current) {
      clearTimeout(saveSessionTimeoutRef.current);
    }

    const saveTrackingSession = () => {
      if (hasTrackingSession) {
        try {
          const sessionData = {
            hasActiveSession: hasTrackingSession,
            isTracking: isTracking,
            isPaused: isPaused,
            timestamp: Date.now(),
            sessionStartTime: sessionStartTime?.toISOString(),
            selectedResort: selectedResort,
            trackingComponentKey: trackingComponentKey
          };
          
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        } catch (error) {
          // Silently handle localStorage errors
        }
      } else {
        try {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        } catch (error) {
          // Silently handle localStorage errors
        }
      }
    };

    saveSessionTimeoutRef.current = setTimeout(saveTrackingSession, APP_CONFIG.SESSION_SAVE_THROTTLE);

    return () => {
      if (saveSessionTimeoutRef.current) {
        clearTimeout(saveSessionTimeoutRef.current);
      }
    };
  }, [hasTrackingSession, isTracking, isPaused, selectedResort?.id, trackingComponentKey, sessionStartTime]);



  // Track when user visits pages and handle tab changes
  useEffect(() => {
    if (activeTab === 'tracking') {
      setHasVisitedTracking(true);
    }
    
    // Clear profile view when changing tabs (unless going to profile tab)
    if (activeTab !== 'profile') {
      setViewingUserProfile(null);
    }
    
    // Scroll to top for all tab changes
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      if (document.body) {
        document.body.scrollTop = 0;
      }
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 10);
    };
    
    scrollToTop();
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [activeTab]);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowPremiumPlans(false);
        setShowResetDialog(false);
        setShowResortSelector(false);
        setShowTutorial(false);
        setShowUnlockAnimation(false);

      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return {
    // State
    activeTab,
    isTracking,
    hasTrackingSession,
    isMobileMenuOpen,
    showPremiumPlans,
    currentUser,
    runs,
    showTutorial,
    showUnlockAnimation,
    unlockAnimationType,
    showResetDialog,
    showResortSelector,
    showAdminConsole,

    showSkiFieldAdmin,
    selectedSkiFieldForAdmin,
    viewingUserProfile,

    isMobile,
    tutorialInitialized,
    hasVisitedTracking,
    trackingComponentKey,
    selectedResort,
    isPaused,
    sessionStartTime,
    currentTrackingStats,
    isMapFullscreen,
    isFullscreenTransition,
    showAdditionalCards,
    showAnalyticsSection,

    // Setters
    setActiveTab,
    setIsTracking,
    setHasTrackingSession,
    setIsMobileMenuOpen,
    setShowPremiumPlans,
    setCurrentUser,
    setRuns,
    setShowTutorial,
    setShowUnlockAnimation,
    setUnlockAnimationType,
    setShowResetDialog,
    setShowResortSelector,
    setShowAdminConsole,

    setShowSkiFieldAdmin,
    setSelectedSkiFieldForAdmin,
    setViewingUserProfile,

    setIsMobile,
    setTutorialInitialized,
    setHasVisitedTracking,
    setTrackingComponentKey,
    setSelectedResort,
    setIsPaused,
    setSessionStartTime,
    setCurrentTrackingStats,
    setIsMapFullscreen,
    setIsFullscreenTransition,
    setShowAdditionalCards,
  };
}