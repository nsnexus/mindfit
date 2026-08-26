// ============================================
// Macro Tracker Chart Component — Mindfit
// ============================================
'use client';

import { Beef, Wheat, Droplet, Sparkles } from 'lucide-react';
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Distribuição de Macronutrientes
        </h3>
        <span className="text-xs text-neutral-400 font-medium">Metas personalizadas</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Proteína */}
        <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-3 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Beef className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide block">Proteínas</span>
                <span className="text-base font-extrabold text-neutral-900 font-[var(--font-heading)]">
                  {current.protein}g <span className="text-xs text-neutral-400 font-normal">/ {target.protein}g</span>
                </span>
              </div>
            </div>
          </div>
          <Progress
            value={current.protein}
            max={target.protein || 1}
            color="primary"
            size="sm"
          />
          <div className="flex justify-between items-center text-[11px] text-neutral-400 font-medium pt-0.5">
            <span>{Math.round((current.protein / (target.protein || 1)) * 100)}% da meta</span>
            <span className="text-emerald-600 font-bold">{Math.max(0, target.protein - current.protein)}g restam</span>
          </div>
        </div>

        {/* Carboidratos */}
        <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-3 hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                <Wheat className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide block">Carboidratos</span>
                <span className="text-base font-extrabold text-neutral-900 font-[var(--font-heading)]">
                  {current.carbs}g <span className="text-xs text-neutral-400 font-normal">/ {target.carbs}g</span>
                </span>
              </div>
            </div>
          </div>
          <Progress
            value={current.carbs}
            max={target.carbs || 1}
            color="accent"
            size="sm"
          />
          <div className="flex justify-between items-center text-[11px] text-neutral-400 font-medium pt-0.5">
            <span>{Math.round((current.carbs / (target.carbs || 1)) * 100)}% da meta</span>
            <span className="text-amber-600 font-bold">{Math.max(0, target.carbs - current.carbs)}g restam</span>
          </div>
        </div>

        {/* Gorduras */}
        <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-3 hover:border-orange-500/30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
                <Droplet className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide block">Gorduras</span>
                <span className="text-base font-extrabold text-neutral-900 font-[var(--font-heading)]">
                  {current.fat}g <span className="text-xs text-neutral-400 font-normal">/ {target.fat}g</span>
                </span>
              </div>
            </div>
          </div>
          <Progress
            value={current.fat}
            max={target.fat || 1}
            color="warning"
            size="sm"
          />
          <div className="flex justify-between items-center text-[11px] text-neutral-400 font-medium pt-0.5">
            <span>{Math.round((current.fat / (target.fat || 1)) * 100)}% da meta</span>
            <span className="text-orange-600 font-bold">{Math.max(0, target.fat - current.fat)}g restam</span>
          </div>
        </div>
      </div>
    </div>
  );
}
