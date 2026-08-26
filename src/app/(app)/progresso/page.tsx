// ============================================
// Página de Progresso & Conquistas — Mindfit
// ============================================
'use client';

import { LineChart, Trophy, Sparkles, Award } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { StreakCounter } from '@/components/progress/StreakCounter';
import { WeightChart } from '@/components/progress/WeightChart';
import { PhotoComparison } from '@/components/progress/PhotoComparison';
import { AchievementBadge } from '@/components/progress/AchievementBadge';

export default function ProgressoPage() {
  const { streakInfo, entries, badges } = useProgress();

  const startWeight = 72.5;
  const goalWeight = 65.0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
            <LineChart className="w-4.5 h-4.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
            Minha Evolução & Conquistas
          </h1>
        </div>
        <p className="text-neutral-500 text-sm sm:text-base">
          Acompanhe sua trajetória corporal, evolução de peso e galeria de medalhas desbloqueadas no Método 21 Dias.
        </p>
      </div>

      {/* Streak Counter & Freeze Gentil */}
      <StreakCounter streak={streakInfo} />

      {/* Weight Progress Chart */}
      <WeightChart
        entries={entries}
        startWeight={startWeight}
        goalWeight={goalWeight}
      />

      {/* Photo Comparison (Antes & Depois) */}
      <PhotoComparison />

      {/* Badges / Conquistas */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Trophy className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">
                Quadro de Conquistas & Medalhas
              </h2>
              <p className="text-xs text-neutral-400">
                Marcos de consistência desbloqueados ao longo das 3 fases.
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            {badges.filter((b) => b.unlocked).length} de {badges.length} Desbloqueadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <AchievementBadge key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </div>
  );
}
