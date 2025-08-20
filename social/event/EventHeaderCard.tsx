import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '../../ui/badge';
import { Heart, Users, Trophy, Sparkles } from 'lucide-react';

interface EventHeaderCardProps {
  eventName: string;
  eventDescription: string;
  isFeatured?: boolean;
}

export function EventHeaderCard({ 
  eventName, 
  eventDescription, 
  isFeatured = false 
}: EventHeaderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="snowline-card bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 text-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-white/10 via-white/5 to-transparent rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-blue-400/20 via-blue-500/10 to-transparent rounded-full translate-y-24 -translate-x-24 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          {/* Event badges and indicators */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg"
            >
              <Heart className="w-6 h-6 text-white fill-white/20" />
            </motion.div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-white/90 uppercase tracking-wide border border-white/20 backdrop-blur-sm">
                  Charity Event
                </div>
                {isFeatured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Badge className="bg-gradient-to-r from-avalanche-orange to-red-500 text-white border-none px-3 py-1 rounded-xl shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-3 h-3" />
                <span className="text-xs font-medium">Community Event</span>
                <div className="w-1 h-1 bg-white/60 rounded-full" />
                <Trophy className="w-3 h-3" />
                <span className="text-xs font-medium">Fundraiser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced title section */}
        <div className="space-y-4">
          {/* Main title with enhanced typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-white via-white/80 to-transparent rounded-full" />
              <span className="text-xs font-semibold text-white/90 uppercase tracking-widest">2025 Event</span>
            </div>
            
            <h1 className="relative">
              {/* Background text effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent blur-sm opacity-30 text-4xl lg:text-5xl xl:text-6xl font-black leading-none tracking-tight">
                {eventName}
              </span>
              
              {/* Main title text */}
              <span className="relative bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent text-4xl lg:text-5xl xl:text-6xl font-black leading-none tracking-tight drop-shadow-2xl">
                <span className="block">Ski For</span>
                <span className="block bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text">
                  A Cure
                </span>
                <span className="block text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text">
                  2025
                </span>
              </span>
            </h1>
          </motion.div>

          {/* Enhanced description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-3"
          >
            <p className="text-xl lg:text-2xl text-white/95 font-semibold leading-relaxed max-w-2xl">
              {eventDescription}
            </p>
            
            {/* Additional event highlights */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white/90">Live Event</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <Heart className="w-4 h-4 text-red-300 fill-red-300/30" />
                <span className="text-sm font-medium text-white/90">Supporting Cancer Research</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <Users className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-medium text-white/90">Worldwide Participation</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to action emphasis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Make a Difference</p>
                <p className="text-xs text-white/80">Every run counts toward the cure</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">$200K</p>
              <p className="text-xs text-white/80">Goal</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}