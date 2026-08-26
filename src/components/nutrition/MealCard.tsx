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
      <div className="bg-white rounded-3xl border border-[#e2f2ea] p-5 sm:p-6 shadow-[0_8px_25px_rgba(14,159,110,0.06)] hover:border-[#0e9f6e] hover:shadow-[0_14px_35px_rgba(14,159,110,0.12)] transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#eef4f1]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className="font-head font-extrabold text-[#12352f] text-base leading-tight">
                  {meal.title}
                </h3>
                <p className="text-xs text-[#5b7a72] mt-0.5 font-medium">
                  {meal.foods.length} {meal.foods.length === 1 ? 'item' : 'itens'} registrados
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold font-head text-[#0e9f6e]">
                {meal.totalCalories} kcal
              </span>
              <div className="flex gap-1.5 text-[10px] text-[#5b7a72] justify-end font-bold font-head">
                <span>P: {Math.round(meal.totalProtein)}g</span>
                <span>•</span>
                <span>C: {Math.round(meal.totalCarbs)}g</span>
                <span>•</span>
                <span>G: {Math.round(meal.totalFat)}g</span>
              </div>
            </div>
          </div>

          {/* Logged Foods List */}
          <div className="py-3.5 space-y-2">
            {meal.foods.length === 0 ? (
              <p className="text-center py-4 text-xs text-[#5b7a72] font-medium">
                Nenhum alimento registrado ainda nesta refeição.
              </p>
            ) : (
              meal.foods.map((food, index) => (
                <div
                  key={`${food.foodId}-${index}`}
                  className="flex items-center justify-between p-3 bg-[#f5faf7] rounded-2xl hover:bg-[#e6f6ef] transition-colors group text-xs sm:text-sm border border-[#eef4f1]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <TrafficLight color={food.trafficLight} showLabel={false} />
                    <span className="font-head font-bold text-[#12352f] truncate">
                      {food.name}
                    </span>
                    <span className="text-xs text-[#5b7a72] flex-shrink-0 font-medium">
                      ({food.quantityG}g)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="font-extrabold font-head text-[#12352f] text-xs">
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
        <div className="pt-3 border-t border-[#eef4f1]">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="btn btn-ghost w-full py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Alimento</span>
          </button>
        </div>
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
