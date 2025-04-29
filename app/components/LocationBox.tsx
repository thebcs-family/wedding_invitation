'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LocationBoxProps {
  image: string;
  title: string;
  description: string;
  date: string;
  onClick?: () => void;
}

export default function LocationBox({ image, title, description, date, onClick }: LocationBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="location-box flex-1"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-64 overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={256}
          className="w-full h-full object-cover"
        />
        <div className={`location-date ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {date}
        </div>
      </div>
      <div className="location-content p-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
} 