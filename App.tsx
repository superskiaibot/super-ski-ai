import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';
import { Button } from './components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';

// Import all components
import { Dashboard } from './components/Dashboard';
import { UnifiedTracking } from './components/UnifiedTracking';
import { Social } from './components/Social';
import { Leaderboards } from './components/Leaderboards';
import { Profile } from './components/Profile';
import { UserSearch } from './components/UserSearch';
import { SettingsPage } from './components/SettingsPage';
import { PremiumPlans } from './components/PremiumPlans';
import { Tutorial } from './components/Tutorial';
import { UnlockAnimation } from './components/UnlockAnimation';
import { ResortSelector } from './components/ResortSelector';
import { AdminConsole } from './components/AdminConsole';
import { AdminDocumentation } from './components/AdminDocumentation';

// Import new event components
import { EventJoinModule } from './components/event/EventJoinModule';
import { TrackingEventStrip } from './components/event/TrackingEventStrip';

import { SkiFieldAdminDashboard } from './components/SkiFieldAdminDashboard';
import { DesktopLayout } from './src/components/layout/DesktopLayout';
import { MobileLayout } from './src/components/layout/MobileLayout';

// Import custom hooks
import { useAppState } from './src/hooks/useAppState';
import { useAppHandlers } from './src/hooks/useAppHandlers';
import { useEventState } from './src/hooks/useEventState';

// Import utilities
import { RoleService } from './src/utils/roleService';
import { NAVIGATION_ITEMS } from './src/constants/app';
import { TrackingSessionStatus } from './src/types/app';

