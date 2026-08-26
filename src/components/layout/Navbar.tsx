// ============================================
// Top Navbar Component — Mindfit Official
// ============================================
'use client';

import Link from 'next/link';
import { Menu, Flame, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useUIStore } from '@/stores/uiStore';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function Navbar() {
  const { user, appUser } = useAuth();
  const { toggleSidebar } = useUIStore();
  const { streakInfo } = useProgress();

  const userInitial =
    appUser?.displayName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'A';

  const streakDays = streakInfo.currentStreak || 1;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#eef4f1] sticky top-0 z-30 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left side: Hamburger & Logo Mobile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors lg:hidden cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 lg:hidden group">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-7 h-7 object-contain"
            />
            <span className="text-xl font-extrabold font-head leading-none">
              <span className="text-[#0f5e5a]">Mind</span>
              <span className="text-[#0e9f6e]">fit</span>
            </span>
          </Link>

          <div className="hidden lg:inline-flex">
            <span className="pill text-xs">
              <span className="w-2 h-2 rounded-full bg-[#0e9f6e] animate-pulse" />
              Fase 1: Preparação &amp; Limpeza
            </span>
          </div>
        </div>

        {/* Right side: Streak badge, User Profile & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fff8e6] border border-[#fde68a] text-[#b45309] text-xs font-head font-bold shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b] animate-bounce" />
            <span>{streakDays} {streakDays === 1 ? 'Dia de Foco' : 'Dias de Foco'}</span>
          </div>

          {appUser?.isPremium && (
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-head font-bold bg-gradient-to-r from-[#8bc34a] to-[#0e9f6e] text-white shadow-xs">
              <Crown className="w-3.5 h-3.5" /> Vitalício
            </span>
          )}

          <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#eef4f1]">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] text-white font-extrabold font-head flex items-center justify-center text-sm shadow-md shadow-[#0e9f6e]/20">
              {userInitial}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-extrabold font-head text-[#12352f] leading-tight">
                {appUser?.displayName || 'Aluno(a)'}
              </p>
              <p className="text-[11px] text-[#0e9f6e] font-semibold leading-tight flex items-center gap-0.5">
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
