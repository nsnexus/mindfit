// ============================================
// Landing Page: Pricing & Offer Section
// ============================================
import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-hero text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
        <div className="space-y-3">
          <Badge variant="premium" size="md">
            Condição Especial de Lançamento
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)]">
            Acesso Completo & Vitalício
          </h2>
          <p className="text-sm sm:text-base text-primary-200 max-w-xl mx-auto">
            Sem pegadinhas, sem assinaturas mensais. Pague uma única vez e tenha a plataforma para sempre.
          </p>
        </div>

        {/* Pricing Box */}
        <Card variant="glass" padding="lg" className="max-w-xl mx-auto text-center space-y-6 border-white/20">
          <div className="space-y-2">
            <span className="text-sm text-neutral-400 uppercase tracking-widest line-through">
              De R$ 197,00
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-lg text-primary-200">Por apenas</span>
              <span className="text-5xl sm:text-6xl font-black text-amber-300 font-[var(--font-heading)]">
                R$ {APP_CONFIG.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              Pagamento único no Pix ou Cartão • Acesso imediato
            </p>
          </div>

          <ul className="text-left space-y-3 text-xs sm:text-sm text-neutral-200 max-w-md mx-auto">
            {[
              'Plano Alimentar Completo de 21 Dias (3 Fases)',
              'Banco de Alimentos Brasileiros com Semáforo',
              'Catálogo com Dezenas de Receitas Práticas',
              'Lista de Compras Automática para o Mercado',
              'Vídeos e Cronômetro de Treinos em Casa',
              'Diário Alimentar e Registro de Água Diário',
              'Gamificação com Streaks & Quadro de Medalhas',
              'Garantia Incondicional de 7 Dias',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link href={ROUTES.CHECKOUT} className="block">
            <Button
              variant="accent"
              size="xl"
              fullWidth
              className="font-extrabold text-neutral-900 shadow-elevated text-lg py-5"
            >
              Quero Minha Vaga no Método 21 Dias →
            </Button>
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
            <span>🛡️</span>
            <span>Risco Zero: 7 dias de garantia ou 100% do dinheiro de volta</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
