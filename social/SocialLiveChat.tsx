import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Smile, 
  Image, 
  MapPin, 
  Zap, 
  Users, 
  Crown, 
  Flame,
  Heart,
  Trophy,
  Mountain,
  Snowflake,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner@2.0.3';

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
    isVerified: boolean;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Pro';
    isModerator?: boolean;
    isLive?: boolean;
  };
  content: {
    type: 'text' | 'image' | 'location' | 'achievement' | 'system';
    text?: string;
    imageUrl?: string;
    location?: { name: string; coordinates: [number, number] };
    achievement?: { title: string; icon: string };
  };
  timestamp: string;
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
  isHighlighted?: boolean;
}

interface LiveRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isLive: boolean;
  category: 'resort' | 'backcountry' | 'general' | 'beginners' | 'racing';
  moderators: string[];
}

interface SocialLiveChatProps {
  room: LiveRoom;
  messages: ChatMessage[];
  currentUser: {
    name: string;
    avatar: string;
    username: string;
    level: string;
  };
  onSendMessage: (content: ChatMessage['content']) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const LiveIndicator = () => (
  <motion.div
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="flex items-center space-x-1"
  >
    <div className="w-2 h-2 bg-red-500 rounded-full" />
    <span className="text-red-500 text-xs font-medium">LIVE</span>
  </motion.div>
);

const MessageItem = ({ 
  message, 
  onReact, 
  currentUsername 
}: { 
  message: ChatMessage; 
  onReact: (messageId: string, emoji: string) => void;
  currentUsername: string;
}) => {
  const [showReactions, setShowReactions] = useState(false);
  
  const quickReactions = ['❤️', '🔥', '👏', '🎿', '⛷️', '🏂', '⛰️', '❄️'];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600';
      case 'Intermediate': return 'text-blue-600';
      case 'Advanced': return 'text-purple-600';
      case 'Expert': return 'text-orange-600';
      case 'Pro': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderMessageContent = () => {
    switch (message.content.type) {
      case 'image':
        return (
          <div className="mt-2">
            <img 
              src={message.content.imageUrl} 
              alt="Shared image"
              className="max-w-xs rounded-lg"
            />
            {message.content.text && (
              <p className="mt-1 text-sm">{message.content.text}</p>
            )}
          </div>
        );
      
      case 'location':
        return (
          <div className="mt-2 p-2 bg-secondary rounded-lg flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{message.content.location?.name}</span>
          </div>
        );
      
      case 'achievement':
        return (
          <div className="mt-2 p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">{message.content.achievement?.title}</span>
          </div>
        );
      
      case 'system':
        return (
          <div className="text-center text-sm text-muted-foreground italic">
            {message.content.text}
          </div>
        );
      
      default:
        return <p className="text-sm">{message.content.text}</p>;
    }
  };

  if (message.content.type === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-2"
      >
        {renderMessageContent()}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex space-x-3 py-2 px-3 rounded-lg ${
        message.isHighlighted ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/50'
      }`}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={message.user.avatar} alt={message.user.name} />
        <AvatarFallback>{message.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm truncate">{message.user.name}</span>
          
          {message.user.isVerified && (
            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          )}
          
          {message.user.isModerator && (
            <Crown className="w-3 h-3 text-yellow-500" />
          )}
          
          {message.user.isLive && (
            <LiveIndicator />
          )}
          
          <Badge variant="outline" className={`text-xs ${getLevelColor(message.user.level)}`}>
            {message.user.level}
          </Badge>
          
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        {renderMessageContent()}
        
        {/* Message Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-secondary"
                onClick={() => onReact(message.id, reaction.emoji)}
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}
        
        {/* Quick React Button */}
        <div className="mt-1">
          <Popover open={showReactions} onOpenChange={setShowReactions}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
              >
                <Smile className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex space-x-1">
                {quickReactions.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      onReact(message.id, emoji);
                      setShowReactions(false);
                    }}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
};

export function SocialLiveChat({
  room,
  messages,
  currentUser,
  onSendMessage,
  onReactToMessage,
  onJoinRoom,
  onLeaveRoom,
  isMinimized = false,
  onToggleMinimize
}: SocialLiveChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage({
        type: 'text',
        text: newMessage.trim()
      });
      setNewMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSendMessage({
            type: 'location',
            location: {
              name: 'Current Location',
              coordinates: [position.coords.latitude, position.coords.longitude]
            }
          });
          toast.success('Location shared!');
        },
        () => {
          toast.error('Could not get location');
        }
      );
    }
  };

  const handleShareImage = () => {
    // Mock image sharing
    onSendMessage({
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1551524164-6cf2ac007fac?w=300&h=200&fit=crop',
      text: 'Check out this view! 🎿'
    });
    toast.success('Image shared!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'resort': return <Mountain className="w-4 h-4" />;
      case 'backcountry': return <Snowflake className="w-4 h-4" />;
      case 'racing': return <Zap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <Button
          onClick={onToggleMinimize}
          className="h-12 px-4 bg-primary text-white shadow-lg hover:bg-primary/90"
        >
          <div className="flex items-center space-x-2">
            {getCategoryIcon(room.category)}
            <span className="font-medium">{room.name}</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {room.memberCount}
            </Badge>
            {room.isLive && (
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            )}
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed right-4 bottom-4 top-4 w-80 z-40"
    >
      <Card className="h-full flex flex-col shadow-2xl border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getCategoryIcon(room.category)}
              <div>
                <CardTitle className="text-sm">{room.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{room.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {room.isLive && <LiveIndicator />}
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {room.memberCount}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLeaveRoom}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    onReact={onReactToMessage}
                    currentUsername={currentUser.username}
                  />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-1 text-xs text-muted-foreground italic"
            >
              Someone is typing...
            </motion.div>
          )}

          {/* Message Input */}
          <div className="p-3 border-t">
            <div className="flex space-x-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareImage}
                className="h-8 px-2"
              >
                <Image className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareLocation}
                className="h-8 px-2"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}