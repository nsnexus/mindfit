// ============================================
// Onboarding — Passo 3: Restrições Alimentares
// ============================================
'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import type { DietaryRestriction } from '@/types/user';

const RESTRICTIONS: { id: DietaryRestriction; title: string; desc: string; icon: string }[] = [
  {
    id: 'none',
    title: 'Sem restrições',
    desc: 'Como de tudo (carnes, grãos, laticínios, massas).',
    icon: '🍽️',
  },
  {
    id: 'lowCarb',
    title: 'Low-Carb',
    desc: 'Menos carboidratos, foco em proteínas e gorduras boas.',
    icon: '🥑',
  },
  {
    id: 'vegetarian',
    title: 'Vegetariano',
    desc: 'Sem carnes vermelhas, aves ou peixes.',
    icon: '🥦',
  },
  {
    id: 'vegan',
    title: 'Vegano',
    desc: '100% à base de plantas, sem nenhum derivado animal.',
    icon: '🌱',
  },
  {
    id: 'glutenFree',
    title: 'Sem Glúten',
    desc: 'Restrição a trigo, centeio, cevada e derivados.',
    icon: '🌾',
  },
  {
    id: 'lactoseFree',
    title: 'Sem Lactose',
    desc: 'Intolerância ou preferência por evitar leite e derivados.',
    icon: '🥛',
  },
];

export function StepDiet() {
  const { data, toggleDietaryRestriction } = useOnboardingStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <span className="text-4xl mb-3 block">🥗</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Suas preferências alimentares
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base">
          Selecione todas as opções que se aplicam à sua rotina para personalizarmos os cardápios.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RESTRICTIONS.map((item) => {
          const isSelected = data.dietaryRestrictions.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleDietaryRestriction(item.id)}
              className={`
                p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all duration-200
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 text-neutral-900 shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                }
              `}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-primary-600 bg-primary-600' : 'border-neutral-300'
                }`}
              >
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
