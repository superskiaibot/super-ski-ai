import React from 'react';
import { motion } from 'motion/react';

interface CommunityStatsSectionProps {
  participantCount: number;
  amountRaised: number;
  fundraisingProgress: number;
  daysRemaining: number;
  formatNumber: (num: number) => string;
}

export function CommunityStatsSection({ 
  participantCount, 
  amountRaised, 
  fundraisingProgress, 
  daysRemaining,
  formatNumber 
}: CommunityStatsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{formatNumber(participantCount)}</div>
        <div className="text-xs text-slate-600 uppercase tracking-wider font-medium">Total Skiers</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-green-600">${Math.round(amountRaised / participantCount)}</div>
        <div className="text-xs text-slate-600 uppercase tracking-wider font-medium">Avg per Person</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-purple-600">{Math.round(fundraisingProgress)}%</div>
        <div className="text-xs text-slate-600 uppercase tracking-wider font-medium">Complete</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-orange-600">{daysRemaining}</div>
        <div className="text-xs text-slate-600 uppercase tracking-wider font-medium">Days Left</div>
      </div>
    </motion.div>
  );
}