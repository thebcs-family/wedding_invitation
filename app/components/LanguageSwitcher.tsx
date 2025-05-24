import { Language } from '../utils/i18n';
import { useState, useRef, useEffect } from 'react';
import LanguageIcon from '@mui/icons-material/Language';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'es', name: 'ES' },
  { code: 'it', name: 'IT' },
  { code: 'ko', name: 'KR' },
] as const;

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[10001]" ref={menuRef}>
      {/* Language Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-sm text-[#72999d] rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-[#72999d] hover:text-white transition-all duration-300"
        aria-label="Select language"
      >
        <LanguageIcon className="w-6 h-6" />
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 w-32">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code as Language)}
              className={`w-full px-4 py-2 rounded-md text-left transition-all text-sm font-medium ${
                currentLanguage === lang.code
                  ? 'bg-[#72999d] text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 