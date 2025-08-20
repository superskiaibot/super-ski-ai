import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  AlertTriangle,
  Battery,
  Signal,
  Settings,
  Phone,
  PhoneOff,
  MapPin,
  Clock,
  Zap,
  Shield,
  Headphones,
  Speaker,
  Wifi,
  WifiOff,
  Heart,
  User,
  Crown,
  Mountain,
  Search,
  Plus,
  X,
  MoreVertical,
  Share2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Minimize2,
  Info,
  MessageSquare,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { User as UserType } from '../../src/types';

interface RadioChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'emergency' | 'resort';
  frequency: string;
  description?: string;
  memberCount?: number;
  isEncrypted?: boolean;
  isModerated?: boolean;
  resort?: string;
  range?: number; // km
  activeUsers?: UserType[];
  moderators?: string[];
  isPremium?: boolean;
}

interface RadioContact {
  id: string;
  user: UserType;
  status: 'online' | 'offline' | 'busy' | 'skiing';
  lastSeen?: Date;
  location?: {
    latitude: number;
    longitude: number;
    resort?: string;
    trail?: string;
  };
  signalStrength: number; // 0-5
  distance?: number; // meters
}

interface AudioSettings {
  inputGain: number;
  outputVolume: number;
  noiseCancellation: boolean;
  autoGainControl: boolean;
  echoCancellation: boolean;
  pushToTalkDelay: number;
  voiceActivation: boolean;
  voiceThreshold: number;
}

interface SkiRadioProps {
  currentUser: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  currentLocation?: {
    latitude: number;
    longitude: number;
    resort?: string;
  };
}

