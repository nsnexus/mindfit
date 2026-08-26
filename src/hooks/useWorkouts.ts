// ============================================
// useWorkouts Hook
// ============================================
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { WORKOUTS_SEED, EXERCISES_SEED } from '@/data/workouts-seed';
import type { Workout, Exercise, WorkoutExerciseItem } from '@/types/workout';

export function useWorkouts() {
  const [workouts] = useState<Workout[]>(WORKOUTS_SEED);
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) => {
      const matchesPhase = selectedPhase === 0 || w.phase.includes(selectedPhase as 1 | 2 | 3);
      const matchesDiff = selectedDifficulty === 'all' || w.difficulty === selectedDifficulty;
      return matchesPhase && matchesDiff;
    });
  }, [workouts, selectedPhase, selectedDifficulty]);

  return {
    workouts: filteredWorkouts,
    allWorkouts: workouts,
    selectedPhase,
    setSelectedPhase,
    selectedDifficulty,
    setSelectedDifficulty,
  };
}

/**
 * Hook para gerenciar a execução ativa de um treino guiado
 */
export function useActiveWorkout(workout: Workout) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentExerciseConfig: WorkoutExerciseItem =
    workout.exercises[currentExerciseIndex] || workout.exercises[0];

  const currentExerciseData: Exercise =
    (workout as any).exercisesList?.[currentExerciseIndex] ||
    EXERCISES_SEED.find((e) => e.id === currentExerciseConfig?.exerciseId) ||
    EXERCISES_SEED[0];

  const initialTime = isResting
    ? currentExerciseConfig.restSeconds
    : currentExerciseConfig.durationSeconds || 30;

  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  // Timer Tick
  useEffect(() => {
    if (isPaused || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNextPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isCompleted, isResting, currentExerciseIndex, currentSet]);

  // Transição de série / descanso / próximo exercício
  const handleNextPhase = useCallback(() => {
    if (!isResting) {
      // Entra em descanso se houver mais séries ou próximo exercício
      setIsResting(true);
      setTimeRemaining(currentExerciseConfig.restSeconds);
    } else {
      // Sai do descanso
      setIsResting(false);

      if (currentSet < currentExerciseConfig.sets) {
        // Próxima série do mesmo exercício
        setCurrentSet((prev) => prev + 1);
        setTimeRemaining(currentExerciseConfig.durationSeconds || 30);
      } else {
        // Próximo exercício
        if (currentExerciseIndex + 1 < workout.exercises.length) {
          setCurrentExerciseIndex((prev) => prev + 1);
          setCurrentSet(1);
          const nextConfig = workout.exercises[currentExerciseIndex + 1];
          setTimeRemaining(nextConfig.durationSeconds || 30);
        } else {
          // Treino concluído!
          setIsCompleted(true);
        }
      }
    }
  }, [isResting, currentSet, currentExerciseConfig, currentExerciseIndex, workout.exercises]);

  const togglePause = () => setIsPaused((prev) => !prev);

  const skip = () => handleNextPhase();

  return {
    currentExerciseData,
    currentExerciseConfig,
    currentExerciseIndex,
    totalExercises: workout.exercises.length,
    currentSet,
    totalSets: currentExerciseConfig.sets,
    isResting,
    isPaused,
    isCompleted,
    timeRemaining,
    totalTime: isResting
      ? currentExerciseConfig.restSeconds
      : currentExerciseConfig.durationSeconds || 30,
    togglePause,
    skip,
  };
}
