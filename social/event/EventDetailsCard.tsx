import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface EventDetailsCardProps {
  startDate: string;
  endDate: string;
  location: string;
  registrationDeadline: string;
  daysRemaining?: number;
}

export function EventDetailsCard({ 
  startDate, 
  endDate, 
  location, 
  registrationDeadline,
  daysRemaining = 7
}: EventDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="snowline-card bg-white p-6 border-2 border-blue-500"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Event Details</h3>
          <p className="text-sm text-slate-600">When and where to join</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-slate-900">{startDate}-{endDate}</span>
            <p className="text-xs text-slate-600">Event dates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div>
            <span className="text-sm font-medium text-slate-900">{location}</span>
            <p className="text-xs text-slate-600">Location</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-medium text-slate-900">
              {registrationDeadline} in {daysRemaining} days
            </span>
            <p className="text-xs text-slate-600">Registration deadline</p>
          </div>
          {daysRemaining <= 7 && (
            <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-lg text-xs font-semibold">
              Urgent
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}