// ============================================
// Página do Plano Alimentar — 21 Dias (Mindfit)
// ============================================
'use client';

import { useState } from 'react';
import { Sparkles, Salad, Lightbulb, Clock, CheckCircle2, ChevronRight, Utensils } from 'lucide-react';
import { MEAL_PLANS_21_DAYS } from '@/data/meal-plans-seed';
import { Card, Badge, Button } from '@/components/ui';
import { TrafficLight } from '@/components/nutrition/TrafficLight';
import { PHASE_NAMES, PHASE_DESCRIPTIONS } from '@/constants/config';
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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Salad className="w-4.5 h-4.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
            Plano Alimentar de 21 Dias
          </h1>
        </div>
        <p className="text-neutral-500 text-sm sm:text-base">
          Cardápios diários práticos estruturados em 3 fases progressivas para queima de gordura e desinflamação.
        </p>
      </div>

      {/* Phase Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedPhase(0)}
          className={`
            px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer
            ${
              selectedPhase === 0
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200/80'
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
              const firstDayOfPhase = MEAL_PLANS_21_DAYS.find((p) => p.phase === phase);
              if (firstDayOfPhase) setSelectedDay(firstDayOfPhase.day);
            }}
            className={`
              px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer
              ${
                selectedPhase === phase
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/25 border border-emerald-400/30'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200/80'
              }
            `}
          >
            Fase {phase}: {PHASE_NAMES[phase]}
          </button>
        ))}
      </div>

      {/* Days Timeline Carousel */}
      <div className="flex gap-2.5 overflow-x-auto py-2 px-1 no-scrollbar">
        {filteredDays.map((plan) => {
          const isSelected = plan.day === selectedDay;
          return (
            <button
              key={plan.day}
              type="button"
              onClick={() => setSelectedDay(plan.day)}
              className={`
                flex-shrink-0 w-16 sm:w-20 py-3.5 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 shadow-md shadow-emerald-500/10 -translate-y-1'
                    : 'border-neutral-200/80 bg-white text-neutral-700 hover:border-neutral-300'
                }
              `}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider block text-neutral-400">
                Dia
              </span>
              <span className="text-xl sm:text-2xl font-black font-[var(--font-heading)] block mt-0.5">
                {plan.day}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full mx-auto mt-1.5 transition-all ${
                  isSelected ? 'bg-emerald-600 scale-125' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Day Overview Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <Badge variant="emerald" size="sm">
              {currentPlan.phaseName} • Dia {currentPlan.day}
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] tracking-tight">
              {currentPlan.focusTitle}
            </h2>

            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-start gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                <strong>Dica Prática:</strong> {currentPlan.dailyTip}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right flex-shrink-0 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-extrabold block">
              Total Estimado
            </span>
            <span className="text-3xl sm:text-4xl font-black font-[var(--font-heading)] text-amber-300">
              ~{currentPlan.meals.reduce((acc, m) => acc + m.estimatedCalories, 0)} kcal
            </span>
          </div>
        </div>
      </div>

      {/* Meal Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {currentPlan.meals.map((meal) => {
          const mealTypeLabels: Record<string, string> = {
            breakfast: 'Café da Manhã',
            lunch: 'Almoço',
            snack: 'Lanche da Tarde',
            dinner: 'Jantar',
          };

          return (
            <Card
              key={meal.type}
              padding="md"
              className="flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                      {mealTypeLabels[meal.type] || meal.type}
                    </span>
                    <h3 className="font-extrabold text-neutral-900 text-base sm:text-lg mt-0.5">
                      {meal.title}
                    </h3>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <TrafficLight color={meal.trafficLight} />
                    <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-lg">
                      ~{meal.estimatedCalories} kcal
                    </span>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 mt-3.5 leading-relaxed">
                  {meal.description}
                </p>

                {meal.options && meal.options.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Variações & Substituições:
                    </p>
                    {meal.options.map((opt, i) => (
                      <p key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{opt}</span>
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
