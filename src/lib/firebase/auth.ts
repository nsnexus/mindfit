// ============================================
// Firebase Auth Helpers (Email e Senha)
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
import { auth, db } from './config';

/**
 * Criar conta com email/senha
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
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
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Logout
 */
export async function logout() {
  await firebaseSignOut(auth);
}

/**
 * Enviar email de recuperação de senha
 */
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Cria o documento do usuário no Firestore (idempotente)
 */
export async function createUserDocument(user: User, displayName?: string) {
  try {
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
  return onAuthStateChanged(auth, callback);
}
