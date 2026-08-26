// ============================================
// Catálogo de Receitas Saudáveis — Mindfit Reference Design
// ============================================
'use client';

import { useState } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { ShoppingListModal } from '@/components/recipes/ShoppingList';

export default function ReceitasPage() {
  const {
    recipes,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    favorites,
    toggleFavorite,
    shoppingListIds,
    selectedShoppingRecipes,
    clearShoppingList,
  } = useRecipes();

  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

  const categories = [
    { id: 'all', label: '🍽️ Todos' },
    { id: 'breakfast', label: '☕ Café da Manhã' },
    { id: 'lunch', label: '🥘 Almoço' },
    { id: 'dinner', label: '🍲 Jantar' },
    { id: 'snack', label: '🍎 Lanches' },
    { id: 'dessert', label: '🍫 Sobremesas Fit' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 className="page-title">👨‍🍳 Receitas Saudáveis</h1>
          <p className="page-sub">
            Pratos saborosos, rápidos e alinhados aos macronutrientes do Método 21 Dias.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsShoppingListOpen(true)}
          className="btn btn-ghost btn-sm"
        >
          🛒 Lista de Compras ({shoppingListIds.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <span style={{ fontSize: '1.1rem' }}>🔍</span>
        <input
          type="text"
          placeholder="Buscar receita por nome ou ingrediente (ex: frango, banana, abóbora...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories Filter Row */}
      <div className="filter-row">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`fbtn ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px 20px', marginTop: '20px' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🔍</span>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', color: '#12352f' }}>
            Nenhuma receita encontrada
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Tente buscar por outro termo ou remova os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid g-3" style={{ marginTop: '16px' }}>
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
