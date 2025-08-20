import React, { useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { SkiRadio } from '../../../components/radio/SkiRadio';
import { User } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
  currentUser: User;
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
  } | null;
}

export function AppLayout({ 
  children, 
  currentUser,
  isTracking = false,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  trackingStats,
  currentLocation
}: AppLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notifications

  const handleOpenRadio = () => {
    setIsRadioOpen(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 100, 20]);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Mobile Header */}
        <Header 
          currentUser={currentUser}
          isMobile={true}
          isTracking={isTracking}
        />
        
        {/* Main Content */}
        <main className="flex-1 pb-20 overflow-auto">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <MobileNav 
          currentUser={currentUser}
          onOpenRadio={handleOpenRadio}
          isTracking={isTracking}
          notifications={notifications}
        />

        {/* Radio Interface */}
        <SkiRadio
          currentUser={currentUser}
          isVisible={isRadioOpen}
          onClose={() => setIsRadioOpen(false)}
          currentLocation={currentLocation}
        />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar currentUser={currentUser} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <Header 
          currentUser={currentUser}
          isMobile={false}
          isTracking={isTracking}
          onOpenRadio={handleOpenRadio}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Desktop Radio Interface */}
      <SkiRadio
        currentUser={currentUser}
        isVisible={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
        currentLocation={currentLocation}
      />
    </div>
  );
}