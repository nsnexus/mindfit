// ============================================
// Página do Plano Alimentar — 21 Dias (Mindfit Exact Reference)
// ============================================
'use client';

import { useState } from 'react';
import { MEAL_PLANS_21_DAYS } from '@/data/meal-plans-seed';
import { PHASE_NAMES } from '@/constants/config';
import type { DayPlan } from '@/types/meal';

export default function PlanoAlimentarPage() {
  const [selectedPhase, setSelectedPhase] = useState<number>(0); // 0 = Todas
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const filteredDays =
    selectedPhase === 0
      ? MEAL_PLANS_21_DAYS
      : MEAL_PLANS_21_DAYS.filter((p) => p.phase === selectedPhase);

  const currentPlan: DayPlan =
    MEAL_PLANS_21_DAYS.find((p) => p.day === selectedDay) || MEAL_PLANS_21_DAYS[0];

  const totalCalories = currentPlan.meals.reduce((acc, m) => acc + (m.estimatedCalories || 0), 0);

  const mealLabels: Record<string, string> = {
    breakfast: '☕ CAFÉ DA MANHÃ',
    lunch: '🥘 ALMOÇO',
    snack: '🍎 LANCHE DA TARDE',
    dinner: '🍲 JANTAR',
  };

  return (
    <div>
      {/* Header */}
      <h1 className="page-title">🥗 Plano Alimentar de 21 Dias</h1>
      <p className="page-sub">
        Cardápios diários práticos estruturados em 3 fases progressivas para queima de gordura e desinflamação.
      </p>

      {/* Phase Filter Row */}
      <div className="filter-row">
        <button
          type="button"
          onClick={() => setSelectedPhase(0)}
          className={`fbtn ${selectedPhase === 0 ? 'active' : ''}`}
        >
          Todos os 21 Dias
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedPhase(1);
            setSelectedDay(1);
          }}
          className={`fbtn ${selectedPhase === 1 ? 'active' : ''}`}
        >
          Fase 1: Preparação
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedPhase(2);
            setSelectedDay(8);
          }}
          className={`fbtn ${selectedPhase === 2 ? 'active' : ''}`}
        >
          Fase 2: Controle
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedPhase(3);
            setSelectedDay(15);
          }}
          className={`fbtn ${selectedPhase === 3 ? 'active' : ''}`}
        >
          Fase 3: Consistência
        </button>
      </div>

      {/* Day Tabs */}
      <div className="day-tabs">
        {filteredDays.map((plan) => {
          const isSelected = plan.day === selectedDay;
          return (
            <div
              key={plan.day}
              onClick={() => setSelectedDay(plan.day)}
              className={`day-tab ${isSelected ? 'active' : ''}`}
            >
              <small>DIA</small>
              <b>{plan.day}</b>
            </div>
          );
        })}
      </div>

      {/* Plan Hero Card */}
      <div className="plan-hero">
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div className="ph-phase">
            Fase {currentPlan.phase}: {PHASE_NAMES[currentPlan.phase] || currentPlan.phaseName}
          </div>
          <h3>Dia {currentPlan.day} — {currentPlan.focusTitle}</h3>
          <div className="tip">
            💡 <b>Dica Nutricional:</b> {currentPlan.dailyTip || 'Mantenha a hidratação constante ao longo do dia e evite pular refeições para acelerar o metabolismo.'}
          </div>
        </div>

        <div className="total">
          <small>TOTAL DO DIA</small>
          <b>{totalCalories || 1800}</b>
          <div style={{ fontSize: '0.8rem', color: '#bfe9d5', marginTop: '2px', fontWeight: 600 }}>
            kcal estimadas
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid g-2">
        {currentPlan.meals.map((meal, index) => (
          <div key={index} className="meal-plan-card">
            <div className="mp-top">
              <div>
                <span className="cat">{mealLabels[meal.type] || meal.type.toUpperCase()}</span>
                <h4>{meal.title}</h4>
              </div>
              <span className="kc">{meal.estimatedCalories} kcal</span>
            </div>
            <p className="desc">{meal.description}</p>
            {meal.options && meal.options.length > 0 && (
              <div>
                <div className="subs-lbl">OPÇÕES E SUGESTÕES:</div>
                {meal.options.map((opt, sIdx) => (
                  <div key={sIdx} className="sub">
                    <span className="c">✓</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
