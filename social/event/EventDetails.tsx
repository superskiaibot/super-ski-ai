import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface EventDetailsProps {
  startDate: string;
  endDate: string;
  location: string;
  registrationDeadline: string;
  daysRemaining?: number;
}

export function EventDetails({ 
  startDate, 
  endDate, 
  location, 
  registrationDeadline,
  daysRemaining = 7
}: EventDetailsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 text-white/90">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{startDate}-{endDate}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">{location}</span>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1">
        <span className="text-xs font-semibold">
          {registrationDeadline} in {daysRemaining} days
        </span>
      </div>
    </div>
  );
}