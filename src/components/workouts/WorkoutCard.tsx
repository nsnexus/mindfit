// ============================================
// Workout Card Component
// ============================================
'use client';

import Link from 'next/link';
import { Card, Badge, Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import type { Workout } from '@/types/workout';

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card
      padding="none"
      hoverable
      className="overflow-hidden flex flex-col justify-between group h-full"
    >
      <div>
        {/* Workout Thumbnail */}
        <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
          <img
            src={workout.imageURL}
            alt={workout.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges Overlays */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
              ⏱️ {workout.durationMinutes} min
            </span>
            <span className="bg-primary-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm">
              🔥 ~{workout.caloriesBurned} kcal
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge
              variant={
                workout.difficulty === 'beginner'
                  ? 'success'
                  : workout.difficulty === 'intermediate'
                  ? 'warning'
                  : 'danger'
              }
              size="sm"
            >
              {workout.difficulty === 'beginner' && 'Iniciante'}
              {workout.difficulty === 'intermediate' && 'Intermediário'}
              {workout.difficulty === 'advanced' && 'Avançado'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 block mb-1">
            Fase {workout.phase.join(', ')} • {workout.exercises.length} Exercícios
          </span>

          <h3 className="font-bold text-neutral-900 text-base group-hover:text-primary-600 transition-colors">
            {workout.title}
          </h3>

          <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
            {workout.description}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-neutral-100">
        <Link href={ROUTES.TREINO_ATIVO(workout.id)}>
          <Button variant="primary" size="md" fullWidth>
            Iniciar Treino Guiado →
          </Button>
        </Link>
      </div>
    </Card>
  );
}
