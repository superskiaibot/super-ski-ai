import React from 'react';
import { EventHeaderCard } from './EventHeaderCard';
import { LiveCounterCard } from './LiveCounterCard';
import { EventDetailsCard } from './EventDetailsCard';
import { JoinActionCard } from './JoinActionCard';

interface EventCardsContainerProps {
  participantCount: number;
  recentJoins: number;
  onJoinEvent: () => void;
  formatNumber: (num: number) => string;
}

export function EventCardsContainer({
  participantCount,
  recentJoins,
  onJoinEvent,
  formatNumber
}: EventCardsContainerProps) {
  return (
    <div className="w-full space-y-6">
      {/* Event Header Card */}
      <EventHeaderCard
        eventName="Ski For A Cure 2025"
        eventDescription="Join skiers worldwide in supporting cancer research"
        isFeatured={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Counter Card */}
        <LiveCounterCard
          participantCount={participantCount}
          recentJoins={recentJoins}
          formatNumber={formatNumber}
        />

        {/* Event Details Card */}
        <EventDetailsCard
          startDate="March 15"
          endDate="17"
          location="Whistler, BC"
          registrationDeadline="Registration closes"
          daysRemaining={7}
        />
      </div>

      {/* Join Action Card */}
      <JoinActionCard
        participantCount={participantCount}
        goalOffset={153}
        onJoinEvent={onJoinEvent}
        formatNumber={formatNumber}
      />
    </div>
  );
}