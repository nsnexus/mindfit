// ============================================
// Firebase Auth Helpers (Email e Senha — SSR Safe)
// ============================================
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
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
  if (typeof window === 'undefined') return null;
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
  if (typeof window === 'undefined') return null;
  const auth = getAuthInstance();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Logout
 */
export async function logout() {
  if (typeof window === 'undefined') return;
  const auth = getAuthInstance();
  await firebaseSignOut(auth);
}

/**
 * Enviar email de recuperação de senha
 */
export async function resetPassword(email: string) {
  if (typeof window === 'undefined') return;
  const auth = getAuthInstance();
  await sendPasswordResetEmail(auth, email);
}

/**
 * Cria o documento do usuário no Firestore (idempotente)
 */
export async function createUserDocument(user: User, displayName?: string) {
  if (typeof window === 'undefined') return;
  try {
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
  } catch (err) {
    console.error('Erro ao criar/atualizar documento do usuário:', err);
  }
}

/**
 * Listener de mudança de estado de autenticação
 */
export function onAuthChange(callback: (user: User | null) => void) {
  if (typeof window === 'undefined') return () => {};
  try {
    const auth = getAuthInstance();
    return onAuthStateChanged(auth, callback);
  } catch (err) {
    console.error('Erro ao registrar listener onAuthStateChanged:', err);
    return () => {};
  }
}
