
'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import GrowthChart from './GrowthChart';
import PopulationChart from './PopulationChart';

interface InsightsData {
  keyMetrics: {
    carOwnershipGrowth: number;
    populationGrowth: number;
    peakHourOccupancy: number;
    averagePricePerHour: number;
  };
  trends: {
    carOwnership: string;
    population: string;
    parkingDemand: string;
    pricing: string;
  };
  implications: string[];
  recommendations: string[];
}

export default function InsightsPage() {
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';
    fetch(`${base}/api/insights/summary`, { cache: 'no-store' })
      .then(res => res.json())
      .then(res => {
        if (res.success && res?.data) {
          setInsightsData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('fetch insights summary failed:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 relative">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <i className="ri-roadster-line text-8xl"></i>
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-4">
                  Discover how <span className="text-blue-200">Melbourne's growth</span> is shaping our roads and <span className="text-blue-200">your daily commute</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-4xl">
                  Understanding the rapid urban expansion and its direct impact on city center parking demand helps explain why finding parking has become increasingly challenging—and guides smarter commuting decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50">
              <div className="p-6 border-b border-gray-100/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Growth of Car Ownership</h2>
                <p className="text-gray-600">Vehicle registrations in Melbourne metropolitan area</p>
              </div>
              
              <div className="p-6">
                <GrowthChart />
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-information-line text-white text-sm"></i>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Impact on Commuters:</p>
                      <p>Car ownership has grown {insightsData?.keyMetrics.carOwnershipGrowth || 0}% since 2015, adding over 400,000 vehicles competing for the same CBD parking spaces. This trend directly correlates with increased parking difficulty and higher demand during peak hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50">
              <div className="p-6 border-b border-gray-100/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">CBD Population Growth</h2>
                <p className="text-gray-600">Residents living within Melbourne CBD boundaries</p>
              </div>
              
              <div className="p-6">
                <PopulationChart />
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-information-line text-white text-sm"></i>
                    </div>
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Impact on Commuters:</p>
                      <p>CBD population doubled in 8 years, creating intense competition for parking among residents, workers, and visitors. Morning peak hours now see {insightsData?.keyMetrics.peakHourOccupancy || 0}% occupancy rates as more people live and work in the same concentrated area.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="ri-car-line text-red-600 text-xl"></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    +{loading ? '...' : insightsData?.keyMetrics.carOwnershipGrowth || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Car ownership growth</div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-group-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    +{loading ? '...' : insightsData?.keyMetrics.populationGrowth || 0}%
                  </div>
                  <div className="text-sm text-gray-600">CBD population increase</div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="ri-parking-line text-orange-600 text-xl"></i>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : insightsData?.keyMetrics.peakHourOccupancy || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Peak hour occupancy</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-900/90 backdrop-blur-md rounded-lg p-8 text-white border border-gray-700/50">
            <div className="max-w-4xl">
              <h3 className="text-xl font-semibold mb-4">What This Means for Melbourne Commuters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h4 className="font-medium text-white mb-2">Planning Ahead is Critical</h4>
                  <p className="text-sm">With parking demand increasing faster than supply, checking availability before your trip saves time and reduces stress during peak hours.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Consider Alternative Transport</h4>
                  <p className="text-sm">As CBD density increases, public transport and active transport options become more attractive for regular commuters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
