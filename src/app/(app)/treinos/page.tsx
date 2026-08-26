// ============================================
// Catálogo de Treinos Guiados — Mindfit
// ============================================
'use client';

import { Dumbbell, Sparkles, Filter } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { PHASE_NAMES } from '@/constants/config';

const DIFFICULTY_TABS = [
  { id: 'all', label: 'Todos os Níveis' },
  { id: 'beginner', label: 'Iniciante' },
  { id: 'intermediate', label: 'Intermediário' },
  { id: 'advanced', label: 'Avançado' },
];

function TreinosPageContent() {
  const {
    workouts,
    selectedPhase,
    setSelectedPhase,
    selectedDifficulty,
    setSelectedDifficulty,
  } = useWorkouts();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <Dumbbell className="w-4.5 h-4.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
            Treinos Guiados em Casa
          </h1>
        </div>
        <p className="text-neutral-500 text-sm sm:text-base">
          Treinos rápidos de 15 minutos com cronômetro para acelerar a queima calórica e tonificar o corpo sem equipamentos.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/80 shadow-sm">
        {/* Phase Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setSelectedPhase(0)}
            className={`
              px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all cursor-pointer
              ${
                selectedPhase === 0
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
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
                px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all cursor-pointer
                ${
                  selectedPhase === phase
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }
              `}
            >
              Fase {phase}: {PHASE_NAMES[phase]}
            </button>
          ))}
        </div>

        {/* Difficulty Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-100 no-scrollbar text-xs">
          <span className="text-neutral-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3" /> Nível:
          </span>
          {DIFFICULTY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedDifficulty(tab.id)}
              className={`
                px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer
                ${
                  selectedDifficulty === tab.id
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-800'
                    : 'bg-neutral-100 border border-transparent text-neutral-600 hover:bg-neutral-200/60'
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
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-2">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-base font-bold text-neutral-800">
            Nenhum treino encontrado
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Tente selecionar outra fase ou nível de dificuldade para ver os exercícios.
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
