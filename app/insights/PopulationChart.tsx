'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PopulationData {
  year: number;
  population: number;
  growth: number;
}

interface PopulationResponse {
  population: PopulationData[];
  summary: {
    totalGrowth: number;
    currentPopulation: number;
    averageAnnualGrowth: number;
    impactOnParking: string;
  };
}

export default function PopulationChart() {
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';
    fetch(`${base}/api/insights/population-growth`, { cache: 'no-store' })
      .then(res => res.json())
      .then(res => {
        if (res.success&& res?.data?.population) {
          setPopulationData(res.data.population);
        }
        setLoading(false);
      })
      .catch(() => {
        console.error('fetch population-growth failed:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-600">Loading population data...</div>
      </div>
    );
  }

  const chartData = populationData.map(item => ({
    year: item.year.toString(),
    population: item.population,
    change: item.growth
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            stroke="#6b7280" 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name) => [
              `${value.toLocaleString()} residents`, 
              'CBD Population'
            ]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Bar 
            dataKey="population" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            stroke="#059669"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
