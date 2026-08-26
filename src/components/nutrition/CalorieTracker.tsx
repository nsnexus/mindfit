// ============================================
// Daily Calorie Budget Tracker — Mindfit Premium
// ============================================
'use client';

import { Flame, Sparkles, TrendingDown, Target } from 'lucide-react';
import { Card } from '@/components/ui';

interface CalorieTrackerProps {
  consumedCalories: number;
  targetCalories: number;
  workoutBurnedCalories?: number;
}

export function CalorieTracker({
  consumedCalories,
  targetCalories,
  workoutBurnedCalories = 0,
}: CalorieTrackerProps) {
  const remaining = Math.max(0, targetCalories - consumedCalories);
  const percentage = Math.min(Math.round((consumedCalories / (targetCalories || 1)) * 100), 100);
  const isOver = consumedCalories > targetCalories;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 text-white shadow-2xl shadow-emerald-950/40 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
        {/* Left Side: Calorie Balances & Key Metrics */}
        <div className="text-center md:text-left space-y-4 flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Balanço Diário de Calorias
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-5xl sm:text-6xl font-black font-[var(--font-heading)] text-white tracking-tight drop-shadow-sm">
                {remaining}
              </span>
              <span className="text-emerald-300 font-bold text-sm sm:text-base">
                {isOver ? 'kcal excedentes' : 'kcal restantes'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed">
              Sua meta diária é de <strong>{targetCalories} kcal</strong> para queima constante de gordura.
              {workoutBurnedCalories > 0 && (
                <span className="text-amber-300 block mt-0.5">
                  🔥 +{workoutBurnedCalories} kcal queimadas nos treinos guiados hoje!
                </span>
              )}
            </p>
          </div>

          {/* Mini Stat Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-neutral-300">Consumidas:</span>
              <strong className="text-white">{consumedCalories} kcal</strong>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-neutral-300">Meta:</span>
              <strong className="text-white">{targetCalories} kcal</strong>
            </div>
          </div>
        </div>

        {/* Right Side: Circular Gauge Ring */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 36 36">
            {/* Background ring */}
            <path
              className="text-white/10"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress ring */}
            <path
              className={isOver ? 'text-amber-400' : 'text-emerald-400'}
              strokeDasharray={`${percentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Gauge Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] leading-none text-white">
              {percentage}%
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-300 uppercase font-extrabold mt-1 tracking-wider">
              Concluído
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
