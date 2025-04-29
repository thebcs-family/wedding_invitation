'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from './components/Header';
import MusicPlayer from './components/MusicPlayer';
import KakaoShare from './components/KakaoShare';
import WorldMap from './components/WorldMap';
import LocationBox from './components/LocationBox';
import Calendar from './components/Calendar';
import MessageForm from './components/MessageForm';
import RSVPModal from './components/RSVPModal';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './config/firebase';
import Script from 'next/script';
import styles from './styles/sections.module.css';
import GiftSection from './components/GiftSection';
import { Gallery } from './components/Gallery';
import Head from 'next/head';
import KakaoMap from './components/KakaoMap';

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/images/gallery/photo_1.png',
    '/images/gallery/photo_2.png',
    '/images/gallery/photo_3.png',
    '/images/gallery/photo_4.png',
    '/images/gallery/photo_5.png',
  ];

  useEffect(() => {
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
        <h2 className="text-2xl font-bold mb-12 text-center" style={{ color: 'var(--button-color)' }}>Wedding in Korea</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 text-center">Our Invitation</h3>
            <p className="text-gray-700 leading-relaxed text-center">
              Though we come from different corners of the world,
              our paths crossed, and love found its way.
              Now, hand in hand, we begin a new journey as one.
              We invite you to celebrate our love
              and happiness in our new beginning. ♡
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <button 
              className="absolute top-4 right-4 bg-[#e0f0e0] text-[#72999d] border-none px-2 py-1 rounded-lg cursor-pointer transition-all text-sm font-bold"
              onClick={() => setIsEnglish(!isEnglish)}
            >
              {isEnglish ? 'Kor' : 'Eng'}
            </button>
            <h3 className="text-2xl mb-6 text-center">Wedding Details</h3>
            <div className="text-center">
              {isEnglish ? (
                <>
                  <p className="text-xl mb-4">Saturday, June 14, 2025</p>
                  <p className="text-xl mb-4">4:30 PM</p>
                  <p className="mb-4">Hiel Place</p>
                  <p className="mb-4">15-4, Gwanjeo-nam-ro 12beon-gil</p>
                </>
              ) : (
                <>
                  <p className="text-xl mb-4">2025년 6월 14일 토요일</p>
                  <p className="text-xl mb-4">오후 4시 30분</p>
                  <p className="mb-4">히엘플레이스</p>
                  <p className="mb-4">대전 서구 관저남로12번길 15-4 1층</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl mb-6 text-center">RSVP</h3>
            <p className="text-center mb-4 text-gray-600">Please RSVP online and submit your response</p>
            <div className="text-center">
              <button
                onClick={() => setShowRSVPModal(true)}
                className="text-white px-8 py-3 rounded-lg transition-colors text-lg"
                style={{ backgroundColor: 'var(--button-color)' }}
              >
                RSVP Now
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <KakaoMap />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Calendar />
          </div>
        </div>
      </div>
    </section>
  );

  const giftSection = (
    <section id="gift" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <GiftSection />
      </div>
    </section>
  );

  const gallerySection = (
    <section id="gallery" className="py-16">
      <h2 className="text-4xl font-bold text-center mb-8">Our Gallery</h2>
      <div className="max-w-6xl mx-auto px-4">
        <Gallery />
      </div>
    </section>
  );

  return (
    <main className={`min-h-screen ${styles.variables}`}>
      <header className={styles.headerImage}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className="text-7xl md:text-6xl font-bold mb-5 text-white">Wedding Invitation</h1>
          <p className="text-5xl md:text-4xl font-light mb-4 text-white">Federico & Cecilia</p>
          <p className="text-3xl md:text-3xl text-white">Save the Date</p>
        </div>
      </header>
      
      <section className={`py-16 px-4 ${styles.worldMapSection}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center" style={{ color: 'var(--button-color)' }}>Our Journey</h2>
          <WorldMap />
        </div>
      </section>

      {weddingDetailsSection}

      <section className={`py-16 px-4 ${styles.gallerySection}`}>
        <div className="max-w-6xl mx-auto">
          <div className={styles.sectionContainer}>
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--button-color)' }}>Our Gallery</h2>
            <div className="relative">
              <div className="flex justify-center">
                <div className="w-[600px] h-[400px] flex items-center justify-center">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`Gallery ${currentImageIndex + 1}`}
                    width={600}
                    height={400}
                    className="rounded-lg object-contain max-w-full max-h-full"
                    priority={currentImageIndex === 0}
                  />
                </div>
              </div>
              <div className="absolute left-0 right-0 flex justify-between px-4 top-1/2 -translate-y-1/2">
                <button
                  onClick={prevImage}
                  className={styles.galleryArrow}
                >
                  <Image src="/images/arrow_left.png" alt="Previous" width={24} height={24} />
                </button>
                <button
                  onClick={nextImage}
                  className={styles.galleryArrow}
                >
                  <Image src="/images/arrow_right.png" alt="Next" width={24} height={24} />
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-16 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-[#72999d]' : ''
                  }`}
                >
                  <Image
                    src={images[index]}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={60}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {giftSection}

      <section className={`py-16 px-4 ${styles.messagesSection}`}>
        <div className="max-w-6xl mx-auto">
          <div className={styles.sectionContainer}>
            <h3 className="text-2xl mb-6 text-center">Messages from Our Guests</h3>
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

            <h3 className="text-2xl mb-6 text-center">Leave a Message</h3>
            <MessageForm />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl mb-6">소식공유</h3>
          <KakaoShare />
          <p className="text-gray-600 mb-4">Thank you!</p>
          <div className="text-4xl" style={{ color: 'var(--button-color)' }}>♥</div>
          <p className="text-gray-600 mt-8">Developed by Federico Berto & Cecilia Callejas</p>
        </div>
      </footer>

      <MusicPlayer />
      <RSVPModal isOpen={showRSVPModal} onClose={() => setShowRSVPModal(false)} />
    </main>
  );
}