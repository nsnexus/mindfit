// ============================================
// Recipe Detail Client Component — Mindfit Official
// ============================================
'use client';

import Link from 'next/link';
import { ChevronLeft, ShoppingCart, Heart } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { ROUTES } from '@/constants/routes';
import type { Recipe } from '@/types/recipe';

export function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, shoppingListIds, toggleShoppingList } = useRecipes();

  const isFavorite = favorites.includes(recipe.id);
  const isInShoppingList = shoppingListIds.includes(recipe.id);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.RECEITAS}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-head font-bold text-[#5b7a72] hover:text-[#0e9f6e] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para Receitas</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toggleShoppingList(recipe.id)}
            className="btn btn-ghost py-2.5 px-4 text-xs font-head font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isInShoppingList ? '✓ Na Lista de Compras' : '+ Lista de Compras'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(recipe.id)}
            className={`
              btn py-2.5 px-4 text-xs font-head font-bold flex items-center gap-1.5 cursor-pointer rounded-full transition-all
              ${isFavorite ? 'bg-red-50 text-red-600 border border-red-200' : 'btn-ghost'}
            `}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{isFavorite ? 'Favoritada' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_8px_25px_rgba(14,159,110,0.06)] overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full bg-[#12352f]">
          <img
            src={recipe.imageURL}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12352f]/95 via-[#12352f]/35 to-transparent" />

          {/* Title Over Image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="pill text-[11px] bg-white/20 text-white border border-white/20 font-head font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-head leading-tight text-white">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Overview Bar */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#eef4f1] flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <span className="text-xs text-[#5b7a72] font-head font-extrabold uppercase block">Tempo</span>
            <span className="text-base sm:text-lg font-extrabold font-head text-[#12352f]">
              ⏱️ {recipe.prepTimeMinutes} min
            </span>
          </div>
          <div className="border-l border-[#eef4f1] pl-4">
            <span className="text-xs text-[#5b7a72] font-head font-extrabold uppercase block">Dificuldade</span>
            <span className="text-base sm:text-lg font-extrabold font-head text-[#12352f] capitalize">
              {recipe.difficulty === 'easy' && 'Fácil'}
              {recipe.difficulty === 'medium' && 'Média'}
              {recipe.difficulty === 'hard' && 'Avançada'}
            </span>
          </div>
          <div className="border-l border-[#eef4f1] pl-4">
            <span className="text-xs text-[#5b7a72] font-head font-extrabold uppercase block">Rendimento</span>
            <span className="text-base sm:text-lg font-extrabold font-head text-[#12352f]">
              🍽️ {recipe.servings} {recipe.servings === 1 ? 'porção' : 'porções'}
            </span>
          </div>
        </div>
      </div>

      {/* Macronutrient Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
        <div className="p-4 bg-white rounded-3xl border border-[#e2f2ea] shadow-xs">
          <span className="text-xs text-[#5b7a72] uppercase font-head font-extrabold block">Calorias</span>
          <span className="text-2xl font-extrabold text-[#0e9f6e] font-head block mt-0.5">
            {recipe.calories}
          </span>
          <span className="text-[10px] text-[#5b7a72] font-medium">kcal/porção</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-[#e2f2ea] shadow-xs">
          <span className="text-xs text-[#5b7a72] uppercase font-head font-extrabold block">Proteína</span>
          <span className="text-2xl font-extrabold text-[#0e9f6e] font-head block mt-0.5">
            {recipe.protein}g
          </span>
          <span className="text-[10px] text-[#5b7a72] font-medium">por porção</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-[#e2f2ea] shadow-xs">
          <span className="text-xs text-[#5b7a72] uppercase font-head font-extrabold block">Carbos</span>
          <span className="text-2xl font-extrabold text-[#d97706] font-head block mt-0.5">
            {recipe.carbs}g
          </span>
          <span className="text-[10px] text-[#5b7a72] font-medium">por porção</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-[#e2f2ea] shadow-xs">
          <span className="text-xs text-[#5b7a72] uppercase font-head font-extrabold block">Gorduras</span>
          <span className="text-2xl font-extrabold text-[#ea580c] font-head block mt-0.5">
            {recipe.fat}g
          </span>
          <span className="text-[10px] text-[#5b7a72] font-medium">por porção</span>
        </div>
      </div>

      {/* Split Grid: Ingredients & Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients */}
        <div className="bg-white rounded-3xl border border-[#e2f2ea] p-6 shadow-[0_8px_25px_rgba(14,159,110,0.06)]">
          <h2 className="text-lg font-extrabold font-head text-[#12352f] mb-4 flex items-center gap-2">
            <span>🥗</span>
            <span>Ingredientes</span>
          </h2>

          <ul className="space-y-2.5">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-3 bg-[#f5faf7] rounded-2xl text-xs sm:text-sm text-[#12352f] border border-[#eef4f1]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0e9f6e] rounded-full" />
                  <span className="font-medium">{ing.name}</span>
                </div>
                <span className="text-xs text-[#5b7a72] font-head font-bold bg-white px-2.5 py-1 rounded-xl border border-[#e2f2ea]">
                  {ing.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-3xl border border-[#e2f2ea] p-6 shadow-[0_8px_25px_rgba(14,159,110,0.06)]">
          <h2 className="text-lg font-extrabold font-head text-[#12352f] mb-4 flex items-center gap-2">
            <span>👩‍🍳</span>
            <span>Modo de Preparo</span>
          </h2>

          <ol className="space-y-3.5">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#12352f] leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-[#e6f6ef] text-[#0e9f6e] font-head font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#c9eee0]">
                  {index + 1}
                </span>
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

