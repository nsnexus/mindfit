// ============================================
// Método 21 Dias — Firebase Client SDK Config (Edge/SSR Safe)
// ============================================
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAGL6qNbWeyfCuyjB459yqOLKKTRAJlFDw',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mindfit-d14f7.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mindfit-d14f7',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mindfit-d14f7.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '133329052719',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:133329052719:web:b54af460b83255563712da',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-6TJFCRLX1N',
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initializeApp, getApps, getApp } = require('firebase/app');
  if (getApps().length > 0) {
    _app = getApp();
  } else {
    _app = initializeApp(firebaseConfig);
  }
  return _app!;
}

export function getAuthInstance(): Auth {
  if (_auth) return _auth;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAuth } = require('firebase/auth');
  _auth = getAuth(getFirebaseApp());
  return _auth!;
}

export function getDbInstance(): Firestore {
  if (_db) return _db;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getFirestore } = require('firebase/firestore');
  _db = getFirestore(getFirebaseApp());
  return _db!;
}

export function getStorageInstance(): FirebaseStorage {
  if (_storage) return _storage;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getStorage } = require('firebase/storage');
  _storage = getStorage(getFirebaseApp());
  return _storage!;
}

export const auth = typeof window !== 'undefined' ? getAuthInstance() : (null as unknown as Auth);
export const db = typeof window !== 'undefined' ? getDbInstance() : (null as unknown as Firestore);
export const storage = typeof window !== 'undefined' ? getStorageInstance() : (null as unknown as FirebaseStorage);

export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (await isSupported()) {
      return getAnalytics(getFirebaseApp());
    }
  }
  return null;
};

export default getFirebaseApp;
