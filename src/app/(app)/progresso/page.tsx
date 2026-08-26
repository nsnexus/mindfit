// ============================================
// Página de Progresso & Conquistas — Mindfit Real Data
// ============================================
'use client';

import { useProgress } from '@/hooks/useProgress';
import { StreakCounter } from '@/components/progress/StreakCounter';
import { WeightChart } from '@/components/progress/WeightChart';
import { PhotoComparison } from '@/components/progress/PhotoComparison';
import { AchievementBadge } from '@/components/progress/AchievementBadge';

export default function ProgressoPage() {
  const { profile, streakInfo, entries, badges, isLoading } = useProgress();

  const startWeight = profile?.weight || 0;
  const goalWeight = profile?.goalWeight || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <h1 className="page-title">📈 Minha Evolução &amp; Conquistas</h1>
      <p className="page-sub">
        Acompanhe sua trajetória corporal, evolução de peso e galeria de medalhas desbloqueadas no Método 21 Dias.
      </p>

      {/* Streak Counter & Freeze Gentil com dados reais */}
      <StreakCounter streak={streakInfo} />

      {/* Weight Progress Chart com dados reais */}
      <WeightChart
        entries={entries}
        startWeight={startWeight}
        goalWeight={goalWeight}
      />

      {/* Photo Comparison (Antes & Depois) */}
      <PhotoComparison />

      {/* Badges / Conquistas com dados reais */}
      <div className="section-title" style={{ fontSize: '1.35rem' }}>
        🏅 Galeria de Conquistas
      </div>
      <div className="medals">
        {badges.map((badge) => (
          <AchievementBadge key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}
