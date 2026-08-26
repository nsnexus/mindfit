// ============================================
// Weight Progress Chart Component
// ============================================
'use client';

import { Card } from '@/components/ui';
import type { ProgressEntry } from '@/types/progress';

interface WeightChartProps {
  entries: ProgressEntry[];
  startWeight: number;
  goalWeight: number;
}

export function WeightChart({
  entries,
  startWeight,
  goalWeight,
}: WeightChartProps) {
  // Mock data if few entries exist yet
  const chartData = entries.length > 0
    ? entries
    : [
        { id: '1', date: 'Dia 1', weight: startWeight },
        { id: '2', date: 'Dia 4', weight: startWeight - 0.6 },
        { id: '3', date: 'Dia 7', weight: startWeight - 1.2 },
        { id: '4', date: 'Dia 11', weight: startWeight - 1.8 },
        { id: '5', date: 'Dia 15', weight: startWeight - 2.5 },
        { id: '6', date: 'Dia 18', weight: startWeight - 3.1 },
        { id: '7', date: 'Dia 21', weight: goalWeight },
      ];

  const currentWeight = chartData[chartData.length - 1]?.weight || startWeight;
  const totalLost = Math.max(0, startWeight - currentWeight);
  const remainingToGoal = Math.max(0, currentWeight - goalWeight);

  const minWeight = Math.min(...chartData.map((d) => d.weight), goalWeight) - 1;
  const maxWeight = Math.max(...chartData.map((d) => d.weight), startWeight) + 1;
  const range = maxWeight - minWeight || 1;

  return (
    <Card padding="md" className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <h3 className="font-bold text-neutral-900 text-base sm:text-lg flex items-center gap-2">
            <span>📈</span>
            <span>Evolução de Peso Corporal</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Meta: {goalWeight} kg • Peso Inicial: {startWeight} kg
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              Eliminado
            </span>
            <span className="text-lg font-black text-emerald-700 font-[var(--font-heading)]">
              -{totalLost.toFixed(1)} kg
            </span>
          </div>

          <div className="p-2.5 bg-primary-50 rounded-2xl border border-primary-100 text-center">
            <span className="text-[10px] uppercase font-bold text-primary-700 block">
              Faltam
            </span>
            <span className="text-lg font-black text-primary-800 font-[var(--font-heading)]">
              {remainingToGoal.toFixed(1)} kg
            </span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Trendline */}
      <div className="w-full h-56 pt-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
          {/* Horizontal Grid lines */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="#f0f0f0" strokeDasharray="4" />
          <line x1="0" y1="90" x2="500" y2="90" stroke="#f0f0f0" strokeDasharray="4" />
          <line x1="0" y1="150" x2="500" y2="150" stroke="#f0f0f0" strokeDasharray="4" />

          {/* Goal reference line */}
          <line
            x1="0"
            y1={170 - ((goalWeight - minWeight) / range) * 140}
            x2="500"
            y2={170 - ((goalWeight - minWeight) / range) * 140}
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="6"
          />

          {/* Trendline Path */}
          <polyline
            fill="none"
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={chartData
              .map((d, index) => {
                const x = (index / (chartData.length - 1 || 1)) * 480 + 10;
                const y = 170 - ((d.weight - minWeight) / range) * 140;
                return `${x},${y}`;
              })
              .join(' ')}
          />

          {/* Data Points */}
          {chartData.map((d, index) => {
            const x = (index / (chartData.length - 1 || 1)) * 480 + 10;
            const y = 170 - ((d.weight - minWeight) / range) * 140;
            return (
              <g key={d.id || index} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  className="fill-white stroke-primary-600 stroke-[3] group-hover:r-7 transition-all"
                />
                {/* Weight label above point */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-neutral-700"
                >
                  {d.weight}kg
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Goal reference label */}
      <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500 rounded" />
          Linha tracejada verde = Sua Meta ({goalWeight} kg)
        </span>
        <span>Acompanhamento semanal</span>
      </div>
    </Card>
  );
}
