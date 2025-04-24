'use client';

import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  return (
    <header className="w-full py-12 text-center relative h-[80vh] flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/images/header-bg.jpg"
          alt="Wedding background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 
            className={`${isMobile ? 'text-4xl' : 'text-7xl'} mb-4 text-white`}
          >
            Person1 & Person2
          </h1>
          <div 
            className="w-24 h-1 mx-auto mb-4"
            style={{ backgroundColor: 'var(--accent-gold)' }}
          />
          <p 
            className={`${isMobile ? 'text-xl' : 'text-2xl'} text-white`}
          >
            Are Getting Married
          </p>
        </div>
        
        <div className={`${isMobile ? 'text-base' : 'text-xl'} space-y-2 text-white/90`}>
          <p>June 15, 2024</p>
          <p>Seoul, Korea</p>
        </div>
      </div>
    </header>
  );
};

export default Header; 