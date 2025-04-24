'use client';

import React from 'react';

interface DetailsProps {
  isMobile: boolean;
}

const Details: React.FC<DetailsProps> = ({ isMobile }) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl'} text-center mb-8`}>
          Wedding Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} mb-4`}>Ceremony</h3>
            <p className="mb-2">June 15, 2024 at 2:00 PM</p>
            <p>St. Mary's Cathedral</p>
            <p>123 Main Street, Seoul</p>
          </div>
          
          <div className="text-center">
            <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} mb-4`}>Reception</h3>
            <p className="mb-2">June 15, 2024 at 5:00 PM</p>
            <p>Grand Ballroom</p>
            <p>456 Park Avenue, Seoul</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details; 