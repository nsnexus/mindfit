// ============================================
// Diário Alimentar & Hidratação
// ============================================
'use client';

import { useState } from 'react';
import { useMeals } from '@/hooks/useMeals';
import { useAuthStore } from '@/stores/authStore';
import { CalorieTracker } from '@/components/nutrition/CalorieTracker';
import { MacroChart } from '@/components/nutrition/MacroChart';
import { MealCard } from '@/components/nutrition/MealCard';
import { Card, Button, Input, Progress } from '@/components/ui';
import { formatDate, getTodayString } from '@/lib/utils';

export default function DiarioPage() {
  const { appUser } = useAuthStore();
  const {
    selectedDate,
    setSelectedDate,
    dailyLog,
    addFood,
    removeFood,
    addWater,
    logWeight,
  } = useMeals();

  const [weightInput, setWeightInput] = useState('');
  const [weightSaved, setWeightSaved] = useState(false);

  // Targets default to 2000 kcal if profile not loaded yet
  const targetCalories = 1800;
  const targetMacros = {
    protein: 135,
    carbs: 180,
    fat: 60,
  };

  const waterTargetMl = 2500;
  const waterPercent = Math.min(Math.round((dailyLog.waterMl / waterTargetMl) * 100), 100);

  // Date Navigation
  const changeDay = (offset: number) => {
    const current = new Date(selectedDate + 'T12:00:00');
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === getTodayString();

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;
    logWeight(Number(weightInput));
    setWeightSaved(true);
    setTimeout(() => setWeightSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Diário Alimentar 📝
          </h1>
          <p className="text-neutral-500 text-sm">
            Registre suas refeições diárias e monitore seu balanço calórico.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => changeDay(-1)}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
            title="Dia anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-xs sm:text-sm font-semibold text-neutral-800 px-3 min-w-[140px] text-center">
            {isToday ? `Hoje, ${formatDate(selectedDate)}` : formatDate(selectedDate)}
          </span>

          <button
            type="button"
            onClick={() => changeDay(1)}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
            title="Próximo dia"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calorie Gauge */}
      <CalorieTracker
        consumedCalories={dailyLog.totalCalories}
        targetCalories={targetCalories}
      />

      {/* Macronutrient Tracking */}
      <MacroChart
        current={{
          protein: dailyLog.totalProtein,
          carbs: dailyLog.totalCarbs,
          fat: dailyLog.totalFat,
        }}
        target={targetMacros}
      />

      {/* Water & Weight Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Tracker */}
        <Card padding="md">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💧</span>
              <div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  Registro de Água
                </h3>
                <p className="text-xs text-neutral-400">Meta: {waterTargetMl} ml / dia</p>
              </div>
            </div>
            <span className="text-base font-extrabold text-blue-600 font-[var(--font-heading)]">
              {dailyLog.waterMl} ml
            </span>
          </div>

          <div className="py-4">
            <Progress
              value={dailyLog.waterMl}
              max={waterTargetMl}
              color="accent"
              size="md"
              showLabel
            />
          </div>

          {/* Quick Add Water Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(250)}
              className="text-xs"
            >
              +250 ml 🥤
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(500)}
              className="text-xs"
            >
              +500 ml 🍶
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(1000)}
              className="text-xs"
            >
              +1 Litro 💧
            </Button>
          </div>
        </Card>

        {/* Daily Weight Check-in */}
        <Card padding="md">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="text-2xl">⚖️</span>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                Peso do Dia
              </h3>
              <p className="text-xs text-neutral-400">
                {dailyLog.weight
                  ? `Registrado hoje: ${dailyLog.weight} kg`
                  : 'Nenhum peso registrado hoje'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveWeight} className="py-4 flex gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder={dailyLog.weight ? String(dailyLog.weight) : 'Ex: 68.5'}
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              rightIcon={<span className="text-xs font-semibold text-neutral-400">kg</span>}
            />
            <Button type="submit" size="md">
              Salvar
            </Button>
          </form>

          {weightSaved && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              ✓ Peso salvo com sucesso no seu histórico!
            </p>
          )}
        </Card>
      </div>

      {/* 4 Meal Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Refeições de Hoje</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MealCard
            meal={dailyLog.meals.breakfast}
            icon="🍳"
            onAddFood={addFood}
            onRemoveFood={removeFood}
          />
          <MealCard
            meal={dailyLog.meals.lunch}
            icon="🥗"
            onAddFood={addFood}
            onRemoveFood={removeFood}
          />
          <MealCard
            meal={dailyLog.meals.snack}
            icon="🍎"
            onAddFood={addFood}
            onRemoveFood={removeFood}
          />
          <MealCard
            meal={dailyLog.meals.dinner}
            icon="🍲"
            onAddFood={addFood}
            onRemoveFood={removeFood}
          />
        </div>
      </div>
    </div>
  );
}
