import React from 'react';
import { EventCardsContainer } from './event/EventCardsContainer';

interface EventJoinSectionProps {
  participantCount: number;
  recentJoins: number;
  onJoinEvent: () => void;
  formatNumber: (num: number) => string;
}

export function EventJoinSection({ 
  participantCount, 
  recentJoins, 
  onJoinEvent, 
  formatNumber 
}: EventJoinSectionProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      <EventCardsContainer
        participantCount={participantCount}
        recentJoins={recentJoins}
        onJoinEvent={onJoinEvent}
        formatNumber={formatNumber}
      />
    </div>
  );
}