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
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <ChefHat className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
              Receitas Saudáveis
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Pratos saborosos, rápidos e alinhados aos macronutrientes do Método 21 Dias.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          onClick={() => setIsShoppingListOpen(true)}
          leftIcon={<ShoppingCart className="w-4 h-4" />}
          className="font-black text-xs sm:text-sm self-start sm:self-auto shadow-md"
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
