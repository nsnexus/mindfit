// ============================================
// Catálogo de Treinos Guiados
// ============================================
'use client';

import { useWorkouts } from '@/hooks/useWorkouts';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { PHASE_NAMES } from '@/constants/config';

const DIFFICULTY_TABS = [
  { id: 'all', label: 'Todos os Níveis' },
  { id: 'beginner', label: '🟢 Iniciante' },
  { id: 'intermediate', label: '🟡 Intermediário' },
  { id: 'advanced', label: '🔴 Avançado' },
];

export function TreinosPageContent() {
  const {
    workouts,
    selectedPhase,
    setSelectedPhase,
    selectedDifficulty,
    setSelectedDifficulty,
  } = useWorkouts();

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Treinos Guiados 🏋️
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Exercícios progressivos para acelerar a queima calórica, tonificar músculos e ganhar disposição em 21 dias.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Phase Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setSelectedPhase(0)}
            className={`
              px-4 py-2 rounded-2xl font-semibold whitespace-nowrap transition-all
              ${selectedPhase === 0
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }
            `}
          >
            Todas as Fases
          </button>

          {[1, 2, 3].map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setSelectedPhase(phase)}
              className={`
                px-4 py-2 rounded-2xl font-semibold whitespace-nowrap transition-all
                ${selectedPhase === phase
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }
              `}
            >
              Fase {phase}: {PHASE_NAMES[phase]}
            </button>
          ))}
        </div>

        {/* Difficulty Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {DIFFICULTY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedDifficulty(tab.id)}
              className={`
                px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors
                ${selectedDifficulty === tab.id
                  ? 'bg-primary-50 border border-primary-300 text-primary-800 font-bold'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts Grid */}
      {workouts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-base font-bold text-neutral-800">
            Nenhum treino encontrado
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Tente selecionar outra fase ou nível de dificuldade.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreinosPage() {
  return <TreinosPageContent />;
}
