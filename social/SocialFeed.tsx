import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  MapPin,
  Eye,
  Bookmark,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle,
  Hash,
  Wind,
  Snowflake,
  Sun,
  Flame,
  Zap,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner@2.0.3';

interface SocialPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
    isVerified: boolean;
    level: string;
    followers: number;
  };
  activity: {
    type: string;
    title: string;
    content: string;
    location: string;
    date: string;
    privacy: 'public' | 'friends' | 'private';
    stats: {
      verticalDescent: number;
      runs: number;
      topSpeed: number;
      distance: number;
      duration: string;
      calories: number;
      airTime: number;
    };
    achievement?: string;
    weather: { temp: number; condition: string; wind: number };
    tags: string[];
    media: Array<{
      type: 'image' | 'video';
      url: string;
      thumbnail: string;
      duration?: string;
    }>;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    kudos: number;
    views: number;
  };
  comments: Array<{
    id: string;
    user: string;
    avatar: string;
    text: string;
    time: string;
    likes: number;
  }>;
}

interface SocialFeedProps {
  posts: SocialPost[];
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onFollow: (username: string) => void;
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  followingUsers: Set<string>;
}

const PostItem = React.memo(({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onBookmark, 
  onFollow,
  likedPosts,
  bookmarkedPosts,
  followingUsers
}: {
  post: SocialPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onFollow: (username: string) => void;
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  followingUsers: Set<string>;
}) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'powder': return <Snowflake className="w-4 h-4 text-blue-500" />;
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-500" />;
      default: return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="mb-6"
    >
      <Card className="apple-card overflow-hidden">
        {/* Post Header */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{post.user.name}</h3>
                  {post.user.isVerified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                  <Badge variant="outline" className="text-xs">
                    {post.user.level}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>@{post.user.username}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{post.activity.location}</span>
                  </div>
                  <span>•</span>
                  <span>{post.activity.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Activity className="w-3 h-3" />
                <span>{post.activity.type}</span>
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onBookmark(post.id)}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    {bookmarkedPosts.has(post.id) ? 'Remove Bookmark' : 'Save Post'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Externally
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Hide Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Post Content */}
          <div>
            <h4 className="font-medium text-lg mb-2">{post.activity.title}</h4>
            <p className="text-muted-foreground leading-relaxed">{post.activity.content}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {post.activity.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Achievement */}
            {post.activity.achievement && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center space-x-2 mt-3 p-3 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-lg border border-primary/20"
              >
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">{post.activity.achievement}</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </motion.div>
            )}
          </div>

          {/* Enhanced Media Carousel */}
          {post.activity.media && post.activity.media.length > 0 && (
            <div className="rounded-lg overflow-hidden bg-black relative">
              <div className="aspect-video relative">
                {post.activity.media.map((media, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-transform duration-300 ${
                      idx === currentMediaIndex ? 'translate-x-0' : 
                      idx < currentMediaIndex ? '-translate-x-full' : 'translate-x-full'
                    }`}
                  >
                    <img 
                      src={media.thumbnail} 
                      alt="Activity media" 
                      className="w-full h-full object-cover"
                    />
                    {media.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="bg-black/50 text-white hover:bg-black/70 rounded-full p-4"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                        </Button>
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-black/50 text-white hover:bg-black/70"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-black/50 text-white hover:bg-black/70"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {media.duration}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Media Navigation */}
              {post.activity.media.length > 1 && (
                <>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {post.activity.media.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentMediaIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentMediaIndex(idx)}
                      />
                    ))}
                  </div>
                  <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                    onClick={() => setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1))}
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                    onClick={() => setCurrentMediaIndex(Math.min(post.activity.media.length - 1, currentMediaIndex + 1))}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}

          {/* Enhanced Stats Grid */}
          <Card className="bg-gradient-to-r from-secondary/50 to-secondary/30 border-secondary">
            <CardContent className="pt-4">
              <div className="grid grid-cols-4 md:grid-cols-7 gap-4 text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div>
                        <div className="text-lg font-bold text-primary">{post.activity.stats.verticalDescent}m</div>
                        <div className="text-xs text-muted-foreground">Vertical</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total vertical descent</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div>
                  <div className="text-lg font-bold">{post.activity.stats.runs}</div>
                  <div className="text-xs text-muted-foreground">Runs</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{post.activity.stats.topSpeed}</div>
                  <div className="text-xs text-muted-foreground">Top km/h</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{post.activity.stats.distance}</div>
                  <div className="text-xs text-muted-foreground">Distance</div>
                </div>
                <div className="hidden md:block">
                  <div className="text-lg font-bold">{post.activity.stats.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="hidden md:block">
                  <div className="text-lg font-bold">{post.activity.stats.calories}</div>
                  <div className="text-xs text-muted-foreground">Calories</div>
                </div>
                <div className="hidden md:block">
                  <div className="text-lg font-bold text-orange-500">{post.activity.stats.airTime}s</div>
                  <div className="text-xs text-muted-foreground">Air Time</div>
                </div>
              </div>
              
              {/* Weather & Conditions */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-1">
                  {getWeatherIcon(post.activity.weather.condition)}
                  <span className="text-sm font-medium">{post.activity.weather.temp}°C</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{post.activity.weather.wind} km/h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{post.engagement.views.toLocaleString()} views</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Engagement Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLike(post.id)}
                      className={`space-x-1 hover:text-red-500 transition-all duration-200 ${
                        likedPosts.has(post.id) ? 'text-red-500 scale-105' : ''
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span>{(post.engagement.likes + (likedPosts.has(post.id) ? 1 : 0)).toLocaleString()}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Like this post</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button 
                variant="ghost" 
                size="sm" 
                className="space-x-1 hover:text-blue-500"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{post.engagement.comments}</span>
              </Button>

              <Button variant="ghost" size="sm" className="space-x-1 hover:text-green-500">
                <Zap className="w-5 h-5" />
                <span>{post.engagement.kudos}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="space-x-1 hover:text-purple-500"
                onClick={() => onShare(post.id)}
              >
                <Share2 className="w-5 h-5" />
                <span>{post.engagement.shares}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark(post.id)}
                className={`hover:text-yellow-500 transition-colors ${
                  bookmarkedPosts.has(post.id) ? 'text-yellow-500' : ''
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
              </Button>
              
              {!followingUsers.has(post.user.username) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFollow(post.user.username)}
                  className="ml-2"
                >
                  Follow
                </Button>
              )}
            </div>
          </div>

          {/* Enhanced Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Comments ({post.comments.length})</span>
                  </h4>
                  {post.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex space-x-3"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.avatar} alt={comment.user} />
                        <AvatarFallback>{comment.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:text-red-500">
                            <Heart className="w-3 h-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Comment Input */}
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex space-x-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                      Post
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
});

PostItem.displayName = 'PostItem';

export function SocialFeed({ 
  posts, 
  onLike, 
  onComment, 
  onShare, 
  onBookmark, 
  onFollow,
  likedPosts,
  bookmarkedPosts,
  followingUsers 
}: SocialFeedProps) {
  return (
    <div className="space-y-0">
      <AnimatePresence>
        {posts.map((post, index) => (
          <PostItem
            key={post.id}
            post={post}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onBookmark={onBookmark}
            onFollow={onFollow}
            likedPosts={likedPosts}
            bookmarkedPosts={bookmarkedPosts}
            followingUsers={followingUsers}
          />
        ))}
      </AnimatePresence>
      
      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline" size="lg">
          Load More Activities
        </Button>
      </div>
    </div>
  );
}