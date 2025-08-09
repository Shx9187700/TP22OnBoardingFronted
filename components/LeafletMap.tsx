'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet to avoid SSR issues
const LeafletMapComponent = dynamic(() => import('./LeafletMapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading map...</p>
      </div>
    </div>
  )
});

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

export default function LeafletMap({ searchQuery, onSpotSelect }: ParkingMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Initializing map...</p>
        </div>
      </div>
    );
  }

  return <LeafletMapComponent searchQuery={searchQuery} onSpotSelect={onSpotSelect} />;
}
