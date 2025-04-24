'use client';

import React from 'react';
import Image from 'next/image';

interface LocationProps {
  country: string;
  date: string;
  image: string;
  isActive: boolean;
}

const LocationCard: React.FC<LocationProps> = ({ country, date, image, isActive }) => {
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-70'}`}>
      <div className="aspect-w-16 aspect-h-9">
        <Image
          src={image}
          alt={`Wedding in ${country}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{country}</h3>
          <p className="text-lg">{date}</p>
          {!isActive && (
            <div className="absolute top-4 right-4 bg-white/90 text-primary-green px-3 py-1 rounded-full text-sm font-semibold">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Locations: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const locations = [
    {
      country: 'Korea',
      date: 'June 15, 2024',
      image: '/images/korea.jpg',
      isActive: true
    },
    {
      country: 'Italy',
      date: 'Coming Soon',
      image: '/images/italy.jpg',
      isActive: false
    },
    {
      country: 'Bolivia',
      date: 'Coming Soon',
      image: '/images/bolivia.jpg',
      isActive: false
    }
  ];

  return (
    <div className="section-container">
      <h2 className="text-3xl text-center mb-8" style={{ color: 'var(--primary-green)' }}>
        Our Wedding Locations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {locations.map((location, index) => (
          <LocationCard key={index} {...location} />
        ))}
      </div>
    </div>
  );
};

export default Locations; 