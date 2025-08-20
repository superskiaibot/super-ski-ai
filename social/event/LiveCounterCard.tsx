import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp } from 'lucide-react';

interface LiveCounterCardProps {
  participantCount: number;
  recentJoins: number;
  formatNumber: (num: number) => string;
}

export function LiveCounterCard({ 
  participantCount, 
  recentJoins, 
  formatNumber 
}: LiveCounterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="snowline-card bg-white p-6 border-2 border-green-500"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <motion.div
                key={participantCount}
                initial={{ scale: 1.2, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-3xl lg:text-4xl font-bold text-green-600 leading-none"
              >
                {formatNumber(participantCount)}
              </motion.div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-600 mt-1">
              Registered Skiers
            </div>
          </div>
        </div>
        
        {recentJoins > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl px-3 py-2"
          >
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-semibold">+{recentJoins} today</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}