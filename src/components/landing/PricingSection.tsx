// ============================================
// Landing Page: Pricing & Irresistible Offer Section — Mindfit
// ============================================
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  Gift,
  Clock,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function PricingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 overflow-hidden bg-neutral-950 border-t border-white/10 text-white">
      {/* Radiant Glow Behind Pricing Box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[600px] bg-gradient-to-tr from-emerald-600/25 via-amber-500/20 to-transparent blur-[160px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 text-xs uppercase font-black tracking-widest text-amber-400 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-500/40 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" /> Condição Especial de Lançamento
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
            Acesso Completo & Vitalício
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto">
            Sem mensalidades, sem taxas recorrentes. Pague uma única vez e tenha acesso ilimitado para sempre.
          </p>
        </div>

        {/* Pricing Card Box */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-2xl rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-neutral-900/95 via-neutral-950/98 to-neutral-950 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/80 backdrop-blur-2xl text-center space-y-8 relative overflow-hidden">
            {/* Top Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-emerald-600 text-neutral-950 font-black text-xs uppercase tracking-wider px-5 py-1.5 rounded-bl-2xl shadow-lg flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Economia de 75% Hoje
            </div>

            {/* Price Presentation */}
            <div className="space-y-3 pt-2">
              <span className="text-sm text-neutral-400 uppercase tracking-widest line-through font-bold">
                De R$ 197,00
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-lg sm:text-xl text-neutral-300 font-semibold">Por apenas</span>
                <span className="text-5xl sm:text-7xl font-black text-amber-400 font-[var(--font-heading)] tracking-tight drop-shadow-sm">
                  R$ {APP_CONFIG.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4" /> Pagamento Único no Pix ou Cartão • Acesso Imediato
              </p>
            </div>

            {/* Value Stack & Bonus Items */}
            <div className="space-y-4 pt-4 border-t border-white/10 text-left">
              <span className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 block text-center">
                Tudo o que está incluído no seu acesso:
              </span>

              <ul className="space-y-3 text-xs sm:text-sm text-neutral-200">
                {[
                  { text: 'Plano Alimentar de 21 Dias (3 Fases Estruturadas)', value: 'R$ 97,00' },
                  { text: 'Banco de Alimentos Brasileiros com Semáforo Volumétrico', value: 'R$ 47,00' },
                  { text: 'Catálogo de Receitas Fit Rápidas & Práticas', value: 'R$ 37,00' },
                  { text: 'BÔNUS: Vídeos & Cronômetro de Treinos de 15 Min em Casa', value: 'GRÁTIS', isBonus: true },
                  { text: 'BÔNUS: Diário Alimentar, Registro de Água & Peso', value: 'GRÁTIS', isBonus: true },
                  { text: 'BÔNUS: Gamificação com Sequências (Streaks) & Medalhas', value: 'GRÁTIS', isBonus: true },
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span className={item.isBonus ? 'font-bold text-amber-300' : ''}>
                        {item.text}
                      </span>
                    </div>
                    <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 ${item.isBonus ? 'bg-amber-400/20 text-amber-300' : 'text-neutral-400'}`}>
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Checkout CTA Button */}
            <div className="space-y-3 pt-2">
              <Link href={ROUTES.CHECKOUT} className="block">
                <Button
                  variant="accent"
                  size="xl"
                  fullWidth
                  rightIcon={<ArrowRight className="w-6 h-6" />}
                  className="font-black text-neutral-950 text-lg sm:text-xl py-5 sm:py-6 shadow-2xl shadow-amber-500/30 hover:scale-[1.02] transition-all"
                >
                  Garantir Minha Vaga no Método 21 Dias →
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Pagamento 100% Seguro
                </span>
                <span>•</span>
                <span>⚡ Acesso Liberado na Hora</span>
              </div>
            </div>

            {/* Guarantee Seal Box */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-white">Garantia Incondicional de 7 Dias</p>
                <p className="text-neutral-300 text-[11px] mt-0.5">
                  Experimente o método por 7 dias. Se por qualquer motivo não gostar, basta solicitar seu reembolso e devolvemos 100% do seu dinheiro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
