// ============================================
// Pricing Summary Card — Mindfit Checkout (Clean Design)
// ============================================
import { APP_CONFIG } from '@/constants/config';

export function PricingCard() {
  return (
    <div className="bg-white rounded-[28px] shadow-[0_18px_45px_rgba(14,159,110,0.14)] overflow-hidden border border-[#e3f1ea] text-center w-full">
      {/* Price Top Header */}
      <div className="bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] text-white p-6 sm:p-8 space-y-2">
        <span className="inline-block bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold font-[var(--font-heading)] tracking-wider">
          🔒 ACESSO VITALÍCIO
        </span>
        <div className="text-xs sm:text-sm opacity-80 line-through font-semibold">
          de R$ 197,00 por
        </div>
        <div className="font-[var(--font-heading)] font-extrabold text-4xl sm:text-5xl leading-none">
          <small className="text-xl font-semibold mr-1">R$</small>49<small className="text-xl font-semibold">,90</small>
        </div>
        <div className="text-xs opacity-90 font-medium">
          pagamento único • acesso para sempre
        </div>
      </div>

      {/* Price Body */}
      <div className="p-6 sm:p-7 text-left space-y-4">
        <ul className="space-y-3 text-xs sm:text-sm text-[#12352f]">
          {[
            'Plano alimentar personalizado e ilimitado',
            'Mais de 500 receitas + lista de compras automática',
            'Biblioteca completa de treinos em vídeo',
            'Acompanhamento de peso, medidas e fotos',
            'Sistema de metas, conquistas e desafios',
            'Todas as atualizações futuras incluídas',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-[#0e9f6e] font-extrabold text-sm flex-shrink-0">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-3 border-t border-[#eef4f1] flex items-center justify-center gap-2 text-xs text-[#5b7a72] font-medium text-center">
          <span>🛡️ Garantia incondicional de 7 dias — ou seu dinheiro de volta</span>
        </div>
      </div>
    </div>
  );
}
