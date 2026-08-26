// ============================================
// Landing Page: Hero Section — Mindfit (Clean Design)
// ============================================
'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-[#f5faf7] pt-12 pb-16 sm:pt-20 sm:pb-24" style={{
      background: 'radial-gradient(1200px 500px at 80% -10%, #e9f8f0 0%, transparent 60%), #f5faf7'
    }}>
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Text & CTAs (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex">
            <span className="pill">🌱 Emagrecimento saudável e sustentável</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-extrabold font-[var(--font-heading)] leading-[1.14] text-[#12352f] tracking-tight">
            Sua <span className="gradient-text">mente</span> e seu <span className="gradient-text">corpo</span> em forma em ciclos de 21 dias
          </h1>

          <p className="text-base sm:text-lg text-[#5b7a72] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
            Plano alimentar personalizado, receitas práticas, treinos guiados e acompanhamento diário — tudo em um só lugar para você criar hábitos que ficam.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link href={ROUTES.CHECKOUT} className="btn btn-primary">
              Quero começar hoje →
            </Link>
            <a href="#como" className="btn btn-ghost">
              Ver como funciona
            </a>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3 pt-3 text-sm text-[#5b7a72]">
            <span className="text-[#f5b301] text-lg tracking-widest font-bold">★★★★★</span>
            <span>
              Mais de <strong className="text-[#12352f]">12.000 pessoas</strong> transformando a rotina com o Mindfit
            </span>
          </div>
        </div>

        {/* Right Column: Floating Visual with Morphing Blob (5 cols) */}
        <div className="lg:col-span-5 relative flex justify-center items-center py-6">
          <div className="hero-blob" />
          <div className="relative hero-float z-10 w-full max-w-[340px] sm:max-w-[380px] bg-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(14,159,110,0.22)] border border-[#eaf3ef] text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center shadow-lg shadow-[#0e9f6e]/30">
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-12 h-12 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Método 21 Dias
              </h3>
              <p className="text-xs text-[#5b7a72] mt-1">
                3 Fases Progressivas de Reeducação & Queima Ativa
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#eef4f1] text-[11px] font-bold">
              <div className="p-2 bg-[#f5faf7] rounded-xl text-[#0e9f6e]">
                <span>Fase 1</span>
                <span className="block text-[10px] text-[#5b7a72] font-normal">Detox</span>
              </div>
              <div className="p-2 bg-[#f5faf7] rounded-xl text-[#8bc34a]">
                <span>Fase 2</span>
                <span className="block text-[10px] text-[#5b7a72] font-normal">Queima</span>
              </div>
              <div className="p-2 bg-[#f5faf7] rounded-xl text-[#1aa8a0]">
                <span>Fase 3</span>
                <span className="block text-[10px] text-[#5b7a72] font-normal">Hábito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
