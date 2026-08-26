// ============================================
// Interactive Workout Timer Component
// Utiliza Web Audio API para bips sem dependência externa
// ============================================
'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui';

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
      className={`
        p-6 sm:p-8 rounded-3xl text-center text-white transition-all duration-500 shadow-elevated
        ${isResting ? 'bg-gradient-accent text-neutral-900' : 'bg-gradient-primary'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
          {isResting ? '🧘 Intervalo de Descanso' : '⚡ Execução em Andamento'}
        </span>

        <span className="text-xs font-semibold">
          {isPaused ? '⏸️ Pausado' : '▶️ Em execução'}
        </span>
      </div>

      {/* Big Circular Counter */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto my-4 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-white/20"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={isResting ? 'text-neutral-900' : 'text-white'}
            strokeDasharray={`${percentage}, 100`}
            strokeWidth="3"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl sm:text-6xl font-black font-[var(--font-heading)] leading-none tracking-tight">
            {timeRemaining}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider mt-1 opacity-80">
            segundos
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          type="button"
          onClick={onTogglePause}
          className={`
            px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2
            ${isResting
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'bg-white text-primary-800 hover:bg-white/90'
            }
          `}
        >
          {isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="px-5 py-3.5 rounded-2xl font-semibold text-sm bg-black/15 hover:bg-black/25 transition-all text-white active:scale-95"
        >
          Pular ⏩
        </button>
      </div>
    </div>
  );
}
