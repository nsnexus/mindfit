// ============================================
// Catálogo de Treinos & Biblioteca wger.de — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import { Dumbbell, Sparkles, Filter, BookOpen, Flame } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { ExerciseLibrary } from '@/components/workouts/ExerciseLibrary';
import { PHASE_NAMES } from '@/constants/config';

const DIFFICULTY_TABS = [
  { id: 'all', label: 'Todos os Níveis' },
  { id: 'beginner', label: 'Iniciante' },
  { id: 'intermediate', label: 'Intermediário' },
  { id: 'advanced', label: 'Avançado' },
];

function TreinosPageContent() {
  const [activeTab, setActiveTab] = useState<'method' | 'library'>('method');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-sm">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
              Treinos & Exercícios
            </h1>
          </div>
          <p className="text-neutral-500 text-xs sm:text-sm">
            Treinos rápidos de 15 minutos em casa e enciclopédia completa de exercícios com anatomia e postura.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex p-1 bg-neutral-200/60 rounded-2xl gap-1 shrink-0 self-start sm:self-auto border border-neutral-300/40">
          <button
            type="button"
            onClick={() => setActiveTab('method')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer
              ${
                activeTab === 'method'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }
            `}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Método 21 Dias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer
              ${
                activeTab === 'library'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }
            `}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Biblioteca (wger)</span>
          </button>
        </div>
      </div>

      {activeTab === 'method' ? (
        <>
          {/* Filters Bar */}
          <div className="space-y-3.5 bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-[0_8px_25px_-5px_rgba(14,159,110,0.06)]">
            {/* Phase Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setSelectedPhase(0)}
                className={`
                  px-4 py-2.5 rounded-2xl font-black whitespace-nowrap transition-all cursor-pointer
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
                    px-4 py-2.5 rounded-2xl font-black whitespace-nowrap transition-all cursor-pointer
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
            <div className="flex items-center gap-2 overflow-x-auto pt-2.5 border-t border-neutral-100 no-scrollbar text-xs">
              <span className="text-neutral-400 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Nível:
              </span>
              {DIFFICULTY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(tab.id)}
                  className={`
                    px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer
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
                Tente selecionar outra fase ou nível de dificuldade para ver os treinos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Wger Exercise Library Explorer */
        <ExerciseLibrary />
      )}
    </div>
  );
}

export default function TreinosPage() {
  return <TreinosPageContent />;
}

