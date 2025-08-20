import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Mountain, AlertCircle, Loader2, RefreshCw, Globe } from 'lucide-react';
import { MAPBOX_CONFIG } from '../../src/constants/index';

// Import Mapbox GL types (would be installed via npm in a real project)
declare global {
  interface Window {
    mapboxgl: any;
  }
}

interface Resort {
  id: string;
  name: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
}

interface TrackingPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: Date;
  speed?: number;
}

interface MapViewProps {
  isTracking: boolean;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  resorts?: Resort[];
  selectedResort: Resort | null;
  trackingData?: TrackingPoint[];
  mapStyle?: 'terrain' | 'satellite' | 'hybrid';
}

export function MapView({ 
  isTracking, 
  currentLocation, 
  resorts, 
  selectedResort, 
  trackingData, 
  mapStyle = 'terrain' 
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('Initializing...');
  const [retryCount, setRetryCount] = useState(0);
  const [useSimpleMap, setUseSimpleMap] = useState(false);
  const userLocationMarker = useRef<any>(null);
  const resortMarkers = useRef<any[]>([]);
  const trackingSource = useRef<any>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Retry mechanism
  const retryMapLoad = useCallback(() => {
    setMapError(null);
    setMapLoaded(false);
    setRetryCount(prev => prev + 1);
    setLoadingStep('Retrying...');
    setUseSimpleMap(false);
    
    // Clean up existing map
    if (map.current) {
      try {
        map.current.remove();
      } catch (e) {
        console.warn('Error cleaning up map:', e);
      }
      map.current = null;
    }
  }, []);

  // Simplified map loader with better error handling
  useEffect(() => {
    console.log('🗺️ MapView: Starting initialization, retry count:', retryCount);
    
    // Enhanced token validation
    if (!MAPBOX_CONFIG.ACCESS_TOKEN || MAPBOX_CONFIG.ACCESS_TOKEN.includes('YOUR_ACCESS_TOKEN_HERE')) {
      console.error('❌ MapView: Invalid Mapbox token');
      setMapError('Mapbox access token not configured properly');
      return;
    }

    // Test token format
    if (!MAPBOX_CONFIG.ACCESS_TOKEN.startsWith('pk.')) {
      console.error('❌ MapView: Token format invalid - should start with pk.');
      setMapError('Invalid Mapbox token format');
      return;
    }

    console.log('✅ MapView: Token format valid:', MAPBOX_CONFIG.ACCESS_TOKEN.substring(0, 20) + '...');
    
    if (map.current || !mapContainer.current || useSimpleMap) {
      console.log('⚠️ MapView: Map already exists, container not ready, or using simple map');
      return;
    }

    // Set loading timeout (20 seconds)
    loadingTimeoutRef.current = setTimeout(() => {
      console.error('⏰ MapView: Loading timeout reached');
      setMapError('Map loading timed out. Click "Simple Map" to continue with basic functionality.');
    }, 20000);

    // Simplified approach: try to use pre-loaded Mapbox GL JS first
    const initializeMap = async () => {
      try {
        setLoadingStep('Checking for Mapbox GL...');
        console.log('📦 MapView: Checking for existing Mapbox GL JS');

        // Check if Mapbox GL is already available
        if (window.mapboxgl) {
          console.log('✅ MapView: Mapbox GL already loaded');
        } else {
          setLoadingStep('Loading Mapbox library...');
          
          // Try a more reliable loading approach
          await loadMapboxGL();
        }

        if (!window.mapboxgl) {
          throw new Error('Mapbox GL JS failed to load - CDN may be blocked');
        }

        setLoadingStep('Initializing map...');
        console.log('🗺️ MapView: Initializing Mapbox instance');

        // Set the access token
        window.mapboxgl.accessToken = MAPBOX_CONFIG.ACCESS_TOKEN;

        // Create a basic map first, then enhance
        const mapConfig = {
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v11', // Start with basic style
          center: MAPBOX_CONFIG.DEFAULTS.center,
          zoom: MAPBOX_CONFIG.DEFAULTS.zoom,
          attributionControl: false
        };

        console.log('🎯 MapView: Creating map with config:', mapConfig);
        map.current = new window.mapboxgl.Map(mapConfig);

        console.log('🎯 MapView: Map instance created, adding event listeners');

        // Handle map load
        map.current.on('load', () => {
          console.log('🎉 MapView: Map loaded successfully');
          
          try {
            // Add basic controls
            map.current.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
            
            // Try to upgrade to terrain style
            try {
              setLoadingStep('Loading terrain style...');
              map.current.setStyle(MAPBOX_CONFIG.STYLES[mapStyle] || MAPBOX_CONFIG.STYLES.terrain);
            } catch (styleError) {
              console.warn('⚠️ MapView: Failed to load terrain style, keeping basic style:', styleError);
            }

            // Clear loading timeout
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
            }

            setMapLoaded(true);
            setLoadingStep('');
            console.log('✨ MapView: Initialization complete');
            
          } catch (setupError) {
            console.error('❌ MapView: Error during map setup:', setupError);
            setMapLoaded(true); // Still allow basic functionality
          }
        });

        // Enhanced error handling
        map.current.on('error', (e: any) => {
          console.error('❌ MapView: Map error event:', e);
          
          const errorMessage = e.error?.message || e.message || 'Unknown map error';
          
          if (errorMessage.includes('token')) {
            setMapError('Invalid Mapbox access token. Please check your token configuration.');
          } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            setMapError('Network error loading map. Please check your internet connection.');
          } else if (errorMessage.includes('style')) {
            console.warn('⚠️ MapView: Style loading failed, but map still functional');
            // Don't set as fatal error, map might still work
          } else {
            setMapError(`Map error: ${errorMessage}`);
          }
        });

      } catch (error: any) {
        console.error('❌ MapView: Critical error during initialization:', error);
        
        // Clear loading timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        
        const errorMessage = error.message || 'Unknown error';
        
        if (errorMessage.includes('CDN') || errorMessage.includes('network')) {
          setMapError('Failed to load map resources. Your network may be blocking Mapbox. Try the Simple Map option.');
        } else if (errorMessage.includes('token')) {
          setMapError('Authentication failed. Please check your Mapbox access token.');
        } else {
          setMapError(`Initialization failed: ${errorMessage}. Try Simple Map for basic functionality.`);
        }
      }
    };

    initializeMap();

    return () => {
      console.log('🧹 MapView: Cleaning up');
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      if (map.current) {
        try {
          map.current.remove();
          map.current = null;
        } catch (error) {
          console.warn('Warning during map cleanup:', error);
        }
      }
    };
  }, [mapStyle, retryCount, useSimpleMap]);

  // Simplified Mapbox GL loading function
  const loadMapboxGL = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Remove any existing scripts to avoid conflicts
      const existingScripts = document.querySelectorAll('script[src*="mapbox-gl"]');
      const existingLinks = document.querySelectorAll('link[href*="mapbox-gl"]');
      existingScripts.forEach(script => script.remove());
      existingLinks.forEach(link => link.remove());

      // Create and add CSS
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      document.head.appendChild(link);

      // Create and add JS
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.type = 'text/javascript';
      
      const timeout = setTimeout(() => {
        console.error('⏰ MapView: Script loading timeout');
        reject(new Error('Script loading timeout - CDN may be blocked'));
      }, 15000);
      
      script.onload = () => {
        clearTimeout(timeout);
        console.log('✅ MapView: Mapbox GL JS v2.15.0 loaded successfully');
        
        // Wait for script to initialize
        setTimeout(() => {
          if (window.mapboxgl) {
            resolve();
          } else {
            reject(new Error('Mapbox GL JS loaded but not available on window'));
          }
        }, 500);
      };
      
      script.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ MapView: Script loading failed:', error);
        reject(new Error('Failed to load Mapbox GL JS script - network error or CDN blocked'));
      };
      
      document.head.appendChild(script);
    });
  };

  // Update current location marker (simplified)
  useEffect(() => {
    if (!map.current || !mapLoaded || !currentLocation) return;

    try {
      // Remove existing marker
      if (userLocationMarker.current) {
        userLocationMarker.current.remove();
      }

      // Create simple marker
      const markerElement = document.createElement('div');
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.backgroundColor = '#004cff';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '3px solid white';
      markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      if (isTracking) {
        markerElement.style.animation = 'pulse 2s infinite';
      }

      // Add marker to map
      userLocationMarker.current = new window.mapboxgl.Marker({
        element: markerElement,
        anchor: 'center'
      })
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(map.current);

      // Center map on current location if tracking
      if (isTracking) {
        map.current.easeTo({
          center: [currentLocation.longitude, currentLocation.latitude],
          zoom: 16,
          duration: 1000
        });
      }
    } catch (error) {
      console.warn('Error updating location marker:', error);
    }
  }, [currentLocation, isTracking, mapLoaded]);

  // Render error state with enhanced options
  if (mapError) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Failed</h3>
          <p className="text-sm text-gray-600 mb-4">{mapError}</p>
          
          {/* Debug Information */}
          <details className="mb-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              Debug Info
            </summary>
            <div className="mt-2 p-2 bg-gray-50 text-xs space-y-1">
              <div>Token: {MAPBOX_CONFIG.ACCESS_TOKEN.substring(0, 20)}...</div>
              <div>Retry Count: {retryCount}</div>
              <div>Loading Step: {loadingStep}</div>
              <div>Window.mapboxgl: {window.mapboxgl ? 'Loaded' : 'Not loaded'}</div>
              <div>Container: {mapContainer.current ? 'Ready' : 'Not ready'}</div>
              <div>Map Instance: {map.current ? 'Created' : 'Not created'}</div>
              <div>Browser: {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}</div>
            </div>
          </details>
          
          <div className="space-y-2">
            <button 
              onClick={retryMapLoad}
              disabled={retryCount >= 3}
              className="w-full px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {retryCount >= 3 ? 'Max Retries Reached' : 'Retry Loading'}
            </button>
            
            {retryCount < 3 && (
              <p className="text-xs text-gray-500">
                Attempt {retryCount + 1} of 3
              </p>
            )}
            
            <button 
              onClick={() => {
                // Test token directly
                console.log('🧪 Testing Mapbox token directly...');
                const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/whistler.json?access_token=${MAPBOX_CONFIG.ACCESS_TOKEN}`;
                fetch(testUrl)
                  .then(response => {
                    console.log('🧪 Token test response status:', response.status);
                    if (response.ok) {
                      alert('✅ Token works perfectly! The issue is with map initialization, not the token.');
                    } else if (response.status === 401) {
                      alert('❌ Token is invalid or expired (401 Unauthorized)');
                    } else if (response.status === 403) {
                      alert('❌ Token lacks required permissions (403 Forbidden)'); 
                    } else {
                      alert(`❌ Token test failed with status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then(data => {
                    console.log('🧪 Token test data:', data);
                    if (data && data.features && data.features.length > 0) {
                      console.log('🎿 Found Whistler:', data.features[0].place_name);
                    }
                  })
                  .catch(error => {
                    console.error('🧪 Token test error:', error);
                    alert(`❌ Network error testing token: ${error.message}`);
                  });
              }}
              className="w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
            >
              🧪 Test Token
            </button>
            
            <button 
              onClick={() => {
                // Show a simplified map instead
                setUseSimpleMap(true);
                setMapLoaded(true);
                setMapError(null);
                console.log('📍 Switching to simple map interface');
              }}
              className="w-full px-4 py-2 bg-green-500 text-white text-sm font-medium hover:bg-green-600"
            >
              <Globe className="w-4 h-4 mr-2" />
              Use Simple Map
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state with detailed progress
  if (!mapLoaded) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="relative mb-4">
            <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
            {retryCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs flex items-center justify-center">
                {retryCount}
              </div>
            )}
          </div>
          
          <p className="text-sm font-medium text-gray-600 mb-2">Loading Snowline Map...</p>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">{loadingStep || 'Preparing terrain visualization'}</p>
            
            {retryCount > 0 && (
              <p className="text-xs text-yellow-600">
                Retry attempt {retryCount}
              </p>
            )}
            
            <div className="w-32 h-1 bg-gray-200 mx-auto mt-3">
              <div className="h-full bg-primary animate-pulse w-1/3"></div>
            </div>
          </div>
          
          <button 
            onClick={retryMapLoad}
            className="mt-4 px-3 py-1 text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Force Retry
          </button>
        </div>
      </div>
    );
  }

  // Fallback simple map display when Mapbox isn't available
  if (useSimpleMap) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-100 via-gray-50 to-green-100 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Mountain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Simple Map Mode</h3>
            <p className="text-sm text-gray-600 mb-4">
              GPS tracking is active without visual map display
            </p>
            
            {/* Simple tracking display */}
            {currentLocation && (
              <div className="bg-white/80 backdrop-blur-sm p-4 border border-white/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Latitude</div>
                    <div className="text-gray-900">{currentLocation.latitude.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Longitude</div>
                    <div className="text-gray-900">{currentLocation.longitude.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            )}
            
            {selectedResort && (
              <div className="mt-4 bg-white/80 backdrop-blur-sm p-3 border border-white/50">
                <div className="text-sm font-medium text-gray-700">Selected Resort</div>
                <div className="text-gray-900">{selectedResort.name}</div>
                <div className="text-gray-600 text-sm">{selectedResort.location}</div>
              </div>
            )}
            
            <button 
              onClick={() => {
                setUseSimpleMap(false);
                setRetryCount(0);
                retryMapLoad();
              }}
              className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90"
            >
              Try Full Map Again
            </button>
          </div>
        </div>
        
        {/* Tracking Status Indicator */}
        {isTracking && (
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-2 shadow-lg border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">Live Tracking (Simple)</span>
            </div>
          </div>
        )}

        {/* Map Style Indicator */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1 shadow-lg border border-white/20">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
            Simple Mode
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 overflow-hidden"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Tracking Status Indicator */}
      {isTracking && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-2 shadow-lg border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Live Tracking</span>
          </div>
        </div>
      )}

      {/* Map Style Indicator */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1 shadow-lg border border-white/20">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
          {mapStyle === 'terrain' ? 'Terrain' : mapStyle === 'satellite' ? 'Satellite' : 'Hybrid'}
        </span>
      </div>
    </div>
  );
}