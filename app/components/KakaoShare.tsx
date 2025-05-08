'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/sections.module.css';
import { secrets } from '../config/secrets';
import { useTranslation, Language } from '../utils/i18n';

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: any) => void;
      };
    };
  }
}

interface KakaoShareProps {
  language: Language;
}

const KakaoShare: React.FC<KakaoShareProps> = ({ language }) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation(language);

  useEffect(() => {
    // Load Kakao SDK
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.Kakao.init(secrets.kakao.javascriptKey);
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `Federico & Cecilia's Wedding`,
          description: 'Join us in celebrating our love on June 14, 2025',
          imageUrl: window.location.origin + '/images/header-bg.jpg',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: 'View Invitation',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-yellow-400 text-white px-8 py-3 rounded-lg transition-colors text-lg mb-8"
      >
        {t.kakaoShare.share}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <Image
                src="/images/header-bg.jpg"
                alt="Wedding Preview"
                width={300}
                height={200}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Federico & Cecilia's Wedding</h3>
              <p className="text-gray-600 mb-4">Join us in celebrating on June 14, 2025</p>
              <button
                onClick={() => {
                  handleShare();
                  setShowModal(false);
                }}
                className="bg-yellow-400 text-white px-6 py-2 rounded-lg"
              >
                {t.kakaoShare.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KakaoShare; 