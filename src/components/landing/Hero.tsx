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
          <div className="hero-scene">
            <img
              src="/mulher-transformacao.png"
              alt="Transformação Mindfit — antes e depois do emagrecimento saudável"
              className="hero-photo"
            />

            <svg className="hero-arrow" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="heroArrowGrad" x1="8" y1="88" x2="188" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8bc34a" />
                  <stop offset="1" stopColor="#0e9f6e" />
                </linearGradient>
                <marker
                  id="heroArrowHead"
                  viewBox="0 0 10 10"
                  refX="5.5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0L10 5L0 10Z" fill="#0e9f6e" />
                </marker>
              </defs>
              <path
                d="M10 85C55 20 130 6 183 22"
                stroke="url(#heroArrowGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                markerEnd="url(#heroArrowHead)"
              />
            </svg>

            <img src="/celular.png" alt="App Mindfit — painel do aluno" className="hero-phone" />
          </div>
        </div>
      </div>
    </header>
  );
}
