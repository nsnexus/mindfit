// ============================================
// Mindfit — Landing Page Principal
// ============================================
import Link from 'next/link';
import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { Benefits } from '@/components/landing/Benefits';
import { PricingSection } from '@/components/landing/PricingSection';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Disclaimer } from '@/components/landing/Disclaimer';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#12352f]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#eef4f1] transition-all">
        <div className="max-w-[1180px] mx-auto px-6 h-[74px] flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 font-[var(--font-heading)] font-extrabold text-xl sm:text-2xl tracking-tight">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-9 h-9 object-contain"
            />
            <span>
              <span className="text-[#0f5e5a]">Mind</span>
              <span className="text-[#0e9f6e]">fit</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5b7a72]">
            <a href="#como" className="hover:text-[#0e9f6e] transition-colors">
              Como funciona
            </a>
            <a href="#recursos" className="hover:text-[#0e9f6e] transition-colors">
              Recursos
            </a>
            <a href="#metodo" className="hover:text-[#0e9f6e] transition-colors">
              Método 21
            </a>
            <a href="#planos" className="hover:text-[#0e9f6e] transition-colors">
              Planos
            </a>
            <a href="#faq" className="hover:text-[#0e9f6e] transition-colors">
              Dúvidas
            </a>
            <Link href={ROUTES.LOGIN} className="hover:text-[#0e9f6e] transition-colors">
              Entrar
            </Link>
          </div>

          {/* Nav CTA */}
          <Link href={ROUTES.CHECKOUT} className="btn btn-primary text-xs sm:text-sm py-2.5 px-5 sm:px-6">
            Começar agora
          </Link>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Stats Bar */}
      <Stats />

      {/* 3. Features & Method 21 */}
      <div id="como">
        <Benefits />
      </div>

      {/* 4. Pricing */}
      <PricingSection />

      {/* 5. Social Proof / Testimonials */}
      <Testimonials />

      {/* 6. FAQ */}
      <FAQ />

      {/* 7. Final CTA Banner */}
      <FinalCTA />

      {/* 8. Footer */}
      <Disclaimer />
    </div>
  );
}
