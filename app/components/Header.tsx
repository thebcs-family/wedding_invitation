'use client';

import React from 'react';

interface HeaderProps {
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  return (
    <header className="relative h-screen flex items-center justify-center">
       <div className="absolute inset-0">
        <img
          src="/images/header-bg.jpg"
          alt="Wedding Background"
          className="w-full h-full object-cover"
        />
      </div> 
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Wedding Invitation</h1>
        <p className="text-xl md:text-2xl">Save the Date</p>
      </div>
    </header>
  );
};

export default Header; 
