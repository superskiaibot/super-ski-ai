import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../ui/card';
import { EventLayoutContainer } from './EventLayoutContainer';

interface EventSectionWrapperProps {
  participantCount: number;
  recentJoins: number;
  onJoinEvent: () => void;
  formatNumber: (num: number) => string;
}

export function EventSectionWrapper({
  participantCount,
  recentJoins,
  onJoinEvent,
  formatNumber
}: EventSectionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="rounded-none border-0 shadow-xl bg-gradient-to-r from-blue-600 to-blue-700">
        <CardContent className="p-0">
          <div className="p-6 lg:p-8">
            <EventLayoutContainer
              participantCount={participantCount}
              recentJoins={recentJoins}
              onJoinEvent={onJoinEvent}
              formatNumber={formatNumber}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}