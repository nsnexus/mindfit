// ============================================
// Firebase Auth Helpers (Email e Senha - Edge/SSR Safe)
// ============================================
import type { User } from 'firebase/auth';
import { getAuthInstance, getDbInstance } from './config';

async function getAuthModule() {
  const mod = await import('firebase/auth');
  const auth = getAuthInstance();
  return { ...mod, auth };
}

/**
 * Criar conta com email/senha
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const { createUserWithEmailAndPassword, updateProfile, auth } = await getAuthModule();
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
  const { signInWithEmailAndPassword, auth } = await getAuthModule();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Logout
 */
export async function logout() {
  const { signOut, auth } = await getAuthModule();
  await signOut(auth);
}

/**
 * Enviar email de recuperação de senha
 */
export async function resetPassword(email: string) {
  const { sendPasswordResetEmail, auth } = await getAuthModule();
  await sendPasswordResetEmail(auth, email);
}

/**
 * Cria o documento do usuário no Firestore (idempotente)
 */
export async function createUserDocument(user: User, displayName?: string) {
  if (typeof window === 'undefined') return;
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  const db = getDbInstance();
  const userRef = doc(db, 'users', user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName || user.displayName || 'Usuário',
      role: 'user',
      isPremium: false,
      onboardingCompleted: false,
      currentDay: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Listener de mudança de estado de autenticação
 */
export function onAuthChange(callback: (user: User | null) => void) {
  if (typeof window === 'undefined') return () => {};
  let unsub: (() => void) | null = null;
  getAuthModule().then(({ onAuthStateChanged, auth }) => {
    unsub = onAuthStateChanged(auth, callback);
  });
  return () => {
    if (unsub) unsub();
  };
}
