// ============================================
// Top Navbar Component
// ============================================
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function Navbar() {
  const { user, appUser, logout } = useAuth();
  const { toggleSidebar } = useUIStore();

  const userInitial = appUser?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left side: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors lg:hidden"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <span className="text-xl font-bold font-[var(--font-heading)] text-primary-600">
              🍃 {APP_CONFIG.name}
            </span>
          </Link>
        </div>

        {/* Right side: User Profile & Actions */}
        <div className="flex items-center gap-3">
          {appUser?.isPremium && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-accent text-neutral-900 shadow-sm">
              ⭐ Vitalício
            </span>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shadow-sm">
              {userInitial}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-neutral-800 leading-tight">
                {appUser?.displayName || 'Usuário'}
              </p>
              <p className="text-xs text-neutral-400 leading-tight">
                {appUser?.role === 'admin' ? 'Administrador' : 'Membro'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
