import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  Zap,
  Mountain,
  Trophy,
  TrendingUp,
  Fire,
  Star,
  Eye,
  MoreHorizontal,
  Flag,
  UserPlus,
  Camera,
  Video,
  Calendar,
  Compass,
  Wind,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Timer,
  Target,
  Award,
  Users
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { AspectRatio } from '../ui/aspect-ratio';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner';
import { SocialPost, SavedRun, User, Achievement, Comment } from '../../src/types';

interface CustomSkiFeedProps {
  posts: SocialPost[];
  currentUser?: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
  onReport: (postId: string) => void;
}

export function CustomSkiFeed({ 
  posts, 
  currentUser, 
  onLike, 
  onComment, 
  onShare, 
  onFollow, 
  onReport 
}: CustomSkiFeedProps) {
  const [commentDialogs, setCommentDialogs] = useState<Record<string, boolean>>({});
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});
  const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({});

  const handleLike = (postId: string) => {
    onLike(postId);
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleComment = (postId: string) => {
    const content = commentTexts[postId]?.trim();
    if (!content) return;
    
    onComment(postId, content);
    setCommentTexts({ ...commentTexts, [postId]: '' });
    setCommentDialogs({ ...commentDialogs, [postId]: false });
    toast.success('Comment added!');
  };

  const handleShare = (postId: string) => {
    onShare(postId);
    toast.success('Post shared!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'green': return 'text-green-600 bg-green-100';
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'black': return 'text-gray-900 bg-gray-100';
      case 'double_black': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'run': return Mountain;
      case 'video': return Video;
      case 'photo': return Camera;
      case 'achievement': return Trophy;
      default: return MessageCircle;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: index * 0.1 }}
          >
            <FeedPost
              post={post}
              currentUser={currentUser}
              onLike={handleLike}
              onComment={() => setCommentDialogs({ ...commentDialogs, [post.id]: true })}
              onShare={handleShare}
              onFollow={onFollow}
              onReport={onReport}
              getDifficultyColor={getDifficultyColor}
              getPostIcon={getPostIcon}
              formatTimeAgo={formatTimeAgo}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comment Dialogs */}
      {Object.entries(commentDialogs).map(([postId, isOpen]) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return null;

        return (
          <Dialog 
            key={postId} 
            open={isOpen} 
            onOpenChange={(open) => setCommentDialogs({ ...commentDialogs, [postId]: open })}
          >
            <DialogContent className="sm:max-w-lg" aria-describedby={`comments-dialog-description-${postId}`}>
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
                <DialogDescription id={`comments-dialog-description-${postId}`}>
                  Share your thoughts on {post.user.name}'s post
                </DialogDescription>
              </DialogHeader>
              
              {/* Existing Comments */}
              <div className="max-h-60 overflow-y-auto space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="font-medium text-sm">{comment.user.name}</div>
                        <div className="text-sm">{comment.content}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add Comment */}
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>{currentUser?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentTexts[postId] || ''}
                    onChange={(e) => setCommentTexts({ ...commentTexts, [postId]: e.target.value })}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCommentDialogs({ ...commentDialogs, [postId]: false })}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleComment(postId)}
                  disabled={!commentTexts[postId]?.trim()}
                >
                  Post Comment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}

