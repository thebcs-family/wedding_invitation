'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from './Header';
import MusicPlayer from './MusicPlayer';
import KakaoShare from './KakaoShare';
import WorldMap from './WorldMap';
import LocationBox from './LocationBox';
import Calendar from './Calendar';
import MessageForm from './MessageForm';
import RSVPModal from './RSVPModal';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import Script from 'next/script';
import styles from '../styles/sections.module.css';
//import GiftSection from './GiftSection';
import { Gallery } from './Gallery';
import Head from 'next/head';
import KakaoMap from './KakaoMap';
import Notification from './Notification';
import ImagePopup from './ImagePopup';
import AnimatedSection from './AnimatedSection';
import AnimatedWaves from './AnimatedWaves';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation, getLanguageFromCountry, Language, getStoredLanguage, setStoredLanguage, getBrowserLanguage } from '../utils/i18n';
import ShareButtons from './ShareButtons';
import ReactCountryFlag from 'react-country-flag';

interface ClientPageProps {
  images: string[];
}

export default function ClientPage({ images }: ClientPageProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { t } = useTranslation(language);

  useEffect(() => {
    const initializeLanguage = async () => {
      console.log('Initializing language...');
      
      // Get browser language
      const browserLanguage = getBrowserLanguage();
      console.log('Browser language detected:', browserLanguage);
      
      if (browserLanguage) {
        console.log('Using browser language:', browserLanguage);
        setLanguage(browserLanguage);
        return;
      }

      // If no browser language detected, default to English
      console.log('No browser language detected, defaulting to English');
      setLanguage('en');
    };

    initializeLanguage();
  }, []);

  // Separate useEffect for Firebase messages
  useEffect(() => {
    console.log('Setting up Firebase listener...');
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Firebase snapshot received');
        console.log('Snapshot empty?', snapshot.empty);
        console.log('Number of docs:', snapshot.docs.length);
        
        const newMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Document data:', data);
          return {
            id: doc.id,
            ...data
          };
        });
        
        console.log('Setting messages state with:', newMessages);
        setMessages(newMessages);
      }, 
      (error) => {
        console.error('Firebase error:', error);
      }
    );

    return () => {
      console.log('Cleaning up Firebase listener');
      unsubscribe();
    };
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setStoredLanguage(newLanguage);
  };

  const renderMap = () => {
    if (typeof window !== 'undefined' && window.daum) {
      new window.daum.roughmap.Lander({
        timestamp: '1710000000000',
        key: window.KAKAO_MAP_KEY,
        mapWidth: '100%',
        mapHeight: '400px',
      }).render();
    }
  };

  const weddingDetailsSection = (
    <section id="wedding-korea" className="py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 text-center" style={{ color: 'var(--button-color)' }}>{t.weddingInKorea}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center h-full">
            <h3 className="text-2xl mb-6 text-center">{t.ourInvitation}</h3>
            <p className="text-gray-700 leading-relaxed text-center">
              {t.invitationText}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center h-full">
            <h3 className="text-2xl mb-6 text-center">{t.weddingDetails}</h3>
            <div className="text-center">
              <p className="text-xl mb-2">{t.date}</p>
              <p className="text-xl mb-2">{t.time}</p>
              <p className="mb-2">{t.venue}</p>
              <p className="mb-4">{t.address}</p>
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
                <ShareButtons language={language} />
                <Link
                  href="/details"
                  className="text-white rounded-lg transition-colors leading-[1rem] hover:bg-white hover:text-black flex items-center justify-center h-[2.5rem] md:w-auto w-[9.5rem] min-w-[7rem] max-w-[12rem] bg-[var(--button-color)] shadow-xl"
                >
                  <span className="leading-tight text-center whitespace-pre-line">{(t.moreDetails?.title || 'More Details')}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-2xl mb-6 text-center">{t.rsvp}</h3>
            <p className="mb-4 text-gray-600 text-center">{t.rsvpText}</p>
            <div>
              <button
                onClick={() => setShowRSVPModal(true)}
                className="text-white px-8 py-3 rounded-lg transition-colors text-lg"
                style={{ backgroundColor: 'var(--button-color)' }}
              >
                {t.rsvpNow}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <KakaoMap />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
            <Calendar language={language} />
          </div>
        </div>
      </div>
    </section>
  );

  //const giftSection = (
    //<section id="gift" className="py-8">
      //<div className="max-w-6xl mx-auto px-4">
        //<GiftSection />
      //</div>
    //</section>
  //);

  const handleRSVPSubmit = () => {
    setNotification({ message: t.thankYou, type: 'success' });
  };

  const handleMessageSubmit = () => {
    setNotification({ message: t.thankYou, type: 'success' });
  };

  const handleError = (message: string) => {
    setNotification({ message, type: 'error' });
  };

  return (
    <main className={`min-h-screen ${styles.variables}`}>
      <LanguageSwitcher 
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
      />
      
      <AnimatedSection>
        <header className={`${styles.headerImage} relative`}>
          <div className={styles.headerOverlay}></div>
          <div className={`${styles.headerContent} flex flex-col h-full relative`} style={{ zIndex: 10000 }}>
            <Image
              src="/images/header_text.webp"
              alt="Header Text"
              width={600}
              height={200}
              className="mx-auto brightness-0 invert mt-0 w-[90%] md:w-[600px]"
              priority
            />
            <Image
              src="/images/header_text_2.webp"
              alt="Federico and Cecilia"
              width={350}
              height={200}
              className="mx-auto brightness-0 invert absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] md:w-[350px]"
              priority
            />
          </div>
          <AnimatedWaves />
        </header>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className={`py-16 px-4 ${styles.worldMapSection}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--button-color)' }}>{t.ourJourney}</h2>
            <p className="text-gray-600 text-center mb-8">{t.journeyMessage}</p>
            <WorldMap language={language} messages={messages} />
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        {weddingDetailsSection}
      </AnimatedSection>

      <AnimatedSection>
        <Gallery images={images} language={language} />
      </AnimatedSection>

      {/*{giftSection}*/}

      <AnimatedSection>
        <section className={`py-8 px-4 ${styles.messagesSection}`}>
          <div className="max-w-6xl mx-auto">
            <div className={styles.sectionContainer}>
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--button-color)' }}>{t.messagesFromGuests}</h3>
              <div className="space-y-4 h-[400px] overflow-y-auto custom-scrollbar bg-[#f8fff8] rounded-lg p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500">No messages yet</div>
                ) : (
                  messages.map((message, idx) => (
                    <div
                      key={message.id}
                      className={`bg-white border border-[#e5e7eb] p-2 md:p-3 rounded-2xl shadow my-3 ${idx === messages.length - 1 ? 'mb-8' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                          <span className="text-[#b6cfa6]">♥</span>
                          {message.country && message.country !== 'NO_COUNTRY' ? (
                            <ReactCountryFlag
                              countryCode={message.country}
                              svg
                              style={{
                                width: '1.2em',
                                height: '1.2em',
                              }}
                            />
                          ) : (
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {message.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {message.timestamp?.toDate().toLocaleDateString() || 'Just now'}
                        </div>
                      </div>
                      <div className="text-gray-700 text-sm pb-1">{message.message}</div>
                    </div>
                  ))
                )}
              </div>

              <h3 className="text-2xl font-bold mb-6 text-center mt-4" style={{ color: 'var(--button-color)' }}>{t.leaveMessage}</h3>
              <MessageForm 
                onSuccess={handleMessageSubmit}
                onError={handleError}
                language={language}
              />
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <footer className="py-8 text-center">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl mb-6">{t.shareNews}</h3>
            <div className="flex justify-center gap-4">
            <KakaoShare language={language} />
            </div>
            <p className="text-gray-600 mb-4">{t.thankYou}</p>
            <div className="text-4xl" style={{ color: 'var(--button-color)' }}>♥</div>
            <p className="text-gray-600 mt-8">{t.developedBy}</p>
          </div>
        </footer>
      </AnimatedSection>

      <MusicPlayer />
      <RSVPModal 
        isOpen={showRSVPModal} 
        onClose={() => setShowRSVPModal(false)}
        onSuccess={handleRSVPSubmit}
        onError={handleError}
        language={language}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  );
} 