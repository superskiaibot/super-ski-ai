import { User as UserType, SavedRun } from './index';

// Define proper types for tracking session status
export type TrackingSessionStatus = 'LIVE' | 'PAUSED' | 'STOPPED' | null;

// App state interface
export interface AppState {
  // Core app state
  activeTab: string;
  isTracking: boolean;
  hasTrackingSession: boolean;
  isMobileMenuOpen: boolean;
  showPremiumPlans: boolean;
  currentUser: UserType | null;
  runs: SavedRun[];

  // Modal and dialog states
  showTutorial: boolean;
  showUnlockAnimation: boolean;
  unlockAnimationType: 'pro';
  showResetDialog: boolean;
  showResortSelector: boolean;
  showAdminConsole: boolean;
  showAchievementDashboard: boolean;
  showSkiFieldAdmin: boolean;
  selectedSkiFieldForAdmin: string | null;

  // Profile viewing state
  viewingUserProfile: UserType | null;

  // Device and UI states
  isMobile: boolean;
  tutorialInitialized: boolean;

  // Tracking-specific states
  hasVisitedTracking: boolean;
  trackingComponentKey: string;
  isPaused: boolean;
  sessionStartTime: Date | null;

  // Fullscreen state management
  isMapFullscreen: boolean;
  isFullscreenTransition: boolean;

  // Analytics states
  showAdditionalCards: boolean;
  showAnalyticsSection: boolean;
}

// App handlers interface
export interface AppHandlers {
  // Navigation handlers
  setActiveTab: (tab: string) => void;
  handleUserSelect: (user: UserType) => void;
  
  // Tracking handlers
  handleStartTracking: () => void;
  handlePauseTracking: () => void;
  handleStopTracking: () => void;
  handleSaveRun: (run: SavedRun) => void;
  
  // Resort handlers
  handleChangeResort: () => void;
  handleResortSelect: (resort: any) => void;
  handleCloseResortSelector: () => void;
  
  // User handlers
  handleUpdateUser: (updates: Partial<UserType>) => void;
  handleUserChange: (newUser: UserType) => void;
  
  // UI handlers
  handleShowUpgrade: () => void;
  handleUpgrade: (plan: 'basic' | 'pro') => void;
  handleShowTutorial: () => void;
  handleCloseTutorial: () => void;
  handleTutorialTabChange: (tab: string) => void;
  
  // Admin handlers
  handleAdminAccess: () => void;
  
  // Fullscreen handlers
  handleMapFullscreenChange: (shouldBeFullscreen: boolean) => void;
  
  // Other handlers
  handleToggleAnalytics: () => void;
  handleCloseUnlockAnimation: () => void;
}

// Extend Window interface to include resizeTimeout
declare global {
  interface Window {
    resizeTimeout: NodeJS.Timeout;
  }
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  badge: TrackingSessionStatus;
}