
'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import LeafletMap from '../components/LeafletMap';
import ParkingAlert from '../components/ParkingAlert';

interface ParkingStats {
  totalSpots: number;
  availableSpots: number;
  totalLocations: number;
  averagePrice: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [stats, setStats] = useState<ParkingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';
    fetch(`${base}/api/parking/stats/overview`, { cache: 'no-store' })
      .then(res => res.json())
      .then(res => {
        if (res.success && res?.data) {
          setStats(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('fetch parking stats overview failed:', err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get('search') as string;
    if (query?.trim()) {
      handleSearch(query.trim());
    }
  };

  return (
    <div className="min-h-screen">
      <Header onSearch={handleSearch} />
      <ParkingAlert isVisible={showAlert} onDismiss={handleDismissAlert} />
      
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              <h1 className="text-4xl font-bold text-transparent mb-3 tracking-tight">
                Live Parking Map
              </h1>
            </div>
            <p className="text-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Real-time parking availability in Melbourne CBD using OpenStreetMap
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 text-center">
            <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-search-line text-blue-500 text-lg"></i>
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search by street name or destination..."
                className="w-full pl-12 pr-6 py-4 border-2 border-white/20 bg-white/95 backdrop-blur-md rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-300 text-base font-medium shadow-xl hover:shadow-2xl hover:bg-white/98"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Search
                </button>
              </div>
            </form>
            <p className="text-sm text-white/80 mt-3 font-medium">
              Tip: Click on parking markers to view details, use the location button in the top right to find your position
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 h-96 lg:h-[32rem]">
            <LeafletMap searchQuery={searchQuery} />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="ri-parking-fill text-white text-2xl"></i>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {loading ? '...' : stats?.availableSpots || 0}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Available Spots</div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="ri-map-pin-line text-white text-2xl"></i>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {loading ? '...' : stats?.totalLocations || 0}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Parking Locations</div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="ri-time-line text-white text-2xl"></i>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${loading ? '...' : stats?.averagePrice?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Average Price/Hour</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
