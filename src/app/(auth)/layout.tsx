// ============================================
// Auth Layout — Mindfit (Clean & Elegant)
// ============================================
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f5faf7] text-[#12352f]">
      {/* Left panel — decorativo escuro elegante (visível no desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f5e5a] text-white flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
        {/* Glow suave */}
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] rounded-full blur-[100px] opacity-25 -top-20 -left-20 pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-3">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-extrabold font-[var(--font-heading)] text-white tracking-tight">
              Mind<span className="text-[#8bc34a]">fit</span>
            </span>
          </Link>
        </div>

        {/* Center Text */}
        <div className="relative z-10 space-y-6 max-w-md my-auto">
          <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold font-[var(--font-heading)] text-[#bfe0d5]">
            🌱 Transformação em 21 Dias
          </span>

          <h1 className="text-3xl xl:text-4xl font-extrabold font-[var(--font-heading)] leading-tight text-white">
            Sua mente e seu corpo em forma com leveza e constância.
          </h1>

          <p className="text-sm xl:text-base text-[#c7e5db] leading-relaxed">
            Cardápios adaptados à rotina brasileira, receitas rápidas, treinos guiados de 15 minutos e acompanhamento diário sem efeito sanfona.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 text-center text-xs">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
              <span className="text-xl block mb-1">🥗</span>
              <span className="font-bold text-white">Cardápios 21D</span>
            </div>
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
              <span className="text-xl block mb-1">💪</span>
              <span className="font-bold text-white">Treinos 15m</span>
            </div>
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
              <span className="text-xl block mb-1">📊</span>
              <span className="font-bold text-white">Evolução Real</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-[#9fc7bd]">
          🔒 Plataforma 100% segura com criptografia de ponta a ponta.
        </div>
      </div>

      {/* Right panel — formulário centralizado */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[440px] space-y-6">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-6">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2">
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-8 h-8 object-contain"
              />
              <span className="text-2xl font-extrabold font-[var(--font-heading)]">
                <span className="text-[#0f5e5a]">Mind</span>
                <span className="text-[#0e9f6e]">fit</span>
              </span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white p-8 sm:p-10 rounded-[28px] border border-[#eaf3ef] shadow-[0_18px_45px_rgba(14,159,110,0.08)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
