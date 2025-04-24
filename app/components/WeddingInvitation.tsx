'use client';

import React, { useEffect, useState } from 'react';
import Header from './Header';
import Details from './Details';
import MapSection from './MapSection';
import MessageSection from './MessageSection';
import Locations from './Locations';
import WorldMap from './WorldMap';
import BankInfo from './BankInfo';

const WeddingInvitation: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isMobile={isMobile} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <WorldMap />
        <Locations isMobile={isMobile} />
        <Details isMobile={isMobile} />
        <MapSection isMobile={isMobile} />
        <BankInfo />
        <MessageSection isMobile={isMobile} />
      </div>
    </div>
  );
};

export default WeddingInvitation; 