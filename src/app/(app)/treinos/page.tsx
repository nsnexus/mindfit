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
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="pill text-xs">
              ⚡ Treinos Rápidos & Eficientes
            </span>
          </div>
          <h1 className="font-head text-3xl sm:text-4xl font-extrabold text-[#12352f] tracking-tight">
            Treinos & <span className="gradient-text">Exercícios</span>
          </h1>
          <p className="text-[#5b7a72] text-xs sm:text-sm mt-1">
            Treinos rápidos de 15 minutos em casa e enciclopédia completa de exercícios com anatomia e postura.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex p-1.5 bg-white rounded-full gap-1 shrink-0 self-start sm:self-auto border border-[#e2f2ea] shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('method')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-head font-bold transition-all cursor-pointer
              ${
                activeTab === 'method'
                  ? 'btn-primary text-white shadow-sm'
                  : 'text-[#5b7a72] hover:text-[#0e9f6e]'
              }
            `}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Método 21 Dias</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-head font-bold transition-all cursor-pointer
              ${
                activeTab === 'library'
                  ? 'btn-primary text-white shadow-sm'
                  : 'text-[#5b7a72] hover:text-[#0e9f6e]'
              }
            `}
          >
            <BookOpen className="w-3.5 h-3.5" />
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

