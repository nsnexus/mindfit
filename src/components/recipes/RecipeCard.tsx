// ============================================
// Recipe Card Component — Mindfit Official
// ============================================
'use client';

import Link from 'next/link';
import { Clock, Heart, ArrowRight } from 'lucide-react';
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
    <div className="bg-white rounded-[18px] border border-[#eaf3ef] shadow-[0_8px_22px_rgba(14,159,110,0.10)] hover:border-transparent hover:shadow-[0_18px_45px_rgba(14,159,110,0.18)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full">
      <div>
        {/* Recipe Image with Overlays */}
        <div className="relative h-48 w-full bg-[#12352f] overflow-hidden">
          <img
            src={recipe.imageURL}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
            loading="lazy"
          />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-head font-bold text-white border border-white/20 flex items-center gap-1 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#8bc34a]" /> {recipe.prepTimeMinutes} min
            </span>

            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
                className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#5b7a72] hover:text-[#d24b4b] hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar receita'}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-[#d24b4b] text-[#d24b4b]' : 'text-[#5b7a72] stroke-current'
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
              <span className="pill text-[10px] py-0.5 px-2 bg-[#fff4e0] text-[#c47f0a]">⚡ Rápido</span>
            )}
            {recipe.tags.includes('highProtein') && (
              <span className="pill text-[10px] py-0.5 px-2 bg-[#e6f6ef] text-[#0e9f6e]">🥩 Proteico</span>
            )}
            {recipe.tags.includes('lowCarb') && (
              <span className="pill text-[10px] py-0.5 px-2 bg-[#e2f5f3] text-[#0f7f78]">🥑 Low-Carb</span>
            )}
            {recipe.tags.includes('vegan') && (
              <span className="pill text-[10px] py-0.5 px-2 bg-[#eef7e2] text-[#5a8a1e]">🌱 Vegano</span>
            )}
          </div>

          <h3 className="font-head font-extrabold text-[#12352f] text-base line-clamp-1 group-hover:text-[#0e9f6e] transition-colors">
            {recipe.title}
          </h3>

          <p className="text-xs text-[#5b7a72] line-clamp-2 leading-relaxed font-medium">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Footer Nutrition Summary & Link */}
      <div className="px-5 pb-5 pt-3.5 border-t border-[#eef4f1] flex items-center justify-between">
        <div>
          <span className="text-sm font-extrabold font-head text-[#0e9f6e]">
            {recipe.calories} kcal
          </span>
          <span className="text-[11px] text-[#5b7a72] block font-bold font-head">
            P: {recipe.protein}g • C: {recipe.carbs}g • G: {recipe.fat}g
          </span>
        </div>

        <Link
          href={ROUTES.RECEITA_DETALHE(recipe.id)}
          className="text-xs font-head font-bold text-[#0e9f6e] hover:text-[#0f5e5a] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Ver Receita</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

