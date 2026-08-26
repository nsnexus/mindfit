// ============================================
// Streak Counter Component com "Freeze Gentil" — Mindfit
// ============================================
'use client';

import { Flame, Shield, Sparkles, Snowflake } from 'lucide-react';
import type { StreakInfo } from '@/types/progress';

interface StreakCounterProps {
  streak: StreakInfo;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 text-white shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Side: Flame & Numbers */}
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300/50 flex items-center justify-center shadow-xl shadow-amber-500/25 flex-shrink-0 animate-pulse-subtle">
            <Flame className="w-9 h-9 sm:w-10 sm:h-10 text-neutral-950 fill-neutral-950" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Sequência de Consistência
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-0.5">
              <span className="text-4xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
                {streak.currentStreak}
              </span>
              <span className="text-emerald-300 font-bold text-base sm:text-lg">
                {streak.currentStreak === 1 ? 'Dia Ativo' : 'Dias Ativos'}
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              Recorde pessoal: <strong className="text-white">{streak.longestStreak} dias consecutivos</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Freeze Gentil Widget */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center sm:text-right max-w-xs space-y-1.5">
          <div className="flex items-center justify-center sm:justify-end gap-1.5">
            <Snowflake className="w-4 h-4 text-cyan-300" />
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Freeze Gentil
            </span>
          </div>

          <p className="text-[11px] text-neutral-200 leading-snug">
            Você possui <strong>{streak.freezesAvailable} perdões de descanso</strong> disponíveis neste ciclo de 21 dias.
          </p>

          <span className="inline-block text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            ✓ Sem culpa: descansar também faz parte do plano
          </span>
        </div>
      </div>
    </div>
  );
}
