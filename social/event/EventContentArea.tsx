import React from 'react';
import { EventHeader } from './EventHeader';
import { LiveParticipantCounter } from './LiveParticipantCounter';
import { EventDetails } from './EventDetails';

interface EventContentAreaProps {
  participantCount: number;
  recentJoins: number;
  formatNumber: (num: number) => string;
}

export function EventContentArea({ 
  participantCount, 
  recentJoins, 
  formatNumber 
}: EventContentAreaProps) {
  return (
    <div className="flex-1 space-y-4 text-white">
      {/* Event Header */}
      <EventHeader
        eventName="Ski For A Cure 2025"
        eventDescription="Join skiers worldwide in supporting cancer research"
        isFeatured={true}
      />

      {/* Live Participant Counter */}
      <LiveParticipantCounter
        participantCount={participantCount}
        recentJoins={recentJoins}
        formatNumber={formatNumber}
      />

      {/* Event Details */}
      <EventDetails
        startDate="March 15"
        endDate="17"
        location="Whistler, BC"
        registrationDeadline="Registration closes"
        daysRemaining={7}
      />
    </div>
  );
}