// ============================================
// Streak Counter Component com "Freeze Gentil"
// ============================================
'use client';

import { Card, Badge } from '@/components/ui';
import type { StreakInfo } from '@/types/progress';

interface StreakCounterProps {
  streak: StreakInfo;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <Card variant="elevated" className="bg-gradient-hero text-white p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Side: Flame & Numbers */}
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-4xl shadow-inner flex-shrink-0 animate-bounce-in">
            🔥
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-primary-300 block">
              Sequência de Consistência
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-[var(--font-heading)]">
                {streak.currentStreak}
              </span>
              <span className="text-primary-200 font-bold text-lg">
                {streak.currentStreak === 1 ? 'Dia Seguido' : 'Dias Seguidos'}
              </span>
            </div>
            <p className="text-xs text-primary-200 mt-1">
              Recorde pessoal: <strong>{streak.longestStreak} dias consecutivos</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Freeze Gentil Widget */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center sm:text-right max-w-xs">
          <div className="flex items-center justify-center sm:justify-end gap-1.5 mb-1">
            <span className="text-base">🧊</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Freeze Gentil
            </span>
          </div>

          <p className="text-[11px] text-primary-100 leading-snug">
            Você tem <strong>{streak.freezesAvailable} perdões de descanso</strong> disponíveis neste ciclo de 21 dias.
          </p>

          <span className="inline-block mt-2 text-[10px] text-emerald-300 font-semibold bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            ✓ Sem culpa: descansar também é cuidar
          </span>
        </div>
      </div>
    </Card>
  );
}
