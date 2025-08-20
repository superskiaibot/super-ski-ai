import React from 'react';
import { TrendingUp, TrendingDown, Mountain } from 'lucide-react';

interface ElevationDataPoint {
  time: number;
  elevation: number;
}

interface ElevationChartProps {
  data: ElevationDataPoint[];
  isTracking?: boolean;
}

export function ElevationChart({ data = [], isTracking = false }: ElevationChartProps) {
  // Ensure data is always an array and has valid content
  const safeData = Array.isArray(data) ? data : [];
  
  // Process the elevation data for visualization
  const processElevationData = () => {
    if (safeData.length === 0) {
      return [];
    }

    const points = [];
    const dataLength = Math.min(safeData.length, 60); // Last 60 data points
    
    // Find min/max elevation for better scaling
    const elevations = safeData.map(point => point.elevation || 1200);
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const elevationRange = Math.max(maxElevation - minElevation, 100); // Minimum range of 100m
    
    for (let i = 0; i < dataLength; i++) {
      const point = safeData[i];
      const elevation = point?.elevation || 1200;
      points.push({
        time: point?.time || i,
        elevation: elevation,
        x: (i / Math.max(dataLength - 1, 1)) * 100,
        y: 90 - ((elevation - minElevation) / elevationRange) * 80 // Scale elevation to chart (10% margin)
      });
    }
    
    return points;
  };

  const chartData = processElevationData();
  const currentElevation = Math.round(safeData[safeData.length - 1]?.elevation || 1200);
  const startElevation = Math.round(safeData[0]?.elevation || 1200);
  const elevationChange = currentElevation - startElevation;

  // Create SVG path for elevation line
  const createPath = () => {
    if (chartData.length < 2) return '';
    
    let path = `M ${chartData[0].x} ${chartData[0].y}`;
    
    for (let i = 1; i < chartData.length; i++) {
      path += ` L ${chartData[i].x} ${chartData[i].y}`;
    }
    
    return path;
  };

  // Create area path for gradient fill
  const createAreaPath = () => {
    const linePath = createPath();
    if (!linePath) return '';
    
    return `${linePath} L 100 90 L 0 90 Z`;
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mountain className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Elevation Profile</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">Current:</span>
            <span className="font-bold">{currentElevation}m</span>
          </div>
          <div className="flex items-center space-x-1">
            {elevationChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-bold ${elevationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {elevationChange >= 0 ? '+' : ''}{elevationChange}m
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-48 bg-gradient-to-b from-blue-50 to-white rounded-lg border">
        {safeData.length > 0 ? (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Gradient definition */}
            <defs>
              <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
              </linearGradient>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            
            {/* Grid lines */}
            <rect width="100" height="100" fill="url(#grid)" opacity="0.3" />
            
            {/* Elevation area fill */}
            {chartData.length >= 2 && (
              <path
                d={createAreaPath()}
                fill="url(#elevationGradient)"
                opacity="0.4"
              />
            )}
            
            {/* Elevation line */}
            {chartData.length >= 2 && (
              <path
                d={createPath()}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className={isTracking ? "animate-pulse" : ""}
              />
            )}
            
            {/* Current position marker */}
            {safeData.length > 0 && chartData.length > 0 && (
              <circle
                cx="95"
                cy={chartData[chartData.length - 1]?.y || 50}
                r="3"
                fill="#ef4444"
                className={isTracking ? "animate-pulse" : ""}
              />
            )}
          </svg>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Mountain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start tracking to see elevation profile</p>
            </div>
          </div>
        )}
        
        {/* Y-axis labels */}
        {safeData.length > 0 && (
          <>
            <div className="absolute left-2 top-2 text-xs text-gray-500">
              {Math.round(Math.max(...safeData.map(p => p.elevation || 1200)))}m
            </div>
            <div className="absolute left-2 bottom-2 text-xs text-gray-500">
              {Math.round(Math.min(...safeData.map(p => p.elevation || 1200)))}m
            </div>
          </>
        )}
        
        {/* X-axis labels */}
        {safeData.length > 0 && (
          <>
            <div className="absolute bottom-2 left-1/4 text-xs text-gray-500">
              {Math.round(safeData.length / 4)}s
            </div>
            <div className="absolute bottom-2 right-1/4 text-xs text-gray-500">
              {Math.round(safeData.length * 3 / 4)}s
            </div>
          </>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{currentElevation}m</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            {Math.max(0, Math.round(Math.abs(elevationChange)))}m
          </div>
          <div className="text-xs text-gray-600">
            {elevationChange >= 0 ? 'Ascent' : 'Descent'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {safeData.length > 0 ? Math.round(Math.abs(elevationChange) / Math.max(safeData.length / 3600, 0.1)) : 0}m/h
          </div>
          <div className="text-xs text-gray-600">Rate</div>
        </div>
      </div>
    </div>
  );
}