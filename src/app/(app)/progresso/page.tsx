// ============================================
// Página de Progresso & Conquistas — Mindfit Reference Design
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
    <div>
      {/* Header */}
      <h1 className="page-title">📈 Minha Evolução &amp; Conquistas</h1>
      <p className="page-sub">
        Acompanhe sua trajetória corporal, evolução de peso e galeria de medalhas desbloqueadas no Método 21 Dias.
      </p>

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
