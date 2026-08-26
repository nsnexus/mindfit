// ============================================
// Landing Page: Hero Section — Mindfit Design
// ============================================
import Link from 'next/link';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function Hero() {
  return (
    <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-36 px-4 sm:px-6 overflow-hidden">
      {/* Ambient Emerald Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[550px] bg-gradient-to-b from-emerald-500/20 via-emerald-600/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 blur-[90px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        {/* Value Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs sm:text-sm font-semibold text-emerald-300 shadow-lg shadow-emerald-950/50 backdrop-blur-md animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span>Método Comprovado de 21 Dias • Pagamento Único Vitalício</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-[var(--font-heading)] text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Transforme seu corpo e seus hábitos em{' '}
          <span className="text-gradient">
            21 dias
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Sem dietas malucas, sem passar fome e sem horas na academia. Um plano alimentar realista com receitas brasileiras, treinos guiados em casa e acompanhamento diário.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 max-w-md sm:max-w-none mx-auto">
          <Link href={ROUTES.CHECKOUT} className="w-full sm:w-auto">
            <Button
              variant="accent"
              size="xl"
              fullWidth
              className="px-8 py-4 sm:py-5 text-base sm:text-lg font-black tracking-wide text-neutral-950 hover:scale-[1.03] transition-all shadow-xl shadow-amber-500/20"
            >
              Garantir Meu Acesso Vitalício por R$ 49,90 →
            </Button>
          </Link>

          <Link href={ROUTES.LOGIN} className="w-full sm:w-auto">
            <Button
              variant="glass"
              size="xl"
              fullWidth
              className="px-6 py-4 sm:py-5 text-base font-semibold text-white/90 hover:text-white hover:bg-white/15"
            >
              Já sou aluno (Entrar)
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 sm:pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-neutral-400 border-t border-white/10 max-w-3xl mx-auto">
          <span className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">★ 4.9/5</span> Avaliação de alunas
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">🛡️</span> Garantia de 7 dias
          </span>
          <span className="flex items-center gap-2">
            <span className="text-emerald-400">⚡</span> Acesso imediato no celular
          </span>
        </div>
      </div>
    </section>
  );
}
