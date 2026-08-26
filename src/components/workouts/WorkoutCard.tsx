// ============================================
// Workout Card Component — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { Clock, Flame, Play, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      className="overflow-hidden flex flex-col justify-between group h-full border border-neutral-200/80 hover:border-emerald-500/40"
    >
      <div>
        {/* Workout Thumbnail with Overlays */}
        <div className="relative h-48 sm:h-52 w-full bg-neutral-900 overflow-hidden">
          <img
            src={workout.imageURL}
            alt={workout.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white border border-white/20 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {workout.durationMinutes} min
            </span>
            <span className="bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white shadow-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> ~{workout.caloriesBurned} kcal
            </span>
          </div>

          {/* Difficulty Badge */}
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
        <div className="p-5 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
            Fase {workout.phase.join(', ')} • {workout.exercises.length} Exercícios Guiados
          </span>

          <h3 className="font-black text-neutral-900 text-lg group-hover:text-emerald-700 transition-colors">
            {workout.title}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {workout.description}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 pt-3 border-t border-neutral-100">
        <Link href={ROUTES.TREINO_ATIVO(workout.id)}>
          <Button
            variant="primary"
            size="md"
            fullWidth
            rightIcon={<Play className="w-4 h-4 fill-white" />}
            className="font-bold shadow-md"
          >
            Iniciar Treino
          </Button>
        </Link>
      </div>
    </Card>
  );
}
