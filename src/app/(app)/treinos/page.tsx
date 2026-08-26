// ============================================
// Catálogo de Treinos & Biblioteca wger.de — Mindfit Reference Design
// ============================================
'use client';

import { useState, Suspense } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { ExerciseLibrary } from '@/components/workouts/ExerciseLibrary';
import { PHASE_NAMES } from '@/constants/config';

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
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span className="page-tag">⚡ Treinos Rápidos &amp; Eficientes</span>
          <h1 className="page-title">
            Treinos &amp; <span className="gradient-text">Exercícios</span>
          </h1>
          <p className="page-sub">
            Treinos rápidos de 15 minutos em casa e enciclopédia completa de exercícios com anatomia e postura.
          </p>
        </div>

        {/* Tab Switcher Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'center' }}>
          <button
            type="button"
            onClick={() => setActiveTab('method')}
            className={`fbtn ${activeTab === 'method' ? 'active' : ''}`}
          >
            🎯 Método 21 Dias
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`fbtn ${activeTab === 'library' ? 'active' : ''}`}
          >
            📖 Biblioteca (wger)
          </button>
        </div>
      </div>

      {activeTab === 'method' ? (
        <>
          {/* Phase Filter Row */}
          <div className="filter-row" style={{ marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => setSelectedPhase(0)}
              className={`fbtn ${selectedPhase === 0 ? 'active' : ''}`}
            >
              Todas as Fases
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhase(1)}
              className={`fbtn ${selectedPhase === 1 ? 'active' : ''}`}
            >
              Fase 1: Preparação
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhase(2)}
              className={`fbtn ${selectedPhase === 2 ? 'active' : ''}`}
            >
              Fase 2: Controle
            </button>
            <button
              type="button"
              onClick={() => setSelectedPhase(3)}
              className={`fbtn ${selectedPhase === 3 ? 'active' : ''}`}
            >
              Fase 3: Consistência
            </button>
          </div>

          {/* Difficulty Filter Row */}
          <div className="filter-row">
            <span
              style={{
                alignSelf: 'center',
                color: 'var(--muted)',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: '0.85rem',
                marginRight: '4px',
              }}
            >
              🎚️ NÍVEL:
            </span>
            <button
              type="button"
              onClick={() => setSelectedDifficulty('all')}
              className={`fbtn ${selectedDifficulty === 'all' ? 'active' : ''}`}
            >
              Todos os Níveis
            </button>
            <button
              type="button"
              onClick={() => setSelectedDifficulty('beginner')}
              className={`fbtn ${selectedDifficulty === 'beginner' ? 'active' : ''}`}
            >
              Iniciante
            </button>
            <button
              type="button"
              onClick={() => setSelectedDifficulty('intermediate')}
              className={`fbtn ${selectedDifficulty === 'intermediate' ? 'active' : ''}`}
            >
              Intermediário
            </button>
            <button
              type="button"
              onClick={() => setSelectedDifficulty('advanced')}
              className={`fbtn ${selectedDifficulty === 'advanced' ? 'active' : ''}`}
            >
              Avançado
            </button>
          </div>

          {/* Workouts Grid */}
          <div className="grid g-3" style={{ marginTop: '20px' }}>
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ marginTop: '24px' }}>
          <ExerciseLibrary />
        </div>
      )}
    </div>
  );
}

export default function TreinosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <TreinosPageContent />
    </Suspense>
  );
}
