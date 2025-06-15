'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation, Language } from '../utils/i18n';

interface PhotosPopupProps {
  language: Language;
}

export default function PhotosPopup({ language }: PhotosPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation(language);

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[10000] animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg 
              className="w-6 h-6 text-[var(--button-color)]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              {t.photosPopup?.title || 'Share Your Photos!'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {t.photosPopup?.message || 'Help us create beautiful memories by sharing your photos from our special day.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsVisible(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t.photosPopup?.later || 'Later'}
              </button>
              <Link
                href="/photos"
                className="px-3 py-1.5 text-sm bg-[var(--button-color)] text-white rounded-md hover:opacity-90 transition-opacity"
                onClick={() => setIsVisible(false)}
              >
                {t.photosPopup?.shareNow || 'Share Now'}
              </Link>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 