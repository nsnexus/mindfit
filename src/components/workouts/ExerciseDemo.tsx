// ============================================
// Exercise Demo & Posture Cues Component
// ============================================
'use client';

import { Card, Badge } from '@/components/ui';
import type { Exercise, WorkoutExerciseItem } from '@/types/workout';

interface ExerciseDemoProps {
  exercise: Exercise;
  exerciseConfig: WorkoutExerciseItem;
  currentSet: number;
  totalSets: number;
}

export function ExerciseDemo({
  exercise,
  exerciseConfig,
  currentSet,
  totalSets,
}: ExerciseDemoProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Exercise Image */}
      <div className="relative h-60 sm:h-72 w-full bg-neutral-100">
        <img
          src={exercise.mediaURL}
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-neutral-900 shadow-sm">
            Série {currentSet} de {totalSets}
          </span>
          <Badge variant="success" size="sm">
            {exercise.muscleGroup.toUpperCase()}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl sm:text-2xl font-extrabold font-[var(--font-heading)]">
            {exercise.name}
          </h2>
          <p className="text-xs text-primary-200 mt-0.5">
            {exerciseConfig.reps
              ? `Meta: ${exerciseConfig.reps} repetições com cadência controlada`
              : `Duração: ${exerciseConfig.durationSeconds} segundos contínuos`}
          </p>
        </div>
      </div>

      {/* Posture & Execution Cues */}
      <div className="p-5 space-y-3 bg-white">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <span>🎯</span>
          <span>Dicas de Postura & Execução Perfeita</span>
        </h4>

        <ul className="space-y-2">
          {exercise.cues.map((cue, index) => (
            <li key={index} className="text-xs sm:text-sm text-neutral-700 flex items-start gap-2 leading-relaxed">
              <span className="text-primary-600 font-bold flex-shrink-0">•</span>
              <span>{cue}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
