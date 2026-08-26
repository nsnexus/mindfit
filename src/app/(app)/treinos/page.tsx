// ============================================
// Catálogo de Treinos & Biblioteca wger.de — Mindfit Reference Design
// ============================================
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useProgress } from '@/hooks/useProgress';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { ExerciseLibrary } from '@/components/workouts/ExerciseLibrary';
import { WorkoutQuestionnaireModal } from '@/components/workouts/WorkoutQuestionnaireModal';
import { ROUTES } from '@/constants/routes';

function TreinosPageContent() {
  const [activeTab, setActiveTab] = useState<'method' | 'library'>('method');
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [customWorkout, setCustomWorkout] = useState<any>(null);

  const {
    workouts,
    selectedPhase,
    setSelectedPhase,
    selectedDifficulty,
    setSelectedDifficulty,
  } = useWorkouts();

  const { profile } = useProgress();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mindfit_custom_workout');
      if (saved) {
        setCustomWorkout(JSON.parse(saved));
      }
    } catch {
      // storage policy
    }
  }, []);

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
            Treinos rápidos de 15 minutos em casa e enciclopédia completa com mais de 860 exercícios da API wger.de.
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
          {/* Custom Workout Generator Banner */}
          <div
            className="cal-hero"
            style={{
              marginTop: '18px',
              marginBottom: '22px',
              background: 'radial-gradient(600px 300px at 90% -20%, rgba(139,195,74,.3), transparent 60%), linear-gradient(135deg, #09312b 0%, #0d473e 50%, #06231f 100%)',
            }}
          >
            <div>
              <span className="ch-tag">⚡ Gerador Inteligente da API</span>
              <div className="big" style={{ fontSize: '2.2rem' }}>
                Treino Guiado por Medidas
              </div>
              <p style={{ maxWidth: '520px' }}>
                Responda um questionário rápido com seu peso, altura e foco. Selecionamos os melhores exercícios da <b>API wger.de</b> sob medida para você.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setIsQuestionnaireOpen(true)}
                  className="btn"
                  style={{
                    background: 'var(--grad)',
                    color: '#fff',
                    padding: '12px 24px',
                    fontSize: '0.92rem',
                    boxShadow: '0 8px 22px rgba(14,159,110,0.3)',
                  }}
                >
                  {customWorkout ? '🔄 Refazer Avaliação Física' : '📋 Preencher Questionário de Medidas'}
                </button>
                {customWorkout && (
                  <Link href={`/treinos/${customWorkout.id}`}>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: '#ffffff',
                        color: '#12352f',
                        padding: '12px 22px',
                        fontSize: '0.92rem',
                      }}
                    >
                      ▶️ Iniciar Treino Sugerido ({customWorkout.durationMinutes} min)
                    </button>
                  </Link>
                )}
              </div>
            </div>
            <div style={{ fontSize: '4.5rem', opacity: 0.85, paddingRight: '20px' }}>
              🤖
            </div>
          </div>

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

      {/* Questionnaire Modal */}
      <WorkoutQuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onWorkoutGenerated={(workout) => setCustomWorkout(workout)}
        initialWeight={profile?.weight || 70}
        initialGoalWeight={profile?.goalWeight || 63}
        initialHeight={profile?.height || 165}
      />
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
