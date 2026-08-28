// ============================================
// Método 21 Dias — Firebase Client SDK Config (Pure Browser Lazy)
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

export async function getFirebaseApp(): Promise<FirebaseApp | null> {
  if (typeof window === 'undefined') return null;
  if (_app) return _app;

  const { initializeApp, getApps, getApp } = await import('firebase/app');
  if (getApps().length > 0) {
    _app = getApp();
  } else {
    _app = initializeApp(firebaseConfig);
  }
  return _app;
}

export async function getAuthInstance(): Promise<Auth | null> {
  if (typeof window === 'undefined') return null;
  if (_auth) return _auth;

  const app = await getFirebaseApp();
  if (!app) return null;

  const { getAuth, setPersistence, indexedDBLocalPersistence, browserLocalPersistence } = await import('firebase/auth');
  _auth = getAuth(app);

  // Deixa a persistência explícita em vez de confiar no default do SDK —
  // WebViews de app nativo (Capacitor/Android) às vezes não persistem a
  // sessão entre aberturas do app sem isso, derrubando o login toda hora.
  // Tenta IndexedDB primeiro (mais robusto), cai pro localStorage se falhar.
  try {
    await setPersistence(_auth, indexedDBLocalPersistence);
  } catch {
    try {
      await setPersistence(_auth, browserLocalPersistence);
    } catch {
      // sem persistência mesmo, segue com o default do SDK
    }
  }

  return _auth;
}

export async function getDbInstance(): Promise<Firestore | null> {
  if (typeof window === 'undefined') return null;
  if (_db) return _db;

  const app = await getFirebaseApp();
  if (!app) return null;

  const { getFirestore } = await import('firebase/firestore');
  _db = getFirestore(app);
  return _db;
}

export async function getStorageInstance(): Promise<FirebaseStorage | null> {
  if (typeof window === 'undefined') return null;
  if (_storage) return _storage;

  const app = await getFirebaseApp();
  if (!app) return null;

  const { getStorage } = await import('firebase/storage');
  _storage = getStorage(app);
  return _storage;
}

export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const app = await getFirebaseApp();
    if (!app) return null;
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (await isSupported()) {
      return getAnalytics(app);
    }
  }
  return null;
};

export default getFirebaseApp;
