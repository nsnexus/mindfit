// ============================================
// useMeals Hook — Diário Alimentar & Hidratação
// ============================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getSubDocument, setSubDocument } from '@/lib/firebase/firestore';
import { getTodayString } from '@/lib/utils';
import type { DailyLogData, MealType, LoggedFood, MealSection } from '@/types/meal';

const createEmptyDayLog = (date: string): DailyLogData => ({
  date,
  meals: {
    breakfast: { type: 'breakfast', title: 'Café da Manhã', foods: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    lunch: { type: 'lunch', title: 'Almoço', foods: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    snack: { type: 'snack', title: 'Lanche da Tarde', foods: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
    dinner: { type: 'dinner', title: 'Jantar', foods: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
  },
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
  waterMl: 0,
  workoutCompleted: false,
});

export function useMeals(initialDate = getTodayString()) {
  const { firebaseUser } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dailyLog, setDailyLog] = useState<DailyLogData>(createEmptyDayLog(initialDate));
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados do dia
  const loadDayLog = useCallback(async (date: string) => {
    if (!firebaseUser) return;
    setIsLoading(true);

    try {
      const doc = await getSubDocument<DailyLogData>('users', firebaseUser.uid, 'dailyLogs', date);
      if (doc) {
        setDailyLog({
          ...createEmptyDayLog(date),
          ...doc,
        });
      } else {
        setDailyLog(createEmptyDayLog(date));
      }
    } catch (err) {
      console.error('Erro ao carregar log diário:', err);
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    loadDayLog(selectedDate);
  }, [selectedDate, loadDayLog]);

  // Salva no Firestore
  const persistLog = async (updatedLog: DailyLogData) => {
    setDailyLog(updatedLog);
    if (!firebaseUser) return;

    try {
      await setSubDocument('users', firebaseUser.uid, 'dailyLogs', updatedLog.date, updatedLog);
    } catch (err) {
      console.error('Erro ao salvar no Firestore:', err);
    }
  };

  // Recalcula totais de uma refeição
  const recalculateMeal = (foods: LoggedFood[]): {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  } => {
    return foods.reduce(
      (acc, f) => ({
        totalCalories: acc.totalCalories + f.calories,
        totalProtein: acc.totalProtein + f.protein,
        totalCarbs: acc.totalCarbs + f.carbs,
        totalFat: acc.totalFat + f.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
  };

  // Recalcula totais do dia
  const recalculateDay = (meals: Record<MealType, MealSection>) => {
    const mealList = Object.values(meals);
    return {
      totalCalories: mealList.reduce((acc, m) => acc + m.totalCalories, 0),
      totalProtein: Math.round(mealList.reduce((acc, m) => acc + m.totalProtein, 0) * 10) / 10,
      totalCarbs: Math.round(mealList.reduce((acc, m) => acc + m.totalCarbs, 0) * 10) / 10,
      totalFat: Math.round(mealList.reduce((acc, m) => acc + m.totalFat, 0) * 10) / 10,
    };
  };

  // Adicionar alimento
  const addFood = (mealType: MealType, food: LoggedFood) => {
    const currentMeal = dailyLog.meals[mealType];
    const newFoods = [...currentMeal.foods, food];
    const mealTotals = recalculateMeal(newFoods);

    const updatedMeals = {
      ...dailyLog.meals,
      [mealType]: {
        ...currentMeal,
        foods: newFoods,
        ...mealTotals,
      },
    };

    const dayTotals = recalculateDay(updatedMeals);
    const updatedLog: DailyLogData = {
      ...dailyLog,
      meals: updatedMeals,
      ...dayTotals,
    };

    persistLog(updatedLog);
  };

  // Remover alimento
  const removeFood = (mealType: MealType, index: number) => {
    const currentMeal = dailyLog.meals[mealType];
    const newFoods = currentMeal.foods.filter((_, i) => i !== index);
    const mealTotals = recalculateMeal(newFoods);

    const updatedMeals = {
      ...dailyLog.meals,
      [mealType]: {
        ...currentMeal,
        foods: newFoods,
        ...mealTotals,
      },
    };

    const dayTotals = recalculateDay(updatedMeals);
    const updatedLog: DailyLogData = {
      ...dailyLog,
      meals: updatedMeals,
      ...dayTotals,
    };

    persistLog(updatedLog);
  };

  // Hidratação (adicionar água em ml)
  const addWater = (amountMl: number) => {
    const updatedLog: DailyLogData = {
      ...dailyLog,
      waterMl: Math.max(0, dailyLog.waterMl + amountMl),
    };
    persistLog(updatedLog);
  };

  // Registrar peso do dia
  const logWeight = (weight: number) => {
    const updatedLog: DailyLogData = {
      ...dailyLog,
      weight,
    };
    persistLog(updatedLog);
  };

  return {
    selectedDate,
    setSelectedDate,
    dailyLog,
    isLoading,
    addFood,
    removeFood,
    addWater,
    logWeight,
  };
}
