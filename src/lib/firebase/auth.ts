// ============================================
// Firebase Auth Helpers (Pure Browser Dynamic Import)
// ============================================
import type { User } from 'firebase/auth';
import { getAuthInstance, getDbInstance } from './config';

/**
 * Criar conta com email/senha
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  if (typeof window === 'undefined') return null;

  const auth = await getAuthInstance();
  if (!auth) throw new Error('Firebase Auth não disponível');

  const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
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
  if (typeof window === 'undefined') return null;

  const auth = await getAuthInstance();
  if (!auth) throw new Error('Firebase Auth não disponível');

  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Logout
 */
export async function logout() {
  if (typeof window === 'undefined') return;

  const auth = await getAuthInstance();
  if (!auth) return;

  const { signOut } = await import('firebase/auth');
  await signOut(auth);
}

/**
 * Enviar email de recuperação de senha
 */
export async function resetPassword(email: string) {
  if (typeof window === 'undefined') return;

  const auth = await getAuthInstance();
  if (!auth) throw new Error('Firebase Auth não disponível');

  const { sendPasswordResetEmail } = await import('firebase/auth');
  await sendPasswordResetEmail(auth, email);
}

/**
 * Cria o documento do usuário no Firestore (idempotente)
 */
export async function createUserDocument(user: User, displayName?: string) {
  if (typeof window === 'undefined') return;

  try {
    const db = await getDbInstance();
    if (!db) return;

    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
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
  } catch (err) {
    console.error('Erro ao criar/atualizar documento do usuário:', err);
  }
}

/**
 * Listener de mudança de estado de autenticação
 */
export function onAuthChange(callback: (user: User | null) => void) {
  if (typeof window === 'undefined') return () => {};

  let unsubscribe: (() => void) | null = null;

  getAuthInstance().then(async (auth) => {
    if (!auth) {
      callback(null);
      return;
    }
    const { onAuthStateChanged } = await import('firebase/auth');
    unsubscribe = onAuthStateChanged(auth, callback);
  }).catch((err) => {
    console.error('Erro ao registrar listener onAuthStateChanged:', err);
    callback(null);
  });

  return () => {
    if (unsubscribe) unsubscribe();
  };
}
