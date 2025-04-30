import { getGalleryImages } from './utils/gallery';
import { Gallery } from './components/Gallery';
import ClientPage from './components/ClientPage';

export default function Home() {
  const images = getGalleryImages();
  
  return (
    <ClientPage images={images} />
  );
}