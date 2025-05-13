import fs from 'fs';
import path from 'path';

export function getGalleryImages() {
  const galleryPath = path.join(process.cwd(), 'public/images/optimized/gallery');
  const files = fs.readdirSync(galleryPath);
  
  // Filter for .webp files and sort them numerically
  const imageFiles = files
    .filter(file => file.startsWith('photo_') && file.endsWith('.webp'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  return imageFiles.map(file => `/images/optimized/gallery/${file}`);
} 