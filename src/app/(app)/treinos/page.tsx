// ============================================
// Catálogo de Treinos & Biblioteca de Exercícios — Mindfit Reference Design
// ============================================
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { ExerciseLibrary } from '@/components/workouts/ExerciseLibrary';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { WorkoutQuestionnaireModal } from '@/components/workouts/WorkoutQuestionnaireModal';
import { getDocuments } from '@/lib/firebase/firestore';
import {
  buildExerciseListItem,
  fetchReplacementExercise,
  type WeeklyPlan,
} from '@/lib/wgerApi';
import type { Workout } from '@/types/workout';

const FOCUS_LABELS: Record<string, string> = {
  fullBody: '🔥 Corpo Todo',
  abs: '🧱 Abdômen & Core',
  legs: '🦵 Pernas & Glúteos',
  arms: '💪 Braços & Ombros',
  back: '🧘 Costas & Postura',
};

function TreinosPageContent() {
  const [activeTab, setActiveTab] = useState<'method' | 'ready' | 'library'>('method');
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [swappingKey, setSwappingKey] = useState<string | null>(null);
  const [readyWorkouts, setReadyWorkouts] = useState<Workout[]>([]);
  const [isLoadingReady, setIsLoadingReady] = useState(true);

  const { profile } = useProgress();

  useEffect(() => {
    getDocuments<Workout>('workouts').then((list) => {
      setReadyWorkouts(list);
      setIsLoadingReady(false);
    });
  }, []);

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

  const updateDayWorkout = (dayIndex: number, newWorkout: any) => {
    if (!weeklyPlan) return;
    persistPlan({
      ...weeklyPlan,
      days: weeklyPlan.days.map((d) => (d.dayIndex === dayIndex ? { ...d, workout: newWorkout } : d)),
    });
  };

  const handleRegenerateDay = async (dayIndex: number) => {
    if (!weeklyPlan) return;
    const day = weeklyPlan.days.find((d) => d.dayIndex === dayIndex);
    if (!day || day.isRestDay || !day.focus) return;

    setRegeneratingDay(dayIndex);
    try {
      const { generateCustomWorkoutFromWger } = await import('@/lib/wgerApi');
      const newWorkout = await generateCustomWorkoutFromWger({
        ...(weeklyPlan.profile as any),
        focus: day.focus,
      });
      newWorkout.id = `${newWorkout.id}-d${dayIndex}`;
      updateDayWorkout(dayIndex, newWorkout);
    } catch (err) {
      console.error('Erro ao gerar sugestão do dia:', err);
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleSwapExercise = async (dayIndex: number, exerciseIndex: number) => {
    if (!weeklyPlan) return;
    const day = weeklyPlan.days.find((d) => d.dayIndex === dayIndex);
    if (!day || !day.workout || !day.focus) return;

    const key = `${dayIndex}-${exerciseIndex}`;
    setSwappingKey(key);
    try {
      const excludeIds = day.workout.exercisesList
        .map((e: any) => e.wgerId)
        .filter((id: any): id is number => typeof id === 'number');

      const replacement = await fetchReplacementExercise(day.focus, excludeIds);
      if (!replacement) return;

      const config = day.workout.exercises[exerciseIndex];
      const built = buildExerciseListItem(
        replacement,
        {
          focus: day.focus,
          equipment: weeklyPlan.profile.equipment,
          difficulty: weeklyPlan.profile.fitnessLevel,
          durationSeconds: config?.durationSeconds || 30,
        },
        exerciseIndex
      );

      const newExercisesList = [...day.workout.exercisesList];
      newExercisesList[exerciseIndex] = built;
      const newExercises = [...day.workout.exercises];
      newExercises[exerciseIndex] = {
        exerciseId: built.id,
        sets: config?.sets || 2,
        restSeconds: config?.restSeconds || 15,
        durationSeconds: config?.durationSeconds || 30,
      };

      updateDayWorkout(dayIndex, { ...day.workout, exercisesList: newExercisesList, exercises: newExercises });
    } catch (err) {
      console.error('Erro ao trocar exercício:', err);
    } finally {
      setSwappingKey(null);
    }
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    if (!weeklyPlan) return;
    const day = weeklyPlan.days.find((d) => d.dayIndex === dayIndex);
    if (!day || !day.workout || day.workout.exercisesList.length <= 1) return;

    const newExercisesList = day.workout.exercisesList.filter((_: any, i: number) => i !== exerciseIndex);
    const newExercises = day.workout.exercises.filter((_: any, i: number) => i !== exerciseIndex);
    const ref = newExercises[0] || { sets: 2, durationSeconds: 30, restSeconds: 15 };
    const durationMinutes =
      Math.round((newExercises.length * ref.sets * (ref.durationSeconds + ref.restSeconds)) / 60) || 5;

    updateDayWorkout(dayIndex, {
      ...day.workout,
      exercisesList: newExercisesList,
      exercises: newExercises,
      durationMinutes,
    });
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
            onClick={() => setActiveTab('ready')}
            className={`fbtn ${activeTab === 'ready' ? 'active' : ''}`}
          >
            🏆 Treinos Prontos
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

      {activeTab === 'ready' ? (
        <div style={{ marginTop: '20px' }}>
          {isLoadingReady ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            </div>
          ) : readyWorkouts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>🏋️</span>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.15rem', color: '#12352f', marginBottom: '6px' }}>
                Nenhum treino pronto ainda
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                Assim que a equipe cadastrar treinos prontos, eles aparecem aqui.
              </p>
            </div>
          ) : (
            <div className="grid g-3">
              {readyWorkouts.map((w) => (
                <WorkoutCard key={w.id} workout={w} />
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'method' ? (
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
                Responda um questionário rápido com seu peso, altura e foco pra gerar uma sugestão de semana completa — depois é só ajustar: trocar ou remover qualquer exercício do jeito que quiser.
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
                  {weeklyPlan ? '🔄 Gerar Nova Sugestão de Plano' : '📋 Preencher Questionário de Medidas'}
                </button>
              </div>
            </div>
            <div style={{ fontSize: '4.5rem', opacity: 0.85, paddingRight: '20px' }}>
              🗓️
            </div>
          </div>

          {/* Plano Semanal (ou estado vazio) */}
          {weeklyPlan ? (
            <div className="grid g-2" style={{ marginTop: '20px' }}>
              {weeklyPlan.days.map((day) => (
                <div
                  key={day.dayIndex}
                  className="card"
                  style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

                    {!day.isRestDay && day.workout && (
                      <button
                        type="button"
                        onClick={() => handleRegenerateDay(day.dayIndex)}
                        disabled={regeneratingDay === day.dayIndex}
                        title="Gerar nova sugestão automática pra este dia"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.72rem', opacity: regeneratingDay === day.dayIndex ? 0.5 : 1 }}
                      >
                        {regeneratingDay === day.dayIndex ? '⏳' : '🔄 Sugestão'}
                      </button>
                    )}
                  </div>

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
                    (() => {
                      const workout = day.workout!;
                      return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span className="pill" style={{ fontSize: '0.72rem' }}>
                          {FOCUS_LABELS[day.focus || 'fullBody']}
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                          {workout.durationMinutes} min • ~{workout.caloriesBurned} kcal
                        </span>
                      </div>

                      {/* Lista de exercícios mapeados — editável */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                        {workout.exercisesList.map((ex: any, exIdx: number) => {
                          const key = `${day.dayIndex}-${exIdx}`;
                          const isSwapping = swappingKey === key;
                          return (
                            <div
                              key={key}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '6px 8px',
                                borderRadius: '10px',
                                background: '#f5faf7',
                              }}
                            >
                              <img
                                src={ex.mediaURL}
                                alt={ex.name}
                                style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                              />
                              <span
                                style={{
                                  flex: 1,
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: '#12352f',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                title={ex.name}
                              >
                                {ex.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleSwapExercise(day.dayIndex, exIdx)}
                                disabled={isSwapping}
                                title="Trocar por outro exercício real"
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  border: 'none',
                                  background: '#e6f6ef',
                                  color: 'var(--green)',
                                  cursor: 'pointer',
                                  fontSize: '0.78rem',
                                  flexShrink: 0,
                                  opacity: isSwapping ? 0.5 : 1,
                                }}
                              >
                                {isSwapping ? '⏳' : '🔄'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveExercise(day.dayIndex, exIdx)}
                                disabled={workout.exercisesList.length <= 1}
                                title="Remover este exercício"
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  border: 'none',
                                  background: '#fdeaea',
                                  color: '#d24b4b',
                                  cursor: workout.exercisesList.length <= 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '0.78rem',
                                  flexShrink: 0,
                                  opacity: workout.exercisesList.length <= 1 ? 0.4 : 1,
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <Link href={`/treinos/${workout.id}`} style={{ marginTop: '6px' }}>
                        <button type="button" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                          Iniciar Treino
                        </button>
                      </Link>
                    </>
                      );
                    })()
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
