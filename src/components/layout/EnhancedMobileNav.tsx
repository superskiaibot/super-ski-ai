import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Home,
  Mountain,
  Users,
  User,
  Settings,
  Camera,
  Play,
  Pause,
  Square,
  MapPin,
  Trophy,
  Bell,
  Search,
  Plus,
  ChevronUp,
  Zap,
  Activity,
  TrendingUp,
  Radio,
  Mic,
  MicOff
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../components/ui/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { FloatingRadioButton } from '../../../components/radio/FloatingRadioButton';
import { User as UserType } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
  color?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
}

interface EnhancedMobileNavProps {
  currentUser: UserType;
  isTracking?: boolean;
  onStartTracking?: () => void;
  onPauseTracking?: () => void;
  onStopTracking?: () => void;
  trackingStats?: {
    duration: number;
    distance: number;
    speed: number;
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    resort?: string;
  };
}

export function EnhancedMobileNav({
  currentUser,
  isTracking = false,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  trackingStats,
  currentLocation
}: EnhancedMobileNavProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [notifications, setNotifications] = useState(3);
  const [showRadio, setShowRadio] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);

  // Enhanced navigation items with radio integration
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/',
      color: 'text-blue-600'
    },
    {
      id: 'track',
      label: 'Track',
      icon: Mountain,
      path: '/track',
      color: 'text-green-600'
    },
    {
      id: 'radio',
      label: 'Radio',
      icon: Radio,
      path: '/radio',
      color: 'text-purple-600'
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      path: '/social',
      badge: notifications,
      color: 'text-orange-600'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      color: 'text-red-600'
    }
  ];

  // Enhanced quick actions with radio controls
  const quickActions: QuickAction[] = [
    {
      id: 'radio',
      label: 'Radio',
      icon: Radio,
      action: () => setShowRadio(true),
      color: 'bg-purple-500'
    },
    {
      id: 'camera',
      label: 'Camera',
      icon: Camera,
      action: () => handleQuickCamera(),
      color: 'bg-blue-500'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: () => handleQuickSearch(),
      color: 'bg-green-500'
    },
    {
      id: 'resorts',
      label: 'Resorts',
      icon: MapPin,
      action: () => handleQuickResorts(),
      color: 'bg-orange-500'
    }
  ];

  // Update active tab based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => 
      currentPath === item.path || 
      (currentPath.startsWith(item.path) && item.path !== '/')
    );
    if (activeItem) {
      setActiveTab(activeItem.id);
    }
  }, [location.pathname]);

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

  // Handle navigation with haptic feedback
  const handleNavigation = (item: NavItem) => {
    triggerHaptic('light');
    setActiveTab(item.id);
    
    // Special handling for radio tab
    if (item.id === 'radio') {
      setShowRadio(true);
    } else {
      navigate(item.path);
    }
    
    // Add subtle animation feedback
    if (navRef.current) {
      navRef.current.style.transform = 'scale(0.98)';
      setTimeout(() => {
        if (navRef.current) {
          navRef.current.style.transform = 'scale(1)';
        }
      }, 100);
    }
  };

  // Quick action handlers
  const handleQuickCamera = () => {
    triggerHaptic('medium');
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      console.log('Opening camera...');
    }
  };

  const handleQuickSearch = () => {
    triggerHaptic('light');
    navigate('/search');
  };

  const handleQuickResorts = () => {
    triggerHaptic('light');
    navigate('/resorts');
  };

  // Handle drag gestures for quick actions
  const handleDrag = (event: any, info: PanInfo) => {
    const newY = Math.max(-100, Math.min(0, info.offset.y));
    setDragY(newY);
    
    if (info.offset.y < -50 && !showQuickActions) {
      setShowQuickActions(true);
      triggerHaptic('medium');
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y < -50) {
      setShowQuickActions(true);
    } else {
      setShowQuickActions(false);
      setDragY(0);
    }
  };

  // Format duration for tracking display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Radio Button */}
      <FloatingRadioButton
        currentUser={currentUser}
        currentLocation={currentLocation}
      />

      {/* Quick Actions Overlay */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowQuickActions(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-50"
          >
            <div className="bg-white rounded-2xl p-4 shadow-2xl border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickActions(false)}
                  className="w-8 h-8 p-0"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tracking Status Bar (when tracking is active) */}
      <AnimatePresence>
        {isTracking && trackingStats && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-20 left-4 right-4 z-30"
          >
            <div className="bg-red-500 text-white rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <div className="text-sm font-medium">Recording</div>
                  <div className="text-sm">{formatDuration(trackingStats.duration)}</div>
                  <div className="text-sm">{trackingStats.distance.toFixed(1)}km</div>
                  <div className="text-sm">{trackingStats.speed.toFixed(0)}km/h</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPauseTracking}
                    className="w-8 h-8 p-0 text-white hover:bg-white/20"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onStopTracking}
                    className="w-8 h-8 p-0 text-white hover:bg-white/20"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Bar */}
      <motion.div
        ref={navRef}
        drag="y"
        dragConstraints={{ top: -100, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{ y: dragY }}
      >
        {/* Drag Indicator */}
        <div className="flex justify-center py-2 bg-white/95 backdrop-blur-sm">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Navigation Content */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-2 pb-safe">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl min-w-[60px] relative transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <item.icon className={cn(
                      "w-6 h-6 mb-1 transition-colors",
                      isActive ? item.color : "text-current"
                    )} />
                    <span className={cn(
                      "text-xs font-medium transition-colors",
                      isActive ? "text-primary" : "text-current"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Badge for notifications */}
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Safe area for iPhone home indicator */}
      <div className="h-safe fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm pointer-events-none" />
    </>
  );
}