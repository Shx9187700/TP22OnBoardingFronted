'use client';

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availability: 'available' | 'limited' | 'full';
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
  maxDuration: string;
  lastUpdated: string;
}

interface ParkingMapProps {
  searchQuery?: string;
  onSpotSelect?: (spot: ParkingSpot) => void;
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LeafletMapComponent({ searchQuery, onSpotSelect }: ParkingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Melbourne CBD coordinates
  const defaultCenter: [number, number] = [-37.8136, 144.9631];

  // Get status color
  const getStatusColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#10B981';
      case 'limited': return '#F59E0B';
      case 'full': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Create custom marker icon
  const createCustomIcon = (availability: string) => {
    const color = getStatusColor(availability);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      ">P</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Enhanced map initialization with multiple tile providers
  const initializeMap = async () => {
    if (!mapRef.current || mapInstanceRef.current || mapInitialized) {
      console.log('LeafletMap: Map initialization skipped - conditions not met');
      return;
    }

    console.log('LeafletMap: Starting map initialization...');

    try {
      // Force container dimensions
      const container = mapRef.current;
      container.style.height = '400px';
      container.style.minHeight = '400px';
      container.style.width = '100%';
      container.style.minWidth = '100%';

      // Create map instance
      const map = L.map(container, {
        center: defaultCenter,
        zoom: 15,
        zoomControl: false,
        attributionControl: true
      });

      // Try multiple tile providers
      const tileProviders = [
        {
          name: 'OpenStreetMap',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          options: {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 12,
          }
        },
        {
          name: 'CartoDB Positron',
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          options: {
            attribution: '© CartoDB',
            maxZoom: 19,
            minZoom: 12,
          }
        }
      ];

      let tileLayerAdded = false;
      
      for (const provider of tileProviders) {
        try {
          const tileLayer = L.tileLayer(provider.url, provider.options);
          tileLayer.addTo(map);
          tileLayerAdded = true;
          break;
        } catch (error) {
          continue;
        }
      }

      if (!tileLayerAdded) {
        throw new Error('All tile providers failed');
      }

      // Add map controls
      L.control.zoom({
        position: 'topright'
      }).addTo(map);
      
      // Add scale control
      L.control.scale({
        position: 'bottomleft',
        metric: true,
        imperial: false,
        maxWidth: 100
      }).addTo(map);

      // Force map refresh
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      mapInstanceRef.current = map;
      setMapInitialized(true);
      console.log('LeafletMap: Map initialized successfully!');
      
    } catch (error) {
      console.error('LeafletMap: Error initializing map:', error);
      setInitError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Initialize map when DOM element is available
  useEffect(() => {
    if (!mapInitialized) {
      if (mapRef.current) {
        setTimeout(initializeMap, 100);
      } else {
        const checkInterval = setInterval(() => {
          if (mapRef.current && !mapInitialized) {
            clearInterval(checkInterval);
            setTimeout(initializeMap, 50);
          }
        }, 100);
        
        setTimeout(() => clearInterval(checkInterval), 5000);
      }
    }
  }, [mapInitialized]);

  // Fetch parking data
  useEffect(() => {
    const fetchParkingData = async () => {
      console.log('LeafletMap: Fetching parking data...');
      try {
        const base =
          process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';
        const response = await fetch(`${base}/api/parking`, { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data?.success && data?.data) {
          setParkingSpots(data.data);
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          }));
        } else {
          console.error('LeafletMap: Failed to fetch parking data:', data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error('LeafletMap: Error fetching parking data:', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchParkingData();

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(fetchParkingData, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Add markers to map
  useEffect(() => {
    if (mapInstanceRef.current && parkingSpots.length > 0 && mapInitialized) {
      console.log('LeafletMap: Adding markers to map...');
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      parkingSpots.forEach((spot, index) => {
        try {
          const marker = L.marker([spot.lat, spot.lng], {
            icon: createCustomIcon(spot.availability)
          }).addTo(mapInstanceRef.current!);

          // Create popup content
          const popupContent = `
            <div style="min-width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 16px; color: #1f2937;">${spot.name}</h3>
                <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4;">${spot.address}</p>
              </div>
              
              <div style="background: #f8fafc; border-radius: 6px; padding: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                  <span style="color: #374151;">Available spots:</span>
                  <strong style="color: #1f2937;">${spot.availableSpots}/${spot.totalSpots}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                  <span style="color: #374151;">Price per hour:</span>
                  <strong style="color: #1f2937;">$${spot.pricePerHour}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 13px;">
                  <span style="color: #374151;">Max duration:</span>
                  <strong style="color: #1f2937;">${spot.maxDuration}</strong>
                </div>
              </div>
              
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot.address)}&travelmode=driving', '_blank')" 
                      style="width: 100%; padding: 10px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 13px; transition: all 0.2s ease;">
                <i class="ri-navigation-line" style="margin-right: 6px;"></i>
                Get Directions
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          
          // Handle marker click
          marker.on('click', () => {
            setSelectedSpot(spot);
            if (onSpotSelect) {
              onSpotSelect(spot);
            }
          });

          markersRef.current.push(marker);
        } catch (error) {
          console.error('LeafletMap: Error adding marker for spot:', spot.name, error);
        }
      });
      
      console.log('LeafletMap: Markers added successfully');
    }
  }, [parkingSpots, onSpotSelect, mapInitialized]);

  // Handle search
  useEffect(() => {
    if (searchQuery && parkingSpots.length > 0 && mapInstanceRef.current && mapInitialized) {
      const searchSpot = parkingSpots.find(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (searchSpot) {
        mapInstanceRef.current.setView([searchSpot.lat, searchSpot.lng], 16);
        setSelectedSpot(searchSpot);
        
        // Highlight the searched marker
        const marker = markersRef.current.find(m => 
          m.getLatLng().lat === searchSpot.lat && m.getLatLng().lng === searchSpot.lng
        );
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }, [searchQuery, parkingSpots, mapInitialized]);

  // Handle current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation && mapInstanceRef.current && mapInitialized) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapInstanceRef.current!.setView([latitude, longitude], 15);
        },
        (error) => {
          console.error('LeafletMap: Error getting current location:', error);
          mapInstanceRef.current!.setView(defaultCenter, 14);
        }
      );
    }
  };

  // Loading state
  if (loading || !mapInitialized) {
    return (
      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ 
            zIndex: 1,
            height: '400px',
            minHeight: '400px',
            width: '100%',
            minWidth: '100%'
          }}
        />
        
        <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-gray-600 text-sm">
              {loading ? 'Loading parking data...' : 'Initializing map...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (initError) {
    return (
      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ 
            zIndex: 1,
            height: '400px',
            minHeight: '400px',
            width: '100%',
            minWidth: '100%'
          }}
        />
        
        <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3 p-6 text-center">
            <div className="text-red-500 text-2xl mb-2">Warning</div>
            <div className="text-gray-800 font-medium mb-2">Map Loading Error</div>
            <div className="text-gray-600 text-sm mb-4">{initError}</div>
            <button 
              onClick={() => {
                setInitError(null);
                setMapInitialized(false);
                mapInstanceRef.current = null;
                setTimeout(initializeMap, 100);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {/* Map container with explicit dimensions */}
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ 
          zIndex: 1,
          height: '400px',
          minHeight: '400px',
          width: '100%',
          minWidth: '100%'
        }}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-4 z-10">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
          <i className="ri-information-line text-blue-600 mr-2"></i>
          Parking Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-700 font-semibold">Available</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-700 font-semibold">Limited</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-700 font-semibold">Full</span>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/30 z-10">
        <button 
          onClick={handleCurrentLocation}
          className="w-12 h-12 flex items-center justify-center hover:bg-white/80 cursor-pointer transition-all duration-300 rounded-xl"
          title="Show current location"
        >
          <i className="ri-focus-3-line text-gray-700 text-lg"></i>
        </button>
      </div>

      {/* Auto refresh status and last updated */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/30 p-4 z-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-gray-700">Auto-refresh: ON</span>
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-500 font-medium">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* Selected spot details */}
      {selectedSpot && (
        <div className="absolute top-4 right-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{selectedSpot.name}</h3>
              <button
                onClick={() => setSelectedSpot(null)}
                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer"
              >
                <i className="ri-close-line text-gray-500"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{selectedSpot.address}</p>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Availability</span>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(selectedSpot.availability) }}></div>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedSpot.availableSpots}/{selectedSpot.totalSpots} spots
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Price per hour</span>
              <span className="text-sm font-semibold text-gray-900">${selectedSpot.pricePerHour}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Max parking time</span>
              <span className="text-sm font-semibold text-gray-900">{selectedSpot.maxDuration}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last updated</span>
              <span className="text-sm text-gray-600">{selectedSpot.lastUpdated}</span>
            </div>

            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedSpot.address)}&travelmode=driving`, '_blank')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              Get Directions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
