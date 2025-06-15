"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "../components/AnimatedSection";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation, Language, getBrowserLanguage } from "../utils/i18n";

export default function PhotosPage() {
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslation(language);

  useEffect(() => {
    const initializeLanguage = async () => {
      const browserLanguage = getBrowserLanguage();
      if (browserLanguage) {
        setLanguage(browserLanguage);
      } else {
        setLanguage('en');
      }
    };
    initializeLanguage();
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <main className="min-h-screen bg-[var(--primary-color)] px-4 py-12">
      <LanguageSwitcher 
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--button-color)]">{t.photos.title}</h1>
          <p className="text-xl mb-6 text-gray-700">{t.photos.dateLocation}</p>
          <p className="text-lg mb-8 text-gray-700">
            {t.photos.description}
          </p>
          <Link
            href="https://photos.app.goo.gl/y38E6SiF7cWpEVsN6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-lg transition-colors text-lg hover:opacity-90"
            style={{ backgroundColor: "var(--button-color)" }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {t.photos.sharePhotos}
          </Link>
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <div className="flex justify-center">
            <img
              src="/images/fedececy_sign.jpeg"
              alt="Fede and Cecy Sign"
              className="max-w-full md:max-w-2xl rounded-xl shadow-lg border-4 border-white"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </AnimatedSection>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block text-white px-6 py-3 rounded-lg transition-colors text-lg"
            style={{ backgroundColor: "var(--button-color)" }}
          >
            {t.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
} 