// ============================================
// Auth Store (Zustand)
// ============================================
import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { AppUser } from '@/types/user';

interface AuthState {
  // Firebase Auth user
  firebaseUser: User | null;
  // Firestore user document
  appUser: AppUser | null;
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setFirebaseUser: (user: User | null) => void;
  setAppUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  appUser: null,
  isLoading: true,
  isInitialized: false,

  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setAppUser: (user) => set({ appUser: user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  reset: () =>
    set({
      firebaseUser: null,
      appUser: null,
      isLoading: false,
    }),
}));
