declare global {
  interface Window {
    FIREBASE_CONFIG: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;
    };
    KAKAO_APP_KEY: string;
    KAKAO_MAP_KEY: string;
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: any) => void;
      };
    };
    daum: any;
  }
}

export {}; 