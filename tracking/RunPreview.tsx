import React from 'react';
import { Map, Navigation, TrendingUp } from 'lucide-react';
import { TrackingStats, Resort } from './types';
import { formatDistance, formatTime } from './utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MapView } from './MapView';

interface RouteVisualizationProps {
  trackingStats: TrackingStats;
  selectedResort: Resort | null;
}

export function RouteVisualization({ trackingStats, selectedResort }: RouteVisualizationProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-background">
      <MapView
        currentLocation={selectedResort?.coordinates ? {
          latitude: selectedResort.coordinates.latitude,
          longitude: selectedResort.coordinates.longitude
        } : null}
        isTracking={false}
        trackingData={[]}
        selectedResort={selectedResort}
        mapStyle="terrain"
      />
    </div>
  );
}