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

        <div className="hero-visual" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/mulher-hero.png"
            alt="Transformação Mindfit — Emagrecimento saudável em 21 dias"
            className="hero-img"
            style={{
              width: '100%',
              maxWidth: '560px',
              height: 'auto',
              maxHeight: '620px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>
    </header>
  );
}
