import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  Heart, 
  MessageCircle, 
  Send,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Eye
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';

interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
    isVerified: boolean;
  };
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail: string;
    duration?: number;
  };
  content: {
    text?: string;
    location?: string;
    timestamp: string;
    stats?: {
      speed?: number;
      elevation?: number;
      temperature?: number;
    };
  };
  engagement: {
    views: number;
    likes: number;
    replies: number;
  };
  expiresAt: string;
}

interface SocialStoriesProps {
  stories: Story[];
  onCreateStory: () => void;
  onViewStory: (storyId: string) => void;
  onLikeStory: (storyId: string) => void;
  onReplyToStory: (storyId: string, reply: string) => void;
}

const StoryViewer = ({ 
  stories, 
  initialIndex, 
  onClose, 
  onLike, 
  onReply 
}: {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onLike: (storyId: string) => void;
  onReply: (storyId: string, reply: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout>();

  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.media.type === 'video' ? 
    (currentStory.media.duration || 15) * 1000 : 5000; // 5s for images, video duration for videos

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (storyDuration / 100));
          if (newProgress >= 100) {
            if (currentIndex < stories.length - 1) {
              setCurrentIndex(currentIndex + 1);
              return 0;
            } else {
              onClose();
              return 100;
            }
          }
          return newProgress;
        });
      }, 100);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => clearInterval(progressInterval.current);
  }, [isPlaying, currentIndex, stories.length, storyDuration, onClose]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(currentStory.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
      toast.success('Reply sent!');
    }
  };

  if (!currentStory) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* Story Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: `${
                  index < currentIndex ? 100 : 
                  index === currentIndex ? progress : 0
                }%` 
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 ring-2 ring-white">
            <AvatarImage src={currentStory.user.avatar} alt={currentStory.user.name} />
            <AvatarFallback>{currentStory.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{currentStory.user.name}</span>
              {currentStory.user.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <span className="text-white/70 text-sm">{currentStory.content.timestamp}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {currentStory.media.type === 'video' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Story Content */}
      <div className="relative w-full h-full max-w-md mx-auto">
        <img 
          src={currentStory.media.thumbnail} 
          alt="Story content"
          className="w-full h-full object-cover"
        />
        
        {/* Story Overlay Content */}
        {currentStory.content.text && (
          <div className="absolute bottom-32 left-4 right-4">
            <p className="text-white text-lg font-medium drop-shadow-lg">
              {currentStory.content.text}
            </p>
          </div>
        )}

        {/* Location & Stats */}
        {(currentStory.content.location || currentStory.content.stats) && (
          <div className="absolute bottom-24 left-4 right-4 space-y-2">
            {currentStory.content.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-sm">{currentStory.content.location}</span>
              </div>
            )}
            {currentStory.content.stats && (
              <div className="flex items-center space-x-4 text-white/80 text-sm">
                {currentStory.content.stats.speed && (
                  <span>🎿 {currentStory.content.stats.speed} km/h</span>
                )}
                {currentStory.content.stats.elevation && (
                  <span>⛰️ {currentStory.content.stats.elevation}m</span>
                )}
                {currentStory.content.stats.temperature && (
                  <span>🌡️ {currentStory.content.stats.temperature}°C</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Areas */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full z-20"
          onClick={handlePrevious}
        />
        <button
          className="absolute right-0 top-0 w-1/3 h-full z-20"
          onClick={handleNext}
        />
        <button
          className="absolute left-1/3 top-0 w-1/3 h-full z-20"
          onClick={() => setIsPlaying(!isPlaying)}
        />
      </div>

      {/* Story Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(currentStory.id)}
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-5 h-5 mr-1" />
              {currentStory.engagement.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-white hover:bg-white/20"
            >
              <MessageCircle className="w-5 h-5 mr-1" />
              {currentStory.engagement.replies}
            </Button>
            <div className="flex items-center space-x-1 text-white/70 text-sm">
              <Eye className="w-4 h-4" />
              <span>{currentStory.engagement.views}</span>
            </div>
          </div>
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {showReplyInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex space-x-2"
            >
              <Input
                placeholder="Reply to story..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
              <Button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="bg-white/20 text-white hover:bg-white/30"
              >
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export function SocialStories({ 
  stories, 
  onCreateStory, 
  onViewStory, 
  onLikeStory, 
  onReplyToStory 
}: SocialStoriesProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    const key = story.user.username;
    if (!acc[key]) {
      acc[key] = {
        user: story.user,
        stories: []
      };
    }
    acc[key].stories.push(story);
    return acc;
  }, {} as Record<string, { user: Story['user']; stories: Story[] }>);

  const handleStoryClick = (userStories: Story[], storyIndex: number = 0) => {
    const globalIndex = stories.findIndex(s => s.id === userStories[storyIndex].id);
    setSelectedStoryIndex(globalIndex);
    onViewStory(userStories[storyIndex].id);
  };

  return (
    <div className="space-y-4">
      {/* Stories Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Stories</h3>
        <Badge variant="outline">{Object.keys(groupedStories).length} active</Badge>
      </div>

      {/* Stories Carousel */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {/* Create Story */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <Card className="w-24 h-32 relative overflow-hidden bg-gradient-to-b from-primary/20 to-primary/40 border-primary/30">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mb-2">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center px-2">Create Story</span>
                </div>
              </Card>
            </motion.div>
          </DialogTrigger>
          <DialogContent aria-describedby="create-story-description">
            <DialogHeader>
              <DialogTitle>Create Story</DialogTitle>
              <DialogDescription id="create-story-description">
                Share a moment from your ski session with your followers. Upload photos or videos to create engaging stories that expire after 24 hours.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Button variant="outline" onClick={onCreateStory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Select Media
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Stories */}
        {Object.entries(groupedStories).map(([username, { user, stories: userStories }]) => (
          <motion.div
            key={username}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStoryClick(userStories)}
            className="flex-shrink-0 cursor-pointer"
          >
            <Card className="w-24 h-32 relative overflow-hidden">
              <img 
                src={userStories[0].media.thumbnail} 
                alt={`${user.name}'s story`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* User Avatar */}
              <div className="absolute top-2 left-2">
                <Avatar className="w-8 h-8 ring-2 ring-white">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>

              {/* Story Count */}
              {userStories.length > 1 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {userStories.length}
                  </Badge>
                </div>
              )}

              {/* User Name */}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">
                  {user.name}
                </p>
                <div className="flex items-center space-x-1 text-white/70 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(userStories[0].content.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <StoryViewer
            stories={stories}
            initialIndex={selectedStoryIndex}
            onClose={() => setSelectedStoryIndex(null)}
            onLike={onLikeStory}
            onReply={onReplyToStory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}