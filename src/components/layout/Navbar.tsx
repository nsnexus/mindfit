// ============================================
// Top Navbar Component — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { Menu, Flame, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function Navbar() {
  const { user, appUser } = useAuth();
  const { toggleSidebar } = useUIStore();

  const userInitial =
    appUser?.displayName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U';

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-emerald-950/10 sticky top-0 z-30 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left side: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5 lg:hidden group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            </div>
            <span className="text-lg font-black font-[var(--font-heading)] text-neutral-900">
              {APP_CONFIG.name}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-neutral-500 bg-neutral-100/80 px-3 py-1.5 rounded-full border border-neutral-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Fase 1: Preparação & Limpeza</span>
          </div>
        </div>

        {/* Right side: Streak badge, User Profile & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-black">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
            <span>1 Dia</span>
          </div>

          {appUser?.isPremium && (
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-md shadow-amber-500/20">
              <Crown className="w-3.5 h-3.5" /> Vitalício
            </span>
          )}

          <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-neutral-200">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-emerald-700/20">
                {userInitial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-extrabold text-neutral-900 leading-tight">
                {appUser?.displayName || 'Aluno(a)'}
              </p>
              <p className="text-[11px] text-emerald-600 font-bold leading-tight flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                {appUser?.role === 'admin' ? 'Administrador' : 'Membro Premium'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
