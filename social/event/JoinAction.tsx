import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';

interface JoinActionProps {
  participantCount: number;
  goalOffset?: number;
  onJoinEvent: () => void;
  formatNumber: (num: number) => string;
}

export function JoinAction({ 
  participantCount, 
  goalOffset = 153,
  onJoinEvent, 
  formatNumber 
}: JoinActionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="text-center sm:text-right text-white/90">
        <div className="text-sm font-medium">Be part of</div>
        <div className="text-lg font-bold">{formatNumber(participantCount + goalOffset)}+ goal</div>
      </div>
      
      <Button
        onClick={onJoinEvent}
        size="lg"
        className="w-full sm:w-auto bg-white text-blue-600 hover:bg-white/95 hover:scale-105 shadow-xl hover:shadow-2xl transition-all duration-200 px-8 py-3 rounded-2xl font-semibold"
      >
        Join Event
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}