function App() {
  const state = useAppState();
  const eventState = useEventState();
  const handlers = useAppHandlers({
    currentUser: state.currentUser,
    sessionStartTime: state.sessionStartTime,
    isTracking: state.isTracking,
    hasTrackingSession: state.hasTrackingSession,
    setActiveTab: state.setActiveTab,
    setViewingUserProfile: state.setViewingUserProfile,
    setSessionStartTime: state.setSessionStartTime,
    setIsTracking: state.setIsTracking,
    setHasTrackingSession: state.setHasTrackingSession,
    setIsPaused: state.setIsPaused,
    setRuns: state.setRuns,
    setSelectedResort: state.setSelectedResort,
    setTrackingComponentKey: state.setTrackingComponentKey,
    setShowResetDialog: state.setShowResetDialog,
    setShowResortSelector: state.setShowResortSelector,
    setCurrentUser: state.setCurrentUser,
    setCurrentTrackingStats: state.setCurrentTrackingStats,
    setIsFullscreenTransition: state.setIsFullscreenTransition,
    setIsMapFullscreen: state.setIsMapFullscreen,
    setShowAdditionalCards: state.setShowAdditionalCards,
    setShowPremiumPlans: state.setShowPremiumPlans,
    setUnlockAnimationType: state.setUnlockAnimationType,
    setShowUnlockAnimation: state.setShowUnlockAnimation,
    setShowTutorial: state.setShowTutorial,
    setIsMobileMenuOpen: state.setIsMobileMenuOpen,
    setShowAdminConsole: state.setShowAdminConsole,
    setShowSkiFieldAdmin: state.setShowSkiFieldAdmin,
    setSelectedSkiFieldForAdmin: state.setSelectedSkiFieldForAdmin,
  });

  // Add admin documentation state
  const [showAdminDocumentation, setShowAdminDocumentation] = React.useState(false);

  const {
    activeTab,
    currentUser,
    hasTrackingSession,
    isTracking,
    isPaused,
    viewingUserProfile,
    runs,
    showResetDialog,
    showResortSelector,
    selectedResort,
    isMobile,
    showTutorial,
    showUnlockAnimation,
    unlockAnimationType,
    showSkiFieldAdmin,
    selectedSkiFieldForAdmin,
    showAdminConsole,
    showPremiumPlans,
    hasVisitedTracking,
    trackingComponentKey,
    sessionStartTime,
    isMapFullscreen,
    isFullscreenTransition,
    showAnalyticsSection,
  } = state;

  // Event state
  const {
    showJoinEventModal,
    setShowJoinEventModal,
    eventJoinData,
    eventStripData,
    eventManagementData,
    handleEventJoinComplete
  } = eventState;

  // Early return if no user loaded
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-glacier-blue via-snow to-powder-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-ultra-ice-blue/10 flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-ultra-ice-blue" />
          </div>
          <h1 className="text-2xl font-semibold text-midnight mb-3">Loading Snowline...</h1>
          <p className="text-muted-foreground">Preparing your ski tracking experience</p>
        </div>
      </div>
    );
  }

  // Enhanced tracking status determination
  const trackingSessionStatus: TrackingSessionStatus = hasTrackingSession 
    ? isTracking 
      ? 'LIVE' 
      : isPaused
        ? 'PAUSED'
        : 'STOPPED'
    : null;

  // Navigation items with tracking status
  const navigationItems = NAVIGATION_ITEMS.map(item => ({
    ...item,
    badge: item.id === 'tracking' ? trackingSessionStatus : null
  }));

  // Fixed: Independent resort selection - no event dependencies
  const handleSkiFieldSelection = (resort: any) => {
    handlers.handleResortSelect(resort);
    // Resort selection is now completely independent of events
  };

  const handleEventStripInvite = () => {
    // Handle team invite functionality
    console.log('Invite team member');
  };

  const handleEventStripLeaderboard = () => {
    // Handle leaderboard navigation
    console.log('Show leaderboard');
  };

  const handleEventStripPause = () => {
    if (isTracking) {
      handlers.handlePauseTracking();
    } else {
      handlers.handleStartTracking();
    }
  };

  const handleEventStripUnlock = () => {
    // Handle payment/unlock functionality
    setShowJoinEventModal(true);
  };

  // Enhanced event join completion handler
  const handleEventJoinCompleteWithTracking = (data: any) => {
    console.log('🎿 Event join completed, enabling tracking interface:', data);
    handleEventJoinComplete(data);
  };

  // Show admin documentation if requested
  if (showAdminDocumentation) {
    return (
      <AdminDocumentation
        currentUser={currentUser}
        onClose={() => setShowAdminDocumentation(false)}
      />
    );
  }

  // Show admin console if requested
  if (showAdminConsole) {
    return (
      <AdminConsole
        currentUser={currentUser}
        onClose={() => {
          state.setShowAdminConsole(false);
          state.setSelectedSkiFieldForAdmin(null);
        }}
        onSelectSkiField={(skiFieldId: string) => {
          console.log('🏔️ Platform admin selecting ski field:', skiFieldId);
          state.setSelectedSkiFieldForAdmin(skiFieldId);
          state.setShowAdminConsole(false);
          state.setShowSkiFieldAdmin(true);
        }}
        onShowDocumentation={() => {
          state.setShowAdminConsole(false);
          setShowAdminDocumentation(true);
        }}
      />
    );
  }

  // Enhanced ski field admin dashboard handling
  if (showSkiFieldAdmin) {
    // Determine the correct ski field ID for the admin dashboard
    let effectiveSkiFieldId = selectedSkiFieldForAdmin;
    
    // If no ski field is explicitly selected and the user is a ski field admin,
    // automatically assign their first assigned ski field
    if (!effectiveSkiFieldId && RoleService.isSkiFieldAdmin(currentUser)) {
      const assignedFields = currentUser.role?.assignedSkiFields;
      if (assignedFields && assignedFields.length > 0) {
        effectiveSkiFieldId = assignedFields[0];
        console.log('🎿 Auto-assigning ski field admin to their first assigned field:', effectiveSkiFieldId);
      }
    }

    return (
      <SkiFieldAdminDashboard 
        currentUser={currentUser}
        onClose={() => {
          state.setShowSkiFieldAdmin(false);
          state.setSelectedSkiFieldForAdmin(null);
        }}
        selectedSkiFieldId={effectiveSkiFieldId}
        onShowDocumentation={() => {
          state.setShowSkiFieldAdmin(false);
          setShowAdminDocumentation(true);
        }}
      />
    );
  }

  // Show premium plans modal
  if (showPremiumPlans) {
    return (
      <PremiumPlans
        currentUser={currentUser}
        onUpgrade={handlers.handleUpgrade}
        onClose={() => state.setShowPremiumPlans(false)}
      />
    );
  }

  // Determine which user profile to show and whether it's own profile
  const profileUser = viewingUserProfile || currentUser;
  const isOwnProfile = !viewingUserProfile;

  // Role-based access control
  const roleBadge = RoleService.getRoleBadge(currentUser);
  const hasAdminAccess = RoleService.hasAdminAccess(currentUser);
  const isProUser = currentUser.isVerified;

  // Enhanced admin access handler that includes documentation
  const handleAdminAccess = () => {
    if (RoleService.isPlatformAdmin(currentUser)) {
      state.setShowAdminConsole(true);
    } else if (RoleService.isSkiFieldAdmin(currentUser)) {
      state.setShowSkiFieldAdmin(true);
    }
  };

  // Admin documentation access handler
  const handleShowAdminDocumentation = () => {
    setShowAdminDocumentation(true);
  };

  // Main content renderer - Fixed to separate event and resort selection
  const renderMainContent = () => {
    if (hasVisitedTracking && activeTab === 'tracking') {
      // Fixed: Always show normal tracking interface
      // Event participation is now completely optional and doesn't block access
      return (
        <div className="h-full min-h-screen relative">
          <UnifiedTracking
            key={trackingComponentKey}
            currentUser={currentUser}
            isTracking={isTracking}
            isPaused={isPaused}
            hasActiveSession={hasTrackingSession}
            sessionStartTime={sessionStartTime}
            onStartTracking={handlers.handleStartTracking}
            onPauseTracking={handlers.handlePauseTracking}
            onStopTracking={handlers.handleStopTracking}
            onSaveRun={handlers.handleSaveRun}
            onOpenAnalytics={handlers.handleToggleAnalytics}
            onUpgrade={handlers.handleShowUpgrade}
            onTrackingStatsUpdate={handlers.handleTrackingStatsUpdate}
            runs={runs}
            selectedResort={selectedResort}
            onResortSelect={handleSkiFieldSelection}
            showResortSelector={showResortSelector}
            onShowResortSelector={() => state.setShowResortSelector(true)}
            onCloseResortSelector={handlers.handleCloseResortSelector}
            showAnalyticsSection={showAnalyticsSection}
            isMapFullscreen={isMapFullscreen}
            isFullscreenTransition={isFullscreenTransition}
            onMapFullscreenChange={handlers.handleMapFullscreenChange}
            eventStripData={eventStripData}
            eventManagementData={eventManagementData}
            onEventJoinComplete={handleEventJoinCompleteWithTracking}
          />
          
          {/* Event Strip - Optional, only shows if event is active */}
          {eventStripData && (
            <TrackingEventStrip
              isVisible={!isMapFullscreen && eventStripData !== null}
              eventData={eventStripData}
              onInvite={handleEventStripInvite}
              onLeaderboard={handleEventStripLeaderboard}
              onPauseTracking={handleEventStripPause}
              onUnlockTracking={handleEventStripUnlock}
              isTrackingActive={isTracking}
              isPaid={eventManagementData.paymentStatus === 'paid'}
            />
          )}
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div 
            key="dashboard" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-50 via-white to-blue-50"
          >
            <Dashboard 
              currentUser={currentUser} 
              runs={runs}
              onUpgrade={handlers.handleShowUpgrade}
            />
          </motion.div>
        )}
        {activeTab === 'social' && (
          <motion.div 
            key="social" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <UserSearch 
              currentUser={currentUser}
              onUserSelect={handlers.handleUserSelect}
            />
          </motion.div>
        )}
        {activeTab === 'skiforacure' && (
          <motion.div 
            key="skiforacure" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Social 
              currentUser={currentUser}
              onUpgrade={handlers.handleShowUpgrade}
              runs={runs}
              onSaveRun={handlers.handleSaveRun}
              eventManagementData={eventManagementData}
              onInviteTeamMember={handleEventStripInvite}
              onViewLeaderboard={handleEventStripLeaderboard}
              onJoinEvent={() => setShowJoinEventModal(true)}
              onUpdateTeam={(teamInfo) => {
                // Update team information
                console.log('Update team:', teamInfo);
              }}
              onRedirectToTracking={(mode) => {
                // Navigate to tracking - normal access, no event requirements
                state.setActiveTab('tracking');
              }}
            />
          </motion.div>
        )}
        {activeTab === 'leaderboards' && (
          <motion.div 
            key="leaderboards" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-50 via-white to-blue-50"
          >
            <Leaderboards currentUser={currentUser} runs={runs} />
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div 
            key="profile" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-50 via-white to-blue-50"
          >
            <Profile 
              user={profileUser}
              currentUser={currentUser}
              isOwnProfile={isOwnProfile}
              runs={runs}
              onUpdateProfile={handlers.handleUpdateUser}
            />
          </motion.div>
        )}
        {activeTab === 'settings' && (
          <motion.div 
            key="settings" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-50 via-white to-blue-50"
          >
            <SettingsPage 
              currentUser={currentUser}
              onUpdateUser={handlers.handleUpdateUser}
              onShowAdminDocumentation={hasAdminAccess ? handleShowAdminDocumentation : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className={`min-h-screen bg-background ${isMapFullscreen ? 'fullscreen-mode' : ''}`} data-tutorial="app-container">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        <DesktopLayout
          currentUser={currentUser}
          isProUser={isProUser}
          hasAdminAccess={hasAdminAccess}
          roleBadge={roleBadge}
          navigationItems={navigationItems}
          activeTab={activeTab}
          viewingUserProfile={viewingUserProfile}
          selectedResort={selectedResort}
          isMapFullscreen={isMapFullscreen}
          onTabChange={(tab) => {
            state.setActiveTab(tab);
            if (tab !== 'profile') {
              state.setViewingUserProfile(null);
            }
          }}
          onUserChange={handlers.handleUserChange}
          onChangeResort={handlers.handleChangeResort}
          onShowUpgrade={handlers.handleShowUpgrade}
          onAdminAccess={handleAdminAccess}
          onViewMyProfile={() => state.setViewingUserProfile(null)}
          onShowAdminDocumentation={hasAdminAccess ? handleShowAdminDocumentation : undefined}
        >
          {renderMainContent()}
        </DesktopLayout>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout
          currentUser={currentUser}
          isProUser={isProUser}
          hasAdminAccess={hasAdminAccess}
          roleBadge={roleBadge}
          navigationItems={navigationItems}
          activeTab={activeTab}
          viewingUserProfile={viewingUserProfile}
          selectedResort={selectedResort}
          trackingSessionStatus={trackingSessionStatus}
          isMobileMenuOpen={state.isMobileMenuOpen}
          isMapFullscreen={isMapFullscreen}
          onTabChange={(tab) => {
            state.setActiveTab(tab);
            if (tab !== 'profile') {
              state.setViewingUserProfile(null);
            }
          }}
          onUserChange={handlers.handleUserChange}
          onChangeResort={handlers.handleChangeResort}
          onShowUpgrade={handlers.handleShowUpgrade}
          onAdminAccess={handleAdminAccess}
          onViewMyProfile={() => state.setViewingUserProfile(null)}
          onShowTutorial={handlers.handleShowTutorial}
          onToggleMobileMenu={() => state.setIsMobileMenuOpen(!state.isMobileMenuOpen)}
          onShowAdminDocumentation={hasAdminAccess ? handleShowAdminDocumentation : undefined}
        >
          {renderMainContent()}
        </MobileLayout>
      </div>

      {/* Dialogs and Modals */}
      <AlertDialog open={showResetDialog} onOpenChange={state.setShowResetDialog}>
        <AlertDialogContent className="mx-auto max-w-md w-[90vw] sm:w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 snowline-card">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="flex items-center justify-center space-x-2 text-xl">
              <MapPin className="w-6 h-6 text-primary" />
              <span>Change Ski Resort?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed text-center text-base pt-4">
              You're about to change your ski resort selection.
              {(isTracking || hasTrackingSession) && (
                <span className="block mt-4 text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  ⚠️ This will end your current tracking session and any unsaved data will be lost.
                </span>
              )}
              <span className="block mt-4 text-muted-foreground">Are you sure you want to continue?</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-6">
            <AlertDialogCancel className="w-full sm:w-auto min-w-24 rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlers.confirmResetTrackingSession}
              className="w-full sm:w-auto min-w-24 bg-primary hover:bg-primary/90 rounded-xl"
            >
              Change Resort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fixed: Independent ResortSelector - no event dependencies */}
      <ResortSelector
        isOpen={showResortSelector}
        onClose={handlers.handleCloseResortSelector}
        onSelectResort={handleSkiFieldSelection}
        selectedResort={selectedResort}
      />

      {/* Event Join Modal - Optional feature, only shows when explicitly requested */}
      {showJoinEventModal && (
        <EventJoinModule
          isOpen={showJoinEventModal}
          onClose={() => setShowJoinEventModal(false)}
          onJoinComplete={handleEventJoinCompleteWithTracking}
          showAsModal={true}
          onRedirectToTracking={(mode) => {
            // Navigate to tracking - normal access, no event requirements
            state.setActiveTab('tracking');
            setShowJoinEventModal(false);
          }}
        />
      )}

      {isMobile && (
        <Tutorial
          isOpen={showTutorial}
          onClose={handlers.handleCloseTutorial}
          currentUser={currentUser}
          activeTab={activeTab}
          onTabChange={handlers.handleTutorialTabChange}
        />
      )}

      <UnlockAnimation
        isOpen={showUnlockAnimation}
        onClose={handlers.handleCloseUnlockAnimation}
        type={unlockAnimationType}
      />
    </div>
  );
}

export default App;