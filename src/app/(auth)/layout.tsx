// ============================================
// Auth Layout — compartilhado entre login/cadastro/recuperar
// ============================================
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorativo (hidden no mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href={ROUTES.HOME} className="mb-12">
            <span className="text-3xl font-bold font-[var(--font-heading)]">
              🍃 {APP_CONFIG.name}
            </span>
          </Link>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Transforme seus
            <br />
            <span className="text-primary-300">hábitos em 21 dias</span>
          </h1>
          <p className="text-lg text-primary-200 max-w-md leading-relaxed">
            Plano alimentar personalizado, receitas saudáveis, treinos guiados
            e acompanhamento de progresso — tudo em um só lugar.
          </p>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🥗
              </div>
              <span className="text-sm text-primary-200">Plano alimentar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                💪
              </div>
              <span className="text-sm text-primary-200">Treinos guiados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                📊
              </div>
              <span className="text-sm text-primary-200">Progresso real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — formulário */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 text-center">
            <Link href={ROUTES.HOME}>
              <span className="text-2xl font-bold text-primary-600 font-[var(--font-heading)]">
                🍃 {APP_CONFIG.name}
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
