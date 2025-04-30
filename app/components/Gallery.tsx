'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/sections.module.css';
import ImagePopup from './ImagePopup';

interface GalleryProps {
  images: string[];
}

export function Gallery({ images }: GalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="gallery" className="py-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className={styles.sectionContainer}>
          <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: 'var(--button-color)' }}>Our Gallery</h2>
          <div className="relative">
            <div className="flex justify-center">
              <div 
                className="w-[600px] h-[400px] flex items-center justify-center cursor-pointer"
                onClick={() => setShowImagePopup(true)}
              >
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
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-4 min-w-max px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                    index === currentImageIndex ? 'ring-2 ring-[#72999d]' : ''
                  }`}
                >
                  <Image
                    src={image}
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
      </div>

      {showImagePopup && (
        <ImagePopup
          imageUrl={images[currentImageIndex]}
          onClose={() => setShowImagePopup(false)}
        />
      )}
    </section>
  );
} 