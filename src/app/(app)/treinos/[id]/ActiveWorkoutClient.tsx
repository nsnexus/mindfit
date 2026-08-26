// ============================================
// Active Workout Client Component
// ============================================
'use client';

import Link from 'next/link';
import { useActiveWorkout } from '@/hooks/useWorkouts';
import { ExerciseDemo } from '@/components/workouts/ExerciseDemo';
import { WorkoutTimer } from '@/components/workouts/WorkoutTimer';
import { Card, Button, Progress } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import type { Workout } from '@/types/workout';

export function ActiveWorkoutClient({ workout }: { workout: Workout }) {
  const {
    currentExerciseData,
    currentExerciseConfig,
    currentExerciseIndex,
    totalExercises,
    currentSet,
    totalSets,
    isResting,
    isPaused,
    isCompleted,
    timeRemaining,
    totalTime,
    togglePause,
    skip,
  } = useActiveWorkout(workout);

  // Completion Screen
  if (isCompleted) {
    return (
      <div className="max-w-lg mx-auto py-10 animate-fade-in text-center">
        <Card variant="elevated" padding="lg" className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl animate-bounce-in">
            🏆
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-[var(--font-heading)] text-neutral-900">
              Treino Concluído com Sucesso!
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Excelente trabalho! Você deu mais um passo fundamental na sua transformação de 21 dias.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div>
              <p className="text-xs text-neutral-400 font-bold uppercase">Tempo Total</p>
              <p className="text-2xl font-black text-neutral-900 mt-0.5">
                {workout.durationMinutes} min
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-bold uppercase">Calorias Estimadas</p>
              <p className="text-2xl font-black text-primary-700 mt-0.5">
                ~{workout.caloriesBurned} kcal
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Link href={ROUTES.DASHBOARD}>
              <Button variant="primary" size="lg" fullWidth>
                Voltar ao Dashboard
              </Button>
            </Link>
            <Link href={ROUTES.DIARIO}>
              <Button variant="outline" size="md" fullWidth>
                Ver Diário do Dia
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={ROUTES.TREINOS}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            ← Cancelar Treino
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900 mt-1">
            {workout.title}
          </h1>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-neutral-500">
            Exercício {currentExerciseIndex + 1} de {totalExercises}
          </span>
          <div className="w-32 mt-1">
            <Progress
              value={((currentExerciseIndex + 1) / totalExercises) * 100}
              size="sm"
              color="primary"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Demo + Interactive Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ExerciseDemo
          exercise={currentExerciseData}
          exerciseConfig={currentExerciseConfig}
          currentSet={currentSet}
          totalSets={totalSets}
        />

        <div className="space-y-4">
          <WorkoutTimer
            timeRemaining={timeRemaining}
            totalTime={totalTime}
            isResting={isResting}
            isPaused={isPaused}
            onTogglePause={togglePause}
            onSkip={skip}
          />

          {/* Quick Info Card */}
          <Card padding="sm" className="text-center bg-white">
            <p className="text-xs text-neutral-500">
              💡 Mantenha a respiração ritmada. Descanse quando indicado pelo timer.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
