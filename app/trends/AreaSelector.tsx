
'use client';

interface AreaSelectorProps {
  selectedArea: string;
  onAreaChange: (area: string) => void;
  selectedTimeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

const areas = [
  { id: 'collins-street', name: 'Collins Street', spots: 450 },
  { id: 'bourke-street', name: 'Bourke Street', spots: 320 },
  { id: 'flinders-lane', name: 'Flinders Lane', spots: 280 },
  { id: 'queen-street', name: 'Queen Street', spots: 180 },
  { id: 'elizabeth-street', name: 'Elizabeth Street', spots: 520 },
  { id: 'spencer-street', name: 'Spencer Street', spots: 650 }
];

const timeFrames = [
  { id: 'day', name: 'Today', icon: 'ri-calendar-line' },
  { id: 'week', name: 'This Week', icon: 'ri-calendar-week-line' },
  { id: 'month', name: 'This Month', icon: 'ri-calendar-month-line' }
];

export default function AreaSelector({ selectedArea, onAreaChange, selectedTimeFrame, onTimeFrameChange }: AreaSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <i className="ri-map-pin-line text-blue-600 mr-2"></i>
          Select Area
        </h3>
        <div className="space-y-2">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => onAreaChange(area.id)}
              className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 cursor-pointer ${
                selectedArea === area.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border border-blue-400'
                  : 'hover:bg-white/80 border border-white/20 text-gray-800 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{area.name}</div>
                  <div className={`text-sm ${selectedArea === area.id ? 'text-blue-100' : 'text-gray-600'}`}>{area.spots} spots</div>
                </div>
                {selectedArea === area.id && (
                  <i className="ri-check-line text-white text-xl"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <i className="ri-time-line text-purple-600 mr-2"></i>
          Time Period
        </h3>
        <div className="space-y-2">
          {timeFrames.map((timeFrame) => (
            <button
              key={timeFrame.id}
              onClick={() => onTimeFrameChange(timeFrame.id)}
              className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 cursor-pointer ${
                selectedTimeFrame === timeFrame.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg border border-purple-400'
                  : 'hover:bg-white/80 border border-white/20 text-gray-800 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3">
                <i className={`${timeFrame.icon} text-lg`}></i>
                <span className="font-medium">{timeFrame.name}</span>
                {selectedTimeFrame === timeFrame.id && (
                  <i className="ri-check-line text-white text-xl ml-auto"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <i className="ri-bar-chart-line text-green-600 mr-2"></i>
          Quick Stats
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <span className="text-sm font-semibold text-gray-700">Peak Hours</span>
            <span className="text-sm font-bold text-gray-900">9-11 AM, 3-5 PM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <span className="text-sm font-semibold text-gray-700">Best Time</span>
            <span className="text-sm font-bold text-green-700">7-8 AM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
            <span className="text-sm font-semibold text-gray-700">Worst Time</span>
            <span className="text-sm font-bold text-red-700">2-3 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
