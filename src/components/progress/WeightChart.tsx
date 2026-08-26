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
  startWeight: propStartWeight,
  goalWeight,
}: WeightChartProps) {
  const chartData = entries && entries.length > 0 ? entries : [];

  const currentWeight =
    chartData.length > 0 ? chartData[chartData.length - 1].weight : propStartWeight || 0;

  const startWeight =
    propStartWeight > 0
      ? propStartWeight
      : chartData.length > 0
      ? chartData[0].weight
      : 0;

  const totalLost = startWeight > 0 && currentWeight > 0 ? startWeight - currentWeight : 0;
  const remainingToGoal =
    goalWeight > 0 && currentWeight > 0 ? Math.max(0, currentWeight - goalWeight) : 0;

  const allWeights = [
    ...(chartData.map((d) => d.weight) || []),
    ...(startWeight > 0 ? [startWeight] : []),
    ...(goalWeight > 0 ? [goalWeight] : []),
  ].filter((w) => w > 0);

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
            {startWeight > 0 ? `Peso Inicial: ${startWeight} kg` : currentWeight > 0 ? `Peso Atual: ${currentWeight} kg` : 'Peso inicial não definido'}
          </div>
        </div>

        <div className="wc-stats">
          <div className="st lost">
            <small>PESO ATUAL</small>
            <b>{currentWeight > 0 ? `${currentWeight.toFixed(1)} kg` : '--'}</b>
          </div>
          {startWeight > 0 && totalLost !== 0 && (
            <div className="st lost">
              <small>ELIMINADO</small>
              <b>{totalLost > 0 ? `-${totalLost.toFixed(1)} kg` : `+${Math.abs(totalLost).toFixed(1)} kg`}</b>
            </div>
          )}
          {goalWeight > 0 && (
            <div className="st left">
              <small>FALTAM</small>
              <b>{remainingToGoal.toFixed(1)} kg</b>
            </div>
          )}
        </div>
      </div>

      {chartData.length === 0 ? (
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
            Nenhum peso registrado ainda
          </b>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
            Registre seu peso periodicamente na aba <b>Diário Alimentar</b> para ver seu gráfico de evolução em tempo real.
          </p>
        </div>
      ) : chartData.length === 1 ? (
        <div
          style={{
            padding: '24px 20px',
            background: '#f6fbf8',
            borderRadius: '16px',
            marginTop: '14px',
            border: '1.5px solid #cdeadd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--grad)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}
            >
              ⚖️
            </div>
            <div>
              <b style={{ color: '#12352f', fontSize: '1.15rem', fontFamily: "'Poppins', sans-serif" }}>
                Primeiro peso registrado: {chartData[0].weight} kg
              </b>
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                Registro efetuado em {chartData[0].date}. Conforme você adicionar novas pesagens no Diário, a linha de evolução será traçada automaticamente.
              </p>
            </div>
          </div>
          <span
            className="badge badge-green"
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            ✅ Registrado Hoje
          </span>
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
