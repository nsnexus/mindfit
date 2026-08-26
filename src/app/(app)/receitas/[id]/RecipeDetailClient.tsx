// ============================================
// Recipe Detail Client Component
// ============================================
'use client';

import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';
import { Card, Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import type { Recipe } from '@/types/recipe';

export function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, shoppingListIds, toggleShoppingList } = useRecipes();

  const isFavorite = favorites.includes(recipe.id);
  const isInShoppingList = shoppingListIds.includes(recipe.id);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.RECEITAS}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Receitas
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleShoppingList(recipe.id)}
            className="text-xs"
          >
            {isInShoppingList ? '✓ Na Lista de Compras' : '+ Lista de Compras'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => toggleFavorite(recipe.id)}
            className="text-xs"
          >
            {isFavorite ? '❤️ Favoritada' : '🤍 Favoritar'}
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <Card padding="none" className="overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full bg-neutral-100">
          <img
            src={recipe.imageURL}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Title Over Image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-[var(--font-heading)] leading-tight">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Overview Bar */}
        <div className="p-4 sm:p-6 bg-white border-b border-neutral-100 flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <span className="text-xs text-neutral-400 font-semibold uppercase block">Tempo</span>
            <span className="text-base sm:text-lg font-bold text-neutral-800">
              ⏱️ {recipe.prepTimeMinutes} min
            </span>
          </div>
          <div className="border-l border-neutral-100 pl-4">
            <span className="text-xs text-neutral-400 font-semibold uppercase block">Dificuldade</span>
            <span className="text-base sm:text-lg font-bold text-neutral-800 capitalize">
              {recipe.difficulty === 'easy' && 'Fácil'}
              {recipe.difficulty === 'medium' && 'Média'}
              {recipe.difficulty === 'hard' && 'Avançada'}
            </span>
          </div>
          <div className="border-l border-neutral-100 pl-4">
            <span className="text-xs text-neutral-400 font-semibold uppercase block">Rendimento</span>
            <span className="text-base sm:text-lg font-bold text-neutral-800">
              🍽️ {recipe.servings} {recipe.servings === 1 ? 'porção' : 'porções'}
            </span>
          </div>
        </div>
      </Card>

      {/* Macronutrient Highlights */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-400 uppercase font-bold block">Calorias</span>
          <span className="text-xl font-extrabold text-primary-700 font-[var(--font-heading)] block mt-0.5">
            {recipe.calories}
          </span>
          <span className="text-[10px] text-neutral-400">kcal/porção</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-400 uppercase font-bold block">Proteína</span>
          <span className="text-xl font-extrabold text-emerald-600 font-[var(--font-heading)] block mt-0.5">
            {recipe.protein}g
          </span>
          <span className="text-[10px] text-neutral-400">por porção</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-400 uppercase font-bold block">Carbos</span>
          <span className="text-xl font-extrabold text-amber-600 font-[var(--font-heading)] block mt-0.5">
            {recipe.carbs}g
          </span>
          <span className="text-[10px] text-neutral-400">por porção</span>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 shadow-sm">
          <span className="text-xs text-neutral-400 uppercase font-bold block">Gorduras</span>
          <span className="text-xl font-extrabold text-yellow-600 font-[var(--font-heading)] block mt-0.5">
            {recipe.fat}g
          </span>
          <span className="text-[10px] text-neutral-400">por porção</span>
        </div>
      </div>

      {/* Split Grid: Ingredients & Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients */}
        <Card padding="md">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <span>🥗</span>
            <span>Ingredientes</span>
          </h2>

          <ul className="space-y-2.5">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm text-neutral-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  <span className="font-medium">{ing.name}</span>
                </div>
                <span className="text-xs text-neutral-500 font-bold bg-white px-2 py-1 rounded-md border border-neutral-200">
                  {ing.quantity}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instructions */}
        <Card padding="md">
          <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <span>👩‍🍳</span>
            <span>Modo de Preparo</span>
          </h2>

          <ol className="space-y-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
