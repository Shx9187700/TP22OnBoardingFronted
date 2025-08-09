
'use client';

import Header from '../../components/Header';
import TrendsChart from './TrendsChart';
import AreaSelector from './AreaSelector';
import { useState } from 'react';

export default function TrendsPage() {
  const [selectedArea, setSelectedArea] = useState('collins-street');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week');

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              <h1 className="text-4xl font-bold text-transparent mb-3 tracking-tight">
                Historical Parking Trends
              </h1>
            </div>
            <p className="text-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Analyze parking patterns to plan your trips better
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <AreaSelector 
                selectedArea={selectedArea}
                onAreaChange={setSelectedArea}
                selectedTimeFrame={selectedTimeFrame}
                onTimeFrameChange={setSelectedTimeFrame}
              />
            </div>
            
            <div className="lg:col-span-3">
              <TrendsChart 
                area={selectedArea}
                timeFrame={selectedTimeFrame}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
