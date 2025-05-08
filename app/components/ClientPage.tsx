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
      setStoredLanguage(browserLanguage);
      return;
    }

    // If browser language is English or not supported, try country detection
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        const detectedLanguage = getLanguageFromCountry(data.country_code);
        setLanguage(detectedLanguage);
        setStoredLanguage(detectedLanguage);
      })
      .catch(() => {
        // Fallback to English if detection fails
        setLanguage('en');
        setStoredLanguage('en');
      });

    // Load messages
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
    });

    return () => unsubscribe();
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
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 text-center">{t.ourInvitation}</h3>
            <p className="text-gray-700 leading-relaxed text-center">
              {t.invitationText}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 text-center">{t.weddingDetails}</h3>
            <div className="text-center">
              <p className="text-xl mb-4">{t.date}</p>
              <p className="text-xl mb-4">{t.time}</p>
              <p className="mb-4">{t.venue}</p>
              <p className="mb-4">{t.address}</p>
              <div className="flex justify-center">
                <ShareButtons language={language} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 text-center">{t.rsvp}</h3>
            <p className="text-center mb-4 text-gray-600">{t.rsvpText}</p>
            <div className="text-center">
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
          <div className="bg-white p-4 rounded-lg shadow-lg">
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
          <div className={styles.headerContent}>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 text-white">{t.weddingInvitation}</h1>
            <p className="text-3xl md:text-4xl font-light mb-4 text-white">Federico & Cecilia</p>
            <p className="text-2xl md:text-3xl text-white">{t.saveTheDate}</p>
          </div>
          <AnimatedWaves />
        </header>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className={`py-16 px-4 ${styles.worldMapSection}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-12 text-center" style={{ color: 'var(--button-color)' }}>{t.ourJourney}</h2>
            <WorldMap language={language} />
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
              <div className="space-y-4 mb-8">
                {messages.map((message) => (
                  <div key={message.id} className="message-item">
                    <div className="message-header">
                      <div className="message-author">
                        <span className="text-[#b6cfa6] mr-2">♥</span>
                        {message.name}
                      </div>
                      <div className="message-time">
                        {message.timestamp?.toDate().toLocaleDateString() || 'Just now'}
                      </div>
                    </div>
                    <div className="message-text">{message.message}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--button-color)' }}>{t.leaveMessage}</h3>
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