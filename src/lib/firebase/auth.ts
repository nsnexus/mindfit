// ============================================
// Firebase Auth Helpers (Email e Senha)
// ============================================
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuthInstance, getDbInstance } from './config';

/**
 * Criar conta com email/senha
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const auth = getAuthInstance();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await updateProfile(user, { displayName });
  await createUserDocument(user, displayName);

  return user;
}

/**
 * Login com email/senha
 */
export async function loginWithEmail(email: string, password: string) {
  const auth = getAuthInstance();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Logout
 */
export async function logout() {
  const auth = getAuthInstance();
  await signOut(auth);
}

/**
 * Enviar email de recuperação de senha
 */
export async function resetPassword(email: string) {
  const auth = getAuthInstance();
  await sendPasswordResetEmail(auth, email);
}

/**
 * Cria o documento do usuário no Firestore (idempotente)
 */
async function createUserDocument(user: User, displayName: string) {
  const db = getDbInstance();
  const userRef = doc(db, 'users', user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: user.photoURL || null,
      role: 'user',
      isPremium: false,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      onboardingCompleted: false,
      acceptedTerms: true,
      acceptedPrivacy: true,
      lgpdConsent: true,
    },
    { merge: true }
  );
}

/**
 * Observer de estado de autenticação
 */
export function onAuthChange(callback: (user: User | null) => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const auth = getAuthInstance();
  return onAuthStateChanged(auth, callback);
}
