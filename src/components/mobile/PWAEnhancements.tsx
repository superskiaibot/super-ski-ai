import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  RefreshCw,
  Wifi,
  WifiOff,
  CloudOff,
  Check,
  AlertCircle,
  X,
  Smartphone,
  Share2
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { toast } from 'sonner';

// Install PWA prompt component
interface InstallPWAPromptProps {
  deferredPrompt: any;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPWAPrompt({ deferredPrompt, onInstall, onDismiss }: InstallPWAPromptProps) {
  const [isVisible, setIsVisible] = useState(!!deferredPrompt);

  useEffect(() => {
    setIsVisible(!!deferredPrompt);
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      onInstall();
      toast.success('App installed successfully! 🎿');
    }
    
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-30"
        >
          <Card className="border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Install SKI TRACER</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Get the full app experience with offline access, faster loading, and native features.
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={handleInstall} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Install App
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDismiss}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Offline status and cache management
export function OfflineManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheSize, setCacheSize] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing data...', {
        icon: '🌐'
      });
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.info('You\'re offline. Data will sync when connected.', {
        icon: '📴'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check cache size
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        setCacheSize(estimate.usage || 0);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    setSyncProgress(0);
    
    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLastSync(new Date());
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const clearCache = async () => {
    setIsClearing(true);
    
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      setCacheSize(0);
      toast.success('Cache cleared successfully!');
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setIsClearing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 space-y-4">
      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <div>
                <h3 className="font-semibold text-sm">
                  {isOnline ? 'Online' : 'Offline'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isOnline ? 'All features available' : 'Limited functionality'}
                </p>
              </div>
            </div>
            
            <Badge variant={isOnline ? 'default' : 'secondary'}>
              {isOnline ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          
          {syncProgress > 0 && syncProgress < 100 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Syncing data...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
          
          {lastSync && (
            <p className="text-xs text-muted-foreground mt-2">
              Last sync: {lastSync.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cache Management */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">Storage</h3>
              <p className="text-xs text-muted-foreground">
                Cached data: {formatBytes(cacheSize)}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearCache}
              disabled={isClearing}
            >
              {isClearing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                'Clear Cache'
              )}
            </Button>
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-green-500" />
              <span>Run data cached for offline access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3 h-3 text-green-500" />
              <span>Maps available offline</span>
            </div>
            <div className="flex items-center space-x-2">
              <CloudOff className="w-3 h-3 text-gray-400" />
              <span>Social features require connection</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Features */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3">Available Offline</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs font-medium">GPS Tracking</p>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs font-medium">Run Recording</p>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs font-medium">Local Maps</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xs font-medium text-gray-600">Social Feed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced share functionality for mobile
interface MobileShareProps {
  title: string;
  text: string;
  url?: string;
  files?: File[];
}

export function MobileShare({ title, text, url, files }: MobileShareProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleNativeShare = async () => {
    if (!navigator.share) {
      fallbackShare();
      return;
    }

    try {
      setIsSharing(true);
      
      const shareData: ShareData = {
        title,
        text,
        url
      };

      // Add files if supported
      if (files && files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
        shareData.files = files;
      }

      await navigator.share(shareData);
      toast.success('Shared successfully!');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        fallbackShare();
      }
    } finally {
      setIsSharing(false);
    }
  };

  const fallbackShare = () => {
    const shareText = `${title}\n\n${text}${url ? `\n\n${url}` : ''}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard!');
    } else {
      // Create temporary textarea for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <Button
      onClick={handleNativeShare}
      disabled={isSharing}
      className="flex items-center space-x-2"
    >
      {isSharing ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
      <span>Share</span>
    </Button>
  );
}

// Touch-optimized input components
interface TouchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  multiline?: boolean;
  maxLength?: number;
}

export function TouchInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  multiline = false,
  maxLength 
}: TouchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          borderColor: isFocused ? '#3b82f6' : '#d1d5db'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <InputComponent
          type={type}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-[48px] text-base" // Larger touch target
        />
      </motion.div>
      
      {maxLength && (
        <div className="text-right text-xs text-gray-500">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}