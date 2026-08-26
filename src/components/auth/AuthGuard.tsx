// ============================================
// AuthGuard — Proteção client-side de rotas
// ============================================
'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requirePremium?: boolean;
  requireOnboarding?: boolean;
  fallback?: ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  requirePremium = false,
  requireOnboarding = false,
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { firebaseUser, appUser, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    // Não autenticado → login
    if (requireAuth && !firebaseUser) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    // Precisa ser admin
    if (requireAdmin && appUser?.role !== 'admin') {
      router.replace(ROUTES.DASHBOARD);
      return;
    }

    // Precisa ser premium
    if (requirePremium && !appUser?.isPremium) {
      router.replace(ROUTES.CHECKOUT);
      return;
    }

    // Precisa ter completado onboarding
    if (requireOnboarding && appUser && !appUser.onboardingCompleted) {
      router.replace(ROUTES.ONBOARDING);
      return;
    }
  }, [
    isInitialized,
    firebaseUser,
    appUser,
    requireAuth,
    requireAdmin,
    requirePremium,
    requireOnboarding,
    router,
  ]);

  // Carregando estado de auth
  if (!isInitialized || isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-neutral-500">Carregando...</p>
          </div>
        </div>
      )
    );
  }

  // Redirect em andamento
  if (requireAuth && !firebaseUser) return null;
  if (requireAdmin && appUser?.role !== 'admin') return null;

  return <>{children}</>;
}
