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
    <div>
      {/* NAV */}
      <nav className="nav">
        <div className="container">
          <Link href={ROUTES.HOME} className="brand">
            <img src="/icons/mindfit-simbolo.png" alt="Mindfit" />
            <span>
              <span className="mind">Mind</span>
              <span className="fit">fit</span>
            </span>
          </Link>
          <div className="nav-links">
            <a href="#como">Como funciona</a>
            <a href="#recursos">Recursos</a>
            <a href="#planos">Planos</a>
            <a href="#faq">Dúvidas</a>
            <Link href={ROUTES.LOGIN}>Entrar</Link>
          </div>
          <div className="nav-actions">
            <Link href={ROUTES.LOGIN} className="nav-login-mobile">
              Entrar
            </Link>
            <Link href={ROUTES.CHECKOUT} className="btn btn-primary">
              <span className="btn-label-full">Começar agora</span>
              <span className="btn-label-short">Assinar</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <Hero />

      {/* STATS */}
      <Stats />

      {/* FEATURES & METHOD 21 */}
      <Benefits />

      {/* PRICING */}
      <PricingSection />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL */}
      <FinalCTA />

      {/* FOOTER */}
      <Disclaimer />
    </div>
  );
}
