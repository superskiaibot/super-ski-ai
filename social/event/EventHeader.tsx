import React from 'react';
import { Badge } from '../../ui/badge';

interface EventHeaderProps {
  eventName: string;
  eventDescription: string;
  isFeatured?: boolean;
}

export function EventHeader({ 
  eventName, 
  eventDescription, 
  isFeatured = false 
}: EventHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
          {eventName}
        </h2>
        <p className="text-xl text-white/95 font-medium">
          {eventDescription}
        </p>
      </div>
      {isFeatured && (
        <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-xl backdrop-blur-sm flex-shrink-0">
          Featured
        </Badge>
      )}
    </div>
  );
}