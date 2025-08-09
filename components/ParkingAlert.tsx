
'use client';

import { useState, useEffect } from 'react';

interface ParkingAlertProps {
  isVisible?: boolean;
  onDismiss?: () => void;
}

export default function ParkingAlert({ isVisible = false, onDismiss }: ParkingAlertProps) {
  const [showAlert, setShowAlert] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowAlert(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    setShowAlert(isVisible);
  }, [isVisible]);

  const handleDismiss = () => {
    setShowAlert(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!showAlert) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <i className="ri-time-line text-white text-lg"></i>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-orange-800 mb-1">
              Parking Expiry Reminder
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              Your parking at Collins Street Plaza expires in 15 minutes. Consider extending or moving your vehicle.
            </p>
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Extend Parking
              </button>
              <button 
                className="px-3 py-1 bg-white text-orange-600 text-xs font-medium rounded border border-orange-600 hover:bg-orange-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                Set Reminder
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:bg-orange-100 rounded cursor-pointer"
          >
            <i className="ri-close-line text-orange-600"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
