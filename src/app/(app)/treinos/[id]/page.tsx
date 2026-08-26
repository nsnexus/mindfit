// ============================================
// Sessão Ativa de Treino Guiado (Server Component com Static Params)
// ============================================
import { WORKOUTS_SEED } from '@/data/workouts-seed';
import { ActiveWorkoutClient } from './ActiveWorkoutClient';

export function generateStaticParams() {
  return WORKOUTS_SEED.map((workout) => ({
    id: workout.id,
  }));
}

export default async function ActiveWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const workout = WORKOUTS_SEED.find((w) => w.id === resolvedParams.id);

  return (
    <ActiveWorkoutClient
      workout={workout || null}
      workoutId={resolvedParams.id}
    />
  );
}
