import { useState } from 'react';
import styles from '../styles/sections.module.css';

export const Gallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/images/gallery/1.jpg',
    '/images/gallery/2.jpg',
    '/images/gallery/3.jpg',
    '/images/gallery/4.jpg',
    '/images/gallery/5.jpg',
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.gallery}>
        <button className={styles.galleryButton} onClick={prevImage}>
          &lt;
        </button>
        <img
          src={images[currentImage]}
          alt={`Gallery image ${currentImage + 1}`}
          className={styles.galleryImage}
        />
        <button className={styles.galleryButton} onClick={nextImage}>
          &gt;
        </button>
      </div>
      <div className={styles.galleryThumbnails}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`${styles.thumbnail} ${
              index === currentImage ? styles.active : ''
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  );
}; 