// Individual Feed Post Component
function FeedPost({ 
  post, 
  currentUser, 
  onLike, 
  onComment, 
  onShare, 
  onFollow, 
  onReport,
  getDifficultyColor,
  getPostIcon,
  formatTimeAgo 
}: {
  post: SocialPost;
  currentUser?: User;
  onLike: (postId: string) => void;
  onComment: () => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
  onReport: (postId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getPostIcon: (type: string) => React.ElementType;
  formatTimeAgo: (date: Date) => string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const PostIcon = getPostIcon(post.type);
  const isOwnPost = currentUser?.id === post.userId;

  const renderPostContent = () => {
    switch (post.type) {
      case 'run':
        return <RunPostContent post={post} getDifficultyColor={getDifficultyColor} />;
      case 'video':
        return <VideoPostContent post={post} />;
      case 'photo':
        return <PhotoPostContent post={post} />;
      case 'achievement':
        return <AchievementPostContent post={post} />;
      default:
        return <TextPostContent post={post} />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Post Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{post.user.name}</span>
                {post.user.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  <PostIcon className="w-3 h-3 mr-1" />
                  {post.type}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{formatTimeAgo(post.createdAt)}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {post.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isOwnPost && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFollow(post.userId)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Follow
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                {!isOwnPost && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onReport(post.id)}>
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Post Content */}
      <CardContent className="space-y-4">
        {/* Text Content */}
        <div className="space-y-2">
          <p className={isExpanded ? '' : 'line-clamp-3'}>
            {post.content}
          </p>
          {post.content.length > 150 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0 h-auto text-sm"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          )}
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Post Type Specific Content */}
        {renderPostContent()}

        {/* Engagement Actions */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className={`p-0 h-auto ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-1"
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{post.likes}</span>
              </motion.div>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="p-0 h-auto text-muted-foreground"
            >
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{post.comments.length}</span>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post.id)}
              className="p-0 h-auto text-muted-foreground"
            >
              <div className="flex items-center space-x-1">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">{post.shares}</span>
              </div>
            </Button>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Eye className="w-4 h-4 mr-1" />
            <span>{(post.likes * 5 + post.comments.length * 3 + post.shares * 2).toLocaleString()} views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Post Type Components
function RunPostContent({ post, getDifficultyColor }: { post: SocialPost; getDifficultyColor: (difficulty: string) => string }) {
  if (!post.run) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">{post.run.name}</h4>
          <Badge className={getDifficultyColor(post.run.stats.difficulty)}>
            {post.run.stats.difficulty.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Mountain className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-medium">{post.run.stats.distance.toFixed(1)} km</div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <div>
              <div className="font-medium">{post.run.stats.maxSpeed.toFixed(1)} km/h</div>
              <div className="text-xs text-muted-foreground">Max Speed</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ArrowUp className="w-4 h-4 text-green-600" />
            <div>
              <div className="font-medium">{post.run.stats.vertical.toFixed(0)} m</div>
              <div className="text-xs text-muted-foreground">Vertical</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-purple-600" />
            <div>
              <div className="font-medium">{Math.floor(post.run.stats.duration / 60)}min</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
          <span className="text-sm text-muted-foreground flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {post.run.resort.name}
          </span>
          <span className="text-sm text-muted-foreground flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(post.run.startTime).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function VideoPostContent({ post }: { post: SocialPost }) {
  if (post.media.length === 0) return null;

  return (
    <div className="space-y-2">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
          <video
            src={post.media[0].url}
            poster={post.media[0].thumbnail}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      </AspectRatio>
      {post.media[0].caption && (
        <p className="text-sm text-muted-foreground">{post.media[0].caption}</p>
      )}
    </div>
  );
}

function PhotoPostContent({ post }: { post: SocialPost }) {
  if (post.media.length === 0) return null;

  return (
    <div className="space-y-2">
      <AspectRatio ratio={4 / 3}>
        <img
          src={post.media[0].url}
          alt="Post"
          className="w-full h-full object-cover rounded-lg"
        />
      </AspectRatio>
      {post.media[0].caption && (
        <p className="text-sm text-muted-foreground">{post.media[0].caption}</p>
      )}
    </div>
  );
}

function AchievementPostContent({ post }: { post: SocialPost }) {
  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardContent className="p-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h4 className="font-semibold text-lg">Achievement Unlocked!</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Reached a new milestone in their skiing journey
        </p>
      </CardContent>
    </Card>
  );
}

function TextPostContent({ post }: { post: SocialPost }) {
  return null; // Text content is handled in the main post component
}