// ============================================
// Catálogo de Treinos & Biblioteca de Exercícios — Mindfit Reference Design
// ============================================
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { ExerciseLibrary } from '@/components/workouts/ExerciseLibrary';
import { WorkoutQuestionnaireModal } from '@/components/workouts/WorkoutQuestionnaireModal';
import { generateCustomWorkoutFromWger, type WeeklyPlan, type WorkoutQuestionnaireData } from '@/lib/wgerApi';

const FOCUS_LABELS: Record<string, string> = {
  fullBody: '🔥 Corpo Todo',
  abs: '🧱 Abdômen & Core',
  legs: '🦵 Pernas & Glúteos',
  arms: '💪 Braços & Ombros',
  back: '🧘 Costas & Postura',
};

function TreinosPageContent() {
  const [activeTab, setActiveTab] = useState<'method' | 'library'>('method');
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  const { profile } = useProgress();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mindfit_weekly_plan');
      if (saved) {
        setWeeklyPlan(JSON.parse(saved));
      }
    } catch {
      // storage policy
    }
  }, []);

  const persistPlan = (plan: WeeklyPlan) => {
    setWeeklyPlan(plan);
    localStorage.setItem('mindfit_weekly_plan', JSON.stringify(plan));
  };

  const handleRegenerateDay = async (dayIndex: number) => {
    if (!weeklyPlan) return;
    const day = weeklyPlan.days.find((d) => d.dayIndex === dayIndex);
    if (!day || day.isRestDay || !day.focus) return;

    setRegeneratingDay(dayIndex);
    try {
      const newWorkout = await generateCustomWorkoutFromWger({
        ...(weeklyPlan.profile as WorkoutQuestionnaireData),
        focus: day.focus,
      });
      newWorkout.id = `${newWorkout.id}-d${dayIndex}`;

      const updatedPlan: WeeklyPlan = {
        ...weeklyPlan,
        days: weeklyPlan.days.map((d) =>
          d.dayIndex === dayIndex ? { ...d, workout: newWorkout } : d
        ),
      };
      persistPlan(updatedPlan);
    } catch (err) {
      console.error('Erro ao trocar treino do dia:', err);
    } finally {
      setRegeneratingDay(null);
    }
  };

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
            Seu plano de treino semanal personalizado e uma biblioteca completa com centenas de exercícios guiados.
          </p>
        </div>

        {/* Tab Switcher Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'center' }}>
          <button
            type="button"
            onClick={() => setActiveTab('method')}
            className={`fbtn ${activeTab === 'method' ? 'active' : ''}`}
          >
            🎯 Meu Plano Semanal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`fbtn ${activeTab === 'library' ? 'active' : ''}`}
          >
            📖 Biblioteca de Exercícios
          </button>
        </div>
      </div>

      {activeTab === 'method' ? (
        <>
          {/* Plan Generator Banner */}
          <div
            className="cal-hero"
            style={{
              marginTop: '18px',
              marginBottom: '22px',
              background: 'radial-gradient(600px 300px at 90% -20%, rgba(139,195,74,.3), transparent 60%), linear-gradient(135deg, #09312b 0%, #0d473e 50%, #06231f 100%)',
            }}
          >
            <div>
              <span className="ch-tag">⚡ Montagem Inteligente</span>
              <div className="big" style={{ fontSize: '2.2rem' }}>
                Seu Plano de Treino Semanal
              </div>
              <p style={{ maxWidth: '520px' }}>
                Responda um questionário rápido com seu peso, altura e foco. Montamos uma semana completa de treinos sob medida para você — e você pode trocar qualquer dia depois.
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
                  {weeklyPlan ? '🔄 Refazer Avaliação Física' : '📋 Preencher Questionário de Medidas'}
                </button>
              </div>
            </div>
            <div style={{ fontSize: '4.5rem', opacity: 0.85, paddingRight: '20px' }}>
              🗓️
            </div>
          </div>

          {/* Plano Semanal (ou estado vazio) */}
          {weeklyPlan ? (
            <div className="grid g-4" style={{ marginTop: '20px' }}>
              {weeklyPlan.days.map((day) => (
                <div
                  key={day.dayIndex}
                  className="card"
                  style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--green)',
                    }}
                  >
                    {day.day}
                  </span>

                  {day.isRestDay || !day.workout ? (
                    <>
                      <div style={{ fontSize: '1.8rem' }}>😴</div>
                      <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#12352f' }}>
                        Dia de Descanso
                      </h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                        Aproveite para recuperar os músculos e se hidratar bem.
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="pill" style={{ alignSelf: 'flex-start', fontSize: '0.72rem' }}>
                        {FOCUS_LABELS[day.focus || 'fullBody']}
                      </span>
                      <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#12352f' }}>
                        {day.workout.durationMinutes} min • ~{day.workout.caloriesBurned} kcal
                      </h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                        {day.workout.exercises.length} exercícios guiados
                      </p>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <Link href={`/treinos/${day.workout.id}`} style={{ flex: 1 }}>
                          <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                            Iniciar Treino
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRegenerateDay(day.dayIndex)}
                          disabled={regeneratingDay === day.dayIndex}
                          className="btn btn-ghost btn-sm"
                          title="Trocar treino deste dia"
                          style={{ opacity: regeneratingDay === day.dayIndex ? 0.6 : 1 }}
                        >
                          {regeneratingDay === day.dayIndex ? '⏳' : '🔄'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="card"
              style={{ marginTop: '20px', textAlign: 'center', padding: '48px 32px' }}
            >
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>🏋️</span>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.15rem', color: '#12352f', marginBottom: '6px' }}>
                Você ainda não tem um plano de treino
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                Preencha o questionário acima para montarmos sua semana de treinos guiados.
              </p>
            </div>
          )}
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
        onWorkoutGenerated={(plan) => setWeeklyPlan(plan)}
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
