import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

// Mock WebRTC functionality for development
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

interface RadioChannel {
  id: string;
  name: string;
  type: 'emergency' | 'resort' | 'public' | 'private';
  frequency?: string;
  users?: string[];
  isProtected?: boolean;
}

interface Contact {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  signalStrength: number;
  lastSeen?: Date;
  location?: {
    latitude: number;
    longitude: number;
    resort?: string;
  };
}

export function useRadioManager(
  onReceiveTransmission: (peerId: string, audioData: any) => void,
  onConnectionStatusChange: (connected: boolean) => void,
  audioSettings: AudioSettings
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<RadioChannel | null>(null);
  const [activeTransmissions, setActiveTransmissions] = useState<string[]>([]);
  const [signalStrength, setSignalStrength] = useState(4);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [channels, setChannels] = useState<RadioChannel[]>([]);
  const [operationMode, setOperationMode] = useState<'text' | 'audio'>('text');

  // Refs for audio handling
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isTransmittingRef = useRef(false);

  // Initialize radio system without requiring microphone access
  useEffect(() => {
    initializeRadio();
    loadMockData();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeRadio = async () => {
    try {
      // Initialize in text mode first (safe default)
      setOperationMode('text');
      setIsInitialized(true);
      setIsConnected(true);
      onConnectionStatusChange(true);
      
      toast.success('📻 Snowline Radio ready (Text mode)', {
        description: 'Enable microphone for voice features'
      });

      // Check audio permissions without requesting them
      await checkAudioPermissions();
      
    } catch (error) {
      console.error('Failed to initialize radio:', error);
      // Still allow text mode even if audio fails
      setOperationMode('text');
      setIsInitialized(true);
      setIsConnected(true);
      onConnectionStatusChange(true);
      
      toast.info('📻 Snowline Radio ready (Text only)', {
        description: 'Audio features unavailable'
      });
    }
  };

  const checkAudioPermissions = async (): Promise<boolean> => {
    try {
      // Check if we're in a secure context
      if (!window.isSecureContext) {
        setHasAudioPermission(false);
        return false;
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasAudioPermission(false);
        return false;
      }

      // Check current permission state without requesting
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        if (permission.state === 'granted') {
          setHasAudioPermission(true);
          return true;
        } else if (permission.state === 'denied') {
          setHasAudioPermission(false);
          return false;
        } else {
          setHasAudioPermission(null); // prompt state
          return false;
        }
      } else {
        // Can't check permissions, assume we need to prompt
        setHasAudioPermission(null);
        return false;
      }
    } catch (error) {
      console.log('Permission check failed:', error);
      setHasAudioPermission(null);
      return false;
    }
  };

  const enableAudioMode = async (): Promise<boolean> => {
    try {
      // Initialize audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Get user media with constraints
      const constraints = {
        audio: {
          echoCancellation: audioSettings.echoCancellation,
          noiseSuppression: audioSettings.noiseCancellation,
          autoGainControl: audioSettings.autoGainControl,
          channelCount: 1,
          sampleRate: 44100
        }
      };

      localStreamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
      
      setHasAudioPermission(true);
      setAudioEnabled(true);
      setOperationMode('audio');
      
      toast.success('🎙️ Voice mode enabled!', {
        description: 'Push-to-talk features now available'
      });
      
      return true;
    } catch (error: any) {
      console.error('Failed to enable audio mode:', error);
      
      let errorMessage = 'Failed to enable voice features';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied';
        setHasAudioPermission(false);
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found';
        setHasAudioPermission(false);
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Microphone not supported';
        setHasAudioPermission(false);
      }
      
      toast.error(errorMessage, {
        description: 'Continuing with text mode'
      });
      
      setOperationMode('text');
      setAudioEnabled(false);
      return false;
    }
  };

  const loadMockData = () => {
    // Mock channels
    const mockChannels: RadioChannel[] = [
      {
        id: 'emergency',
        name: 'Emergency',
        type: 'emergency',
        frequency: '161.300 MHz',
        users: ['patrol-1', 'patrol-2'],
        isProtected: true
      },
      {
        id: 'resort-main',
        name: 'Resort Main',
        type: 'resort',
        frequency: '462.675 MHz',
        users: ['user-1', 'user-2', 'user-3']
      },
      {
        id: 'public-1',
        name: 'Public Channel 1',
        type: 'public',
        frequency: '462.562 MHz',
        users: ['user-4', 'user-5']
      },
      {
        id: 'friends',
        name: 'My Friends',
        type: 'private',
        frequency: '467.712 MHz',
        users: ['friend-1', 'friend-2'],
        isProtected: true
      }
    ];

    // Mock contacts
    const mockContacts: Contact[] = [
      {
        id: 'friend-1',
        username: 'skibuddy',
        displayName: 'Alex Chen',
        avatar: '',
        isOnline: true,
        signalStrength: 4,
        location: {
          latitude: 50.1163,
          longitude: -122.9574,
          resort: 'Whistler Blackcomb'
        }
      },
      {
        id: 'friend-2',
        username: 'powderhound',
        displayName: 'Sarah Johnson',
        avatar: '',
        isOnline: true,
        signalStrength: 3,
        location: {
          latitude: 50.1180,
          longitude: -122.9500,
          resort: 'Whistler Blackcomb'
        }
      },
      {
        id: 'patrol-1',
        username: 'patrol',
        displayName: 'Ski Patrol',
        avatar: '',
        isOnline: true,
        signalStrength: 5,
        location: {
          latitude: 50.1200,
          longitude: -122.9600,
          resort: 'Whistler Blackcomb'
        }
      }
    ];

    setChannels(mockChannels);
    setContacts(mockContacts);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const joinChannel = useCallback(async (channelId: string): Promise<boolean> => {
    try {
      const channel = channels.find(c => c.id === channelId);
      if (!channel) {
        throw new Error('Channel not found');
      }

      setCurrentChannel(channel);
      setIsConnected(true);
      
      toast.success(`📻 Joined ${channel.name}`, {
        description: operationMode === 'audio' ? 'Voice ready' : 'Text mode active'
      });
      return true;
    } catch (error) {
      console.error('Failed to join channel:', error);
      toast.error('Failed to join channel');
      return false;
    }
  }, [channels, operationMode]);

  const leaveChannel = useCallback(() => {
    setCurrentChannel(null);
    setActiveTransmissions([]);
    toast.info('📻 Left channel');
  }, []);

  const startTransmission = useCallback(() => {
    if (!currentChannel) {
      toast.error('No channel selected');
      return false;
    }

    if (operationMode === 'text') {
      toast.info('📱 Use text input to send messages');
      return false;
    }

    if (!localStreamRef.current) {
      toast.error('Audio not available');
      return false;
    }

    try {
      isTransmittingRef.current = true;
      
      // Mock transmission to other users
      setTimeout(() => {
        // Simulate received transmission
        if (contacts.length > 0) {
          const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
          onReceiveTransmission(randomContact.id, null);
        }
      }, 2000);

      toast.info(`🎙️ Transmitting on ${currentChannel.name}`, { duration: 1000 });
      return true;
    } catch (error) {
      console.error('Failed to start transmission:', error);
      toast.error('Transmission failed');
      return false;
    }
  }, [currentChannel, contacts, onReceiveTransmission, operationMode]);

  const stopTransmission = useCallback(() => {
    isTransmittingRef.current = false;
    return true;
  }, []);

  const sendTextMessage = useCallback((message: string) => {
    if (!currentChannel) {
      toast.error('No channel selected');
      return false;
    }

    if (!message.trim()) {
      return false;
    }

    // Mock text message sending
    toast.success(`📱 Message sent to ${currentChannel.name}`, {
      description: `"${message}"`
    });

    return true;
  }, [currentChannel]);

  const sendEmergencyAlert = useCallback((location: { latitude: number; longitude: number; resort?: string }) => {
    if (!isConnected) {
      toast.error('Not connected to radio network');
      return false;
    }

    // Mock emergency alert
    toast.success('🚨 Emergency alert sent!', {
      duration: 5000,
      description: `Location: ${location.resort || 'Unknown'}\nLat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`
    });

    // Auto-join emergency channel
    const emergencyChannel = channels.find(c => c.type === 'emergency');
    if (emergencyChannel) {
      joinChannel(emergencyChannel.id);
    }

    return true;
  }, [isConnected, channels, joinChannel]);

  const getSignalStrength = useCallback(() => {
    // Mock signal strength based on various factors
    const baseStrength = 4;
    const variation = Math.random() * 2 - 1; // -1 to 1
    return Math.max(1, Math.min(5, Math.round(baseStrength + variation)));
  }, []);

  const getChannels = useCallback(() => channels, [channels]);
  const getContacts = useCallback(() => contacts, [contacts]);
  const getCurrentChannel = useCallback(() => currentChannel, [currentChannel]);
  const getActiveTransmissions = useCallback(() => activeTransmissions, [activeTransmissions]);

  return {
    // State
    isInitialized,
    isConnected,
    hasAudioPermission,
    audioEnabled,
    operationMode,
    currentChannel,
    activeTransmissions,
    signalStrength,
    contacts,
    channels,

    // Actions
    enableAudioMode,
    joinChannel,
    leaveChannel,
    startTransmission,
    stopTransmission,
    sendTextMessage,
    sendEmergencyAlert,
    getSignalStrength,
    getChannels,
    getContacts,
    getCurrentChannel,
    getActiveTransmissions
  };
}

// Export types for use in other components
export type { RadioChannel, Contact, AudioSettings };