// ============================================
// Landing Page: Pricing Section — Mindfit (Clean Design)
// ============================================
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function PricingSection() {
  return (
    <section className="py-24 px-6" id="planos" style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #eef8f2 100%)'
    }}>
      <div className="max-w-[1180px] mx-auto text-center space-y-4">
        <div className="inline-flex">
          <span className="pill">💎 Oferta de lançamento</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-[#12352f] tracking-tight">
          Pague uma vez. Use para sempre.
        </h2>
        <p className="text-base sm:text-lg text-[#5b7a72] max-w-xl mx-auto pb-10">
          Sem mensalidade, sem pegadinha. Um único pagamento e o Mindfit é seu para a vida toda.
        </p>

        {/* Pricing Card */}
        <div className="max-w-[560px] mx-auto bg-white rounded-[28px] shadow-[0_18px_45px_rgba(14,159,110,0.18)] overflow-hidden border border-[#e3f1ea] text-center">
          {/* Price Top Header */}
          <div className="bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] text-white p-8 sm:p-10 space-y-3">
            <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold font-[var(--font-heading)] tracking-wider">
              🔒 ACESSO VITALÍCIO
            </span>
            <div className="text-sm opacity-80 line-through font-semibold">
              de R$ 197,00 por
            </div>
            <div className="font-[var(--font-heading)] font-extrabold text-5xl sm:text-6xl leading-none">
              <small className="text-2xl font-semibold mr-1">R$</small>49<small className="text-2xl font-semibold">,90</small>
            </div>
            <div className="text-xs sm:text-sm opacity-90 font-medium">
              pagamento único • acesso para sempre
            </div>
          </div>

          {/* Price Body */}
          <div className="p-8 sm:p-10 text-left space-y-6">
            <ul className="space-y-3.5 text-sm sm:text-base text-[#12352f]">
              {[
                'Plano alimentar personalizado e ilimitado',
                'Mais de 500 receitas + lista de compras automática',
                'Biblioteca completa de treinos em vídeo',
                'Acompanhamento de peso, medidas e fotos',
                'Sistema de metas, conquistas e desafios',
                'Todas as atualizações futuras incluídas',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#0e9f6e] font-extrabold text-base flex-shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href={ROUTES.CHECKOUT} className="btn btn-primary w-full text-base sm:text-lg py-4">
              Garantir meu acesso vitalício →
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-[#5b7a72] font-medium pt-1">
              <span>🛡️ Garantia incondicional de 7 dias — ou seu dinheiro de volta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
