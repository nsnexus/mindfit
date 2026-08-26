// ============================================
// Mindfit — Landing Page Principal de Vendas
// ============================================
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Flame, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 pb-20 sm:pb-0">
      {/* Top Floating Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white text-center py-2.5 px-4 text-xs font-extrabold flex items-center justify-center gap-2 border-b border-emerald-500/30 shadow-md">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Oferta de Lançamento:
        </span>
        <span className="text-amber-300 font-black">Apenas R$ 49,90</span>
        <span className="hidden sm:inline text-emerald-100 font-medium">— Pagamento Único Vitalício</span>
      </div>

      {/* Main Header / Nav */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <span className="font-black text-xl font-[var(--font-heading)] tracking-tight text-white block leading-none">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Método 21 Dias
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={ROUTES.LOGIN}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold text-neutral-300 hover:text-white transition-colors"
            >
              Entrar
            </Link>

            <Link
              href={ROUTES.CHECKOUT}
              className="px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section with Interactive Simulator */}
      <Hero />

      {/* 2. Benefits & Methodology */}
      <Benefits />

      {/* 3. Social Proof */}
      <Testimonials />

      {/* 4. Pricing & Stack Offer */}
      <PricingSection />

      {/* 5. FAQ */}
      <FAQ />

      {/* 6. Footer & Medical Disclaimer */}
      <Disclaimer />

      {/* Sticky Mobile Bottom Conversion Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-neutral-950/95 backdrop-blur-2xl border-t border-emerald-500/30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-neutral-400 line-through">R$197</span>
              <span className="text-lg font-black text-amber-400 font-[var(--font-heading)]">R$ 49,90</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold block">Acesso Vitalício</span>
          </div>

          <Link
            href={ROUTES.CHECKOUT}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-black text-xs text-center shadow-lg shadow-amber-500/30 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Quero Minha Vaga</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
