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
    <div className="min-h-screen bg-neutral-900 text-neutral-800 selection:bg-primary-500 selection:text-white">
      {/* Top Floating Announcement Bar */}
      <div className="bg-primary-700 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2">
        <span>⚡ Oferta de Lançamento:</span>
        <span className="text-amber-300 font-extrabold">Apenas R$ 49,90</span>
        <span>— Pagamento Único Vitalício</span>
      </div>

      {/* Main Header / Nav */}
      <header className="px-4 sm:px-6 py-4 max-w-6xl mx-auto flex items-center justify-between relative z-20">
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 text-white font-extrabold text-xl font-[var(--font-heading)]">
          <img
            src="/icons/mindfit-simbolo.png"
            alt="Mindfit"
            className="w-8 h-8 object-contain"
          />
          <span>{APP_CONFIG.name}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.LOGIN}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors"
          >
            Entrar
          </Link>

          <Link
            href={ROUTES.CHECKOUT}
            className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-accent-500 hover:bg-accent-400 text-neutral-900 transition-all shadow-md hover:scale-105"
          >
            Começar Agora
          </Link>
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
