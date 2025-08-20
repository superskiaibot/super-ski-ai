import React from 'react';
import { Play, Pause, Square, Timer } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '../../src/types/index';
import { Resort } from './types';

interface TrackingControlsProps {
  currentUser: User;
  isTracking: boolean;
  isPaused?: boolean;
  hasTrackingSession: boolean;
  selectedResort: Resort | null;
  onStartTracking: () => void;
  onPauseTracking: () => void;
  onStopTracking: () => void;
  showAnalyticsSection?: boolean; // New prop to control bottom padding
}

export function TrackingControls({
  isTracking,
  isPaused = false,
  hasTrackingSession,
  selectedResort,
  onStartTracking,
  onPauseTracking,
  onStopTracking,
  showAnalyticsSection = false
}: TrackingControlsProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm border-l border-r border-b border-gray-200 shadow-lg rounded-b-xl" data-tutorial="tracking-controls">
      <div className="flex items-center justify-center px-6 py-4 gap-4">
        {!isTracking && !isPaused ? (
          /* Not Tracking - Centered Start Button */
          <Button
            onClick={onStartTracking}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 min-h-[44px]"
          >
            <Play className="w-4 h-4" />
            <span className="font-medium">
              {hasTrackingSession ? 'Resume' : 'Start'}
            </span>
          </Button>
        ) : (
          /* Tracking or Paused - Control Buttons */
          <>
            {isTracking ? (
              <Button
                onClick={onPauseTracking}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 min-h-[44px]"
              >
                <Pause className="w-4 h-4" />
                <span className="font-medium">Pause</span>
              </Button>
            ) : (
              <Button
                onClick={onStartTracking}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 min-h-[44px]"
              >
                <Play className="w-4 h-4" />
                <span className="font-medium">Resume</span>
              </Button>
            )}
            <Button
              onClick={onStopTracking}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 min-h-[44px]"
            >
              <Square className="w-4 h-4" />
              <span className="font-medium">Stop</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}