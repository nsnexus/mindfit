// ============================================
// Dashboard Principal — Mindfit Exact Reference Design
// ============================================
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useMeals } from '@/hooks/useMeals';
import { CalorieTracker } from '@/components/nutrition/CalorieTracker';
import { MacroChart } from '@/components/nutrition/MacroChart';
import { ROUTES } from '@/constants/routes';

export default function DashboardPage() {
  const { appUser } = useAuthStore();
  const { dailyLog, addWater } = useMeals();

  const userName = appUser?.displayName?.split(' ')[0] || 'Aluno(a)';
  const targetCalories = 1800;
  const targetMacros = { protein: 135, carbs: 180, fat: 60 };
  const waterTargetMl = 2500;
  const waterPercentage = Math.min(Math.round((dailyLog.waterMl / waterTargetMl) * 100), 100);

  return (
    <div>
      {/* 1. Header & Welcome */}
      <span className="page-tag">🌱 Método 21 Dias • Ciclo Ativo</span>
      <h1 className="page-title">
        Olá, <span className="gradient-text">{userName}</span>! 👋
      </h1>
      <p className="page-sub">
        Painel diário com suas metas nutricionais, treinos guiados e acompanhamento.
      </p>

      {/* 2. Motivational Card */}
      <div
        className="card"
        style={{
          background: '#eef8f2',
          borderColor: '#d7ede3',
          marginBottom: '24px',
          padding: '16px 22px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>💬</span>
        <em style={{ color: '#37564e' }}>
          "A constância vence a perfeição. Cada copo d'água, cada prato consciente te deixam mais perto da sua meta."
        </em>
      </div>

      {/* 3. Main Dashboard 2-Column Layout */}
      <div className="dash-layout">
        {/* LEFT COLUMN: Calories, Quick Actions, Macros */}
        <div>
          {/* Calorie Hero Card */}
          <CalorieTracker
            consumedCalories={dailyLog.totalCalories}
            targetCalories={targetCalories}
          />

          {/* Quick Actions Grid */}
          <div className="grid g-4" style={{ marginBottom: '24px' }}>
            <Link href={ROUTES.DIARIO} className="qa">
              <div className="ic" style={{ background: 'var(--grad)' }}>
                🍽️
              </div>
              <b>Registrar Refeição</b>
              <span>Diário diário</span>
            </Link>

            <Link href={ROUTES.PLANO_ALIMENTAR} className="qa">
              <div className="ic" style={{ background: 'linear-gradient(135deg, #8bc34a, #0e9f6e)' }}>
                🥗
              </div>
              <b>Ver Cardápio</b>
              <span>Plano 21 dias</span>
            </Link>

            <Link href={ROUTES.TREINOS} className="qa">
              <div className="ic" style={{ background: 'linear-gradient(135deg, #f0a70f, #e0740b)' }}>
                💪
              </div>
              <b>Treino de Hoje</b>
              <span>15 min em casa</span>
            </Link>

            <Link href={ROUTES.PROGRESSO} className="qa">
              <div className="ic" style={{ background: 'linear-gradient(135deg, #2f89c5, #1f6fa8)' }}>
                📈
              </div>
              <b>Minha Evolução</b>
              <span>Pesos &amp; fotos</span>
            </Link>
          </div>

          {/* Macros Tracker Grid */}
          <MacroChart
            current={{
              protein: dailyLog.totalProtein,
              carbs: dailyLog.totalCarbs,
              fat: dailyLog.totalFat,
            }}
            target={targetMacros}
          />
        </div>

        {/* RIGHT COLUMN: Active Cycle, Workout of the Day, Hydration */}
        <div>
          {/* Active 21-Day Cycle Card */}
          <div className="side-card cycle-card">
            <div className="row">
              <span className="lbl">🔄 Ciclo Ativo</span>
              <span className="lbl" style={{ color: '#a9e34b' }}>
                Dia 1 de 21
              </span>
            </div>
            <div style={{ marginTop: '14px' }}>
              <b style={{ fontFamily: "'Poppins', sans-serif" }}>Fase 1: Preparação &amp; Limpeza</b>
              <div className="bar" style={{ background: 'rgba(255, 255, 255, 0.15)', marginTop: '10px' }}>
                <i style={{ width: '5%', background: '#a9e34b' }}></i>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  color: '#a9e34b',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  marginTop: '4px',
                }}
              >
                5%
              </div>
            </div>
            <div className="focus-box">
              💡 <b>Foco de Hoje:</b> Elimine refrigerantes e beba pelo menos 2,5 litros de água para desinchar.
            </div>
          </div>

          {/* Today's Workout Card */}
          <div className="side-card">
            <div className="workout-mini">
              <div className="wic">⚡</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>Treino do Dia</h4>
                  <span className="badge badge-green">Fase 1</span>
                </div>
                <div className="meta">15 min • Sem aparelhos</div>
                <b style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1rem' }}>
                  Alongamento Dinâmico &amp; Caminhada Ativa
                </b>
                <p style={{ marginTop: '6px' }}>
                  Exercícios suaves de ativação para destravar as articulações e queimar calorias.
                </p>
              </div>
            </div>
            <Link href={ROUTES.TREINOS} style={{ display: 'block', marginTop: '16px' }}>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Iniciar Treino Guiado →
              </button>
            </Link>
          </div>

          {/* Hydration Tracker Card */}
          <div className="side-card hydro">
            <div className="row">
              <b
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                💧 Hidratação
              </b>
              <span className="amt">
                <span>{dailyLog.waterMl}</span> / {waterTargetMl} ml
              </span>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
              Meta: {waterTargetMl} ml
            </span>
            <div className="bar" style={{ marginTop: '10px' }}>
              <i
                style={{
                  width: `${waterPercentage}%`,
                  background: 'linear-gradient(90deg, #2f89c5, #1aa8a0)',
                }}
              ></i>
            </div>
            <div className="btns">
              <button onClick={() => addWater(250)}>+250 ml 🥤</button>
              <button onClick={() => addWater(500)}>+500 ml 🚰</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
