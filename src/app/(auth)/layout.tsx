// ============================================
// Auth Layout — Mindfit
// ============================================
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page-wrapper">
      {/* Left panel — decorativo escuro elegante */}
      <div className="auth-left-panel">
        {/* Top Logo */}
        <div>
          <Link href={ROUTES.HOME} className="brand" style={{ color: '#ffffff' }}>
            <img src="/icons/mindfit-simbolo.png" alt="Mindfit" />
            <span>
              <span style={{ color: '#ffffff' }}>Mind</span>
              <span className="fit" style={{ color: '#8bc34a' }}>fit</span>
            </span>
          </Link>
        </div>

        {/* Center Text */}
        <div className="auth-left-content">
          <span className="pill" style={{ background: 'rgba(255,255,255,0.12)', color: '#bfe0d5' }}>
            🌱 Transformação em 21 Dias
          </span>

          <h1 className="auth-left-title">
            Sua mente e seu corpo em forma com leveza e constância.
          </h1>

          <p className="auth-left-desc">
            Cardápios adaptados à rotina brasileira, receitas rápidas, treinos guiados de 15 minutos e acompanhamento diário sem efeito sanfona.
          </p>

          <div className="auth-features-row">
            <div className="auth-feature-card">
              <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '4px' }}>🥗</span>
              <span>Cardápios 21D</span>
            </div>
            <div className="auth-feature-card">
              <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '4px' }}>💪</span>
              <span>Treinos 15m</span>
            </div>
            <div className="auth-feature-card">
              <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '4px' }}>📊</span>
              <span>Evolução Real</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '0.8rem', color: '#9fc7bd' }}>
          🔒 Plataforma 100% segura com criptografia de ponta a ponta.
        </div>
      </div>

      {/* Right panel — formulário centralizado */}
      <div className="auth-right-panel">
        <div className="auth-form-card">
          {children}
        </div>
      </div>
    </div>
  );
}
