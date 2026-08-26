// ============================================
// Diário Alimentar & Hidratação — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import {
  UtensilsCrossed,
  Droplets,
  Scale,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
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

  const targetCalories = 1800;
  const targetMacros = {
    protein: 135,
    carbs: 180,
    fat: 60,
  };

  const waterTargetMl = 2500;

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
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <UtensilsCrossed className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
              Diário Alimentar
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Registre suas refeições diárias e monitore seu balanço calórico em tempo real.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-neutral-200/80 shadow-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => changeDay(-1)}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs sm:text-sm font-bold text-neutral-800 px-3 min-w-[140px] text-center flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            {isToday ? `Hoje, ${formatDate(selectedDate)}` : formatDate(selectedDate)}
          </span>

          <button
            type="button"
            onClick={() => changeDay(1)}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Próximo dia"
          >
            <ChevronRight className="w-4 h-4" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Water Tracker */}
        <Card padding="md" className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                    Registro de Água
                  </h3>
                  <p className="text-xs text-neutral-400">Meta: {waterTargetMl} ml / dia</p>
                </div>
              </div>
              <span className="text-base font-black text-blue-600 font-[var(--font-heading)]">
                {dailyLog.waterMl} ml
              </span>
            </div>

            <div className="py-4">
              <Progress
                value={dailyLog.waterMl}
                max={waterTargetMl}
                color="info"
                size="md"
                showLabel
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(250)}
              className="text-xs font-bold"
            >
              +250 ml 🥤
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(500)}
              className="text-xs font-bold"
            >
              +500 ml 🍶
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(1000)}
              className="text-xs font-bold"
            >
              +1 Litro 💧
            </Button>
          </div>
        </Card>

        {/* Daily Weight Check-in */}
        <Card padding="md" className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
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
                rightIcon={<span className="text-xs font-bold text-neutral-400">kg</span>}
              />
              <Button type="submit" size="md" className="font-bold shrink-0">
                Salvar
              </Button>
            </form>
          </div>

          {weightSaved && (
            <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Peso salvo com sucesso no seu histórico!
            </p>
          )}
        </Card>
      </div>

      {/* 4 Meal Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black font-[var(--font-heading)] text-neutral-900">
          Refeições do Dia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
