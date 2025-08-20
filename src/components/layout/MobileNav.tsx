import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Mountain,
  Users,
  User,
  Trophy,
  Radio,
  Settings
} from 'lucide-react';
import { cn } from '../../../components/ui/utils';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface MobileNavProps {
  currentUser: any;
  onOpenRadio?: () => void;
  isTracking?: boolean;
  notifications?: number;
}

export function MobileNav({ 
  currentUser, 
  onOpenRadio, 
  isTracking = false,
  notifications = 0 
}: MobileNavProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
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
      color: 'text-purple-600',
      isSpecial: true, // Special handling for radio
      action: onOpenRadio
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      path: '/social',
      color: 'text-orange-600',
      badge: notifications
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      color: 'text-red-600'
    }
  ];

  const handleNavClick = (item: any) => {
    if (item.isSpecial && item.action) {
      item.action();
    } else {
      setActiveTab(item.path);
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-gray-200">
      {/* Tracking indicator */}
      {isTracking && (
        <div className="bg-red-500 text-white text-center py-1 text-xs">
          🔴 Recording Active
        </div>
      )}
      
      <div className="flex items-center justify-around py-2 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = item.isSpecial ? false : activeTab === item.path;
          const IconComponent = item.icon;
          
          if (item.isSpecial) {
            // Special handling for radio button
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(item)}
                className="flex flex-col items-center p-3 rounded-xl min-w-[60px] relative bg-purple-100 text-purple-600"
              >
                <div className="relative">
                  <IconComponent className="w-6 h-6 mb-1" />
                  {/* Radio active indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleNavClick(item)}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                  <IconComponent className={cn(
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
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}