// ============================================
// Weight Progress Chart Component — Mindfit Reference Design
// ============================================
'use client';

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
  // Use real entries only. If none, initialize with the starting weight
  const chartData =
    entries.length > 0
      ? entries
      : startWeight > 0
      ? [{ id: '1', date: 'Início', weight: startWeight }]
      : [];

  const currentWeight =
    chartData.length > 0 ? chartData[chartData.length - 1].weight : startWeight;

  const totalLost = startWeight > 0 && currentWeight > 0 ? startWeight - currentWeight : 0;
  const remainingToGoal =
    goalWeight > 0 && currentWeight > 0 ? Math.max(0, currentWeight - goalWeight) : 0;

  const allWeights = [
    ...(chartData.map((d) => d.weight) || []),
    ...(startWeight > 0 ? [startWeight] : []),
    ...(goalWeight > 0 ? [goalWeight] : []),
  ];

  const minWeight = allWeights.length > 0 ? Math.min(...allWeights) - 1 : 50;
  const maxWeight = allWeights.length > 0 ? Math.max(...allWeights) + 1 : 80;
  const range = maxWeight - minWeight || 1;

  return (
    <div className="card weight-chart-card" style={{ marginBottom: '22px' }}>
      <div className="wc-head">
        <div>
          <h3>📈 Evolução de Peso Corporal</h3>
          <div className="wc-meta">
            {goalWeight > 0 ? `Meta: ${goalWeight} kg` : 'Meta não definida'} •{' '}
            {startWeight > 0 ? `Peso Inicial: ${startWeight} kg` : 'Peso inicial não definido'}
          </div>
        </div>

        <div className="wc-stats">
          <div className="st lost">
            <small>ELIMINADO</small>
            <b>{totalLost > 0 ? `-${totalLost.toFixed(1)} kg` : `${totalLost.toFixed(1)} kg`}</b>
          </div>
          <div className="st left">
            <small>FALTAM</small>
            <b>{remainingToGoal.toFixed(1)} kg</b>
          </div>
        </div>
      </div>

      {chartData.length <= 1 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '36px 16px',
            background: '#f6fbf8',
            borderRadius: '16px',
            marginTop: '14px',
            border: '1px dashed #cdeadd',
          }}
        >
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '6px' }}>⚖️</span>
          <b style={{ color: '#12352f', fontSize: '1rem', fontFamily: "'Poppins', sans-serif" }}>
            {startWeight > 0
              ? `Peso inicial registrado: ${startWeight} kg`
              : 'Nenhum peso registrado ainda'}
          </b>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
            Registre seu peso periodicamente na aba <b>Diário Alimentar</b> para ver seu gráfico de evolução real em tempo real.
          </p>
        </div>
      ) : (
        <div style={{ width: '100%', height: '200px', marginTop: '14px' }}>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#eef4f1" strokeDasharray="4" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="#eef4f1" strokeDasharray="4" />
            <line x1="0" y1="150" x2="500" y2="150" stroke="#eef4f1" strokeDasharray="4" />

            {/* Goal reference line */}
            {goalWeight > 0 && (
              <line
                x1="0"
                y1={170 - ((goalWeight - minWeight) / range) * 140}
                x2="500"
                y2={170 - ((goalWeight - minWeight) / range) * 140}
                stroke="#0e9f6e"
                strokeWidth="1.5"
                strokeDasharray="6"
              />
            )}

            {/* Real Trendline */}
            <polyline
              fill="none"
              stroke="#0e9f6e"
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

            {/* Real Data Points */}
            {chartData.map((d, index) => {
              const x = (index / (chartData.length - 1 || 1)) * 480 + 10;
              const y = 170 - ((d.weight - minWeight) / range) * 140;
              return (
                <g key={d.id || index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#fff"
                    stroke="#0e9f6e"
                    strokeWidth="3"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fill="#12352f"
                    fontSize="11"
                    fontFamily="Poppins, sans-serif"
                    fontWeight="700"
                  >
                    {d.weight}kg
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.82rem', color: 'var(--muted)' }}>
        <span>— Linha tracejada verde = Sua Meta ({goalWeight || '--'} kg)</span>
        <span>Acompanhamento real</span>
      </div>
    </div>
  );
}
