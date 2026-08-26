// ============================================
// Daily Calorie Budget Tracker Component
// ============================================
'use client';

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
    <Card variant="elevated" className="bg-gradient-primary text-white p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Side: Stats */}
        <div className="text-center sm:text-left space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-primary-200">
            Balanço Calórico do Dia
          </span>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-[var(--font-heading)]">
              {remaining}
            </span>
            <span className="text-primary-200 font-medium text-sm sm:text-base">
              {isOver ? 'kcal excedentes' : 'kcal restantes'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-primary-100 max-w-sm">
            Meta diária calculada: <strong>{targetCalories} kcal</strong>
            {workoutBurnedCalories > 0 && ` (+${workoutBurnedCalories} kcal queimadas no treino)`}
          </p>
        </div>

        {/* Right Side: Circular Gauge */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-white/20"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className={isOver ? 'text-amber-300' : 'text-white'}
              strokeDasharray={`${percentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-[var(--font-heading)] leading-none">
              {consumedCalories}
            </span>
            <span className="text-[10px] text-primary-200 uppercase font-semibold mt-0.5">
              Consumidas
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
