// ============================================
// Diário Alimentar & Hidratação — Mindfit Reference Design
// ============================================
'use client';

import { useState } from 'react';
import { useMeals } from '@/hooks/useMeals';
import { CalorieTracker } from '@/components/nutrition/CalorieTracker';
import { MacroChart } from '@/components/nutrition/MacroChart';
import { MealCard } from '@/components/nutrition/MealCard';
import { formatDate, getTodayString } from '@/lib/utils';

export default function DiarioPage() {
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
  const waterPercentage = Math.min(Math.round((dailyLog.waterMl / waterTargetMl) * 100), 100);

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
    <div>
      {/* Header & Date Nav */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div>
          <h1 className="page-title">🍽️ Diário Alimentar</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            Registre suas refeições diárias e monitore seu balanço calórico em tempo real.
          </p>
        </div>
        <div className="date-nav">
          <button type="button" onClick={() => changeDay(-1)} title="Dia anterior">
            ‹
          </button>
          <span className="lbl">
            📅 {isToday ? `Hoje, ${formatDate(selectedDate)}` : formatDate(selectedDate)}
          </span>
          <button type="button" onClick={() => changeDay(1)} title="Próximo dia">
            ›
          </button>
        </div>
      </div>

      {/* Calorie Hero Tracker */}
      <CalorieTracker
        consumedCalories={dailyLog.totalCalories}
        targetCalories={targetCalories}
      />

      {/* Macros Tracker */}
      <div style={{ marginBottom: '24px' }}>
        <MacroChart
          current={{
            protein: dailyLog.totalProtein,
            carbs: dailyLog.totalCarbs,
            fat: dailyLog.totalFat,
          }}
          target={targetMacros}
        />
      </div>

      {/* Water and Weight Quick Log Grid */}
      <div className="grid g-2" style={{ marginBottom: '24px' }}>
        {/* Hydration Card */}
        <div className="card hydro">
          <div className="row">
            <b
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              💧 Registro de Água
            </b>
            <span className="amt">
              <span>{dailyLog.waterMl}</span> ml
            </span>
          </div>
          <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
            Meta: {waterTargetMl} ml / dia
          </span>
          <div className="bar" style={{ marginTop: '10px' }}>
            <i
              style={{
                width: `${waterPercentage}%`,
                background: 'linear-gradient(90deg, #2f89c5, #1aa8a0)',
              }}
            ></i>
          </div>
          <div className="btns three">
            <button onClick={() => addWater(250)}>+250 ml 🥤</button>
            <button onClick={() => addWater(500)}>+500 ml 🚰</button>
            <button onClick={() => addWater(1000)}>+1 Litro 💧</button>
          </div>
        </div>

        {/* Weight Tracker Card */}
        <div className="card weight-card">
          <div className="wic">⚖️</div>
          <div style={{ flex: 1 }}>
            <b style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem' }}>
              Peso do Dia
            </b>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              {dailyLog.weight
                ? `Registrado hoje: ${dailyLog.weight} kg`
                : weightSaved
                ? '✅ Peso salvo com sucesso!'
                : 'Nenhum peso registrado hoje'}
            </div>
            <form onSubmit={handleSaveWeight} className="weight-input">
              <input
                type="number"
                step="0.1"
                placeholder={dailyLog.weight ? String(dailyLog.weight) : 'Ex: 68.5'}
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
              <span className="unit">kg</span>
              <button type="submit" className="btn btn-primary btn-sm">
                Salvar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <div className="section-title" style={{ fontSize: '1.35rem' }}>
        Refeições do Dia
      </div>
      <div className="grid g-2">
        <MealCard
          meal={dailyLog.meals.breakfast}
          icon="☕"
          onAddFood={addFood}
          onRemoveFood={removeFood}
        />
        <MealCard
          meal={dailyLog.meals.lunch}
          icon="🥘"
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
  );
}
