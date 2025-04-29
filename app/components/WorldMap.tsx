'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/sections.module.css';

const WorldMap: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="relative mb-8">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <Image
            src="/images/world-map.png"
            alt="World Map with our locations"
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg"
          />
        </div>
        
        {/* Map Points */}
        <div 
          className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer transition-transform hover:scale-150"
          style={{ top: '44%', right: '17.5%' }}
          onMouseEnter={() => setHoveredPoint('korea')}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {hoveredPoint === 'korea' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-2 rounded-lg shadow-lg whitespace-nowrap">
              <p className="font-bold text-sm" style={{ color: '#72999d' }}>Daejeon, Korea</p>
              <p className="text-xs" style={{ color: '#72999d' }}>June 14, 2025</p>
            </div>
          )}
        </div>
        <div 
          className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer transition-transform hover:scale-150"
          style={{ bottom: '25%', right: '67%' }}
          onMouseEnter={() => setHoveredPoint('bolivia')}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {hoveredPoint === 'bolivia' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-2 rounded-lg shadow-lg whitespace-nowrap">
              <p className="font-bold text-sm" style={{ color: '#72999d' }}>La Paz, Bolivia</p>
              <p className="text-xs" style={{ color: '#72999d' }}>Coming Soon</p>
            </div>
          )}
        </div>
        <div 
          className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer transition-transform hover:scale-150"
          style={{ bottom: '55.5%', left: '51.5%' }}
          onMouseEnter={() => setHoveredPoint('italy')}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {hoveredPoint === 'italy' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-2 rounded-lg shadow-lg whitespace-nowrap">
              <p className="font-bold text-sm" style={{ color: '#72999d' }}>Bologna, Italy</p>
              <p className="text-xs" style={{ color: '#72999d' }}>Coming Soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Country Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="location-box flex-1" onClick={() => scrollToSection('wedding-korea')}>
          <div className="h-64 overflow-hidden relative">
            <Image src="/images/korea.jpg" alt="Korea" width={400} height={256} className="w-full h-full object-cover" />
            <div className="location-date">June 14, 2025</div>
          </div>
          <div className="location-content p-6">
            <h3 className="text-2xl font-bold mb-2">Daejeon, Korea</h3>
            <p className="text-gray-600">Where our love story started</p>
          </div>
        </div>
        
        <div className="location-box flex-1">
          <div className="h-64 overflow-hidden relative">
            <Image src="/images/bolivia.jpg" alt="Bolivia" width={400} height={256} className="w-full h-full object-cover" />
            <div className="location-date">Coming Soon</div>
          </div>
          <div className="location-content p-6">
            <h3 className="text-2xl font-bold mb-2">La Paz, Bolivia</h3>
            <p className="text-gray-600">Cecilia's hometown</p>
          </div>
        </div>
        
        <div className="location-box flex-1">
          <div className="h-64 overflow-hidden relative">
            <Image src="/images/italy.jpg" alt="Italy" width={400} height={256} className="w-full h-full object-cover" />
            <div className="location-date">Coming Soon</div>
          </div>
          <div className="location-content p-6">
            <h3 className="text-2xl font-bold mb-2">Bologna, Italy</h3>
            <p className="text-gray-600">Federico's hometown</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap; 