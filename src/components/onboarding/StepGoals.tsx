// ============================================
// Onboarding — Passo 2: Metas e Objetivos
// ============================================
'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { Input } from '@/components/ui';
import type { Objective } from '@/types/user';

const OBJECTIVES: { id: Objective; title: string; desc: string; icon: string }[] = [
  {
    id: 'lose',
    title: 'Emagrecer com saúde',
    desc: 'Perder gordura corporal preservando sua massa magra e vitalidade.',
    icon: '🔥',
  },
  {
    id: 'tone',
    title: 'Tonificar e Definir',
    desc: 'Reduzir percentual de gordura e aumentar a firmeza muscular.',
    icon: '💪',
  },
  {
    id: 'maintain',
    title: 'Criar hábitos sustentáveis',
    desc: 'Aprender a comer bem, ter mais energia e manter seu peso atual.',
    icon: '🌱',
  },
];

export function StepGoals() {
  const { data, updateData } = useOnboardingStore();

  const weightDiff = data.weight && data.goalWeight ? data.weight - data.goalWeight : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <span className="text-4xl mb-3 block">🎯</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Qual é o seu objetivo principal?
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base">
          Vamos calibrar a intensidade do plano e o balanço calórico ideal para sua meta.
        </p>
      </div>

      {/* Objectives Cards */}
      <div className="space-y-3">
        {OBJECTIVES.map((item) => {
          const isSelected = data.objective === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => updateData({ objective: item.id })}
              className={`
                w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-200
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 text-neutral-900 shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                }
              `}
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">{item.desc}</p>
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

      {/* Goal Weight */}
      <div className="pt-2">
        <Input
          label="Qual é a sua meta de peso? (kg)"
          type="number"
          step="0.1"
          min={30}
          max={300}
          value={data.goalWeight || ''}
          onChange={(e) => updateData({ goalWeight: Number(e.target.value) })}
          placeholder="Ex: 65.0"
          rightIcon={<span className="text-xs font-semibold text-neutral-400">kg</span>}
        />

        {weightDiff > 0 && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-center gap-2">
            <span>✨</span>
            <span>
              Meta de redução: <strong>{weightDiff.toFixed(1)} kg</strong>. Um ciclo de 21 dias é perfeito para construir a base sustentável dessa conquista!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
