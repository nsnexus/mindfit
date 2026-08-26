// ============================================
// Auth Layout — Mindfit
// ============================================
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sparkles, Salad, Dumbbell, LineChart, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex selection:bg-emerald-500 selection:text-neutral-950">
      {/* Left panel — decorativo (hidden no mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Glow circles */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-600/30">
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <span className="text-2xl font-black font-[var(--font-heading)] tracking-tight text-white block leading-none">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Método 21 Dias
              </span>
            </div>
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" /> Transformação em 3 Fases
          </div>

          <h1 className="text-4xl xl:text-5xl font-black font-[var(--font-heading)] leading-tight tracking-tight text-white">
            Transforme seu corpo e seus hábitos em{' '}
            <span className="text-gradient-emerald">21 dias</span>.
          </h1>

          <p className="text-base text-neutral-300 leading-relaxed font-normal">
            Plano alimentar realista com comida brasileira, receitas práticas, treinos guiados de 15 minutos e diário com semáforo volumétrico.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <Salad className="w-5 h-5 text-emerald-400 mx-auto" />
              <span className="text-xs font-bold block text-white">Cardápios 21D</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <Dumbbell className="w-5 h-5 text-amber-400 mx-auto" />
              <span className="text-xs font-bold block text-white">Treinos 15 Min</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <LineChart className="w-5 h-5 text-teal-400 mx-auto" />
              <span className="text-xs font-bold block text-white">Evolução Real</span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Plataforma Segura e Criptografada</span>
        </div>
      </div>

      {/* Right panel — formulário */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gradient-mesh">
        <div className="w-full max-w-md space-y-6">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-6">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-600/30">
                <img
                  src="/icons/mindfit-simbolo.png"
                  alt="Mindfit"
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-black text-neutral-900 font-[var(--font-heading)]">
                {APP_CONFIG.name}
              </span>
            </Link>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
