// ============================================
// Landing Page: Hero Section — Mindfit
// ============================================
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function Hero() {
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-text">
          <span className="pill">🌱 Emagrecimento saudável e sustentável</span>
          <h1>
            Sua <span className="gradient-text">mente</span> e seu{' '}
            <span className="gradient-text">corpo</span> em forma em ciclos de 21 dias
          </h1>
          <p className="lead">
            Plano alimentar personalizado, receitas práticas, treinos guiados e acompanhamento diário — tudo em um só lugar para você criar hábitos que ficam.
          </p>
          <div className="hero-cta">
            <Link href={ROUTES.CHECKOUT} className="btn btn-primary">
              Quero começar hoje →
            </Link>
            <a href="#como" className="btn btn-ghost">
              Ver como funciona
            </a>
          </div>
          <div className="hero-trust">
            <span className="stars">★★★★★</span>
            <span>
              Mais de <b>12.000 pessoas</b> transformando a rotina com o Mindfit
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-blob" />
          <div className="hero-card-preview">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center shadow-lg shadow-[#0e9f6e]/30 mb-4">
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-12 h-12 object-contain brightness-0 invert"
              />
            </div>
            <h3 className="font-[var(--font-heading)] font-bold text-xl text-[#12352f]">
              Método 21 Dias
            </h3>
            <p className="text-xs text-[#5b7a72] mt-1 mb-4">
              3 Fases Progressivas de Reeducação & Queima Ativa
            </p>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#eef4f1] text-[11px] font-bold">
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
