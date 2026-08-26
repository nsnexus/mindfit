// ============================================
// Catálogo de Receitas Saudáveis
// ============================================
'use client';

import { useState } from 'react';
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
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Receitas Saudáveis 📖
          </h1>
          <p className="text-neutral-500 text-sm">
            Pratos saborosos, rápidos e alinhados aos macronutrientes do Método 21 Dias.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          onClick={() => setIsShoppingListOpen(true)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        >
          Lista de Compras ({shoppingListIds.length})
        </Button>
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
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 shadow-sm">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-base font-bold text-neutral-800">
            Nenhuma receita encontrada
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
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
