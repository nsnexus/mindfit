// ============================================
// Food Search & Selection Component
// ============================================
'use client';

import { useState, useMemo } from 'react';
import { BRAZILIAN_FOODS } from '@/data/foods-br';
import { TrafficLight } from './TrafficLight';
import { Input, Button, Modal } from '@/components/ui';
import type { FoodItem, LoggedFood, MealType } from '@/types/meal';

interface FoodSearchProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  mealTitle: string;
  onAddFood: (mealType: MealType, food: LoggedFood) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'proteínas', label: 'Proteínas' },
  { id: 'grãos', label: 'Grãos e Pães' },
  { id: 'frutas', label: 'Frutas' },
  { id: 'legumes', label: 'Legumes e Saladas' },
  { id: 'laticínios', label: 'Laticínios' },
  { id: 'oleaginosas', label: 'Castanhas/Gorduras' },
];

export function FoodSearch({
  isOpen,
  onClose,
  mealType,
  mealTitle,
  onAddFood,
}: FoodSearchProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantityG, setQuantityG] = useState<number>(100);

  const filteredFoods = useMemo(() => {
    return BRAZILIAN_FOODS.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === 'all' || food.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantityG(food.commonPortionG || 100);
  };

  const handleConfirmAdd = () => {
    if (!selectedFood) return;

    const multiplier = quantityG / 100;
    const logged: LoggedFood = {
      foodId: selectedFood.id,
      name: selectedFood.name,
      quantityG,
      calories: Math.round(selectedFood.caloriesPer100g * multiplier),
      protein: Math.round(selectedFood.proteinPer100g * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbsPer100g * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fatPer100g * multiplier * 10) / 10,
      fiber: Math.round(selectedFood.fiberPer100g * multiplier * 10) / 10,
      trafficLight: selectedFood.trafficLight,
      loggedAt: new Date().toISOString(),
    };

    onAddFood(mealType, logged);
    setSelectedFood(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedFood(null);
        onClose();
      }}
      title={`Adicionar Alimento — ${mealTitle}`}
      size="lg"
    >
      {!selectedFood ? (
        <div className="space-y-4">
          {/* Search Bar */}
          <Input
            placeholder="Buscar alimento brasileiro (ex: feijão, frango, tapioca...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors
                  ${selectedCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Food List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {filteredFoods.length === 0 ? (
              <p className="text-center text-neutral-400 py-8 text-sm">
                Nenhum alimento encontrado para "{search}".
              </p>
            ) : (
              filteredFoods.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => handleSelectFood(food)}
                  className="w-full p-3 bg-neutral-50 hover:bg-primary-50/50 hover:border-primary-300 border border-neutral-100 rounded-2xl text-left flex items-center justify-between transition-all"
                >
                  <div className="flex-1 pr-3">
                    <p className="font-semibold text-neutral-800 text-sm">{food.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {food.commonPortionLabel} • {food.caloriesPer100g} kcal/100g
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <TrafficLight color={food.trafficLight} showLabel={false} />
                    <span className="text-xs font-bold text-neutral-700 bg-white px-2.5 py-1 rounded-xl border border-neutral-200">
                      {food.caloriesPer100g} kcal
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Portion Customization Screen */
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-neutral-900">{selectedFood.name}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Porção padrão: {selectedFood.commonPortionLabel}
              </p>
            </div>
            <TrafficLight color={selectedFood.trafficLight} />
          </div>

          {/* Portion Adjuster */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Quantidade consumida (em gramas ou ml)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantityG(Math.max(10, quantityG - 10))}
                className="w-11 h-11 rounded-xl bg-neutral-100 text-neutral-700 font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center text-lg"
              >
                -
              </button>
              <Input
                type="number"
                min={1}
                max={2000}
                value={quantityG}
                onChange={(e) => setQuantityG(Number(e.target.value))}
                className="text-center font-bold text-lg"
                rightIcon={<span className="text-xs font-semibold text-neutral-400">g</span>}
              />
              <button
                type="button"
                onClick={() => setQuantityG(quantityG + 10)}
                className="w-11 h-11 rounded-xl bg-neutral-100 text-neutral-700 font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Live Nutrition Calculation */}
          <div className="grid grid-cols-4 gap-2 text-center p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase font-bold">Calorias</p>
              <p className="text-sm font-bold text-primary-700">
                {Math.round((selectedFood.caloriesPer100g * quantityG) / 100)} kcal
              </p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase font-bold">Proteína</p>
              <p className="text-sm font-bold text-neutral-800">
                {Math.round(((selectedFood.proteinPer100g * quantityG) / 100) * 10) / 10}g
              </p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase font-bold">Carbos</p>
              <p className="text-sm font-bold text-neutral-800">
                {Math.round(((selectedFood.carbsPer100g * quantityG) / 100) * 10) / 10}g
              </p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 uppercase font-bold">Gorduras</p>
              <p className="text-sm font-bold text-neutral-800">
                {Math.round(((selectedFood.fatPer100g * quantityG) / 100) * 10) / 10}g
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setSelectedFood(null)}
            >
              Voltar à busca
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleConfirmAdd}
            >
              Confirmar e Adicionar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
