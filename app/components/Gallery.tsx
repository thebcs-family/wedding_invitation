'use client';

import { useState, useEffect } from 'react';
import { useTranslation, Language } from '../utils/i18n';
import styles from '../styles/sections.module.css';

interface GalleryProps {
  images: string[];
  language: Language;
}

export function Gallery({ images, language }: GalleryProps) {
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation(language);
  
  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial number of images to show
  const initialImages = isMobile ? 6 : 12; // Show 6 images on mobile (3 rows of 2), 12 on desktop
  const displayImages = showMore ? images : images.slice(0, initialImages);

  // Initialize Magnific Popup with all images
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).jQuery) {
      const $ = (window as any).jQuery;
      $('.magnific-zoom-gallery').magnificPopup({
        type: 'image',
        gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0, 2], // Preload the current image and next 2
          tCounter: '%curr% / %total%', // Counter format
        },
        mainClass: 'mfp-with-zoom',
        zoom: {
          enabled: true,
          duration: 300,
          easing: 'ease-in-out',
        }
      });
    }
  }, [showMore]); // Reinitialize when showMore changes

  return (
    <section id="gallery" className="py-16 px-4" style={{ backgroundColor: 'var(--section-bg)' }}>
      <div className="container max-w-6xl mx-auto">
        <div className={styles.sectionContainer}>
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--button-color)' }}>
            {t.gallery.title}
          </h2>

          <div className="row grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Visible Images */}
            {displayImages.map((image, index) => (
              <div key={index} className={styles.photoItem}>
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`} 
                  className="aspect-square"
                />
                <div className={styles.photoOverlay} />
                <div className={styles.iconLink}>
                  <a 
                    href={image.replace('w400-h400', 's2400')} 
                    className="magnific-zoom-gallery"
                    data-index={index}
                  >
                    <div className={styles.iconCircle}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 4v16m8-8H4" 
                        />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            ))}

            {/* Hidden Images (for Magnific Popup) */}
            <div className="hidden">
              {!showMore && images.slice(initialImages).map((image, index) => (
                <a 
                  key={`hidden-${index}`}
                  href={image.replace('w400-h400', 's2400')} 
                  className="magnific-zoom-gallery"
                  data-index={initialImages + index}
                />
              ))}
            </div>
          </div>

          {images.length > initialImages && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowMore(!showMore)}
                className="px-6 py-2 bg-[var(--button-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {showMore ? t.gallery.showLess : t.gallery.showMore}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 