import React, { useEffect, useRef } from 'react';
import { Gauge, Clock, Route, Mountain, TrendingUp, Flame, Lock } from 'lucide-react';
import { TrackingStats } from './types';
import { formatTime, formatDistance, formatVertical } from './utils';
import { User } from '../../src/types/index';
import { hasFeature } from '../../src/utils/featureGates';

interface LiveStatsCardsProps {
  trackingStats: TrackingStats;
  isFullscreen?: boolean;
  isTracking?: boolean;
  isPaused?: boolean;
  showAdditionalCards?: boolean;
  onCardExpansionChange?: (expanded: boolean) => void;
  currentUser?: User;
  isFullscreenTransition?: boolean; // Still accept this prop for debugging
}

export function LiveStatsCards({ 
  trackingStats, 
  isFullscreen = false, 
  isTracking = false, 
  isPaused = false,
  showAdditionalCards = false,
  onCardExpansionChange,
  currentUser,
  isFullscreenTransition = false
}: LiveStatsCardsProps) {
  // Ref for the container to apply direct CSS variable manipulation
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if user has Pro features for additional cards
  const hasProFeatures = currentUser ? hasFeature(currentUser, 'advanced_analytics') : false;
  
  // Always show additional cards when toggled, but locked for Basic users
  const shouldShowAdditionalCards = showAdditionalCards && hasProFeatures;
  
  // Show locked cards if showAdditionalCards is true but user doesn't have Pro features
  const shouldShowLockedCards = showAdditionalCards && !hasProFeatures;

  // Notify parent when card expansion state changes - includes both Pro and locked states
  React.useEffect(() => {
    onCardExpansionChange?.(shouldShowAdditionalCards || shouldShowLockedCards);
  }, [shouldShowAdditionalCards, shouldShowLockedCards, onCardExpansionChange]);

  // CSS-ONLY POSITIONING SYSTEM - Update CSS variables directly without React re-renders
  useEffect(() => {
    // Note: We don't need to do anything here anymore! 
    // The CSS variables are automatically updated by the .fullscreen-mode class on body
    // This completely bypasses React's render cycle for positioning changes
    
    if (isFullscreenTransition) {
      console.log('🚀 CSS-ONLY POSITIONING: Fullscreen transition detected - CSS variables will handle positioning instantly');
    }
  }, [isFullscreen, isFullscreenTransition]);

  // PURE RENDER APPROACH - No conditional rendering, no complex logic
  // The CSS handles all positioning and sizing based on the .fullscreen-mode class on body
  console.log('📱 PURE RENDER: Using CSS-only positioning system');

  return (
    <div 
      ref={containerRef}
      className="snowline-analytics-cards-container"
    >
      <div className="space-y-3">
        {/* Main Cards Container - CSS handles grid vs flex layout */}
        <div className="snowline-analytics-main-cards">
          {/* Speed Card */}
          <div className="snowline-analytics-card snowline-analytics-speed">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="snowline-analytics-pulse bg-orange-400"></div>
              <div className="snowline-analytics-icon">
                <Gauge className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-1">
                <div className="snowline-analytics-text text-orange-600 leading-none tracking-tight">
                  {trackingStats.speed.toFixed(1)}
                </div>
                <div className="text-xs text-orange-600/70 uppercase tracking-wide leading-none font-medium">
                  KM/H
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Card */}
          <div className="snowline-analytics-card snowline-analytics-time">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="snowline-analytics-pulse bg-blue-400"></div>
              <div className="snowline-analytics-icon">
                <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-1">
                <div className="snowline-analytics-text text-blue-600 leading-none tracking-tight">
                  {formatTime(trackingStats.duration)}
                </div>
                <div className="text-xs text-blue-600/70 uppercase tracking-wide leading-none font-medium">
                  TIME
                </div>
              </div>
            </div>
          </div>
          
          {/* Distance Card - Reverted back to horizontal distance */}
          <div className="snowline-analytics-card snowline-analytics-distance">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="snowline-analytics-pulse bg-green-400"></div>
              <div className="snowline-analytics-icon">
                <Route className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-1">
                <div className="snowline-analytics-text text-green-600 leading-none tracking-tight">
                  {formatDistance(trackingStats.distance)}
                </div>
                <div className="text-xs text-green-600/70 uppercase tracking-wide leading-none font-medium">
                  DISTANCE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Cards Row - Pro Features */}
        {(shouldShowLockedCards || shouldShowAdditionalCards) && (
          <div className="snowline-analytics-main-cards">
            {shouldShowLockedCards && (
              <>
                {/* Vertical Meters Card - Locked (changed from Max Speed) */}
                <div className="snowline-analytics-card snowline-analytics-locked">
                  <div className="absolute inset-0 bg-gray-100/50 rounded-xl"></div>
                  <div className="snowline-analytics-content relative flex flex-col items-center justify-center space-y-2">
                    <div className="snowline-analytics-icon">
                      <Mountain className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="snowline-analytics-text text-gray-600 leading-none tracking-tight">
                        --
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide leading-none font-medium">
                        VERTICAL
                      </div>
                    </div>
                  </div>
                  <div className="snowline-analytics-lock-icon">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                {/* Lift Ascent Card - Locked (changed from Elevation) */}
                <div className="snowline-analytics-card snowline-analytics-locked">
                  <div className="absolute inset-0 bg-gray-100/50 rounded-xl"></div>
                  <div className="snowline-analytics-content relative flex flex-col items-center justify-center space-y-2">
                    <div className="snowline-analytics-icon">
                      <TrendingUp className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="snowline-analytics-text text-gray-600 leading-none tracking-tight">
                        --
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide leading-none font-medium">
                        LIFTS
                      </div>
                    </div>
                  </div>
                  <div className="snowline-analytics-lock-icon">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                {/* Top Speed Card - Locked (changed from Calories) */}
                <div className="snowline-analytics-card snowline-analytics-locked">
                  <div className="absolute inset-0 bg-gray-100/50 rounded-xl"></div>
                  <div className="snowline-analytics-content relative flex flex-col items-center justify-center space-y-2">
                    <div className="snowline-analytics-icon">
                      <Flame className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="snowline-analytics-text text-gray-600 leading-none tracking-tight">
                        --
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide leading-none font-medium">
                        TOP SPEED
                      </div>
                    </div>
                  </div>
                  <div className="snowline-analytics-lock-icon">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                </div>
              </>
            )}
            
            {shouldShowAdditionalCards && (
              <>
                {/* Vertical Meters Card - Active (changed from Max Speed) */}
                <div className="snowline-analytics-card snowline-analytics-additional">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="snowline-analytics-pulse bg-purple-400"></div>
                    <div className="snowline-analytics-icon">
                      <Mountain className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="snowline-analytics-text text-purple-600 leading-none tracking-tight">
                        {formatVertical(trackingStats.vertical)}
                      </div>
                      <div className="text-xs text-purple-600/70 uppercase tracking-wide leading-none font-medium">
                        VERTICAL
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Lift Ascent Card - Active (changed from Max Speed position) */}
                <div className="snowline-analytics-card snowline-analytics-elevation">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="snowline-analytics-pulse bg-cyan-400"></div>
                    <div className="snowline-analytics-icon">
                      <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="snowline-analytics-text text-cyan-600 leading-none tracking-tight">
                        {formatVertical(trackingStats.liftAscent || 0)}
                      </div>
                      <div className="text-xs text-cyan-600/70 uppercase tracking-wide leading-none font-medium">
                        LIFTS
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Top Speed Card - Active (changed from Calories) */}
                <div className="snowline-analytics-card snowline-analytics-calories">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="snowline-analytics-pulse bg-red-400"></div>
                    <div className="snowline-analytics-icon">
                      <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-center space-y-1">
                      <div className="snowline-analytics-text text-red-600 leading-none tracking-tight">
                        {trackingStats.maxSpeed.toFixed(1)}
                      </div>
                      <div className="text-xs text-red-600/70 uppercase tracking-wide leading-none font-medium">
                        TOP SPEED
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}