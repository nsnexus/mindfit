// ============================================
// Onboarding — Passo 4: Nível de Atividade & Treinos
// ============================================
'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import type { ActivityLevel, WorkoutPreference } from '@/types/user';

const ACTIVITY_LEVELS: { id: ActivityLevel; title: string; desc: string; icon: string }[] = [
  {
    id: 'sedentary',
    title: 'Sedentário',
    desc: 'Trabalho sentado, pouco ou nenhum exercício semanal.',
    icon: '🪑',
  },
  {
    id: 'light',
    title: 'Levemente Ativo',
    desc: 'Caminhadas leves ou exercícios 1 a 2 vezes por semana.',
    icon: '🚶',
  },
  {
    id: 'moderate',
    title: 'Moderadamente Ativo',
    desc: 'Exercícios ou treinos estruturados 3 a 5 vezes por semana.',
    icon: '🏃',
  },
  {
    id: 'active',
    title: 'Muito Ativo',
    desc: 'Treinos intensos 6 a 7 dias por semana ou trabalho físico pesado.',
    icon: '⚡',
  },
];

const WORKOUT_PREFS: { id: WorkoutPreference; title: string; desc: string; icon: string }[] = [
  {
    id: 'home',
    title: 'Treinar em Casa',
    desc: 'Treinos funcionais, peso do corpo e poucos ou nenhum acessório.',
    icon: '🏠',
  },
  {
    id: 'gym',
    title: 'Academia / Aparelhos',
    desc: 'Musculação e equipamentos tradicionais de academia.',
    icon: '🏋️',
  },
];

export function StepActivity() {
  const { data, updateData } = useOnboardingStore();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-6">
        <span className="text-4xl mb-3 block">⚡</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Sua rotina e movimento
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base">
          Isso nos ajuda a determinar seu gasto calórico total e os melhores treinos para você.
        </p>
      </div>

      {/* Activity Level */}
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-3">
          Como é o seu nível de atividade física atual?
        </label>
        <div className="space-y-2.5">
          {ACTIVITY_LEVELS.map((item) => {
            const isSelected = data.activityLevel === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateData({ activityLevel: item.id })}
                className={`
                  w-full p-3.5 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all duration-200
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
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-primary-600 bg-primary-600' : 'border-neutral-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Workout Preference */}
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-3">
          Onde você prefere se exercitar?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WORKOUT_PREFS.map((item) => {
            const isSelected = data.workoutPreference === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateData({ workoutPreference: item.id })}
                className={`
                  p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all duration-200
                  ${isSelected
                    ? 'border-primary-500 bg-primary-50 text-neutral-900 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }
                `}
              >
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
