import React from 'react';
import { JoinAction } from './JoinAction';

interface EventActionAreaProps {
  participantCount: number;
  onJoinEvent: () => void;
  formatNumber: (num: number) => string;
}

export function EventActionArea({ 
  participantCount, 
  onJoinEvent, 
  formatNumber 
}: EventActionAreaProps) {
  return (
    <div className="flex-shrink-0">
      <JoinAction
        participantCount={participantCount}
        goalOffset={153}
        onJoinEvent={onJoinEvent}
        formatNumber={formatNumber}
      />
    </div>
  );
}