// ============================================
// Active Workout Client Component — Mindfit Official & Custom wger
// ============================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useActiveWorkout } from '@/hooks/useWorkouts';
import { ExerciseDemo } from '@/components/workouts/ExerciseDemo';
import { WorkoutTimer } from '@/components/workouts/WorkoutTimer';
import { Progress } from '@/components/ui';
import { getDocument } from '@/lib/firebase/firestore';
import { ROUTES } from '@/constants/routes';
import type { Workout } from '@/types/workout';

interface ActiveWorkoutClientProps {
  workout: Workout | null;
  workoutId?: string;
}

export function ActiveWorkoutClient({ workout: initialWorkout, workoutId }: ActiveWorkoutClientProps) {
  const [resolvedWorkout, setResolvedWorkout] = useState<Workout | null>(initialWorkout);
  const [isCheckingCustom, setIsCheckingCustom] = useState(!initialWorkout);

  useEffect(() => {
    async function resolve() {
      if (initialWorkout || !workoutId) return;

      // 1. Treino gerado pelo plano semanal (fica só no localStorage do aluno)
      try {
        const saved = localStorage.getItem('mindfit_weekly_plan');
        if (saved) {
          const plan = JSON.parse(saved);
          const match = plan?.days?.find((d: any) => d.workout?.id === workoutId)?.workout;
          if (match) {
            setResolvedWorkout(match);
            setIsCheckingCustom(false);
            return;
          }
        }
      } catch {
        // storage policy
      }

      // 2. Treino pronto cadastrado pelo admin (Firestore)
      const fromDb = await getDocument<Workout>('workouts', workoutId);
      if (fromDb) {
        setResolvedWorkout(fromDb);
      }
      setIsCheckingCustom(false);
    }

    resolve();
  }, [initialWorkout, workoutId]);

  if (isCheckingCustom) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!resolvedWorkout || !resolvedWorkout.exercises || resolvedWorkout.exercises.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-[#e2f2ea] shadow-sm max-w-lg mx-auto">
        <span className="text-4xl block mb-2">🏋️</span>
        <h2 className="text-lg font-bold text-[#12352f] font-head">Treino não encontrado</h2>
        <p className="text-xs text-[#5b7a72] mt-1 mb-6">
          O treino que você está procurando não existe ou expirou. Tente gerar seu plano novamente.
        </p>
        <Link href={ROUTES.TREINOS}>
          <button className="btn btn-primary">Voltar aos Treinos</button>
        </Link>
      </div>
    );
  }

  return <ActiveWorkoutRunner workout={resolvedWorkout} />;
}

function ActiveWorkoutRunner({ workout }: { workout: Workout }) {
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
        <div className="bg-white rounded-3xl border border-[#e2f2ea] p-8 shadow-[0_16px_40px_rgba(14,159,110,0.12)] space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#e6f6ef] text-[#0e9f6e] border border-[#c9eee0] flex items-center justify-center mx-auto text-4xl animate-bounce-in shadow-xs">
            🏆
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-head text-[#12352f]">
              Treino Concluído com Sucesso!
            </h2>
            <p className="text-xs sm:text-sm text-[#5b7a72] mt-1 font-medium">
              Excelente trabalho! Você deu mais um passo fundamental na sua transformação de 21 dias.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-5 bg-[#f5faf7] rounded-2xl border border-[#e2f2ea]">
            <div>
              <p className="text-xs text-[#5b7a72] font-head font-extrabold uppercase">Tempo Total</p>
              <p className="text-2xl font-extrabold font-head text-[#12352f] mt-0.5">
                {workout.durationMinutes} min
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5b7a72] font-head font-extrabold uppercase">Calorias Queimadas</p>
              <p className="text-2xl font-extrabold font-head text-[#0e9f6e] mt-0.5">
                ~{workout.caloriesBurned} kcal
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link href={ROUTES.DASHBOARD} className="block">
              <button
                type="button"
                className="btn btn-primary w-full py-3.5 text-sm font-head font-bold shadow-md shadow-[#0e9f6e]/20 cursor-pointer"
              >
                Voltar ao Dashboard
              </button>
            </Link>
            <Link href={ROUTES.DIARIO} className="block">
              <button
                type="button"
                className="btn btn-ghost w-full py-3 text-xs font-head font-bold cursor-pointer"
              >
                Ver Diário do Dia
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={ROUTES.TREINOS}
            className="inline-flex items-center gap-1.5 text-xs font-head font-bold text-[#5b7a72] hover:text-[#0e9f6e] transition-colors"
          >
            ← Cancelar Treino
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold font-head text-[#12352f] mt-1">
            {workout.title}
          </h1>
        </div>

        <div className="text-right">
          <span className="pill text-[11px] font-head font-bold bg-[#f5faf7] text-[#0e9f6e] border border-[#e2f2ea]">
            Exercício {currentExerciseIndex + 1} de {totalExercises}
          </span>
          <div className="w-32 mt-1.5">
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
          <div className="text-center bg-white p-4 rounded-2xl border border-[#e2f2ea] shadow-xs">
            <p className="text-xs text-[#5b7a72] font-medium">
              💡 Mantenha a respiração ritmada. Descanse quando indicado pelo timer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
