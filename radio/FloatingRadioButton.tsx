import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  Signal,
  Battery,
  Minimize2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { SkiRadio } from './SkiRadio';
import { useRadioManager } from './RadioManager';
import { toast } from 'sonner';
import { User } from '../../src/types';

interface FloatingRadioButtonProps {
  currentUser: User;
  currentLocation?: {
    latitude: number;
    longitude: number;
    resort?: string;
  };
  className?: string;
}

export function FloatingRadioButton({ currentUser, currentLocation, className }: FloatingRadioButtonProps) {
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [activeTransmissions, setActiveTransmissions] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);

  // Audio settings
  const [audioSettings] = useState({
    inputGain: 75,
    outputVolume: 80,
    noiseCancellation: true,
    autoGainControl: true,
    echoCancellation: true,
    pushToTalkDelay: 200,
    voiceActivation: false,
    voiceThreshold: 30
  });

  // Radio manager hook
  const {
    isInitialized,
    isConnected: radioConnected,
    hasAudioPermission,
    audioEnabled,
    operationMode,
    joinChannel,
    leaveChannel,
    startTransmission,
    stopTransmission,
    sendEmergencyAlert,
    getSignalStrength,
    enableAudioMode
  } = useRadioManager(
    handleReceiveTransmission,
    handleConnectionStatusChange,
    audioSettings
  );

  // Update signal strength periodically
  useEffect(() => {
    if (isInitialized) {
      const interval = setInterval(() => {
        setSignalStrength(getSignalStrength());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isInitialized, getSignalStrength]);

  // Battery monitoring
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  function handleReceiveTransmission(peerId: string, audioData: any) {
    setActiveTransmissions(prev => [...prev.filter(id => id !== peerId), peerId]);
    
    // Remove from active transmissions after a delay
    setTimeout(() => {
      setActiveTransmissions(prev => prev.filter(id => id !== peerId));
    }, 3000);

    toast.info(`📻 Receiving transmission`, {
      duration: 2000,
      description: `From user ${peerId}`,
    });
  }

  function handleConnectionStatusChange(connected: boolean) {
    setIsConnected(connected);
    // Remove toast messages to avoid duplicates since RadioManager already shows them
  }

  const handleQuickTransmit = () => {
    if (!radioConnected || !currentChannel) {
      toast.error('Not connected to any channel');
      return;
    }

    if (operationMode === 'text') {
      toast.info('📱 Open radio for text messaging');
      setIsRadioOpen(true);
      return;
    }

    if (isTransmitting) {
      stopTransmission();
      setIsTransmitting(false);
    } else {
      const success = startTransmission();
      if (success) {
        setIsTransmitting(true);
        
        // Auto-stop after 30 seconds
        setTimeout(() => {
          if (isTransmitting) {
            stopTransmission();
            setIsTransmitting(false);
            toast.warning('Transmission auto-stopped (30s limit)');
          }
        }, 30000);
      }
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([20]);
    }
  };

  const handleEmergencyAlert = () => {
    if (currentLocation) {
      sendEmergencyAlert(currentLocation);
      toast.success('🚨 Emergency alert sent!');
    } else {
      toast.error('Location required for emergency alert');
    }
  };

  const getSignalBars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className={`w-1 h-3 rounded ${
          i < signalStrength ? 'bg-green-500' : 'bg-gray-300'
        }`}
        style={{ height: `${8 + i * 2}px` }}
      />
    ));
  };

  return (
    <>
      {/* Floating Radio Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`fixed bottom-32 right-4 z-40 ${className}`}
      >
        <div className="relative">
          {/* Main radio button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRadioOpen(true)}
            className={`w-14 h-14 rounded-full shadow-lg border-2 flex items-center justify-center ${
              radioConnected 
                ? 'bg-primary border-primary/20 text-white' 
                : 'bg-gray-500 border-gray-400 text-white'
            }`}
          >
            <Radio className="w-6 h-6" />
          </motion.button>

          {/* Active transmission indicator */}
          <AnimatePresence>
            {(isTransmitting || activeTransmissions.length > 0) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signal strength indicator */}
          {radioConnected && (
            <div className="absolute -top-2 -left-2 flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-sm">
              {getSignalBars()}
            </div>
          )}

          {/* Battery indicator */}
          <div className="absolute -bottom-2 -left-2 flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-sm">
            <Battery className={`w-3 h-3 ${batteryLevel > 20 ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-xs font-medium">{batteryLevel}%</span>
          </div>

          {/* Quick action buttons when connected */}
          <AnimatePresence>
            {radioConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 right-0 flex flex-col space-y-2"
              >
                {/* Quick PTT button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseDown={handleQuickTransmit}
                  onMouseUp={handleQuickTransmit}
                  className={`w-12 h-12 rounded-full shadow-lg border-2 flex items-center justify-center ${
                    isTransmitting
                      ? 'bg-red-500 border-red-400 text-white animate-pulse'
                      : operationMode === 'audio' 
                        ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600'
                  }`}
                >
                  {isTransmitting ? <Mic className="w-5 h-5" /> : operationMode === 'audio' ? <MicOff className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                </motion.button>

                {/* Mute button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full shadow-lg border-2 flex items-center justify-center ${
                    isMuted
                      ? 'bg-red-500 border-red-400 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </motion.button>

                {/* Emergency button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEmergencyAlert}
                  className="w-12 h-12 rounded-full shadow-lg border-2 bg-red-500 border-red-400 text-white flex items-center justify-center hover:bg-red-600"
                >
                  <AlertTriangle className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Connection status */}
        <AnimatePresence>
          {!radioConnected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-16 right-0 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow-sm"
            >
              Not connected
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Full Radio Interface */}
      <SkiRadio
        currentUser={currentUser}
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
        currentLocation={currentLocation}
      />

      {/* Transmission overlay */}
      <AnimatePresence>
        {isTransmitting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-50"
          >
            <div className="bg-red-500 text-white rounded-lg p-3 shadow-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-semibold">ON AIR</span>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
              <p className="text-center text-sm mt-1">
                Broadcasting on {currentChannel || 'Unknown Channel'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incoming transmission overlay */}
      <AnimatePresence>
        {activeTransmissions.length > 0 && !isTransmitting && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed top-20 left-4 z-50"
          >
            <div className="bg-blue-500 text-white rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-semibold">RECEIVING</span>
              </div>
              <p className="text-sm mt-1">
                {activeTransmissions.length} active transmission{activeTransmissions.length > 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}