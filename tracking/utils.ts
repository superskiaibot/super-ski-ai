export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Changed from formatDistance to formatVertical to focus on vertical meters skied
export const formatVertical = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Keep the original distance formatter for backward compatibility if needed elsewhere
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

export const getMockCoordinates = (resortId: string) => {
  const mockCoordinates: Record<string, { latitude: number; longitude: number }> = {
    'whistler': { latitude: 50.1163, longitude: -122.9574 },
    'vail': { latitude: 39.6403, longitude: -106.3742 },
    'chamonix': { latitude: 45.9237, longitude: 6.8694 },
    'aspen': { latitude: 39.1911, longitude: -106.8175 },
    'zermatt': { latitude: 45.9838, longitude: 7.7455 },
    'stanton': { latitude: 47.1333, longitude: 10.2667 }
  };
  
  return mockCoordinates[resortId];
};