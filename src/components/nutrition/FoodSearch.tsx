// ============================================
// Food Search & Selection Component — Mindfit Reference Design
// ============================================
'use client';

import { useState, useMemo } from 'react';
import { BRAZILIAN_FOODS } from '@/data/foods-br';
import { TrafficLight } from './TrafficLight';
import type { FoodItem, LoggedFood, MealType } from '@/types/meal';

interface FoodSearchProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  mealTitle: string;
  onAddFood: (mealType: MealType, food: LoggedFood) => void;
}

const CATEGORIES = [
  { id: 'all', label: '🍽️ Todos' },
  { id: 'proteínas', label: '🥩 Proteínas' },
  { id: 'grãos', label: '🌾 Grãos e Pães' },
  { id: 'frutas', label: '🍎 Frutas' },
  { id: 'legumes', label: '🥦 Legumes e Saladas' },
  { id: 'laticínios', label: '🥛 Laticínios' },
  { id: 'oleaginosas', label: '🥜 Castanhas/Gorduras' },
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

  if (!isOpen) return null;

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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 53, 47, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <span className="page-tag" style={{ marginBottom: '4px' }}>
              🍽️ Diário Alimentar
            </span>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.35rem', color: '#12352f' }}>
              Adicionar Alimento — {mealTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedFood(null);
              onClose();
            }}
            style={{
              background: '#f5faf7',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '1.2rem',
              color: '#5b7a72',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {!selectedFood ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f5faf7',
                border: '1.5px solid #cdeadd',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar alimento (ex: feijão, frango, tapioca, ovo...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                style={{
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  width: '100%',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem',
                  color: '#12352f',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ color: '#5b7a72', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Chips with Clean Hidden Scrollbar */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '50px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    border: selectedCategory === cat.id ? '1px solid transparent' : '1px solid #eaf3ef',
                    background: selectedCategory === cat.id ? 'var(--grad)' : '#fff',
                    color: selectedCategory === cat.id ? '#fff' : 'var(--muted)',
                    cursor: 'pointer',
                    transition: '0.2s',
                    flexShrink: 0,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Food List */}
            <div
              style={{
                maxHeight: '340px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingRight: '4px',
              }}
            >
              {filteredFoods.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Nenhum alimento encontrado para "{search}".
                </div>
              ) : (
                filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => handleSelectFood(food)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#f6fbf8',
                      border: '1px solid #eaf3ef',
                      borderRadius: '14px',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: '0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eaf7f0';
                      e.currentTarget.style.borderColor = '#cdeadd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f6fbf8';
                      e.currentTarget.style.borderColor = '#eaf3ef';
                    }}
                  >
                    <div>
                      <b style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem', color: '#12352f' }}>
                        {food.name}
                      </b>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>
                        {food.commonPortionLabel} • {food.caloriesPer100g} kcal/100g
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrafficLight color={food.trafficLight} showLabel={false} />
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 700,
                          background: '#fff',
                          color: '#12352f',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid #eaf3ef',
                        }}
                      >
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                padding: '16px',
                background: '#e6f6ef',
                borderRadius: '16px',
                border: '1px solid #cdeadd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <b style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem', color: '#12352f' }}>
                  {selectedFood.name}
                </b>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                  Porção padrão de referência: {selectedFood.commonPortionLabel}
                </p>
              </div>
              <TrafficLight color={selectedFood.trafficLight} />
            </div>

            {/* Quantity Stepper */}
            <div>
              <label style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#12352f', marginBottom: '8px' }}>
                Quantidade Consumida (em gramas ou ml)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setQuantityG(Math.max(10, quantityG - 10))}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#fff',
                    border: '1.5px solid #cdeadd',
                    color: '#12352f',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={quantityG}
                  onChange={(e) => setQuantityG(Number(e.target.value))}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #0e9f6e',
                    textAlign: 'center',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: '#12352f',
                    outline: 'none',
                  }}
                />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: 'var(--muted)', fontSize: '0.9rem' }}>
                  gramas
                </span>
                <button
                  type="button"
                  onClick={() => setQuantityG(quantityG + 10)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#fff',
                    border: '1.5px solid #cdeadd',
                    color: '#12352f',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Calculated Macros Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                padding: '14px',
                background: '#f6fbf8',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div>
                <small style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700 }}>CALORIAS</small>
                <b style={{ display: 'block', color: 'var(--green)', fontSize: '1.15rem', fontFamily: "'Poppins', sans-serif" }}>
                  {Math.round(selectedFood.caloriesPer100g * (quantityG / 100))} kcal
                </b>
              </div>
              <div>
                <small style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700 }}>PROTEÍNAS</small>
                <b style={{ display: 'block', color: '#12352f', fontSize: '1.05rem', fontFamily: "'Poppins', sans-serif" }}>
                  {(selectedFood.proteinPer100g * (quantityG / 100)).toFixed(1)}g
                </b>
              </div>
              <div>
                <small style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700 }}>CARBOS</small>
                <b style={{ display: 'block', color: '#12352f', fontSize: '1.05rem', fontFamily: "'Poppins', sans-serif" }}>
                  {(selectedFood.carbsPer100g * (quantityG / 100)).toFixed(1)}g
                </b>
              </div>
              <div>
                <small style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700 }}>GORDURAS</small>
                <b style={{ display: 'block', color: '#12352f', fontSize: '1.05rem', fontFamily: "'Poppins', sans-serif" }}>
                  {(selectedFood.fatPer100g * (quantityG / 100)).toFixed(1)}g
                </b>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="btn btn-ghost"
                style={{ flex: 1, padding: '12px' }}
              >
                Voltar à Lista
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                ✓ Confirmar no Diário
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
