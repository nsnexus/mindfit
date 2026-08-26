// ============================================
// useOnboarding Hook
// ============================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { setSubDocument, updateDocument, serverTimestamp } from '@/lib/firebase/firestore';
import { ROUTES } from '@/constants/routes';

export function useOnboarding() {
  const router = useRouter();
  const { firebaseUser, setAppUser, appUser } = useAuthStore();
  const store = useOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProfileAndFinish = async () => {
    if (!firebaseUser) {
      setError('Usuário não autenticado. Por favor, faça login.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const results = store.getResults();
      const profileData = {
        age: store.data.age,
        sex: store.data.sex,
        weight: store.data.weight,
        height: store.data.height,
        goalWeight: store.data.goalWeight,
        activityLevel: store.data.activityLevel,
        objective: store.data.objective,
        dietaryRestrictions: store.data.dietaryRestrictions,
        workoutPreference: store.data.workoutPreference,
        tmb: results.tmb,
        get: results.get,
        dailyCalorieTarget: results.calorieTarget,
        macros: results.macros,
        currentPhase: 1,
        currentDay: 1,
        cycleStartDate: serverTimestamp(),
      };

      // Salva na subcoleção profile
      await setSubDocument('users', firebaseUser.uid, 'profile', 'current', profileData);

      // Atualiza flag no documento do usuário
      await updateDocument('users', firebaseUser.uid, {
        onboardingCompleted: true,
      });

      // Atualiza o estado local
      if (appUser) {
        setAppUser({ ...appUser, onboardingCompleted: true });
      }

      // Redireciona para o dashboard
      router.push(ROUTES.DASHBOARD);
    } catch (err: any) {
      console.error('Erro ao salvar onboarding:', err);
      setError('Houve uma falha ao salvar seus dados. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    ...store,
    isSaving,
    error,
    saveProfileAndFinish,
  };
}
