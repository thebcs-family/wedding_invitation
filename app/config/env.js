// Environment configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const KAKAO_APP_KEY = process.env.YOUR_KAKAO_APP_KEY;
const KAKAO_MAP_KEY = process.env.YOUR_KAKAO_MAP_KEY;

// Export configuration
if (typeof window !== 'undefined') {
  window.FIREBASE_CONFIG = firebaseConfig;
  window.KAKAO_APP_KEY = KAKAO_APP_KEY;
  window.KAKAO_MAP_KEY = KAKAO_MAP_KEY;
}

export { firebaseConfig, KAKAO_APP_KEY, KAKAO_MAP_KEY }; 