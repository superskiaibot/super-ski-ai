import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MoreHorizontal,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import exampleImage from 'figma:asset/98f3cd2252a6ee51f18b8267e60b579c191259f5.png';

interface WebContainerProps {
  className?: string;
}

export function WebContainer({ className = '' }: WebContainerProps) {
  const [currentUrl, setCurrentUrl] = useState('https://skiforacure.co.nz');
  const [inputUrl, setInputUrl] = useState('https://skiforacure.co.nz');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://skiforacure.co.nz']);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(240); // 4 minutes
  const [volume, setVolume] = useState(75);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const cleanUrl = (url: string): string => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const navigateToUrl = (url: string) => {
    const cleanedUrl = cleanUrl(url);
    setCurrentUrl(cleanedUrl);
    setInputUrl(cleanedUrl);
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    // Add to history if it's a new URL
    if (cleanedUrl !== history[historyIndex]) {
      const newHistory = [...history.slice(0, historyIndex + 1), cleanedUrl];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      navigateToUrl(url);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      navigateToUrl(url);
    }
  };

  const refreshPage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToUrl(inputUrl);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipBackward = () => {
    setProgress(Math.max(0, progress - 10));
  };

  const skipForward = () => {
    setProgress(Math.min(duration, progress + 10));
  };

  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [showControls, isPlaying]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Browser Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="apple-card overflow-hidden">
          {/* Browser Controls */}
          <div className="border-b border-border bg-secondary/30 p-4">
            <div className="flex items-center space-x-3">
              {/* Navigation Buttons */}
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={historyIndex <= 0}
                  className="w-8 h-8 p-0 rounded-full transition-transform hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goForward}
                  disabled={historyIndex >= history.length - 1}
                  className="w-8 h-8 p-0 rounded-full transition-transform hover:scale-105"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshPage}
                  className="w-8 h-8 p-0 rounded-full transition-transform hover:scale-105"
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                    transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                </Button>
              </div>

              {/* URL Bar */}
              <form onSubmit={handleSubmit} className="flex-1 flex space-x-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter URL..."
                    className="pl-10 pr-4"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button type="submit" size="sm" className="transition-transform hover:scale-105">
                  Go
                </Button>
              </form>

              {/* External Link */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(currentUrl, '_blank')}
                className="w-8 h-8 p-0 rounded-full transition-transform hover:scale-105"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Website Content Area - Video Placeholder */}
          <div className="relative bg-background">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-background/95"
                >
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading {new URL(currentUrl).hostname}...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Player Section */}
            <div className="bg-gray-50 py-8">
              <div className="max-w-6xl mx-auto px-4">
                {/* Video Player */}
                <div 
                  ref={videoRef}
                  className={`relative bg-black rounded-xl overflow-hidden cursor-pointer aspect-video shadow-2xl ${
                    isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
                  }`}
                  onClick={() => setShowControls(!showControls)}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => !isPlaying && setShowControls(false)}
                >
                  {/* Video Thumbnail/Background */}
                  <div className="absolute inset-0">
                    <img
                      src={exampleImage}
                      alt="Ski for a Cure Video Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                  </div>

                  {/* Video Overlay Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white z-10">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4"
                      >
                        <Badge className="bg-red-600 text-white px-3 py-1 text-sm mb-4">
                          🔴 LIVE EVENT HIGHLIGHTS
                        </Badge>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-3xl md:text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Ski for a Cure 2024
                      </motion.h3>
                      
                      <motion.p 
                        className="text-lg md:text-xl opacity-90 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Join New Zealand's biggest charity ski event supporting cancer research
                      </motion.p>
                      
                      <motion.div 
                        className="flex flex-wrap justify-center gap-4 text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                          📍 Queenstown, NZ
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                          🎯 $500K Goal
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                          ⛷️ 2000+ Participants
                        </Badge>
                      </motion.div>
                    </div>
                  </div>

                  {/* Video Controls Overlay */}
                  <AnimatePresence>
                    {showControls && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Center Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlay();
                            }}
                            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isPlaying ? (
                              <Pause className="w-10 h-10 text-white" />
                            ) : (
                              <Play className="w-10 h-10 text-white ml-1" />
                            )}
                          </motion.button>
                        </div>

                        {/* Bottom Controls Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="space-y-4">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <Slider
                                value={[progress]}
                                onValueChange={(value) => setProgress(value[0])}
                                max={duration}
                                step={1}
                                className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
                              />
                              <div className="flex justify-between text-xs text-white/80">
                                <span>{formatTime(progress)}</span>
                                <span>{formatTime(duration)}</span>
                              </div>
                            </div>
                            
                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    skipBackward();
                                  }}
                                  className="text-white hover:bg-white/20 w-10 h-10 p-0"
                                >
                                  <SkipBack className="w-5 h-5" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlay();
                                  }}
                                  className="text-white hover:bg-white/20 w-12 h-12 p-0"
                                >
                                  {isPlaying ? (
                                    <Pause className="w-6 h-6" />
                                  ) : (
                                    <Play className="w-6 h-6 ml-0.5" />
                                  )}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    skipForward();
                                  }}
                                  className="text-white hover:bg-white/20 w-10 h-10 p-0"
                                >
                                  <SkipForward className="w-5 h-5" />
                                </Button>
                                
                                {/* Volume Control */}
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMute();
                                    }}
                                    className="text-white hover:bg-white/20 w-10 h-10 p-0"
                                  >
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                  </Button>
                                  <div className="w-20 hidden md:block">
                                    <Slider
                                      value={[isMuted ? 0 : volume]}
                                      onValueChange={(value) => {
                                        setVolume(value[0]);
                                        if (value[0] > 0) setIsMuted(false);
                                      }}
                                      max={100}
                                      step={1}
                                      className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white hover:bg-white/20 w-10 h-10 p-0"
                                >
                                  <Settings className="w-5 h-5" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFullscreen();
                                  }}
                                  className="text-white hover:bg-white/20 w-10 h-10 p-0"
                                >
                                  <Maximize className="w-5 h-5" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white hover:bg-white/20 w-10 h-10 p-0"
                                >
                                  <MoreHorizontal className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Video Info Overlay */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isPlaying && (
                                <Badge className="bg-red-600 text-white flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                  <span>PLAYING</span>
                                </Badge>
                              )}
                            </div>
                            <Badge className="bg-black/50 text-white backdrop-blur-sm">
                              4K • HD
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Video Description */}
                <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ski for a Cure 2024 - Official Event Highlights
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>156,789 views</span>
                        <span>•</span>
                        <span>2 days ago</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <span>👍 2.1K</span>
                          <span>👎 12</span>
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Experience the excitement and community spirit of New Zealand's premier charity ski event. 
                    This year's Ski for a Cure brought together over 2,000 participants across The Remarkables 
                    and Coronet Peak to raise funds for cancer research. Watch as skiers and snowboarders of 
                    all levels come together for an incredible cause, featuring breathtaking alpine scenery, 
                    competitive racing, and heartwarming stories from our community.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">#SkiForACure</Badge>
                    <Badge variant="secondary">#NewZealand</Badge>
                    <Badge variant="secondary">#CharityEvent</Badge>
                    <Badge variant="secondary">#Skiing</Badge>
                    <Badge variant="secondary">#CancerResearch</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default WebContainer;