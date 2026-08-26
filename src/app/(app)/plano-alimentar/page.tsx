// ============================================
// Página do Plano Alimentar — 21 Dias
// ============================================
'use client';

import { useState } from 'react';
import { MEAL_PLANS_21_DAYS } from '@/data/meal-plans-seed';
import { Card, Badge, Button } from '@/components/ui';
import { TrafficLight } from '@/components/nutrition/TrafficLight';
import { PHASE_NAMES, PHASE_DESCRIPTIONS } from '@/constants/config';
import type { DayPlan } from '@/types/meal';

export default function PlanoAlimentarPage() {
  const [selectedPhase, setSelectedPhase] = useState<number>(0); // 0 = Todas
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const filteredDays = selectedPhase === 0
    ? MEAL_PLANS_21_DAYS
    : MEAL_PLANS_21_DAYS.filter((p) => p.phase === selectedPhase);

  const currentPlan: DayPlan =
    MEAL_PLANS_21_DAYS.find((p) => p.day === selectedDay) || MEAL_PLANS_21_DAYS[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Plano Alimentar de 21 Dias 🥗
        </h1>
        <p className="text-neutral-500 text-sm sm:text-base mt-1">
          Cardápios estruturados em 3 fases progressivas para reeducação alimentar e perda sustentável de gordura.
        </p>
      </div>

      {/* Phase Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedPhase(0)}
          className={`
            px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all
            ${selectedPhase === 0
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }
          `}
        >
          Todos os 21 Dias
        </button>

        {[1, 2, 3].map((phase) => (
          <button
            key={phase}
            type="button"
            onClick={() => {
              setSelectedPhase(phase);
              // Seleciona o primeiro dia da fase
              const firstDayOfPhase = MEAL_PLANS_21_DAYS.find((p) => p.phase === phase);
              if (firstDayOfPhase) setSelectedDay(firstDayOfPhase.day);
            }}
            className={`
              px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all
              ${selectedPhase === phase
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }
            `}
          >
            Fase {phase}: {PHASE_NAMES[phase]}
          </button>
        ))}
      </div>

      {/* Days Timeline Carousel */}
      <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
        {filteredDays.map((plan) => {
          const isSelected = plan.day === selectedDay;
          return (
            <button
              key={plan.day}
              type="button"
              onClick={() => setSelectedDay(plan.day)}
              className={`
                flex-shrink-0 w-16 py-3 rounded-2xl border-2 text-center transition-all duration-200
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-md -translate-y-0.5'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }
              `}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block text-neutral-400">
                Dia
              </span>
              <span className="text-xl font-extrabold font-[var(--font-heading)] block mt-0.5">
                {plan.day}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full mx-auto mt-1.5 ${isSelected ? 'bg-primary-600' : 'bg-transparent'}`} />
            </button>
          );
        })}
      </div>

      {/* Day Overview Banner */}
      <Card variant="elevated" className="bg-gradient-hero text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="premium" size="sm" className="mb-2">
              {currentPlan.phaseName}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-[var(--font-heading)]">
              {currentPlan.focusTitle}
            </h2>
            <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 flex items-start gap-2.5 max-w-2xl">
              <span className="text-lg">💡</span>
              <p className="text-xs sm:text-sm text-primary-100 leading-relaxed">
                <strong>Dica do Dia:</strong> {currentPlan.dailyTip}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right flex-shrink-0">
            <span className="text-xs uppercase tracking-wider text-primary-200 font-semibold block">
              Estimativa do Cardápio
            </span>
            <span className="text-3xl font-extrabold font-[var(--font-heading)]">
              ~{currentPlan.meals.reduce((acc, m) => acc + m.estimatedCalories, 0)} kcal
            </span>
          </div>
        </div>
      </Card>

      {/* Meal Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentPlan.meals.map((meal) => {
          const icons: Record<string, string> = {
            breakfast: '🍳',
            lunch: '🥗',
            snack: '🍎',
            dinner: '🍲',
          };

          return (
            <Card key={meal.type} padding="md" className="flex flex-col justify-between hover:shadow-card">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{icons[meal.type] || '🍽️'}</span>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-base">
                        {meal.title}
                      </h3>
                      <span className="text-xs text-neutral-400 capitalize">
                        {meal.type === 'breakfast' && 'Café da Manhã'}
                        {meal.type === 'lunch' && 'Almoço'}
                        {meal.type === 'snack' && 'Lanche da Tarde'}
                        {meal.type === 'dinner' && 'Jantar'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <TrafficLight color={meal.trafficLight} />
                    <span className="text-xs font-bold text-neutral-600 block mt-1">
                      ~{meal.estimatedCalories} kcal
                    </span>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 mt-3 leading-relaxed">
                  {meal.description}
                </p>

                {meal.options && meal.options.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-50 space-y-1">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Variações & Dicas:
                    </p>
                    {meal.options.map((opt, i) => (
                      <p key={i} className="text-xs text-neutral-500 flex items-center gap-1.5">
                        <span className="text-primary-500 font-bold">•</span>
                        {opt}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
