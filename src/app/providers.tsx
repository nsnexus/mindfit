// ============================================
// Providers — Auth + React Query
// ============================================
'use client';

import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { onAuthChange } from '@/lib/firebase/auth';
import { getDocument } from '@/lib/firebase/firestore';
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
    const unsubscribe = onAuthChange(async (user) => {
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

    return () => unsubscribe();
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
