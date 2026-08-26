// ============================================
// Meal Card Component — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import { Plus, Trash2, Utensils } from 'lucide-react';
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
      <Card padding="md" className="transition-all hover:shadow-xl hover:border-emerald-500/30 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className="font-extrabold text-neutral-900 text-base leading-tight">
                  {meal.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {meal.foods.length} {meal.foods.length === 1 ? 'item' : 'itens'} adicionados
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-black text-emerald-700 font-[var(--font-heading)]">
                {meal.totalCalories} kcal
              </span>
              <div className="flex gap-1.5 text-[10px] text-neutral-400 justify-end font-bold">
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
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl hover:bg-emerald-50/40 transition-colors group text-xs sm:text-sm border border-neutral-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <TrafficLight color={food.trafficLight} showLabel={false} />
                    <span className="font-bold text-neutral-800 truncate">
                      {food.name}
                    </span>
                    <span className="text-xs text-neutral-400 flex-shrink-0 font-medium">
                      ({food.quantityG}g)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="font-extrabold text-neutral-900 text-xs">
                      {food.calories} kcal
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveFood(meal.type, index)}
                      className="p-1.5 text-neutral-300 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remover alimento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2 border-t border-neutral-100">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => setIsSearchOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold text-xs"
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
