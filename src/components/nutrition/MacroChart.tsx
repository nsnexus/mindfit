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
  const macros = [
    {
      id: 'protein',
      name: 'Proteínas',
      current: current.protein,
      target: target.protein,
      unit: 'g',
      color: 'emerald',
      icon: Beef,
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      barColor: 'primary' as const,
      textColor: 'text-emerald-600',
    },
    {
      id: 'carbs',
      name: 'Carboidratos',
      current: current.carbs,
      target: target.carbs,
      unit: 'g',
      color: 'amber',
      icon: Wheat,
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      barColor: 'accent' as const,
      textColor: 'text-amber-600',
    },
    {
      id: 'fat',
      name: 'Gorduras',
      current: current.fat,
      target: target.fat,
      unit: 'g',
      color: 'orange',
      icon: Droplet,
      iconBg: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      barColor: 'warning' as const,
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-extrabold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5 font-[var(--font-heading)]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Distribuição de Macronutrientes
        </h3>
        <span className="text-xs text-neutral-400 font-semibold">Metas diárias</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {macros.map((m) => {
          const Icon = m.icon;
          const pct = Math.min(Math.round((m.current / (m.target || 1)) * 100), 100);
          const remaining = Math.max(0, m.target - m.current);

          return (
            <div
              key={m.id}
              className="p-4 sm:p-5 bg-white rounded-3xl border border-emerald-100 shadow-[0_8px_25px_-5px_rgba(14,159,110,0.06)] space-y-3 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${m.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider block">
                      {m.name}
                    </span>
                    <span className="text-base sm:text-lg font-black text-neutral-900 font-[var(--font-heading)] tracking-tight">
                      {m.current}g <span className="text-xs text-neutral-400 font-semibold">/ {m.target}g</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Progress
                  value={m.current}
                  max={m.target || 1}
                  color={m.barColor}
                  size="sm"
                />
                <div className="flex justify-between items-center text-[11px] font-semibold pt-0.5">
                  <span className="text-neutral-400">{pct}% da meta</span>
                  <span className={`${m.textColor} font-bold`}>{remaining}g restam</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

