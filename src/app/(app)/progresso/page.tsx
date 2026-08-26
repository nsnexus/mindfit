// ============================================
// Página de Progresso & Conquistas — Mindfit Official
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="pill text-xs">
            📈 Resultados & Consistência
          </span>
        </div>
        <h1 className="font-head text-3xl sm:text-4xl font-extrabold text-[#12352f] tracking-tight">
          Minha <span className="gradient-text">Evolução & Conquistas</span>
        </h1>
        <p className="text-[#5b7a72] text-xs sm:text-sm mt-1">
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
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-head text-lg font-extrabold text-[#12352f]">
                Quadro de Conquistas & Medalhas
              </h2>
              <p className="text-xs text-[#5b7a72] font-medium">
                Marcos de consistência desbloqueados ao longo das 3 fases.
              </p>
            </div>
          </div>
          <span className="pill text-xs font-head font-bold">
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

