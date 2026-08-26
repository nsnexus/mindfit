// ============================================
// Página do Plano Alimentar — 21 Dias (Mindfit Official)
// ============================================
'use client';

import { useState } from 'react';
import { Sparkles, Salad, Lightbulb, Clock, CheckCircle2, ChevronRight, Utensils } from 'lucide-react';
import { MEAL_PLANS_21_DAYS } from '@/data/meal-plans-seed';
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="pill text-xs">
            🥗 Nutrição Estruturada
          </span>
        </div>
        <h1 className="font-head text-3xl sm:text-4xl font-extrabold text-[#12352f] tracking-tight">
          Plano Alimentar de <span className="gradient-text">21 Dias</span>
        </h1>
        <p className="text-[#5b7a72] text-xs sm:text-sm mt-1">
          Cardápios diários práticos estruturados em 3 fases progressivas para queima de gordura e desinflamação.
        </p>
      </div>

      {/* Phase Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedPhase(0)}
          className={`
            px-5 py-2.5 rounded-full text-xs sm:text-sm font-head font-bold whitespace-nowrap transition-all cursor-pointer
            ${
              selectedPhase === 0
                ? 'btn-primary text-white shadow-md shadow-[#0e9f6e]/20'
                : 'bg-white text-[#5b7a72] hover:bg-[#f5faf7] hover:text-[#0e9f6e] border border-[#e2f2ea]'
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
              px-5 py-2.5 rounded-full text-xs sm:text-sm font-head font-bold whitespace-nowrap transition-all cursor-pointer
              ${
                selectedPhase === phase
                  ? 'btn-primary text-white shadow-md shadow-[#0e9f6e]/20'
                  : 'bg-white text-[#5b7a72] hover:bg-[#f5faf7] hover:text-[#0e9f6e] border border-[#e2f2ea]'
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
                    ? 'border-[#0e9f6e] bg-[#e6f6ef] text-[#12352f] shadow-md shadow-[#0e9f6e]/10 -translate-y-1'
                    : 'border-[#e2f2ea] bg-white text-[#5b7a72] hover:border-[#0e9f6e]/40'
                }
              `}
            >
              <span className="text-[10px] font-head font-extrabold uppercase tracking-wider block text-[#5b7a72]">
                Dia
              </span>
              <span className="text-xl sm:text-2xl font-extrabold font-head block mt-0.5">
                {plan.day}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full mx-auto mt-1.5 transition-all ${
                  isSelected ? 'bg-[#0e9f6e] scale-125' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Day Overview Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#09312b] via-[#0d473e] to-[#06231f] border border-[#0e9f6e]/30 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <span className="pill text-xs bg-white/10 text-[#8bc34a] border border-white/20 font-head font-bold">
              {currentPlan.phaseName} • Dia {currentPlan.day}
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-head tracking-tight">
              {currentPlan.focusTitle}
            </h2>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-start gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                <strong>Dica Prática:</strong> {currentPlan.dailyTip}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right flex-shrink-0 bg-white/5 border border-white/10 p-5 rounded-2xl">
            <span className="text-[11px] uppercase tracking-wider text-[#8bc34a] font-head font-extrabold block">
              Total Estimado
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold font-head text-[#8bc34a]">
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
            <div
              key={meal.type}
              className="bg-white rounded-3xl border border-[#e2f2ea] p-6 shadow-[0_8px_25px_rgba(14,159,110,0.06)] flex flex-col justify-between hover:border-[#0e9f6e] hover:shadow-[0_14px_35px_rgba(14,159,110,0.12)] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#eef4f1]">
                  <div>
                    <span className="text-[11px] font-head font-extrabold text-[#0e9f6e] uppercase tracking-wider block">
                      {mealTypeLabels[meal.type] || meal.type}
                    </span>
                    <h3 className="font-head font-extrabold text-[#12352f] text-base sm:text-lg mt-0.5">
                      {meal.title}
                    </h3>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <TrafficLight color={meal.trafficLight} />
                    <span className="pill text-[11px] font-head font-bold bg-[#f5faf7] text-[#0e9f6e] border border-[#e2f2ea]">
                      ~{meal.estimatedCalories} kcal
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#12352f] mt-3.5 leading-relaxed font-medium">
                  {meal.description}
                </p>

                {meal.options && meal.options.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#eef4f1] space-y-1.5">
                    <p className="text-[11px] font-head font-extrabold text-[#5b7a72] uppercase tracking-wider">
                      Variações & Substituições:
                    </p>
                    {meal.options.map((opt, i) => (
                      <p key={i} className="text-xs text-[#5b7a72] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0e9f6e] shrink-0" />
                        <span>{opt}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

