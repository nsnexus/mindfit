// ============================================
// Mindfit — Landing Page Principal de Vendas
// ============================================
import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import { Benefits } from '@/components/landing/Benefits';
import { Testimonials } from '@/components/landing/Testimonials';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQ } from '@/components/landing/FAQ';
import { Disclaimer } from '@/components/landing/Disclaimer';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950">
      {/* Top Floating Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-950 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b border-emerald-500/20 shadow-md">
        <span>⚡ Oferta de Lançamento:</span>
        <span className="text-amber-300 font-black">Apenas R$ 49,90</span>
        <span className="hidden sm:inline text-emerald-200">— Pagamento Único Vitalício</span>
      </div>

      {/* Main Header / Nav */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 text-white font-extrabold text-xl font-[var(--font-heading)]">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-8 h-8 object-contain"
            />
            <span className="tracking-tight">{APP_CONFIG.name}</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.LOGIN}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Entrar
            </Link>

            <Link
              href={ROUTES.CHECKOUT}
              className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.03] active:scale-[0.98]"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Benefits & Methodology */}
      <Benefits />

      {/* 3. Social Proof */}
      <Testimonials />

      {/* 4. Pricing & Offer */}
      <PricingSection />

      {/* 5. FAQ */}
      <FAQ />

      {/* 6. Footer & Medical Disclaimer */}
      <Disclaimer />
    </div>
  );
}
