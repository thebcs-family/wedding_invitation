'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-7xl md:text-6xl font-bold mb-5 text-white">Wedding Invitation</h1>
        <p className="text-5xl md:text-4xl font-light mb-4 text-white">Federico & Cecilia</p>
      </div>
    </header>
  );
} 