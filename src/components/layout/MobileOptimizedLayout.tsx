import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { EnhancedMobileNav } from './EnhancedMobileNav';
import { InstallPWAPrompt, OfflineManager, MobileStatusBar } from '../mobile/PWAEnhancements';
import { PullToRefresh } from '../mobile/MobileEnhancements';
import { toast, Toaster } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import {
  Menu,
  X,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  BellRing,
  Settings,
  HelpCircle,
  Shield,
  Zap
} from 'lucide-react';

interface MobileOptimizedLayoutProps {
  isTracking?: boolean;
  onStartTracking?: () => void;
  onPauseTracking?: () => void;
  onStopTracking?: () => void;
  trackingStats?: {
    duration: number;
    distance: number;
    speed: number;
  };
}

export function MobileOptimizedLayout({
  isTracking,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  trackingStats
}: MobileOptimizedLayoutProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const [showOfflineManager, setShowOfflineManager] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  
  const location = useLocation();
  const layoutRef = useRef<HTMLDivElement>(null);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after a delay (better UX)
      setTimeout(() => {
        setShowPWAPrompt(true);
      }, 10000);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPWAPrompt(false);
      
      // Store installation status
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already prompted
    const hasPrompted = localStorage.getItem('pwa-prompt-dismissed');
    const isInstalled = localStorage.getItem('pwa-installed');
    
    if (hasPrompted || isInstalled) {
      setShowPWAPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle network status
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle notifications
  useEffect(() => {
    // Simulate receiving notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const messages = [
          'New run uploaded by @skiPro!',
          'Weather alert: Fresh powder incoming!',
          'You\'ve reached a new personal best!',
          'Friend request from @alpineExplorer'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setNotifications(prev => [...prev, randomMessage]);
        
        // Show toast notification
        toast.info(randomMessage, {
          action: {
            label: 'View',
            onClick: () => console.log('View notification')
          }
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    triggerHaptic('light');
    
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear notifications as part of refresh
      setNotifications([]);
      
      toast.success('Data refreshed!', {
        icon: '🔄'
      });
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle PWA installation
  const handlePWAInstall = () => {
    setShowPWAPrompt(false);
    triggerHaptic('medium');
  };

  const handlePWADismiss = () => {
    setShowPWAPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    triggerHaptic('light');
  };

  // Get page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/track': return 'Track Session';
      case '/social': return 'Social Feed';
      case '/leaderboards': return 'Rankings';
      case '/profile': return 'Profile';
      case '/settings': return 'Settings';
      default: return 'SKI TRACER';
    }
  };

  return (
    <div 
      ref={layoutRef}
      className="min-h-screen bg-gray-50 overflow-hidden flex flex-col"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      {/* Status Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            {isOfflineMode && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                Offline
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <MobileStatusBar />
            
            {notifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotifications([])}
                className="relative"
              >
                <BellRing className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              </motion.button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuickSettings(!showQuickSettings)}
              className="w-8 h-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Settings Panel */}
      <AnimatePresence>
        {showQuickSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b overflow-hidden"
          >
            <div className="p-4 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOfflineManager(!showOfflineManager)}
                className="flex flex-col items-center p-3 h-auto space-y-1"
              >
                {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                <span className="text-xs">Network</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerHaptic('medium')}
                className="flex flex-col items-center p-3 h-auto space-y-1"
              >
                <Zap className="w-4 h-4" />
                <span className="text-xs">Haptic</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Help section coming soon!')}
                className="flex flex-col items-center p-3 h-auto space-y-1"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs">Help</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Manager */}
      <AnimatePresence>
        {showOfflineManager && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 border-b overflow-hidden"
          >
            <OfflineManager />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Pull-to-Refresh */}
      <div className="flex-1 overflow-hidden">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="h-full overflow-auto">
            <main className="pb-24"> {/* Bottom padding for navigation */}
              <Outlet />
            </main>
          </div>
        </PullToRefresh>
      </div>

      {/* Enhanced Mobile Navigation */}
      <EnhancedMobileNav
        isTracking={isTracking}
        onStartTracking={onStartTracking}
        onPauseTracking={onPauseTracking}
        onStopTracking={onStopTracking}
        trackingStats={trackingStats}
      />

      {/* PWA Install Prompt */}
      {showPWAPrompt && (
        <InstallPWAPrompt
          deferredPrompt={deferredPrompt}
          onInstall={handlePWAInstall}
          onDismiss={handlePWADismiss}
        />
      )}

      {/* Enhanced Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            padding: '12px 16px'
          },
          actionButtonStyle: {
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px'
          }
        }}
        expand
        richColors
      />
    </div>
  );
}