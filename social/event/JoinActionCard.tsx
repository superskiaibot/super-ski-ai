import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Target } from 'lucide-react';
import { Button } from '../../ui/button';

interface JoinActionCardProps {
  participantCount: number;
  goalOffset?: number;
  onJoinEvent: () => void;
  formatNumber: (num: number) => string;
}

export function JoinActionCard({ 
  participantCount, 
  goalOffset = 153,
  onJoinEvent, 
  formatNumber 
}: JoinActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="snowline-card bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Join the Movement</h3>
          <p className="text-sm text-white/90">Be part of something bigger</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="text-sm font-medium text-white/90 mb-1">
            Community Goal
          </div>
          <div className="text-2xl font-bold text-white">
            {formatNumber(participantCount + goalOffset)}+ skiers
          </div>
          <div className="text-xs text-white/80 mt-1">
            {formatNumber(goalOffset)} more needed
          </div>
        </div>
        
        <Button
          onClick={onJoinEvent}
          size="lg"
          className="w-full sm:w-auto bg-white text-orange-600 hover:bg-white/95 hover:scale-105 shadow-xl hover:shadow-2xl transition-all duration-200 px-8 py-3 rounded-2xl font-semibold"
        >
          Join Event
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}