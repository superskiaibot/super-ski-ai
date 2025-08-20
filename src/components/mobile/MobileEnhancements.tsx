import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  RefreshCw,
  ChevronDown,
  X,
  Share2,
  Download,
  Camera,
  Video,
  Mic,
  Heart,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Signal
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { toast } from 'sonner';

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export function PullToRefresh({ onRefresh, children, threshold = 80 }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    if (info.point.y < threshold) return;
    
    const distance = Math.max(0, Math.min(info.offset.y, threshold + 40));
    setPullDistance(distance);
    setCanRefresh(distance >= threshold);
  }, [threshold]);

  const handleDragEnd = useCallback(async (event: any, info: PanInfo) => {
    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([10, 50, 10]);
        }
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setCanRefresh(false);
  }, [canRefresh, isRefreshing, onRefresh]);

  return (
    <motion.div
      ref={containerRef}
      drag="y"
      dragConstraints={{ top: 0, bottom: threshold + 40 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className="h-full overflow-hidden"
      style={{ y: pullDistance }}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center"
            style={{ height: pullDistance }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ 
                  rotate: canRefresh ? 180 : 0,
                  scale: isRefreshing ? 1.2 : 1
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <RefreshCw 
                  className={`w-6 h-6 ${
                    isRefreshing ? 'animate-spin text-primary' : 
                    canRefresh ? 'text-primary' : 'text-gray-400'
                  }`} 
                />
              </motion.div>
              <span className="text-xs mt-1 text-gray-600">
                {isRefreshing ? 'Refreshing...' : canRefresh ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </motion.div>
  );
}

// Enhanced mobile sheet with better touch interactions
interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
}

export function MobileSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  snapPoints = [0.3, 0.6, 0.9],
  initialSnap = 1
}: MobileSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    const newY = Math.max(0, info.offset.y);
    setDragY(newY);
  }, []);

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    
    // Determine which snap point to go to
    const windowHeight = window.innerHeight;
    let targetSnap = currentSnap;
    
    if (velocity > 500 || offset > 100) {
      // Snap down
      if (currentSnap < snapPoints.length - 1) {
        targetSnap = currentSnap + 1;
      } else {
        onClose();
        return;
      }
    } else if (velocity < -500 || offset < -100) {
      // Snap up
      if (currentSnap > 0) {
        targetSnap = currentSnap - 1;
      }
    }
    
    setCurrentSnap(targetSnap);
    setDragY(0);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10]);
    }
  }, [currentSnap, snapPoints, onClose]);

  const currentHeight = snapPoints[currentSnap] * window.innerHeight;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: `${100 - snapPoints[currentSnap] * 100}%` }}
            exit={{ y: "100%" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: window.innerHeight }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl"
            style={{ 
              height: `${snapPoints[currentSnap] * 100}%`,
              y: dragY
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-3 border-b">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Touch-optimized media capture component
interface MediaCaptureProps {
  onCapture: (file: File, type: 'photo' | 'video') => void;
  onClose: () => void;
}

export function MediaCapture({ onCapture, onClose }: MediaCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, [facingMode]);

  const initializeCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      });
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera');
    }
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file, 'photo');
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([50]);
        }
      }
    }, 'image/jpeg', 0.9);
  };

  const startVideoRecording = () => {
    if (!stream) return;
    
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      onCapture(file, 'video');
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    
    // Start timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 50, 20]);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </Button>
        
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
          className="text-white"
        >
          <RefreshCw className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Camera view */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Overlay controls */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center space-x-8">
          {/* Photo capture */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={capturePhoto}
            className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center"
            disabled={isRecording}
          >
            <Camera className="w-8 h-8 text-gray-700" />
          </motion.button>
          
          {/* Video record */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isRecording ? stopVideoRecording : startVideoRecording}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${
              isRecording ? 'bg-red-500' : 'bg-white'
            }`}
          >
            {isRecording ? (
              <Square className="w-8 h-8 text-white" />
            ) : (
              <Video className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-gray-700'}`} />
            )}
          </motion.button>
          
          {/* Switch camera */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
            className="w-16 h-16 bg-white/20 rounded-full border-2 border-white/40 flex items-center justify-center"
            disabled={isRecording}
          >
            <RefreshCw className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Enhanced status bar for mobile
export function MobileStatusBar() {
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [signalStrength, setSignalStrength] = useState(4);

  useEffect(() => {
    // Network status
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Battery API (if supported)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2 text-xs text-gray-600">
      {/* Network status */}
      {networkStatus === 'online' ? (
        <Wifi className="w-4 h-4 text-green-500" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-500" />
      )}
      
      {/* Signal strength */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 h-3 rounded ${
              i < signalStrength ? 'bg-green-500' : 'bg-gray-300'
            }`}
            style={{ height: `${8 + i * 2}px` }}
          />
        ))}
      </div>
      
      {/* Battery */}
      <div className="flex items-center space-x-1">
        <Battery className={`w-4 h-4 ${batteryLevel > 20 ? 'text-green-500' : 'text-red-500'}`} />
        <span className="text-xs">{batteryLevel}%</span>
      </div>
    </div>
  );
}