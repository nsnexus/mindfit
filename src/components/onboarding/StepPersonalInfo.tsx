// ============================================
// Onboarding — Passo 1: Informações Pessoais
// ============================================
'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { Card, Input } from '@/components/ui';

export function StepPersonalInfo() {
  const { data, updateData } = useOnboardingStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <span className="text-4xl mb-3 block">👤</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Vamos nos conhecer melhor
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base">
          Essas informações são essenciais para calcularmos suas necessidades energéticas com precisão científica.
        </p>
      </div>

      {/* Sex Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Sexo biológico (para cálculo metabólico)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateData({ sex: 'female' })}
            className={`
              p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200
              ${data.sex === 'female'
                ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-sm'
                : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
              }
            `}
          >
            <span className="text-3xl">👩</span>
            <span className="font-semibold text-sm">Feminino</span>
          </button>

          <button
            type="button"
            onClick={() => updateData({ sex: 'male' })}
            className={`
              p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200
              ${data.sex === 'male'
                ? 'border-primary-500 bg-primary-50 text-primary-800 shadow-sm'
                : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
              }
            `}
          >
            <span className="text-3xl">👨</span>
            <span className="font-semibold text-sm">Masculino</span>
          </button>
        </div>
      </div>

      {/* Age & Height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Sua Idade"
          type="number"
          min={16}
          max={100}
          value={data.age || ''}
          onChange={(e) => updateData({ age: Number(e.target.value) })}
          placeholder="Ex: 28"
          hint="Mínimo 16 anos"
          rightIcon={<span className="text-xs font-semibold text-neutral-400">anos</span>}
        />

        <Input
          label="Sua Altura (cm)"
          type="number"
          min={100}
          max={250}
          value={data.height || ''}
          onChange={(e) => updateData({ height: Number(e.target.value) })}
          placeholder="Ex: 165"
          hint="Ex: 165 para 1,65m"
          rightIcon={<span className="text-xs font-semibold text-neutral-400">cm</span>}
        />
      </div>

      {/* Current Weight */}
      <div>
        <Input
          label="Seu Peso Atual (kg)"
          type="number"
          step="0.1"
          min={30}
          max={300}
          value={data.weight || ''}
          onChange={(e) => updateData({ weight: Number(e.target.value) })}
          placeholder="Ex: 72.5"
          rightIcon={<span className="text-xs font-semibold text-neutral-400">kg</span>}
        />
      </div>
    </div>
  );
}
