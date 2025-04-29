import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { secrets } from './secrets';

let app;
let db;

// Firebase configuration
const firebaseConfig = secrets.firebase;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    
    // Initialize analytics only in browser environment
    getAnalytics(app);
  } else {
    app = getApps()[0];
    db = getFirestore(app);
  }
}

export { db }; 