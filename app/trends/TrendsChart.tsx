
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TrendsChartProps {
  area: string;
  timeFrame: string;
}

interface TrendItem {
  period: string;
  occupancy: number;
  availableSpots: number;
  timestamp: string;
}

interface TrendSummary {
  averageOccupancy: number;
  maxOccupancy: number;
  minOccupancy: number;
  peakTime: string;
  bestTime: string;
  totalPeriods: number;
}

interface TrendApiData {
  area: string;
  timeFrame: string;
  trends: TrendItem[];
  summary: TrendSummary;
  lastUpdated: string;
}

const areaNames: { [key: string]: string } = {
  'collins-street': 'Collins Street Plaza',
  'bourke-street': 'Bourke Street Central',
  'flinders-lane': 'Flinders Lane Tower',
  'queen-street': 'Queen Street Hub',
  'elizabeth-street': 'Elizabeth Street Complex',
  'spencer-street': 'Spencer Street Station'
};

export default function TrendsChart({ area, timeFrame }: TrendsChartProps) {
  const [trendData, setTrendData] = useState<TrendApiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
  setError(null);
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

  fetch(`${base}/api/trends/${area}?timeFrame=${timeFrame}`, { cache: 'no-store' })
    .then((res) => res.json())
    .then((res) => {
      if (res?.success && res?.data) {
        setTrendData(res.data);
      } else {
        setError('Failed to load data');
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error('fetch trends failed:', err);
      setError('Failed to load data');
      setLoading(false);
    });
}, [area, timeFrame]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!trendData) return <div className="p-6">No data available</div>;

  // Convert data format to match previous chart format
  const chartData = trendData.trends.map(item => ({
    time: item.period,
    availability: 100 - item.occupancy,
    occupied: item.occupancy
  }));

  const summary = trendData.summary;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30">
      <div className="p-6 border-b border-gray-100/50">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {areaNames[area]} - Parking Trends
        </h2>
        <p className="text-gray-700 font-medium">
          Average availability patterns for {timeFrame === 'day' ? 'today' : timeFrame === 'week' ? 'this week' : 'this month'}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Availability Percentage</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [`${value}%`, 'Availability']}
                  />
                  <Bar dataKey="availability" fill="#10b981" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Occupied Spots Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [`${value}`, 'Occupied Spots']}
                  />
                  <Line type="monotone" dataKey="occupied" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-xl border border-green-300 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="ri-arrow-up-line text-white text-xl"></i>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Best Time</div>
                <div className="text-sm text-green-100 font-medium">{summary.bestTime} ({100 - summary.minOccupancy}% available)</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 shadow-xl border border-red-300 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="ri-arrow-down-line text-white text-xl"></i>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Peak Time</div>
                <div className="text-sm text-red-100 font-medium">{summary.peakTime} ({100 - summary.maxOccupancy}% available)</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-xl border border-blue-300 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="ri-time-line text-white text-xl"></i>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Average</div>
                <div className="text-sm text-blue-100 font-medium">{100 - summary.averageOccupancy}% availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
