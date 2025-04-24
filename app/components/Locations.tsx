'use client';

import React from 'react';

interface LocationsProps {
  isMobile: boolean;
}

const Locations: React.FC<LocationsProps> = ({ isMobile }) => {
  const locations = [
    {
      name: 'Korea',
      date: 'June 15, 2024',
      // image: '/images/korea.jpg',
      description: 'Main Ceremony'
    },
    {
      name: 'Italy',
      date: 'Coming Soon',
      // image: '/images/italy.jpg',
      description: 'European Celebration'
    },
    {
      name: 'Bolivia',
      date: 'Coming Soon',
      // image: '/images/bolivia.jpg',
      description: 'South American Celebration'
    }
  ];

  return (
    <div className="section-container">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl text-center mb-8 text-primary-green">Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div key={index} className="text-center">
              {/* <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div> */}
              <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
              <p className="text-gray-600 mb-1">{location.date}</p>
              <p className="text-gray-700">{location.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations; 