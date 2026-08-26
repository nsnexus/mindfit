// ============================================
// Sessão Ativa de Treino Guiado (Server Component com Static Params)
// ============================================
import Link from 'next/link';
import { WORKOUTS_SEED } from '@/data/workouts-seed';
import { ActiveWorkoutClient } from './ActiveWorkoutClient';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

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

  if (!workout) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm max-w-lg mx-auto">
        <span className="text-4xl block mb-2">🏋️</span>
        <h2 className="text-lg font-bold text-neutral-800">Treino não encontrado</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-6">
          O treino que você está procurando não existe ou foi removido.
        </p>
        <Link href={ROUTES.TREINOS}>
          <Button variant="primary">Voltar aos Treinos</Button>
        </Link>
      </div>
    );
  }

  return <ActiveWorkoutClient workout={workout} />;
}
