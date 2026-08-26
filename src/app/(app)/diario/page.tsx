// ============================================
// Diário Alimentar & Hidratação — Mindfit Official
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
import { Progress } from '@/components/ui';
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="pill text-xs">
              🍽️ Nutrição Consciente
            </span>
          </div>
          <h1 className="font-head text-3xl sm:text-4xl font-extrabold text-[#12352f] tracking-tight">
            Diário <span className="gradient-text">Alimentar</span>
          </h1>
          <p className="text-[#5b7a72] text-xs sm:text-sm mt-1">
            Registre suas refeições diárias e monitore seu balanço calórico em tempo real.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-[#e2f2ea] shadow-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => changeDay(-1)}
            className="p-2 rounded-full text-[#5b7a72] hover:text-[#0e9f6e] hover:bg-[#f5faf7] transition-colors cursor-pointer"
            title="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs sm:text-sm font-head font-extrabold text-[#12352f] px-3 min-w-[140px] text-center flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0e9f6e]" />
            {isToday ? `Hoje, ${formatDate(selectedDate)}` : formatDate(selectedDate)}
          </span>

          <button
            type="button"
            onClick={() => changeDay(1)}
            className="p-2 rounded-full text-[#5b7a72] hover:text-[#0e9f6e] hover:bg-[#f5faf7] transition-colors cursor-pointer"
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
        <div className="bg-white rounded-3xl border border-[#e2f2ea] p-6 shadow-[0_8px_25px_rgba(14,159,110,0.06)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#eef4f1]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-xs">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-head font-extrabold text-[#12352f] text-base">
                    Registro de Água
                  </h3>
                  <p className="text-xs text-[#5b7a72] font-medium">Meta: {waterTargetMl} ml / dia</p>
                </div>
              </div>
              <span className="text-base font-extrabold font-head text-[#0e9f6e]">
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

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#eef4f1]">
            <button
              type="button"
              onClick={() => addWater(250)}
              className="btn btn-ghost py-2.5 px-2 text-xs font-bold"
            >
              +250 ml 🥤
            </button>
            <button
              type="button"
              onClick={() => addWater(500)}
              className="btn btn-ghost py-2.5 px-2 text-xs font-bold"
            >
              +500 ml 🍶
            </button>
            <button
              type="button"
              onClick={() => addWater(1000)}
              className="btn btn-ghost py-2.5 px-2 text-xs font-bold"
            >
              +1L 💧
            </button>
          </div>
        </div>

        {/* Daily Weight Check-in */}
        <div className="bg-white rounded-3xl border border-[#e2f2ea] p-6 shadow-[0_8px_25px_rgba(14,159,110,0.06)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 pb-3.5 border-b border-[#eef4f1]">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-head font-extrabold text-[#12352f] text-base">
                  Peso do Dia
                </h3>
                <p className="text-xs text-[#5b7a72] font-medium">
                  {dailyLog.weight
                    ? `Registrado hoje: ${dailyLog.weight} kg`
                    : 'Nenhum peso registrado hoje'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveWeight} className="py-4 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  placeholder={dailyLog.weight ? String(dailyLog.weight) : 'Ex: 68.5'}
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full h-11 px-4 bg-[#f5faf7] border border-[#e2f2ea] rounded-2xl text-sm font-medium text-[#12352f] placeholder:text-neutral-400 focus:outline-none focus:border-[#0e9f6e] focus:bg-white focus:ring-4 focus:ring-[#0e9f6e]/10 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-head font-bold text-[#5b7a72]">
                  kg
                </span>
              </div>
              <button
                type="submit"
                className="btn btn-primary px-5 h-11 text-xs font-bold shrink-0 cursor-pointer"
              >
                Salvar Peso
              </button>
            </form>
          </div>

          {weightSaved && (
            <p className="text-xs text-[#0f5e5a] bg-[#e6f6ef] px-3.5 py-2 rounded-2xl border border-[#c9eee0] font-head font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#0e9f6e]" />
              Peso registrado com sucesso no seu histórico!
            </p>
          )}
        </div>
      </div>

      {/* 4 Meal Cards Grid */}
      <div className="space-y-4">
        <h2 className="font-head text-xl font-extrabold text-[#12352f] flex items-center gap-2">
          <span>Refeições do Dia</span>
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

