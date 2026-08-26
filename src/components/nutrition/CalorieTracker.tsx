// ============================================
// Daily Calorie Budget Tracker — Mindfit Reference Design
// ============================================
'use client';

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
  
  // Circumference for r=60 is 2 * Math.PI * 60 = ~377
  const circumference = 377;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="cal-hero" style={{ marginBottom: '22px' }}>
      <div>
        <span className="ch-tag">⚡ Balanço Diário de Calorias</span>
        <div className="big">
          <span>{remaining.toLocaleString('pt-BR')}</span>{' '}
          <small>{isOver ? 'kcal excedentes' : 'kcal restantes'}</small>
        </div>
        <p>
          Sua meta diária é de <b>{targetCalories.toLocaleString('pt-BR')} kcal</b> para queima constante e saudável de gordura.
        </p>
        <div className="mini-stats">
          <span className="ms">
            <span className="d" style={{ background: '#8bc34a' }}></span> Consumidas:{' '}
            <b>{consumedCalories} kcal</b>
          </span>
          <span className="ms">
            <span className="d" style={{ background: 'var(--amber)' }}></span> Meta:{' '}
            <b>{targetCalories} kcal</b>
          </span>
          {workoutBurnedCalories > 0 && (
            <span className="ms">
              <span className="d" style={{ background: '#f59e0b' }}></span> Queimadas:{' '}
              <b>+{workoutBurnedCalories} kcal</b>
            </span>
          )}
        </div>
      </div>

      <div className="ring-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg className="ring" width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="12" />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke={isOver ? '#f59e0b' : '#a9e34b'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="ring-txt" style={{ textAlign: 'center', position: 'absolute' }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '1.7rem', color: '#fff' }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '0.7rem', color: '#bfe9d5', letterSpacing: '1px' }}>
            CONCLUÍDO
          </div>
        </div>
      </div>
    </div>
  );
}
