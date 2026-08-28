// ============================================
// Página de Detalhes da Receita (busca no Firestore, client-side)
// ============================================
import { RecipeDetailClient } from './RecipeDetailClient';

// As receitas vivem no Firestore (gerenciadas pelo admin), não em uma lista
// fixa no build — sem generateStaticParams, renderiza sempre sob demanda.
export const dynamic = 'force-dynamic';

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <RecipeDetailClient recipeId={resolvedParams.id} />;
}
