'use client';

import React from 'react';

const WorldMap: React.FC = () => {
  return (
    <div className="section-container">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl text-center mb-8 text-primary-green">Our Journey</h2>
        {/* <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <img
            src="/images/world-map.jpg"
            alt="World Map"
            className="w-full h-full object-cover"
          />
        </div> */}
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-700">
            Our love story spans across continents...
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorldMap; 