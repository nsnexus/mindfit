// ============================================
// Macro Tracker Chart Component — Mindfit Reference Design
// ============================================
'use client';

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
  const pPct = Math.min(Math.round((current.protein / (target.protein || 1)) * 100), 100);
  const cPct = Math.min(Math.round((current.carbs / (target.carbs || 1)) * 100), 100);
  const gPct = Math.min(Math.round((current.fat / (target.fat || 1)) * 100), 100);

  const macros = [
    {
      name: 'PROTEÍNAS',
      icon: '🥩',
      iconBg: '#e6f6ef',
      iconColor: 'var(--green)',
      barColor: 'var(--green)',
      textColor: 'var(--green)',
      current: current.protein,
      target: target.protein,
      pct: pPct,
      remaining: Math.max(0, target.protein - current.protein),
    },
    {
      name: 'CARBOIDRATOS',
      icon: '🌾',
      iconBg: '#fff4e0',
      iconColor: 'var(--orange)',
      barColor: 'var(--orange)',
      textColor: 'var(--orange)',
      current: current.carbs,
      target: target.carbs,
      pct: cPct,
      remaining: Math.max(0, target.carbs - current.carbs),
    },
    {
      name: 'GORDURAS BOAS',
      icon: '🥑',
      iconBg: '#e2f5f3',
      iconColor: 'var(--teal)',
      barColor: 'var(--teal)',
      textColor: 'var(--teal)',
      current: current.fat,
      target: target.fat,
      pct: gPct,
      remaining: Math.max(0, target.fat - current.fat),
    },
  ];

  return (
    <div>
      <div className="section-title">
        🍃 Distribuição de Macronutrientes{' '}
        <span style={{ marginLeft: 'auto', fontWeight: 500, fontSize: '0.85rem', color: 'var(--muted)' }}>
          Metas diárias
        </span>
      </div>
      <div className="grid g-3">
        {macros.map((m) => (
          <div key={m.name} className="macro">
            <div className="top">
              <div className="mic" style={{ background: m.iconBg, color: m.iconColor }}>
                {m.icon}
              </div>
              <div>
                <div className="lbl">{m.name}</div>
                <div className="val">
                  {m.current}g <small>/ {m.target}g</small>
                </div>
              </div>
            </div>
            <div className="bar">
              <i style={{ width: `${m.pct}%`, background: m.barColor }}></i>
            </div>
            <div className="foot">
              <span style={{ color: 'var(--muted)' }}>{m.pct}% da meta</span>
              <span className="rem" style={{ color: m.textColor }}>
                {m.remaining}g restam
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
