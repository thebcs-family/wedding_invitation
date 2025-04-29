'use client';

interface ImagePopupProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImagePopup({ imageUrl, onClose }: ImagePopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative aspect-[4/3]">
          <img
            src={imageUrl}
            alt="Gallery image"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
} 