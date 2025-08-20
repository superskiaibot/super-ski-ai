import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, Users, Building2, Users2 } from 'lucide-react';

interface AnalyticsCardsSectionProps {
  amountRaised: number;
  participantCount: number;
  fundraisingProgress: number;
  daysRemaining: number;
  recentJoins: number;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
}

export function AnalyticsCardsSection({ 
  amountRaised, 
  participantCount, 
  fundraisingProgress, 
  daysRemaining, 
  recentJoins,
  formatCurrency,
  formatNumber 
}: AnalyticsCardsSectionProps) {
  // Number of sponsors supporting the event
  const sponsorCount = 4;
  
  // Number of teams participating in the charity event
  const teamsCount = 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      {/* 4 Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Amount Raised Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white border-2 border-green-500 rounded-2xl p-4 shadow-md relative"
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <motion.div
              key={amountRaised}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold text-green-600 leading-none"
            >
              {formatCurrency(amountRaised)}
            </motion.div>
            <div className="text-xs font-medium text-slate-600">
              Amount Raised
            </div>
            {recentJoins > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </motion.div>

        {/* Members Participating Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-md relative"
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <motion.div
              key={participantCount}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold text-blue-600 leading-none"
            >
              {formatNumber(participantCount)}
            </motion.div>
            <div className="text-xs font-medium text-slate-600">
              Members
            </div>
            {recentJoins > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </motion.div>

        {/* Sponsors Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white border-2 border-purple-500 rounded-2xl p-4 shadow-md"
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-purple-600 leading-none">
              {sponsorCount}
            </div>
            <div className="text-xs font-medium text-slate-600">
              Sponsors
            </div>
          </div>
        </motion.div>

        {/* Teams Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white border-2 border-orange-500 rounded-2xl p-4 shadow-md"
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-orange-600 leading-none">
              {teamsCount}
            </div>
            <div className="text-xs font-medium text-slate-600">
              Teams
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}