// ============================================
// Meal Card Component — Mindfit Reference Design
// ============================================
'use client';

import { useState } from 'react';
import { TrafficLight } from './TrafficLight';
import { FoodSearch } from './FoodSearch';
import type { MealSection, MealType, LoggedFood } from '@/types/meal';

interface MealCardProps {
  meal: MealSection;
  icon: string;
  onAddFood: (mealType: MealType, food: LoggedFood) => void;
  onRemoveFood: (mealType: MealType, index: number) => void;
}

export function MealCard({
  meal,
  icon,
  onAddFood,
  onRemoveFood,
}: MealCardProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const bgIcons: Record<string, string> = {
    breakfast: '#fff4e0',
    lunch: '#e6f6ef',
    snack: '#fdeaea',
    dinner: '#e5f1fa',
  };

  return (
    <>
      <div className="meal">
        <div className="head">
          <div className="left">
            <div
              className="mic"
              style={{ background: bgIcons[meal.type] || '#e6f6ef' }}
            >
              {icon}
            </div>
            <div>
              <h4>{meal.title}</h4>
              <div className="items-lbl">
                {meal.foods.length} {meal.foods.length === 1 ? 'item' : 'itens'} adicionado
                {meal.foods.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="kcal">{meal.totalCalories} kcal</div>
            <div className="macros-mini">
              P: {Math.round(meal.totalProtein)}g • C: {Math.round(meal.totalCarbs)}g • G:{' '}
              {Math.round(meal.totalFat)}g
            </div>
          </div>
        </div>

        {meal.foods.length > 0 ? (
          <div className="food-list">
            {meal.foods.map((food, index) => (
              <div key={`${food.foodId}-${index}`} className="food-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrafficLight color={food.trafficLight} showLabel={false} />
                  <span>
                    <b>{food.name}</b> ({food.quantityG}g) ·{' '}
                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>
                      {food.calories} kcal
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFood(meal.type, index)}
                  className="del"
                  title="Remover"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">Nenhum alimento registrado ainda nesta refeição.</div>
        )}

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="add-food"
        >
          ➕ Adicionar Alimento
        </button>
      </div>

      {/* Food Search Modal */}
      <FoodSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        mealType={meal.type}
        mealTitle={meal.title}
        onAddFood={onAddFood}
      />
    </>
  );
}
