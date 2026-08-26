// ============================================
// Landing Page: Final CTA Banner — Mindfit
// ============================================
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function FinalCTA() {
  return (
    <section className="bg-[#0f5e5a] text-white text-center py-24 px-6 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] rounded-full blur-[120px] opacity-40 -top-[200px] left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1180px] mx-auto relative z-10 space-y-6">
        <h2 className="text-3xl sm:text-5xl font-extrabold font-[var(--font-heading)] tracking-tight">
          Comece sua transformação hoje 🌿
        </h2>
        <p className="text-base sm:text-lg text-[#c7e5db] max-w-xl mx-auto leading-relaxed">
          Junte-se a milhares de pessoas que descobriram que emagrecer com saúde pode ser leve. Sua melhor versão começa agora.
        </p>
        <div className="pt-2">
          <Link href={ROUTES.CHECKOUT} className="btn btn-primary text-base sm:text-lg py-4 px-8">
            Quero meu acesso vitalício por R$ 49,90
          </Link>
        </div>
      </div>
    </section>
  );
}
