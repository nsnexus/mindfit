// ============================================
// Meal Card Component (Café, Almoço, Jantar, Lanche)
// ============================================
'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';
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

  return (
    <>
      <Card padding="md" className="transition-all hover:shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                {meal.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {meal.foods.length} {meal.foods.length === 1 ? 'item' : 'itens'} registrados
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-extrabold text-primary-700 font-[var(--font-heading)]">
              {meal.totalCalories} kcal
            </span>
            <div className="flex gap-1.5 text-[10px] text-neutral-400 justify-end font-medium">
              <span>P: {Math.round(meal.totalProtein)}g</span>
              <span>•</span>
              <span>C: {Math.round(meal.totalCarbs)}g</span>
              <span>•</span>
              <span>G: {Math.round(meal.totalFat)}g</span>
            </div>
          </div>
        </div>

        {/* Logged Foods List */}
        <div className="py-3 space-y-2">
          {meal.foods.length === 0 ? (
            <p className="text-center py-4 text-xs text-neutral-400">
              Nenhum alimento registrado ainda nesta refeição.
            </p>
          ) : (
            meal.foods.map((food, index) => (
              <div
                key={`${food.foodId}-${index}`}
                className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100/70 transition-colors group text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <TrafficLight color={food.trafficLight} showLabel={false} />
                  <span className="font-medium text-neutral-800 truncate">
                    {food.name}
                  </span>
                  <span className="text-xs text-neutral-400 flex-shrink-0">
                    ({food.quantityG}g)
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="font-bold text-neutral-700 text-xs">
                    {food.calories} kcal
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFood(meal.type, index)}
                    className="p-1 text-neutral-300 hover:text-red-500 rounded-md transition-colors"
                    title="Remover alimento"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-2 border-t border-neutral-100">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => setIsSearchOpen(true)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Adicionar Alimento
          </Button>
        </div>
      </Card>

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
