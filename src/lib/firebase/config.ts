// ============================================
// Método 21 Dias — Firebase Client SDK Config
// ============================================
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Inicialização lazy do Firebase — evita erro em build time
 * quando as variáveis de ambiente não estão disponíveis
 */
function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApp();

  // Em build time, as env vars podem não existir
  if (!firebaseConfig.apiKey) {
    // Retorna app com config vazia para não quebrar o build
    // O app real será inicializado no browser com as env vars
    console.warn('[Firebase] API key not found — using placeholder config for build.');
  }

  return initializeApp(firebaseConfig);
}

// Lazy getters — só inicializam quando acessados no browser
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getApp_() {
  if (!_app) _app = getFirebaseApp();
  return _app;
}

export function getAuthInstance(): Auth {
  if (!_auth) _auth = getAuth(getApp_());
  return _auth;
}

export function getDbInstance(): Firestore {
  if (!_db) _db = getFirestore(getApp_());
  return _db;
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) _storage = getStorage(getApp_());
  return _storage;
}

// Compat exports — usados em todo o app
export const auth = typeof window !== 'undefined' ? getAuthInstance() : (null as unknown as Auth);
export const db = typeof window !== 'undefined' ? getDbInstance() : (null as unknown as Firestore);
export const storage = typeof window !== 'undefined' ? getStorageInstance() : (null as unknown as FirebaseStorage);

// Analytics (só no browser)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && (await isSupported())) {
    return getAnalytics(getApp_());
  }
  return null;
};

export default getApp_;
