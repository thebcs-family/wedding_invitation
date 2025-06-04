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

interface ShareButtonsProps {
  language: Language;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ language }) => {
  const [showModal, setShowModal] = useState(false);
  const [sharePlatform, setSharePlatform] = useState<'kakao' | 'whatsapp'>('kakao');
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

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `Federico & Cecilia's Wedding`,
          description: 'Join us in celebrating our love on June 14, 2025',
          imageUrl: window.location.origin + '/images/optimized/header-bg.jpg',
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

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent('Join us in celebrating Federico & Cecilia\'s Wedding on June 14, 2025!');
    const url = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(window.location.href)}`;
    
    // Try to open WhatsApp app first
    const whatsappAppUrl = `whatsapp://send?text=${text}%20${encodeURIComponent(window.location.href)}`;
    
    // Create a temporary link to detect if the app is installed
    const link = document.createElement('a');
    link.href = whatsappAppUrl;
    
    // If the app is not installed, it will fall back to the web version
    link.onclick = (e) => {
      e.preventDefault();
      window.open(url, '_blank');
    };
    
    link.click();
  };

  const handleShare = () => {
    if (sharePlatform === 'kakao') {
      handleKakaoShare();
    } else {
      handleWhatsAppShare();
    }
    setShowModal(false);
  };

  // Example contact info (replace with real data or from translations/config)
  const bridePhone = 'tel:+821043029697'; // Example: Korea number
  const brideSMS = 'sms:+821043029697';
  const groomPhone = 'tel:+821030423555'; // Example: Italy number
  const groomSMS = 'sms:+821030423555';

  return (
    <div className="space-y-8">
      {/* Main Title */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {/* Contact Box */}
        <div className="flex-1 bg-white rounded-2xl p-8 shadow-md flex flex-col justify-center min-w-[280px] max-w-[420px] mx-auto">
          <div className="grid grid-cols-3 gap-y-8 items-center">
            {/* Bride Row */}
            <span className="font-semibold text-lg text-[#668eaa] text-right pr-2">{language === 'ko' ? '신부' : 'Bride'}</span>
            <span className="font-bold text-gray-700 text-lg">{t.contact.bride}</span>
            <span className="flex gap-3">
              <a href={bridePhone} title="Call" className="hover:opacity-70" target="_blank" rel="noopener noreferrer">
                <svg height="18" viewBox="0 0 128 128" width="18" xmlns="http://www.w3.org/2000/svg" style={{ fill: '#668eaa' }}><g id="icon"><path d="m54.048 43.653-3.928 6.122a7.725 7.725 0 0 0 .829 9.434l8.566 9.277 9.277 8.566a7.726 7.726 0 0 0 9.434.829l6.638-4.259 16.65 17.219-6.748 8.553a8.839 8.839 0 0 1 -9.277 3.039c-13.659-3.633-25.501-11.763-36.672-23.25-11.487-11.171-19.617-23.013-23.251-36.672a8.84 8.84 0 0 1 3.04-9.276l8.605-6.79z"/><path d="m85.054 73.5-1 .641 17.126 17.123.375-.475a5.5 5.5 0 0 0 -.434-7.3l-9.237-9.237a5.493 5.493 0 0 0 -6.83-.752z"/><path d="m37.212 26.445-.475.375 17.123 17.125.641-1a5.493 5.493 0 0 0 -.75-6.829l-9.237-9.237a5.5 5.5 0 0 0 -7.302-.434z"/></g></svg>
              </a>
              <a href={brideSMS} title="Send SMS" className="hover:opacity-70" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#668eaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </span>
            {/* Groom Row */}
            <span className="font-semibold text-lg text-[#668eaa] text-right pr-2">{language === 'ko' ? '신랑' : 'Groom'}</span>
            <span className="font-bold text-gray-700 text-lg">{t.contact.groom}</span>
            <span className="flex gap-3">
              <a href={groomPhone} title="Call" className="hover:opacity-70" target="_blank" rel="noopener noreferrer">
                <svg height="18" viewBox="0 0 128 128" width="18" xmlns="http://www.w3.org/2000/svg" style={{ fill: '#668eaa' }}><g id="icon"><path d="m54.048 43.653-3.928 6.122a7.725 7.725 0 0 0 .829 9.434l8.566 9.277 9.277 8.566a7.726 7.726 0 0 0 9.434.829l6.638-4.259 16.65 17.219-6.748 8.553a8.839 8.839 0 0 1 -9.277 3.039c-13.659-3.633-25.501-11.763-36.672-23.25-11.487-11.171-19.617-23.013-23.251-36.672a8.84 8.84 0 0 1 3.04-9.276l8.605-6.79z"/><path d="m85.054 73.5-1 .641 17.126 17.123.375-.475a5.5 5.5 0 0 0 -.434-7.3l-9.237-9.237a5.493 5.493 0 0 0 -6.83-.752z"/><path d="m37.212 26.445-.475.375 17.123 17.125.641-1a5.493 5.493 0 0 0 -.75-6.829l-9.237-9.237a5.5 5.5 0 0 0 -7.302-.434z"/></g></svg>
              </a>
              <a href={groomSMS} title="Send SMS" className="hover:opacity-70" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#668eaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </span>
          </div>
        </div>
        {/* Share Box */}
        <div className="flex-1 bg-white rounded-2xl p-8 shadow-md flex flex-col justify-center min-w-[280px] max-w-[420px] mx-auto">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSharePlatform('kakao');
                setShowModal(true);
              }}
              className="bg-[#fffbe6] hover:bg-[#fee500] text-[#222] border border-[#fee500] font-medium px-7 py-3 rounded-xl transition-colors text-base shadow-sm"
              style={{ fontFamily: 'inherit' }}
            >
              {t.kakaoShare.share}
            </button>
            <button
              onClick={() => {
                setSharePlatform('whatsapp');
                setShowModal(true);
              }}
              className="bg-[#eafff3] hover:bg-[#25D366] text-[#128C7E] border border-[#25D366] font-medium px-7 py-3 rounded-xl transition-colors text-base shadow-sm"
              style={{ fontFamily: 'inherit' }}
            >
              {t.whatsappShare.share}
            </button>
          </div>
        </div>
      </div>
      {/* Add space before thank you */}
      <div className="h-10" />
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
                src="/images/optimized/header-bg.jpg"
                alt="Wedding Preview"
                width={300}
                height={200}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Federico & Cecilia's Wedding</h3>
              <p className="text-gray-600 mb-4">Join us in celebrating on June 14, 2025</p>
              <button
                onClick={handleShare}
                className={`${
                  sharePlatform === 'kakao' ? 'bg-[#fee500] hover:bg-[#fffbe6] text-[#222] border border-[#fee500]' : 'bg-[#25D366] hover:bg-[#eafff3] text-[#128C7E] border border-[#25D366]'
                } font-medium px-6 py-2 rounded-lg transition-colors text-base shadow-sm`}
                style={{ fontFamily: 'inherit' }}
              >
                {sharePlatform === 'kakao' ? t.kakaoShare.send : t.whatsappShare.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButtons; 