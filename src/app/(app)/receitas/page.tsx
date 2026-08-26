// ============================================
// Catálogo de Receitas Saudáveis — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import { ChefHat, ShoppingCart, Sparkles } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeFilter } from '@/components/recipes/RecipeFilter';
import { ShoppingListModal } from '@/components/recipes/ShoppingList';
import { Button } from '@/components/ui';

export default function ReceitasPage() {
  const {
    recipes,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    favorites,
    toggleFavorite,
    shoppingListIds,
    selectedShoppingRecipes,
    clearShoppingList,
  } = useRecipes();

  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="pill text-xs">
              👨‍🍳 Culinária & Praticidade
            </span>
          </div>
          <h1 className="font-head text-3xl sm:text-4xl font-extrabold text-[#12352f] tracking-tight">
            Receitas <span className="gradient-text">Saudáveis</span>
          </h1>
          <p className="text-[#5b7a72] text-xs sm:text-sm mt-1">
            Pratos saborosos, rápidos e alinhados aos macronutrientes do Método 21 Dias.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsShoppingListOpen(true)}
          className="btn btn-primary font-head font-bold text-xs sm:text-sm py-3 px-5 self-start sm:self-auto shadow-md shadow-[#0e9f6e]/20 flex items-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Lista de Compras ({shoppingListIds.length})</span>
        </button>
      </div>

      {/* Search & Filters */}
      <RecipeFilter
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-2">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-base font-bold text-neutral-800">
            Nenhuma receita encontrada
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Tente buscar por outro termo ou remova os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        selectedRecipes={selectedShoppingRecipes}
        onClearList={clearShoppingList}
      />
    </div>
  );
}
