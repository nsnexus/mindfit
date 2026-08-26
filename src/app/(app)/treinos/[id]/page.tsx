// ============================================
// Sessão Ativa de Treino Guiado (Server Component Dinâmico)
// ============================================
import { WORKOUTS_SEED } from '@/data/workouts-seed';
import { ActiveWorkoutClient } from './ActiveWorkoutClient';

// Treinos gerados (plano semanal) só existem no localStorage do cliente,
// então esta rota precisa ser sempre renderizada por request — sem
// generateStaticParams/ISR, que exige binding de cache no Cloudflare Workers.
export const dynamic = 'force-dynamic';

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
