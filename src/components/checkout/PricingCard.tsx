// ============================================
// Pricing Summary Card Component
// ============================================
import { Card, Badge } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { formatCurrency } from '@/lib/utils';

export function PricingCard() {
  return (
    <Card variant="elevated" className="bg-gradient-hero text-white p-6 sm:p-8 space-y-6">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="premium" size="sm">
            Oferta Especial
          </Badge>
          <span className="text-xs text-primary-200 font-semibold">
            Acesso Vitalício
          </span>
        </div>

        <h3 className="text-2xl font-extrabold font-[var(--font-heading)]">
          Método 21 Dias Completo
        </h3>
        <p className="text-xs text-primary-200 mt-1">
          Pagamento único sem mensalidades ou taxas ocultas.
        </p>
      </div>

      {/* Price */}
      <div className="py-4 border-y border-white/15">
        <span className="text-xs text-primary-200 uppercase tracking-wider block line-through">
          De R$ 197,00
        </span>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-sm font-semibold text-primary-200">Por apenas</span>
          <span className="text-4xl sm:text-5xl font-black font-[var(--font-heading)] text-amber-300">
            R$ {APP_CONFIG.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <span className="text-xs text-primary-200">
          Pagamento único • Acesso imediato no celular e computador
        </span>
      </div>

      {/* Features checklist */}
      <ul className="space-y-2.5 text-xs sm:text-sm text-primary-100">
        {[
          'Plano Alimentar de 21 Dias (3 fases progressivas)',
          'Banco de Alimentos Brasileiros com Semáforo Volumétrico',
          'Catálogo de Receitas Rápidas & Lista de Compras Automática',
          'Biblioteca de Exercícios & Treinos Guiados em Vídeo/Timer',
          'Diário Alimentar, Registro de Água e Acompanhamento de Peso',
          'Gamificação com Streaks Gentis & Quadro de Medalhas',
          'Garantia Incondicional de 7 Dias',
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber-300 font-bold flex-shrink-0">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Guarantee Stamp */}
      <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center gap-3 text-xs">
        <span className="text-2xl">🛡️</span>
        <div>
          <p className="font-bold text-white">Garantia Total de 7 Dias</p>
          <p className="text-primary-200 text-[11px]">
            Se não amar a plataforma, devolvemos 100% do seu dinheiro.
          </p>
        </div>
      </div>
    </Card>
  );
}
