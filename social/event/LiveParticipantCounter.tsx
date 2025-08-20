import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';

interface LiveParticipantCounterProps {
  participantCount: number;
  recentJoins: number;
  formatNumber: (num: number) => string;
}

export function LiveParticipantCounter({ 
  participantCount, 
  recentJoins, 
  formatNumber 
}: LiveParticipantCounterProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <motion.div
                key={participantCount}
                initial={{ scale: 1.2, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-4xl lg:text-5xl font-bold text-white leading-none"
              >
                {formatNumber(participantCount)}
              </motion.div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div className="text-sm font-medium text-white/90 mt-1">
              Registered Skiers
            </div>
          </div>
        </div>
        
        {recentJoins > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl px-3 py-1"
          >
            <div className="flex items-center gap-1 text-white">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">+{recentJoins} today</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}