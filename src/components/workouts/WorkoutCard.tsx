// ============================================
// Workout Card Component — Mindfit Official
// ============================================
'use client';

import Link from 'next/link';
import { Clock, Flame, Play, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { Workout } from '@/types/workout';

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <div className="bg-white rounded-[18px] border border-[#eaf3ef] shadow-[0_8px_22px_rgba(14,159,110,0.10)] hover:border-transparent hover:shadow-[0_18px_45px_rgba(14,159,110,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full">
      <div>
        {/* Workout Thumbnail with Overlays */}
        <div className="relative h-48 sm:h-52 w-full bg-[#12352f] overflow-hidden">
          <img
            src={workout.imageURL}
            alt={workout.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12352f]/90 via-[#12352f]/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-head font-bold text-white border border-white/20 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8bc34a]" /> {workout.durationMinutes} min
            </span>
            <span className="bg-[#0e9f6e]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-head font-bold text-white shadow-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> ~{workout.caloriesBurned} kcal
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="pill text-xs font-head font-bold bg-white/90 text-[#0f5e5a] shadow-sm">
              {workout.difficulty === 'beginner' && '🌱 Iniciante'}
              {workout.difficulty === 'intermediate' && '⚡ Intermediário'}
              {workout.difficulty === 'advanced' && '🔥 Avançado'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          <span className="text-[11px] font-head font-extrabold uppercase tracking-wider text-[#0e9f6e] block">
            Fase {workout.phase.join(', ')} • {workout.exercises.length} Exercícios Guiados
          </span>

          <h3 className="font-head font-extrabold text-[#12352f] text-lg group-hover:text-[#0e9f6e] transition-colors leading-tight">
            {workout.title}
          </h3>

          <p className="text-xs text-[#5b7a72] line-clamp-2 leading-relaxed font-medium">
            {workout.description}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 pt-3.5 border-t border-[#eef4f1]">
        <Link href={ROUTES.TREINO_ATIVO(workout.id)}>
          <button
            type="button"
            className="btn btn-primary w-full py-3 text-xs sm:text-sm font-head font-bold shadow-md shadow-[#0e9f6e]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Iniciar Treino</span>
            <Play className="w-3.5 h-3.5 fill-white" />
          </button>
        </Link>
      </div>
    </div>
  );
}

