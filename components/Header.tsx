
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-white/30 sticky top-0 z-50">
      <div className="px-8 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-4 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <i className="ri-parking-line text-white text-2xl"></i>
            </div>
            <div className="font-['Pacifico'] text-3xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              Lord of Park
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <nav className="flex items-center space-x-2">
            <Link 
              href="/home" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                pathname === '/home'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <i className="ri-home-line"></i>
              <span>Home</span>
            </Link>
            <Link 
              href="/" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                pathname === '/'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <i className="ri-map-pin-line"></i>
              <span>Live Map</span>
            </Link>
            <Link 
              href="/trends" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                pathname === '/trends' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <i className="ri-line-chart-line"></i>
              <span>Trends</span>
            </Link>
            <Link 
              href="/insights" 
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                pathname === '/insights' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/80 hover:shadow-md'
              }`}
            >
              <i className="ri-bar-chart-line"></i>
              <span>Insights</span>
            </Link>
          </nav>

          {/* Right Section - Status Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live Data</span>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Melbourne CBD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