export function SkiRadio({ currentUser, isOpen, onClose, currentLocation }: SkiRadioProps) {
  // Core radio states
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<RadioChannel | null>(null);
  const [signalStrength, setSignalStrength] = useState(4);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isConnected, setIsConnected] = useState(true);
  const [operationMode, setOperationMode] = useState<'text' | 'audio' | 'hybrid'>('text');
  
  // Audio states
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [audioPermissionError, setAudioPermissionError] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [permissionAttempts, setPermissionAttempts] = useState(0);
  
  // UI states
  const [activeTab, setActiveTab] = useState<'channels' | 'contacts' | 'settings'>('channels');
  const [showChannelCreate, setShowChannelCreate] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    inputGain: 75,
    outputVolume: 80,
    noiseCancellation: true,
    autoGainControl: true,
    echoCancellation: true,
    pushToTalkDelay: 200,
    voiceActivation: false,
    voiceThreshold: 30
  });
  
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const transmitButtonRef = useRef<HTMLButtonElement>(null);
  const transmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data - would be fetched from API
  const [channels] = useState<RadioChannel[]>([
    {
      id: 'emergency',
      name: 'Emergency Channel',
      type: 'emergency',
      frequency: '156.800',
      description: 'Emergency communications only',
      memberCount: 1247,
      isEncrypted: false,
      isModerated: true,
      range: 50
    },
    {
      id: 'whistler-main',
      name: 'Whistler Main',
      type: 'resort',
      frequency: '462.550',
      description: 'General Whistler communications',
      memberCount: 342,
      resort: 'Whistler Blackcomb',
      range: 15,
      activeUsers: []
    },
    {
      id: 'powder-hunters',
      name: 'Powder Hunters',
      type: 'public',
      frequency: '462.575',
      description: 'Share fresh powder locations',
      memberCount: 89,
      range: 25,
      isPremium: false
    },
    {
      id: 'friends-crew',
      name: 'My Ski Crew',
      type: 'private',
      frequency: '467.875',
      description: 'Private group for friends',
      memberCount: 6,
      isEncrypted: true,
      range: 10,
      moderators: [currentUser?.id || 'unknown']
    }
  ]);

  const [contacts] = useState<RadioContact[]>([
    {
      id: '1',
      user: {
        id: 'friend1',
        username: 'AlpineAce',
        displayName: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: '',
        stats: {} as any,
        settings: {} as any,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      status: 'skiing',
      location: {
        latitude: currentLocation?.latitude || 0,
        longitude: currentLocation?.longitude || 0,
        resort: 'Whistler Blackcomb',
        trail: 'Whistler Bowl'
      },
      signalStrength: 5,
      distance: 340,
      lastSeen: new Date()
    },
    {
      id: '2',
      user: {
        id: 'friend2',
        username: 'PowderSeeker',
        displayName: 'Mike Chen',
        email: 'mike@example.com',
        avatar: '',
        stats: {} as any,
        settings: {} as any,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      status: 'online',
      signalStrength: 3,
      distance: 1200,
      lastSeen: new Date()
    }
  ]);

  // Initialize radio in text mode (safe default)
  useEffect(() => {
    if (isOpen) {
      // Set default to text mode to avoid permission issues
      setOperationMode('text');
      setIsAudioEnabled(false);
      setPermissionAttempts(0);
      
      // Check permissions on open but don't automatically request
      checkAudioPermissions();
      
      // Show welcome message
      toast.info('📻 Snowline Radio ready in text mode!', { 
        description: 'Tap "Enable Voice" when ready for voice features'
      });
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen]);

  // Set default channel
  useEffect(() => {
    if (channels.length > 0 && !currentChannel) {
      // Default to resort channel if available, otherwise first public channel
      const resortChannel = channels.find(ch => ch.type === 'resort');
      const defaultChannel = resortChannel || channels.find(ch => ch.type === 'public') || channels[0];
      setCurrentChannel(defaultChannel);
    }
  }, [channels, currentChannel]);

  const checkAudioPermissions = async (): Promise<boolean> => {
    try {
      // Check if we're in a secure context
      if (!window.isSecureContext) {
        setAudioPermissionError('🔒 Microphone access requires HTTPS. Please use a secure connection.');
        setHasAudioPermission(false);
        return false;
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setAudioPermissionError('🎙️ Microphone not supported in this browser. Text mode available.');
        setHasAudioPermission(false);
        return false;
      }

      // Check current permission state
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          
          if (permission.state === 'granted') {
            setHasAudioPermission(true);
            setAudioPermissionError(null);
            return true;
          } else if (permission.state === 'denied') {
            setHasAudioPermission(false);
            setAudioPermissionError('🚫 Microphone access denied. You can enable it in browser settings.');
            return false;
          } else {
            setHasAudioPermission(null); // prompt state
            setAudioPermissionError(null);
            return false;
          }
        } catch (error) {
          // Some browsers don't support microphone permission query
          setHasAudioPermission(null);
          setAudioPermissionError(null);
          return false;
        }
      } else {
        // Can't check permissions, assume we need to prompt
        setHasAudioPermission(null);
        setAudioPermissionError(null);
        return false;
      }
    } catch (error) {
      console.log('Permission check failed:', error);
      setHasAudioPermission(null);
      setAudioPermissionError('⚠️ Unable to check microphone permissions. Text mode available.');
      return false;
    }
  };

  const requestAudioPermission = async (): Promise<boolean> => {
    try {
      console.log('Requesting microphone permission...');
      setPermissionAttempts(prev => prev + 1);
      
      // Show permission dialog to explain why we need it
      if (permissionAttempts === 0) {
        setShowPermissionDialog(true);
        return false;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: audioSettings.echoCancellation,
          noiseSuppression: audioSettings.noiseCancellation,
          autoGainControl: audioSettings.autoGainControl,
          sampleRate: 48000,
          channelCount: 1
        }
      });
      
      setMediaStream(stream);
      setHasAudioPermission(true);
      setIsAudioEnabled(true);
      setOperationMode('audio');
      setAudioPermissionError(null);
      setShowPermissionDialog(false);
      setShowPermissionHelp(false);
      
      const context = new AudioContext({ sampleRate: 48000 });
      setAudioContext(context);
      
      toast.success('🎙️ Voice enabled! Microphone ready for radio communication.');
      return true;
      
    } catch (error: any) {
      console.error('Failed to get audio permission:', error);
      setHasAudioPermission(false);
      setIsAudioEnabled(false);
      setOperationMode('text');
      
      let errorMessage = '🎙️ Microphone unavailable. Text mode is still fully functional.';
      let helpMessage = 'You can still use all messaging features.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = '🚫 Microphone access denied.';
        helpMessage = 'To enable voice features, click the microphone icon in your browser\'s address bar and allow access.';
        setShowPermissionHelp(true);
      } else if (error.name === 'NotFoundError') {
        errorMessage = '🎙️ No microphone detected.';
        helpMessage = 'Please connect a microphone to use voice features.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = '❌ Microphone not supported in this browser.';
        helpMessage = 'Try using Chrome, Firefox, or Safari for voice features.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = '🔧 Microphone is being used by another application.';
        helpMessage = 'Please close other apps using your microphone and try again.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = '⚙️ Microphone settings not compatible.';
        helpMessage = 'Your microphone doesn\'t support the required audio settings.';
      }
      
      setAudioPermissionError(errorMessage);
      setShowPermissionDialog(false);
      
      toast.warning(errorMessage, { 
        description: helpMessage,
        duration: 5000
      });
      
      return false;
    }
  };

  const handlePermissionDialogContinue = async () => {
    const success = await requestAudioPermission();
    if (!success && permissionAttempts >= 2) {
      // After multiple attempts, keep in text mode
      setShowPermissionDialog(false);
      toast.info('📱 Continuing in text mode - all messaging features available!');
    }
  };

  const openBrowserSettings = () => {
    // This will open browser settings for microphone permissions
    toast.info('Check your browser\'s address bar for microphone permissions', {
      description: 'Look for a microphone icon next to the URL and click "Allow"',
      duration: 8000
    });
  };

  const resetPermissions = async () => {
    setPermissionAttempts(0);
    setHasAudioPermission(null);
    setAudioPermissionError(null);
    setShowPermissionHelp(false);
    await checkAudioPermissions();
  };

  const cleanup = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
  };

  // Push-to-talk handlers - work in demo mode
  const startTransmission = useCallback(() => {
    if (!currentChannel) return;
    
    setIsTransmitting(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([20]);
    }
    
    // Clear any existing timeout
    if (transmitTimeoutRef.current) {
      clearTimeout(transmitTimeoutRef.current);
    }
    
    // Auto-stop transmission after 30 seconds
    transmitTimeoutRef.current = setTimeout(() => {
      stopTransmission();
      toast.warning('Transmission automatically stopped (30s limit)');
    }, 30000);
    
    if (operationMode === 'audio' && isAudioEnabled && mediaStream) {
      toast.info(`🎙️ Voice transmission on ${currentChannel.name}`, { duration: 1000 });
    } else {
      toast.info(`📡 Demo transmission on ${currentChannel.name}`, { duration: 1000 });
    }
  }, [currentChannel, operationMode, isAudioEnabled, mediaStream]);

  const stopTransmission = useCallback(() => {
    setIsTransmitting(false);
    
    if (transmitTimeoutRef.current) {
      clearTimeout(transmitTimeoutRef.current);
      transmitTimeoutRef.current = null;
    }
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10]);
    }
  }, []);

  // Keyboard shortcuts for PTT
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isTransmitting && isOpen) {
        event.preventDefault();
        startTransmission();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && isTransmitting) {
        event.preventDefault();
        stopTransmission();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTransmitting, isOpen, startTransmission, stopTransmission]);

  const handleChannelChange = (channel: RadioChannel) => {
    setCurrentChannel(channel);
    toast.success(`📻 Switched to ${channel.name}`);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const handleEmergencyCall = () => {
    setShowEmergencyDialog(true);
    
    // Auto-switch to emergency channel
    const emergencyChannel = channels.find(ch => ch.type === 'emergency');
    if (emergencyChannel) {
      setCurrentChannel(emergencyChannel);
    }
    
    // Strong haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  };

  const sendEmergencyAlert = () => {
    if (!currentLocation) {
      toast.error('Location required for emergency alert');
      return;
    }
    
    // Would send to emergency services/ski patrol
    toast.success('🚨 Emergency alert sent to ski patrol!');
    setShowEmergencyDialog(false);
    
    // Continue vibration for emergency
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const sendTextMessage = () => {
    if (!textMessage.trim() || !currentChannel) return;
    
    // Would send to channel
    toast.success(`📱 Message sent to ${currentChannel.name}: "${textMessage}"`);
    setTextMessage('');
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10]);
    }
  };

  const handleEnableAudio = async () => {
    if (hasAudioPermission === false && permissionAttempts > 0) {
      setShowPermissionHelp(true);
      return;
    }
    
    const success = await requestAudioPermission();
    if (success) {
      setOperationMode('audio');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'skiing': return 'bg-blue-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'resort': return <Mountain className="w-4 h-4 text-blue-500" />;
      case 'private': return <Lock className="w-4 h-4 text-purple-500" />;
      case 'public': return <Unlock className="w-4 h-4 text-green-500" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getOperationModeIcon = () => {
    switch (operationMode) {
      case 'audio': return <Mic className="w-4 h-4 text-green-500" />;
      case 'text': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'hybrid': return <Headphones className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  // Don't render if currentUser is not loaded yet
  if (!currentUser) {
    return null;
  }

  // Minimized view
  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-24 right-4 z-30"
      >
        <Card className="w-16 h-16 p-0 overflow-hidden border-2 border-primary shadow-lg">
          <Button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full p-0 bg-primary hover:bg-primary/90"
          >
            <div className="flex flex-col items-center">
              <Radio className="w-6 h-6 text-white" />
              {isTransmitting && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-1" />
              )}
            </div>
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-white flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Radio className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Snowline Radio</h2>
                <p className="text-sm text-muted-foreground">
                  {currentChannel?.name || 'No channel selected'}
                  {operationMode === 'text' && ' (Text Mode)'}
                  {operationMode === 'audio' && ' (Voice Ready)'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Status indicators */}
              <div className="flex items-center space-x-1">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-3 rounded ${
                        i < signalStrength ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{ height: `${8 + i * 2}px` }}
                    />
                  ))}
                </div>
                <Battery className={`w-4 h-4 ${batteryLevel > 20 ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-xs">{batteryLevel}%</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
                <Minimize2 className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Operation Mode Info */}
          {operationMode === 'text' && (
            <Alert className="mx-4 mt-3">
              <Info className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getOperationModeIcon()}
                  <span className="text-sm">Text mode active - Send messages to your ski buddies</span>
                </div>
                <Button size="sm" onClick={handleEnableAudio}>
                  {hasAudioPermission === false && permissionAttempts > 0 ? 'Help' : 'Enable Voice'}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Permission Error Alert */}
          {audioPermissionError && (
            <Alert className="mx-4 mt-3" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">{audioPermissionError}</span>
                {hasAudioPermission === false && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={resetPermissions}>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowPermissionHelp(true)}>
                      Help
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Current Channel Info */}
          {currentChannel && (
            <div className="px-4 py-3 bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getChannelIcon(currentChannel.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{currentChannel.name}</span>
                      {currentChannel.isEncrypted && <Lock className="w-3 h-3 text-purple-500" />}
                      {currentChannel.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>📻 {currentChannel.frequency} MHz</span>
                      <span>👥 {currentChannel.memberCount} users</span>
                      <span>📡 {currentChannel.range}km range</span>
                    </div>
                  </div>
                </div>
                
                {isConnected ? (
                  <Badge variant="default" className="text-xs">
                    <Wifi className="w-3 h-3 mr-1" />
                    {operationMode === 'audio' ? 'Voice Ready' : 'Text Only'}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Text Input Area */}
          {operationMode === 'text' && currentChannel && (
            <div className="px-4 py-3 border-b bg-muted/10">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder={`Send message to ${currentChannel.name}...`}
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={sendTextMessage}
                  disabled={!textMessage.trim()}
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-3">
                <TabsTrigger value="channels" className="text-xs">
                  <Radio className="w-3 h-3 mr-1" />
                  Channels
                </TabsTrigger>
                <TabsTrigger value="contacts" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Contacts
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Channels Tab */}
              <TabsContent value="channels" className="flex-1 p-4 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Available Channels</h3>
                    <Button size="sm" onClick={() => setShowChannelCreate(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-3">
                      {channels.map((channel) => (
                        <Card
                          key={channel.id}
                          className={`cursor-pointer transition-all ${
                            currentChannel?.id === channel.id 
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => handleChannelChange(channel)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                {getChannelIcon(channel.type)}
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold text-sm">{channel.name}</h4>
                                    {channel.isEncrypted && <Lock className="w-3 h-3 text-purple-500" />}
                                    {channel.isPremium && <Crown className="w-3 h-3 text-yellow-500" />}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {channel.description}
                                  </p>
                                  <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                                    <span>📻 {channel.frequency}</span>
                                    <span>👥 {channel.memberCount}</span>
                                    <span>📡 {channel.range}km</span>
                                  </div>
                                </div>
                              </div>
                              
                              {channel.type === 'emergency' && (
                                <Badge variant="destructive" className="text-xs">
                                  Emergency
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Contacts Tab */}
              <TabsContent value="contacts" className="flex-1 p-4 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Ski Buddies</h3>
                    <Button size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Find
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <Card key={contact.id} className="hover:border-primary/50 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={contact.user.avatar} />
                                  <AvatarFallback>
                                    {contact.user.displayName?.charAt(0) || contact.user.username.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(contact.status)}`} />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm">
                                    {contact.user.displayName || contact.user.username}
                                  </h4>
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-1 h-2 rounded ${
                                          i < contact.signalStrength ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                  <span className="capitalize">{contact.status}</span>
                                  {contact.distance && (
                                    <span>📍 {formatDistance(contact.distance)}</span>
                                  )}
                                </div>
                                
                                {contact.location?.trail && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    🎿 {contact.location.trail}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="flex-1 p-4 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-6">
                    {/* Operation Mode */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Operation Mode</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getOperationModeIcon()}
                            <div>
                              <Label className="font-medium">Current Mode</Label>
                              <p className="text-xs text-muted-foreground capitalize">
                                {operationMode} communication
                              </p>
                            </div>
                          </div>
                          {operationMode === 'text' && (
                            <Button size="sm" onClick={handleEnableAudio}>
                              <Mic className="w-4 h-4 mr-2" />
                              {hasAudioPermission === false && permissionAttempts > 0 ? 'Help' : 'Enable Voice'}
                            </Button>
                          )}
                        </div>
                        
                        {audioPermissionError && (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              {audioPermissionError}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>

                    {/* Audio Settings - only show if audio is enabled */}
                    {operationMode === 'audio' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Audio Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Input Gain</Label>
                            <Slider
                              value={[audioSettings.inputGain]}
                              onValueChange={([value]) => setAudioSettings(prev => ({ ...prev, inputGain: value }))}
                              max={100}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          
                          <div>
                            <Label>Output Volume</Label>
                            <Slider
                              value={[audioSettings.outputVolume]}
                              onValueChange={([value]) => setAudioSettings(prev => ({ ...prev, outputVolume: value }))}
                              max={100}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Noise Cancellation</Label>
                            <Switch
                              checked={audioSettings.noiseCancellation}
                              onCheckedChange={(checked) => setAudioSettings(prev => ({ ...prev, noiseCancellation: checked }))}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Auto Gain Control</Label>
                            <Switch
                              checked={audioSettings.autoGainControl}
                              onCheckedChange={(checked) => setAudioSettings(prev => ({ ...prev, autoGainControl: checked }))}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Emergency Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span>Emergency</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={handleEmergencyCall}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Emergency Alert
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Instantly connects to emergency channel and alerts ski patrol
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bottom Controls */}
          {currentChannel && (
            <div className="p-4 border-t bg-white">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                {operationMode === 'audio' ? (
                  <Button
                    ref={transmitButtonRef}
                    size="lg"
                    className={`px-8 py-3 ${isTransmitting ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
                    onMouseDown={startTransmission}
                    onMouseUp={stopTransmission}
                    onTouchStart={startTransmission}
                    onTouchEnd={stopTransmission}
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    {isTransmitting ? 'TRANSMITTING' : 'PUSH TO TALK'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEnableAudio()}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    TEXT MODE
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-center text-xs text-muted-foreground mt-2">
                {operationMode === 'audio' ? 'Hold SPACEBAR or button to transmit' : 'Type messages above to communicate'}
              </p>
            </div>
          )}

          {/* Channel Creation Dialog */}
          <Dialog open={showChannelCreate} onOpenChange={setShowChannelCreate}>
            <DialogContent aria-describedby="channel-create-description">
              <DialogHeader>
                <DialogTitle>Create New Channel</DialogTitle>
                <DialogDescription id="channel-create-description">
                  Create a custom radio channel for your ski group or resort communications.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="channel-name">Channel Name</Label>
                  <Input id="channel-name" placeholder="My Ski Group" />
                </div>
                
                <div>
                  <Label htmlFor="channel-type">Channel Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="channel-description">Description</Label>
                  <Input id="channel-description" placeholder="Optional description" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowChannelCreate(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowChannelCreate(false)}>
                  Create Channel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Permission Dialog */}
          <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
            <DialogContent aria-describedby="permission-request-description">
              <DialogHeader>
                <DialogTitle>Enable Voice Features</DialogTitle>
                <DialogDescription id="permission-request-description">
                  Snowline Radio needs microphone access to enable voice communication with other skiers.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert>
                  <Mic className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Why we need microphone access:</strong>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• Real-time voice communication with your ski group</li>
                      <li>• Push-to-talk radio functionality</li>
                      <li>• Emergency voice alerts for safety</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your privacy is protected: Audio is only transmitted when you press and hold the talk button.
                    You have full control over when your microphone is active.
                  </AlertDescription>
                </Alert>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPermissionDialog(false)}>
                  Keep Text Mode
                </Button>
                <Button onClick={handlePermissionDialogContinue}>
                  <Mic className="w-4 h-4 mr-2" />
                  Grant Access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Permission Help Dialog */}
          <Dialog open={showPermissionHelp} onOpenChange={setShowPermissionHelp}>
            <DialogContent aria-describedby="permission-help-description">
              <DialogHeader>
                <DialogTitle>Enable Microphone Access</DialogTitle>
                <DialogDescription id="permission-help-description">
                  Follow these steps to enable voice features in your browser.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>How to enable microphone access:</strong>
                    <ol className="mt-2 text-sm space-y-2 list-decimal list-inside">
                      <li>Look for a microphone icon 🎙️ in your browser&apos;s address bar</li>
                      <li>Click on the microphone icon</li>
                      <li>Select "Always allow" for microphone access</li>
                      <li>Refresh this page or click "Try Again" below</li>
                    </ol>
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <ExternalLink className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Alternative method:</strong> You can also go to your browser settings and enable microphone access for this website manually.
                  </AlertDescription>
                </Alert>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPermissionHelp(false)}>
                  Cancel
                </Button>
                <Button onClick={openBrowserSettings} variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Browser Settings
                </Button>
                <Button onClick={resetPermissions}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Emergency Dialog */}
          <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
            <DialogContent aria-describedby="emergency-alert-description">
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Emergency Alert</span>
                </DialogTitle>
                <DialogDescription id="emergency-alert-description">
                  This will immediately alert ski patrol and emergency services with your current location.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Only use this for real emergencies. False alarms waste resources and put others at risk.
                  </AlertDescription>
                </Alert>
                
                {currentLocation && (
                  <div className="text-sm">
                    <p className="font-medium">Your location will be shared:</p>
                    <p className="text-muted-foreground">
                      📍 {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    </p>
                    {currentLocation.resort && (
                      <p className="text-muted-foreground">🏔️ {currentLocation.resort}</p>
                    )}
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={sendEmergencyAlert}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Send Emergency Alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}