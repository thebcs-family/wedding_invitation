import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import itTranslations from '../translations/it.json';
import koTranslations from '../translations/ko.json';

const translations = {
  en: enTranslations,
  es: esTranslations,
  it: itTranslations,
  ko: koTranslations,
};

export type Language = 'en' | 'es' | 'it' | 'ko';

// Map of browser language codes to our supported languages
const languageMap: Record<string, Language> = {
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'it': 'it',
  'it-IT': 'it',
  'ko': 'ko',
  'ko-KR': 'ko',
};

export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  // Get browser language
  const browserLang = navigator.language || (navigator as any).userLanguage;
  console.log('Browser language:', browserLang);
  console.log('All browser languages:', navigator.languages);
  console.log('User language:', (navigator as any).userLanguage);
  console.log('Browser language:', navigator.language);
  
  // Try to match the full language code
  if (languageMap[browserLang]) {
    console.log('Matched full language code:', browserLang);
    return languageMap[browserLang];
  }
  
  // Try to match just the primary language code
  const primaryLang = browserLang.split('-')[0];
  console.log('Primary language code:', primaryLang);
  if (languageMap[primaryLang]) {
    console.log('Matched primary language code:', primaryLang);
    return languageMap[primaryLang];
  }
  
  console.log('No language match found, defaulting to English');
  return 'en';
}

export function getLanguageFromCountry(countryCode: string): Language {
  // Spanish-speaking countries
  const spanishCountries = ['ES', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'CR', 'PA', 'DO', 'GT', 'SV', 'HN', 'NI', 'PR', 'CU'];
  
  // Italian-speaking countries
  const italianCountries = ['IT'];

  // Korean-speaking countries
  const koreanCountries = ['KR', 'KP'];

  if (spanishCountries.includes(countryCode)) {
    return 'es';
  } else if (italianCountries.includes(countryCode)) {
    return 'it';
  } else if (koreanCountries.includes(countryCode)) {
    return 'ko';
  }
  
  return 'en';
}

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('language') as Language;
  return stored && ['en', 'es', 'it', 'ko'].includes(stored) ? stored : 'en';
}

export function setStoredLanguage(language: Language) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', language);
}

export function getTranslation(language: Language) {
  return translations[language];
}

export function useTranslation(language: Language) {
  const t = translations[language];
  
  return {
    t,
    language,
  };
} 