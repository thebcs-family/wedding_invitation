'use client';

import React from 'react';
import Image from 'next/image';

const WorldMap: React.FC = () => {
  return (
    <div className="section-container relative">
      <div className="relative h-[500px] w-full">
        <Image
          src="/images/world-map.jpg"
          alt="World Map"
          fill
          className="object-contain"
        />
        {/* Korea Marker */}
        <div className="absolute" style={{ top: '45%', left: '80%' }}>
          <div className="relative">
            <div className="w-4 h-4 bg-accent-gold rounded-full" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg">
              <p className="text-sm font-semibold text-primary-green">Korea</p>
              <p className="text-xs text-gray-600">June 15, 2024</p>
            </div>
          </div>
        </div>
        {/* Italy Marker */}
        <div className="absolute" style={{ top: '40%', left: '50%' }}>
          <div className="relative">
            <div className="w-4 h-4 bg-gray-400 rounded-full" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg">
              <p className="text-sm font-semibold text-gray-600">Italy</p>
              <p className="text-xs text-gray-400">Coming Soon</p>
            </div>
          </div>
        </div>
        {/* Bolivia Marker */}
        <div className="absolute" style={{ top: '60%', left: '30%' }}>
          <div className="relative">
            <div className="w-4 h-4 bg-gray-400 rounded-full" />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg">
              <p className="text-sm font-semibold text-gray-600">Bolivia</p>
              <p className="text-xs text-gray-400">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap; 