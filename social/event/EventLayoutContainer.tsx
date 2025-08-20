import React from 'react';
import { EventContentArea } from './EventContentArea';
import { EventActionArea } from './EventActionArea';

interface EventLayoutContainerProps {
  participantCount: number;
  recentJoins: number;
  onJoinEvent: () => void;
  formatNumber: (num: number) => string;
}

export function EventLayoutContainer({
  participantCount,
  recentJoins,
  onJoinEvent,
  formatNumber
}: EventLayoutContainerProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
        
        {/* Event Content Area */}
        <EventContentArea
          participantCount={participantCount}
          recentJoins={recentJoins}
          formatNumber={formatNumber}
        />

        {/* Event Action Area */}
        <EventActionArea
          participantCount={participantCount}
          onJoinEvent={onJoinEvent}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}