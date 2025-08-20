import React from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ProgressSectionProps {
  amountRaised: number;
  fundraisingGoal: number;
  fundraisingProgress: number;
  formatCurrency: (amount: number) => string;
}

export function ProgressSection({ 
  amountRaised, 
  fundraisingGoal, 
  fundraisingProgress, 
  formatCurrency 
}: ProgressSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Fundraising Progress</h3>
              <p className="text-sm text-slate-600">Goal: {formatCurrency(fundraisingGoal)}</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 text-sm font-medium">
            {Math.round(fundraisingProgress)}% Complete
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-slate-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fundraisingProgress}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full"
            />
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Raised: {formatCurrency(amountRaised)}</span>
            <span>{formatCurrency(fundraisingGoal - amountRaised)} to go</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}