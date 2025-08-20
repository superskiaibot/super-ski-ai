import React from 'react';
import { EventJoinModule, EventJoinData } from './EventJoinModule';

interface JoinEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinComplete: (joinData: EventJoinData) => void;
  initialMode?: 'individual' | 'team' | 'business';
}

export function JoinEventModal({ 
  isOpen, 
  onClose, 
  onJoinComplete,
  initialMode 
}: JoinEventModalProps) {
  return (
    <EventJoinModule
      isOpen={isOpen}
      onClose={onClose}
      onJoinComplete={onJoinComplete}
      initialMode={initialMode}
      showAsModal={true}
    />
  );
}

// Re-export the types for backward compatibility
export type { EventJoinData };