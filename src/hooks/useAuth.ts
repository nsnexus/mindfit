// ============================================
// useAuth Hook — gerencia estado de autenticação (Email/Senha)
// ============================================
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  onAuthChange,
  loginWithEmail,
  registerWithEmail,
  logout as firebaseLogout,
  resetPassword,
} from '@/lib/firebase/auth';
import { getDocument } from '@/lib/firebase/firestore';
import type { AppUser } from '@/types/user';
import { ROUTES } from '@/constants/routes';

export function useAuth() {
  const router = useRouter();
  const {
    firebaseUser,
    appUser,
    isLoading,
    isInitialized,
    setFirebaseUser,
    setAppUser,
    setLoading,
    setInitialized,
    reset,
  } = useAuthStore();

  // Listener de autenticação — roda uma vez no mount
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setLoading(true);

      if (user) {
        setFirebaseUser(user);

        // Busca dados do Firestore
        const userData = await getDocument<AppUser>('users', user.uid);
        setAppUser(userData);
      } else {
        reset();
      }

      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // === Actions ===

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.push(ROUTES.DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setLoading(true);
    try {
      await registerWithEmail(email, password, displayName);
      router.push(ROUTES.ONBOARDING);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await firebaseLogout();
    reset();
    router.push(ROUTES.HOME);
  };

  const sendResetEmail = async (email: string) => {
    await resetPassword(email);
  };

  return {
    user: firebaseUser,
    appUser,
    isLoading,
    isInitialized,
    isAuthenticated: !!firebaseUser,
    isPremium: appUser?.isPremium ?? false,
    isAdmin: appUser?.role === 'admin',
    needsOnboarding: appUser ? !appUser.onboardingCompleted : false,

    // Actions
    login,
    register,
    logout,
    sendResetEmail,
  };
}
