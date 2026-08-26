// ============================================
// Página de Detalhes da Receita (Server Component com Static Params)
// ============================================
import Link from 'next/link';
import { RECIPES_SEED } from '@/data/recipes-seed';
import { RecipeDetailClient } from './RecipeDetailClient';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export function generateStaticParams() {
  return RECIPES_SEED.map((recipe) => ({
    id: recipe.id,
  }));
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const recipe = RECIPES_SEED.find((r) => r.id === resolvedParams.id);

  if (!recipe) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm max-w-lg mx-auto">
        <span className="text-4xl block mb-2">🍽️</span>
        <h2 className="text-lg font-bold text-neutral-800">Receita não encontrada</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-6">
          A receita que você procura não está disponível ou foi movida.
        </p>
        <Link href={ROUTES.RECEITAS}>
          <Button variant="primary">Voltar para o Catálogo</Button>
        </Link>
      </div>
    );
  }

  return <RecipeDetailClient recipe={recipe} />;
}
