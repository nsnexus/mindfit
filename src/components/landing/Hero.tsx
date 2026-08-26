// ============================================
// Landing Page: Hero Section
// ============================================
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        {/* Value pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-primary-200 shadow-sm animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Método Comprovado de 21 Dias • Pagamento Único de R$ 49,90</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-[var(--font-heading)] text-white tracking-tight leading-[1.1]">
          Transforme seu corpo e hábitos em{' '}
          <span className="text-gradient underline decoration-primary-400 decoration-wavy decoration-2">
            21 dias
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
          Sem dietas malucas, sem passar fome e sem horas na academia. Um plano alimentar realista com receitas brasileiras, treinos rápidos guiados e gamificação diária.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href={ROUTES.CHECKOUT} className="w-full sm:w-auto">
            <Button
              variant="accent"
              size="xl"
              fullWidth
              className="shadow-elevated hover:scale-105 transition-all text-neutral-900 font-extrabold px-8 py-5 text-lg"
            >
              Garantir Meu Acesso Vitalício por R$ 49,90 →
            </Button>
          </Link>

          <Link href={ROUTES.LOGIN} className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="xl"
              fullWidth
              className="text-white border-white/30 hover:bg-white/10 py-5"
            >
              Já sou aluno (Entrar)
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-primary-200">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-300">⭐</span> 4.9/5 estrelas de satisfação
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-300">🛡️</span> Garantia de 7 dias ou seu dinheiro de volta
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-blue-300">📱</span> Funciona direto no seu celular (PWA)
          </span>
        </div>
      </div>
    </section>
  );
}
