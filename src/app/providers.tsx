// ============================================
// Providers — Auth + React Query
// ============================================
'use client';

import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import type { AppUser } from '@/types/user';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

function AuthProvider({ children }: { children: ReactNode }) {
  const { setFirebaseUser, setAppUser, setLoading, setInitialized, reset } =
    useAuthStore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        const { onAuthChange } = await import('@/lib/firebase/auth');
        const { getDocument } = await import('@/lib/firebase/firestore');

        unsubscribe = onAuthChange(async (user) => {
          setLoading(true);

          if (user) {
            setFirebaseUser(user);
            const userData = await getDocument<AppUser>('users', user.uid);
            setAppUser(userData);
          } else {
            reset();
          }

          setLoading(false);
          setInitialized(true);
        });
      } catch (err) {
        console.error('[AuthProvider] Error initializing Firebase auth:', err);
        setLoading(false);
        setInitialized(true);
      }
    }

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setFirebaseUser, setAppUser, setLoading, setInitialized, reset]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
