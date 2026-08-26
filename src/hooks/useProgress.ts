// ============================================
// useProgress Hook
// ============================================
'use client';

import { useState } from 'react';
import { ACHIEVEMENTS_DEFINITIONS } from '@/data/achievements';
import type { ProgressEntry, UserBadge, StreakInfo } from '@/types/progress';

export function useProgress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);

  const streakInfo: StreakInfo = {
    currentStreak: 4,
    longestStreak: 7,
    lastActivityDate: new Date().toISOString().split('T')[0],
    freezesAvailable: 2,
    freezesUsed: 0,
    isActiveToday: true,
  };

  // Evaluate user badges with realistic progress
  const badges: UserBadge[] = ACHIEVEMENTS_DEFINITIONS.map((def) => {
    let currentValue = 0;
    if (def.id === 'primeiro-passo') currentValue = 1;
    if (def.id === 'semana-imparavel') currentValue = 4;
    if (def.id === 'metodo-21-dias-concluido') currentValue = 4;
    if (def.id === 'mestre-da-hidratacao') currentValue = 3;
    if (def.id === 'primeira-foto') currentValue = 1;
    if (def.id === 'maquina-de-treino') currentValue = 3;
    if (def.id === 'diario-fiel') currentValue = 4;

    const unlocked = currentValue >= def.targetValue;
    const progressPercentage = Math.min(
      Math.round((currentValue / def.targetValue) * 100),
      100
    );

    return {
      id: def.id,
      badgeDef: def,
      unlocked,
      unlockedAt: unlocked ? '2026-08-26' : undefined,
      currentValue,
      progressPercentage,
    };
  });

  return {
    entries,
    streakInfo,
    badges,
  };
}
