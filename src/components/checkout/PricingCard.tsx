// ============================================
// Pricing Summary Card Component — Mindfit Checkout
// ============================================
import { ShieldCheck, Check, Sparkles, Zap, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';

export function PricingCard() {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
      {/* Glow behind card */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="premium" size="sm">
            Oferta Especial
          </Badge>
          <span className="text-xs text-emerald-300 font-bold">
            Acesso Vitalício
          </span>
        </div>

        <h3 className="text-2xl font-black font-[var(--font-heading)] tracking-tight">
          Método 21 Dias Completo
        </h3>
        <p className="text-xs text-neutral-300 mt-1">
          Pagamento único sem mensalidades ou taxas ocultas.
        </p>
      </div>

      {/* Price Presentation */}
      <div className="py-4 border-y border-white/10 space-y-1">
        <span className="text-xs text-neutral-400 uppercase tracking-wider block line-through font-bold">
          De R$ 197,00
        </span>
        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-sm font-semibold text-neutral-300">Por apenas</span>
          <span className="text-4xl sm:text-5xl font-black font-[var(--font-heading)] text-amber-400">
            R$ {APP_CONFIG.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <span className="text-xs text-emerald-300 font-bold block flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> Pagamento único • Acesso imediato no celular
        </span>
      </div>

      {/* Features checklist */}
      <ul className="space-y-3 text-xs sm:text-sm text-neutral-200">
        {[
          'Plano Alimentar de 21 Dias (3 fases progressivas)',
          'Banco de Alimentos Brasileiros com Semáforo Volumétrico',
          'Catálogo de Receitas Rápidas & Lista de Compras',
          'Vídeos e Cronômetro de Treinos Guiados em Casa',
          'Diário Alimentar, Registro de Água e Acompanhamento',
          'Gamificação com Sequências Gentis & Medalhas',
          'Garantia Incondicional de 7 Dias',
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              <Check className="w-3 h-3" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Guarantee Box */}
      <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3 text-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-white">Garantia Total de 7 Dias</p>
          <p className="text-neutral-300 text-[11px]">
            Se não amar a plataforma, devolvemos 100% do seu dinheiro.
          </p>
        </div>
      </div>
    </div>
  );
}
