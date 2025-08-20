import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, Trophy, Calendar, TrendingUp, ChevronDown, Crown, User, Flag } from 'lucide-react';
import { Badge } from '../ui/badge';

interface JoinEventSectionProps {
  onJoinEvent?: (participationType: 'individual' | 'team' | 'business') => void;
  onShowEvents?: () => void;
}

export function JoinEventSection({ onJoinEvent, onShowEvents }: JoinEventSectionProps) {
  const [showJoinOptions, setShowJoinOptions] = useState(false);

  const handleJoinEventClick = () => {
    setShowJoinOptions(!showJoinOptions);
  };

  const handleOptionSelect = (option: string, price: string) => {
    console.log(`Selected option: ${option} - ${price}`);
    // Handle specific option selection here
    setShowJoinOptions(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl mx-4 md:mx-6 lg:mx-8 shadow-xl"
    >
      {/* Enhanced Dynamic Background with Snowline brand colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-ultra-ice-blue via-blue-600 to-midnight" />
      
      {/* Animated overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-mountain-green/20 via-transparent to-avalanche-orange/20 animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* Moving light effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), 
                         radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 50% 100%, rgba(255, 85, 0, 0.1) 0%, transparent 50%)`
      }} />
      
      {/* Dynamic edge lighting effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
}