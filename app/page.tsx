import { getGalleryImages } from './utils/gallery';
import { Gallery } from './components/Gallery';
import ClientPage from './components/ClientPage';
import FallingPetals from './components/FallingPetals';

export default function Home() {
  const images = getGalleryImages();
  
  return (
    <>
      <FallingPetals />
      <ClientPage images={images} showGalleryLink={true} />
    </>
  );
}