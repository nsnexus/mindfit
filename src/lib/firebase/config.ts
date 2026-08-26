// ============================================
// Método 21 Dias — Firebase Client SDK Config
// ============================================
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAGL6qNbWeyfCuyjB459yqOLKKTRAJlFDw',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mindfit-d14f7.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mindfit-d14f7',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mindfit-d14f7.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '133329052719',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:133329052719:web:b54af460b83255563712da',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-6TJFCRLX1N',
};

// Singleton App Instance
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export const getFirebaseApp = () => app;
export const getAuthInstance = () => auth;
export const getDbInstance = () => db;
export const getStorageInstance = () => storage;

export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (await isSupported()) {
      return getAnalytics(app);
    }
  }
  return null;
};

export default app;
