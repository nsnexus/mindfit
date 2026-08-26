// ============================================
// Daily Calorie Budget Tracker — Mindfit Premium
// ============================================
'use client';

import { Sparkles, Flame, CheckCircle2, TrendingDown } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b332d] via-[#0e433b] to-[#072420] text-white p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(14,159,110,0.28)] border border-emerald-500/30">
      {/* Ambient background glows */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-10 w-60 h-60 bg-[#8bc34a]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left Side: Calorie Balances & Key Metrics */}
        <div className="text-center md:text-left space-y-3.5 flex-1 w-full">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#8bc34a]" /> Balanço Diário de Calorias
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-center md:justify-start gap-3">
              <span className="text-5xl sm:text-6xl font-black font-[var(--font-heading)] text-white tracking-tight drop-shadow-sm">
                {remaining.toLocaleString('pt-BR')}
              </span>
              <span className="text-emerald-300 font-bold text-sm sm:text-base tracking-wide">
                {isOver ? 'kcal excedentes' : 'kcal restantes'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md leading-relaxed">
              Sua meta diária é de <strong className="text-white font-bold">{targetCalories.toLocaleString('pt-BR')} kcal</strong> para queima constante e saudável de gordura.
            </p>
          </div>

          {/* Mini Stat Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-emerald-100/90 font-medium">Consumidas:</span>
              <strong className="text-white font-extrabold">{consumedCalories} kcal</strong>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="text-emerald-100/90 font-medium">Meta:</span>
              <strong className="text-white font-extrabold">{targetCalories} kcal</strong>
            </div>

            {workoutBurnedCalories > 0 && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-xs text-amber-200">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Queimadas: <strong className="text-white font-extrabold">+{workoutBurnedCalories} kcal</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Circular Gauge Ring */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 drop-shadow-xl" viewBox="0 0 36 36">
            {/* Background ring */}
            <path
              className="text-white/15"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress ring */}
            <path
              className={isOver ? 'text-amber-400' : 'text-[#8bc34a]'}
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
            <span className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] leading-none text-white tracking-tight">
              {percentage}%
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8bc34a] uppercase font-black mt-1 tracking-wider">
              Concluído
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

