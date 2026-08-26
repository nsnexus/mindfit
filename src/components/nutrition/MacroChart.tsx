// ============================================
// Macro Tracker Chart Component
// ============================================
'use client';

import { Progress } from '@/components/ui';

interface MacroChartProps {
  current: {
    protein: number;
    carbs: number;
    fat: number;
  };
  target: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function MacroChart({ current, target }: MacroChartProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Proteína */}
      <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥩</span>
            <span className="text-sm font-semibold text-neutral-800">Proteína</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            {current.protein}g / {target.protein}g
          </span>
        </div>
        <Progress
          value={current.protein}
          max={target.protein || 1}
          color="primary"
          size="md"
        />
        <p className="text-[11px] text-neutral-400 mt-2 text-right">
          {Math.max(0, target.protein - current.protein)}g restantes
        </p>
      </div>

      {/* Carboidrato */}
      <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍚</span>
            <span className="text-sm font-semibold text-neutral-800">Carboidratos</span>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
            {current.carbs}g / {target.carbs}g
          </span>
        </div>
        <Progress
          value={current.carbs}
          max={target.carbs || 1}
          color="accent"
          size="md"
        />
        <p className="text-[11px] text-neutral-400 mt-2 text-right">
          {Math.max(0, target.carbs - current.carbs)}g restantes
        </p>
      </div>

      {/* Gordura */}
      <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥑</span>
            <span className="text-sm font-semibold text-neutral-800">Gorduras</span>
          </div>
          <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md">
            {current.fat}g / {target.fat}g
          </span>
        </div>
        <Progress
          value={current.fat}
          max={target.fat || 1}
          color="warning"
          size="md"
        />
        <p className="text-[11px] text-neutral-400 mt-2 text-right">
          {Math.max(0, target.fat - current.fat)}g restantes
        </p>
      </div>
    </div>
  );
}
