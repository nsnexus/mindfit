// ============================================
// Recipe Card Component — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { Clock, Heart, ArrowRight } from 'lucide-react';
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
      className="overflow-hidden flex flex-col justify-between group h-full border border-neutral-200/80 hover:border-emerald-500/40"
    >
      <div>
        {/* Recipe Image with Overlays */}
        <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
          <img
            src={recipe.imageURL}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
            loading="lazy"
          />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-white border border-white/20 flex items-center gap-1 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {recipe.prepTimeMinutes} min
            </span>

            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
                className="pointer-events-auto w-9 h-9 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar receita'}
              >
                <Heart
                  className={`w-4.5 h-4.5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-500 stroke-current'
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-1">
            {recipe.tags.includes('quick') && (
              <Badge variant="warning" size="xs">Rápido</Badge>
            )}
            {recipe.tags.includes('highProtein') && (
              <Badge variant="success" size="xs">Proteico</Badge>
            )}
            {recipe.tags.includes('lowCarb') && (
              <Badge variant="info" size="xs">Low-Carb</Badge>
            )}
            {recipe.tags.includes('vegan') && (
              <Badge variant="default" size="xs">Vegano</Badge>
            )}
          </div>

          <h3 className="font-extrabold text-neutral-900 text-base line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {recipe.title}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Footer Nutrition Summary & Link */}
      <div className="px-5 pb-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <div>
          <span className="text-sm font-black text-emerald-700 font-[var(--font-heading)]">
            {recipe.calories} kcal
          </span>
          <span className="text-[11px] text-neutral-400 block font-bold">
            P: {recipe.protein}g • C: {recipe.carbs}g • G: {recipe.fat}g
          </span>
        </div>

        <Link
          href={ROUTES.RECEITA_DETALHE(recipe.id)}
          className="text-xs font-extrabold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Ver Receita</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
