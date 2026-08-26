// ============================================
// Interactive Workout Timer Component — Mindfit Reference Design
// Utiliza Web Audio API para bips sem dependência externa
// ============================================
'use client';

import { useEffect, useRef } from 'react';

interface WorkoutTimerProps {
  timeRemaining: number;
  totalTime: number;
  isResting: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onSkip: () => void;
}

// Bip sonoro sintetizado no navegador
function playBeep(freq = 880, duration = 0.15) {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context may be restricted by browser policy
  }
}

export function WorkoutTimer({
  timeRemaining,
  totalTime,
  isResting,
  isPaused,
  onTogglePause,
  onSkip,
}: WorkoutTimerProps) {
  const prevTimeRef = useRef(timeRemaining);

  // Play audio beeps at 3, 2, 1 seconds
  useEffect(() => {
    if (!isPaused && timeRemaining !== prevTimeRef.current) {
      if (timeRemaining === 3 || timeRemaining === 2 || timeRemaining === 1) {
        playBeep(600, 0.1);
      } else if (timeRemaining === 0) {
        playBeep(1200, 0.3); // High celebratory beep
      }
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining, isPaused]);

  const percentage = Math.min(
    Math.round(((totalTime - timeRemaining) / (totalTime || 1)) * 100),
    100
  );

  return (
    <div
      style={{
        borderRadius: '24px',
        padding: '32px 24px',
        textAlign: 'center',
        color: '#ffffff',
        background: isResting
          ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
          : 'radial-gradient(600px 300px at 90% -20%, rgba(139,195,74,0.25), transparent 60%), linear-gradient(135deg, #0f5e5a 0%, #0a3d3a 100%)',
        boxShadow: '0 18px 45px rgba(14, 159, 110, 0.20)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span
          style={{
            fontSize: '0.78rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isResting ? '🧘 Intervalo de Descanso' : '⚡ Execução em Andamento'}
        </span>

        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#bfe9d5',
          }}
        >
          {isPaused ? '⏸️ Pausado' : '▶️ Em execução'}
        </span>
      </div>

      {/* Big Circular Counter */}
      <div style={{ position: 'relative', width: '180px', height: '180px', margin: '16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg className="ring" width="180" height="180" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r="75"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="12"
          />
          <circle
            cx="90"
            cy="90"
            r="75"
            fill="none"
            stroke={isResting ? '#fde68a' : '#a9e34b'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={471}
            strokeDashoffset={471 - (percentage / 100) * 471}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: '3.6rem',
              lineHeight: 1,
              color: '#ffffff',
            }}
          >
            {timeRemaining}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#bfe9d5',
              marginTop: '4px',
            }}
          >
            segundos
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
        <button
          type="button"
          onClick={onTogglePause}
          className="btn"
          style={{
            background: '#ffffff',
            color: '#12352f',
            padding: '12px 28px',
            fontSize: '0.95rem',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          {isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="btn"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '12px 22px',
            fontSize: '0.95rem',
          }}
        >
          Pular ⏩
        </button>
      </div>
    </div>
  );
}
