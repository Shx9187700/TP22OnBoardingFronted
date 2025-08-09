'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CarOwnershipData {
  year: number;
  ownership: number;
  growth: number;
}

interface CarOwnershipResponse {
  carOwnership: CarOwnershipData[];
  summary: {
    totalGrowth: number;
    currentOwnership: number;
    averageAnnualGrowth: number;
    impactOnParking: string;
  };
}

export default function GrowthChart() {
  const [carOwnershipData, setCarOwnershipData] = useState<CarOwnershipData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/insights/car-ownership')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setCarOwnershipData(res.data.carOwnership);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-600">Loading car ownership data...</div>
      </div>
    );
  }

  const chartData = carOwnershipData.map(item => ({
    year: item.year.toString(),
    vehicles: item.ownership,
    growth: item.growth
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name) => [
              `${(value / 1000).toLocaleString()}K vehicles`, 
              'Registered Vehicles'
            ]}
            labelFormatter={(label) => `Year ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="vehicles" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}