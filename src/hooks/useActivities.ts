// ============================================
// useActivities — histórico de atividades rastreadas (Firestore)
// ============================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  getSubDocuments,
  getSubDocument,
  setSubDocument,
  deleteDocument,
  serverTimestamp,
} from '@/lib/firebase/firestore';
import type { Activity, ActivityType, RoutePoint } from '@/types/activity';

interface SaveActivityInput {
  type: ActivityType;
  distanceMeters: number;
  durationSeconds: number;
  avgSpeedKmh: number;
  calories: number;
  route: RoutePoint[];
  startedAt: string;
}

export function useActivities() {
  const { firebaseUser } = useAuthStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userUid = firebaseUser?.uid;

  const load = useCallback(async () => {
    if (!userUid) {
      setActivities([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const list = await getSubDocuments<Activity>('users', userUid, 'activities');
    list.sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
    setActivities(list);
    setIsLoading(false);
  }, [userUid]);

  useEffect(() => {
    load();
  }, [load]);

  const saveActivity = useCallback(
    async (input: SaveActivityInput) => {
      if (!userUid) return null;
      const id = `act_${Date.now()}`;
      const activity: Omit<Activity, 'id'> = {
        userId: userUid,
        type: input.type,
        startedAt: input.startedAt,
        endedAt: new Date().toISOString(),
        durationSeconds: input.durationSeconds,
        distanceMeters: input.distanceMeters,
        avgSpeedKmh: input.avgSpeedKmh,
        calories: input.calories,
        route: input.route,
      };
      await setSubDocument('users', userUid, 'activities', id, {
        ...activity,
        createdAt: await serverTimestamp(),
      });
      await load();
      return id;
    },
    [userUid, load]
  );

  const getActivity = useCallback(
    async (id: string) => {
      if (!userUid) return null;
      return getSubDocument<Activity>('users', userUid, 'activities', id);
    },
    [userUid]
  );

  const removeActivity = useCallback(
    async (id: string) => {
      if (!userUid) return;
      await deleteDocument(`users/${userUid}/activities`, id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    },
    [userUid]
  );

  const totals = activities.reduce(
    (acc, a) => ({
      distanceMeters: acc.distanceMeters + (a.distanceMeters || 0),
      durationSeconds: acc.durationSeconds + (a.durationSeconds || 0),
      calories: acc.calories + (a.calories || 0),
    }),
    { distanceMeters: 0, durationSeconds: 0, calories: 0 }
  );

  return {
    activities,
    isLoading,
    totals,
    saveActivity,
    getActivity,
    removeActivity,
    refresh: load,
  };
}
