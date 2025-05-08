'use client';

import React, { Suspense, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from '../styles/sections.module.css';
import { useTranslation, Language } from '../utils/i18n';

// Dynamically import the Globe component with no SSR
const Globe = dynamic(() => import('./Globe'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-transparent rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-gray-700 text-xl">Loading...</div>
    </div>
  )
});

interface WorldMapProps {
  language: Language;
}

const WorldMap: React.FC<WorldMapProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const koreaRef = useRef<HTMLDivElement>(null);
  const boliviaRef = useRef<HTMLDivElement>(null);
  const italyRef = useRef<HTMLDivElement>(null);

  const scrollToLocation = (location: string) => {
    const refs = {
      korea: koreaRef,
      bolivia: boliviaRef,
      italy: italyRef
    };
    
    const ref = refs[location as keyof typeof refs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="world-map-container">
      <div className="mb-12">
        <Suspense fallback={
          <div className="h-[600px] w-full bg-transparent rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-gray-700 text-xl">Loading...</div>
          </div>
        }>
          <Globe language={language} onLocationClick={scrollToLocation} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div ref={koreaRef} className="location-box flex-1">
          <div className="h-64 overflow-hidden relative">
            <Image src="/images/korea.jpg" alt="Korea" width={400} height={256} className="w-full h-full object-cover" />
            <div className="location-date">June 14, 2025</div>
          </div>
          <div className="location-content p-6">
            <h3 className="text-2xl font-bold mb-2">{t.locations.korea.title}</h3>
            <p className="text-gray-600">{t.locations.korea.description}</p>
          </div>
        </div>
        
        <div ref={boliviaRef} className="location-box flex-1">
          <div className="h-64 overflow-hidden relative">
            <Image src="/images/bolivia.jpg" alt="Bolivia" width={400} height={256} className="w-full h-full object-cover" />
            <div className="location-date">Coming Soon</div>
          </div>
          <div className="location-content p-6">
            <h3 className="text-2xl font-bold mb-2">{t.locations.bolivia.title}</h3>
            <p className="text-gray-600">{t.locations.bolivia.description}</p>
          </div>
        </div>
        
        <div ref={italyRef} className="location-box flex-1">
          <div className="h-64 overflow-hidden relative">
            <Image src="/images/italy.jpg" alt="Italy" width={400} height={256} className="w-full h-full object-cover" />
            <div className="location-date">Coming Soon</div>
          </div>
          <div className="location-content p-6">
            <h3 className="text-2xl font-bold mb-2">{t.locations.italy.title}</h3>
            <p className="text-gray-600">{t.locations.italy.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap; 