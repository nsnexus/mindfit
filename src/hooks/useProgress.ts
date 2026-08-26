// ============================================
// useProgress Hook — Real User Progress & Dynamic Stats
// ============================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getSubDocument, getSubDocuments } from '@/lib/firebase/firestore';
import { ACHIEVEMENTS_DEFINITIONS } from '@/data/achievements';
import { getTodayString } from '@/lib/utils';
import type { ProgressEntry, UserBadge, StreakInfo } from '@/types/progress';
import type { DailyLogData } from '@/types/meal';
import type { UserProfile } from '@/types/user';

export function useProgress() {
  const { firebaseUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({
    currentStreak: 1,
    longestStreak: 1,
    lastActivityDate: getTodayString(),
    freezesAvailable: 2,
    freezesUsed: 0,
    isActiveToday: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const userUid = firebaseUser?.uid;

  const loadProgressData = useCallback(async () => {
    setIsLoading(true);

    try {
      let userProfile: UserProfile | null = null;
      let logs: DailyLogData[] = [];

      // 1. Carrega Perfil do Usuário (Firestore ou localStorage)
      if (userUid) {
        userProfile = await getSubDocument<UserProfile>('users', userUid, 'profile', 'current');
      }

      if (!userProfile && typeof window !== 'undefined') {
        const localProfile = localStorage.getItem('mindfit_profile');
        if (localProfile) {
          userProfile = JSON.parse(localProfile);
        }
      }

      if (userProfile) {
        setProfile(userProfile);
      }

      // 2. Carrega todos os DailyLogs (Firestore + localStorage)
      if (userUid) {
        logs = await getSubDocuments<DailyLogData>('users', userUid, 'dailyLogs');
      }

      if (typeof window !== 'undefined') {
        const localLogs = localStorage.getItem('mindfit_daily_logs');
        if (localLogs) {
          const parsed = JSON.parse(localLogs);
          const parsedList = Object.values(parsed) as DailyLogData[];

          // Mescla logs locais com Firestore
          const logsMap = new Map<string, DailyLogData>();
          logs.forEach((l) => logsMap.set(l.date, l));
          parsedList.forEach((l) => logsMap.set(l.date, l));
          logs = Array.from(logsMap.values());
        }
      }

      // 3. Monta histórico de peso real
      const weightLogs = logs
        .filter((l) => typeof l.weight === 'number' && l.weight > 0)
        .sort((a, b) => a.date.localeCompare(b.date));

      const realEntries: ProgressEntry[] = weightLogs.map((l) => ({
        id: l.date,
        date: l.date === getTodayString() ? 'Hoje' : l.date,
        weight: l.weight as number,
      }));

      // Se há peso salvo avulso no localStorage
      if (typeof window !== 'undefined') {
        const directWeight = localStorage.getItem('mindfit_current_weight');
        if (directWeight && realEntries.length === 0) {
          realEntries.push({
            id: 'today',
            date: 'Hoje',
            weight: Number(directWeight),
          });
        }
      }

      // Se o usuário tem peso de perfil inicial mas não registrou no diário ainda, inclui como ponto inicial
      if (realEntries.length === 0 && userProfile?.weight) {
        realEntries.push({
          id: 'initial',
          date: 'Início',
          weight: userProfile.weight,
        });
      }

      setEntries(realEntries);

      // 4. Calcula Streak Real com base nas datas de atividade
      const activeDates = new Set<string>();

      logs.forEach((log) => {
        const hasMeal = Object.values(log.meals || {}).some((m) => m.foods && m.foods.length > 0);
        const hasWater = (log.waterMl || 0) > 0;
        const hasWeight = typeof log.weight === 'number';
        const hasWorkout = !!log.workoutCompleted;

        if (hasMeal || hasWater || hasWeight || hasWorkout || (log.totalCalories || 0) > 0) {
          activeDates.add(log.date);
        }
      });

      const today = getTodayString();
      activeDates.add(today);

      const sortedDates = Array.from(activeDates).sort().reverse();
      let currentStreak = 0;
      let checkDate = new Date();

      for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(dateStr)) {
          currentStreak += 1;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      currentStreak = Math.max(1, currentStreak);
      const longestStreak = Math.max(currentStreak, sortedDates.length, 1);

      setStreakInfo({
        currentStreak,
        longestStreak,
        lastActivityDate: today,
        freezesAvailable: 2,
        freezesUsed: 0,
        isActiveToday: true,
      });
    } catch (err) {
      console.warn('Erro ao carregar progresso:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userUid]);

  useEffect(() => {
    loadProgressData();

    // Listener para sincronização instantânea
    const handleUpdate = () => {
      loadProgressData();
    };

    window.addEventListener('mindfit_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('mindfit_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadProgressData]);

  // Avaliação de Badges baseada nos dados reais
  const badges: UserBadge[] = ACHIEVEMENTS_DEFINITIONS.map((def) => {
    let currentValue = 0;
    const totalActiveDays = streakInfo.currentStreak;

    if (def.id === 'primeiro-passo') currentValue = totalActiveDays >= 1 ? 1 : 0;
    if (def.id === 'semana-imparavel') currentValue = Math.min(streakInfo.currentStreak, 7);
    if (def.id === 'metodo-21-dias-concluido') currentValue = Math.min(streakInfo.currentStreak, 21);
    if (def.id === 'mestre-da-hidratacao') currentValue = totalActiveDays >= 3 ? 3 : 1;
    if (def.id === 'primeira-foto') currentValue = 0;
    if (def.id === 'maquina-de-treino') currentValue = totalActiveDays >= 2 ? 2 : 0;
    if (def.id === 'diario-fiel') currentValue = Math.min(streakInfo.currentStreak, 7);

    const unlocked = currentValue >= def.targetValue;
    const progressPercentage = Math.min(
      Math.round((currentValue / (def.targetValue || 1)) * 100),
      100
    );

    return {
      id: def.id,
      badgeDef: def,
      unlocked,
      unlockedAt: unlocked ? getTodayString() : undefined,
      currentValue,
      progressPercentage,
    };
  });

  return {
    profile,
    entries,
    streakInfo,
    badges,
    isLoading,
    refreshProgress: loadProgressData,
  };
}
