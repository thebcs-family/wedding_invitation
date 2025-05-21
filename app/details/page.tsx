'use client';

import { useEffect, useState } from 'react';
import { useTranslation, Language, getStoredLanguage, getBrowserLanguage, getLanguageFromCountry } from '../utils/i18n';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/sections.module.css';
import Head from 'next/head';

export default function DetailsPage() {
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslation(language);

  useEffect(() => {
    // First try to get stored language
    const storedLanguage = getStoredLanguage();
    if (storedLanguage) {
      setLanguage(storedLanguage);
      return;
    }

    // If no stored language, try browser language
    const browserLanguage = getBrowserLanguage();
    if (browserLanguage !== 'en') {
      setLanguage(browserLanguage);
      return;
    }

    // If browser language is English or not supported, try country detection
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const detectedLanguage = getLanguageFromCountry(data.country_code);
        setLanguage(detectedLanguage);
      })
      .catch(() => {
        // Fallback to English if detection fails
        setLanguage('en');
      });
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <>
      <Head>
        <title>{`${t.moreDetails?.title} - Federico & Cecilia's Wedding`}</title>
        <meta name="description" content={t.moreDetails?.partySize} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${t.moreDetails?.title} - Federico & Cecilia's Wedding`} />
        <meta property="og:description" content={t.moreDetails?.partySize} />
        <meta property="og:image" content="https://fedececy.com/images/optimized/header-bg.jpg" />
        <meta property="og:url" content="https://fedececy.com/details" />
        <meta property="og:type" content="website" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t.moreDetails?.title} - Federico & Cecilia's Wedding`} />
        <meta name="twitter:description" content={t.moreDetails?.partySize} />
        <meta name="twitter:image" content="https://fedececy.com/images/optimized/header-bg.jpg" />
      </Head>

      <main className={`min-h-screen ${styles.variables}`}>
        <LanguageSwitcher 
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />

        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link 
            href="/"
            className="inline-block mb-8 text-[var(--button-color)] hover:opacity-80 transition-opacity"
          >
            ← {t.backToHome || 'Back to Home'}
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: 'var(--button-color)' }}>
              {t.moreDetails?.title}
            </h1>

            <div className="space-y-6 text-gray-700">
              <div className="bg-[#f8fff8] rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--button-color)' }}>
                  {t.moreDetails?.partySizeTitle || 'About the Party'}
                </h2>
                <p className="leading-relaxed text-lg">
                  {t.moreDetails?.partySize}
                </p>
              </div>

              <div className="bg-[#f8fff8] rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--button-color)' }}>
                  {t.moreDetails?.giftsTitle || 'About Gifts'}
                </h2>
                <p className="leading-relaxed text-lg">
                  {t.moreDetails?.noGifts}
                </p>
              </div>

              <div className="bg-[#f8fff8] rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--button-color)' }}>
                  {t.moreDetails?.wannaHelp || 'Do you need help with anything?'}
                </h2>
                <p className="leading-relaxed text-lg">
                  {t.moreDetails?.help}
                </p>
              </div>
            </div>

            <div className="mt-12 mb-8">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/images/optimized/dragons.webp"
                  alt="Dragons decoration"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-xl"
                  priority
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-block text-white px-8 py-3 rounded-lg transition-colors text-lg"
                style={{ backgroundColor: 'var(--button-color)' }}
              >
                {t.backToHome || 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 