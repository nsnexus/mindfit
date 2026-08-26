// ============================================
// Página de Progresso & Conquistas
// ============================================
'use client';

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
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Minha Evolução & Conquistas 📊
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Acompanhe sua trajetória visual, histórico de peso e recompensas do Método 21 Dias.
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span>🏆</span>
              <span>Quadro de Medalhas & Conquistas</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Desbloqueie badges reais ao atingir marcos de consistência.
            </p>
          </div>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
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
