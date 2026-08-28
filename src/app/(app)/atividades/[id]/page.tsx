// ============================================
// Detalhe de Atividade (Server Component Dinâmico)
// ============================================
import { ActivityDetailClient } from './ActivityDetailClient';

// Atividades vivem na subcoleção do usuário no Firestore, então
// esta rota precisa ser sempre renderizada por request.
export const dynamic = 'force-dynamic';

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ActivityDetailClient activityId={resolvedParams.id} />;
}
