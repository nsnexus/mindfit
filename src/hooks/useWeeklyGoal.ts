// ============================================
// useWeeklyGoal — meta semanal de distância (km) baseada nas atividades rastreadas
// ============================================
'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getSubDocument, setSubDocument } from '@/lib/firebase/firestore';
import type { Activity } from '@/types/activity';

const DEFAULT_GOAL_KM = 15;

/**
 * Início (segunda-feira, 00:00) da semana corrente.
 */
function startOfWeek(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day; // volta pra segunda-feira
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function useWeeklyGoal(activities: Activity[]) {
  const { firebaseUser } = useAuthStore();
  const [goalKm, setGoalKm] = useState(DEFAULT_GOAL_KM);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!firebaseUser) {
      setIsLoaded(true);
      return;
    }
    getSubDocument<{ weeklyDistanceGoalKm?: number }>('users', firebaseUser.uid, 'profile', 'current').then((p) => {
      if (p?.weeklyDistanceGoalKm) setGoalKm(p.weeklyDistanceGoalKm);
      setIsLoaded(true);
    });
  }, [firebaseUser]);

  const weekDistanceMeters = useMemo(() => {
    const weekStart = startOfWeek();
    return activities
      .filter((a) => new Date(a.startedAt) >= weekStart)
      .reduce((sum, a) => sum + (a.distanceMeters || 0), 0);
  }, [activities]);

  const weekDistanceKm = weekDistanceMeters / 1000;
  const progressPercent = goalKm > 0 ? Math.min(100, Math.round((weekDistanceKm / goalKm) * 100)) : 0;

  const updateGoal = useCallback(
    async (newGoalKm: number) => {
      setGoalKm(newGoalKm);
      if (!firebaseUser) return;
      await setSubDocument('users', firebaseUser.uid, 'profile', 'current', {
        weeklyDistanceGoalKm: newGoalKm,
      });
    },
    [firebaseUser]
  );

  return {
    goalKm,
    weekDistanceKm,
    progressPercent,
    isLoaded,
    updateGoal,
  };
}
