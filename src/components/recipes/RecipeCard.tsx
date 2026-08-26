// ============================================
// Recipe Card Component
// ============================================
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import type { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string) => void;
  onAddToShoppingList?: (recipe: Recipe) => void;
}

export function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) {
  return (
    <Card
      padding="none"
      hoverable
      className="overflow-hidden flex flex-col justify-between group h-full"
    >
      <div>
        {/* Recipe Image with Overlays */}
        <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
          <img
            src={recipe.imageURL}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Top Overlays: Prep time badge & Favorite button */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
              ⏱️ {recipe.prepTimeMinutes} min
            </span>

            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
                className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar receita'}
              >
                <svg
                  className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'}`}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {recipe.tags.includes('quick') && (
              <Badge variant="warning" size="sm">Rápido</Badge>
            )}
            {recipe.tags.includes('highProtein') && (
              <Badge variant="success" size="sm">Proteico</Badge>
            )}
            {recipe.tags.includes('lowCarb') && (
              <Badge variant="info" size="sm">Low-Carb</Badge>
            )}
            {recipe.tags.includes('vegan') && (
              <Badge variant="default" size="sm">Vegano</Badge>
            )}
          </div>

          <h3 className="font-bold text-neutral-900 text-base line-clamp-1 group-hover:text-primary-600 transition-colors">
            {recipe.title}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Footer Nutrition Summary & Link */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <div>
          <span className="text-sm font-extrabold text-primary-700 font-[var(--font-heading)]">
            {recipe.calories} kcal
          </span>
          <span className="text-[11px] text-neutral-400 block font-medium">
            P: {recipe.protein}g • C: {recipe.carbs}g • G: {recipe.fat}g
          </span>
        </div>

        <Link
          href={ROUTES.RECEITA_DETALHE(recipe.id)}
          className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          Ver Receita →
        </Link>
      </div>
    </Card>
  );
}
