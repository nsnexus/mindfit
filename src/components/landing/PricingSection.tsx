// ============================================
// Landing Page: Pricing & Offer Section
// ============================================
import Link from 'next/link';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function PricingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 overflow-hidden bg-neutral-950 border-t border-white/10">
      {/* Radiant Glow Behind Pricing Box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-amber-500/15 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-500/40 shadow-md">
            🔥 Condição Especial de Lançamento
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
            Acesso Completo & Vitalício
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto">
            Sem pegadinhas, sem renovação automática. Pague uma única vez e tenha acesso ilimitado para sempre.
          </p>
        </div>

        {/* Pricing Card Box */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-xl rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/60 backdrop-blur-2xl text-center space-y-8 relative overflow-hidden">
            {/* Top Ribbons */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-emerald-600 text-neutral-950 font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-md">
            Economia de 75%
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-sm text-neutral-400 uppercase tracking-widest line-through font-semibold">
              De R$ 197,00
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-lg sm:text-xl text-neutral-300 font-medium">Por apenas</span>
              <span className="text-5xl sm:text-7xl font-black text-amber-400 font-[var(--font-heading)] tracking-tight">
                R$ {APP_CONFIG.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-300 font-semibold">
              ⚡ Pagamento Único no Pix ou Cartão • Acesso Imediato
            </p>
          </div>

          {/* Checklist */}
          <ul className="text-left space-y-3.5 text-xs sm:text-sm text-neutral-200 max-w-md mx-auto pt-4 border-t border-white/10">
            {[
              'Plano Alimentar Completo de 21 Dias (3 Fases)',
              'Banco de Alimentos Brasileiros com Semáforo',
              'Catálogo com Dezenas de Receitas Práticas',
              'Lista de Compras Automática para o Mercado',
              'Vídeos e Cronômetro de Treinos em Casa (15 min)',
              'Diário Alimentar e Registro de Água com Gamificação',
              'Sistema de Streaks com Freeze Gentil sem culpa',
              'Garantia Incondicional de 7 Dias',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Checkout CTA */}
          <Link href={ROUTES.CHECKOUT} className="block pt-2">
            <Button
              variant="accent"
              size="xl"
              fullWidth
              className="font-black text-neutral-950 text-lg sm:text-xl py-5 sm:py-6 shadow-xl shadow-amber-500/25 hover:scale-[1.02] transition-all"
            >
              Quero Minha Vaga no Método 21 Dias →
            </Button>
          </Link>

          {/* Guarantee Seal */}
          <div className="flex items-center justify-center gap-2.5 text-xs text-neutral-400 pt-2">
            <span className="text-lg">🛡️</span>
            <span>Risco Zero: 7 dias de garantia incondicional ou 100% do seu dinheiro de volta.</span>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
