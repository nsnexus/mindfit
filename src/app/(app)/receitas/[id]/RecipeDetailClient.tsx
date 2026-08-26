// ============================================
// Recipe Detail Client Component — Mindfit Reference Design
// ============================================
'use client';

import Link from 'next/link';
import { ChevronLeft, ShoppingCart, Heart } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { ROUTES } from '@/constants/routes';
import type { Recipe } from '@/types/recipe';

const TAG_TRANSLATIONS: Record<string, { label: string; bg: string; color: string }> = {
  quick: { label: '⚡ Rápido', bg: '#e6f6ef', color: '#0e9f6e' },
  vegetarian: { label: '🌱 Vegetariano', bg: '#eef7e2', color: '#5a8a1e' },
  vegan: { label: '🌿 Vegano', bg: '#eef7e2', color: '#5a8a1e' },
  highProtein: { label: '🥩 Proteico', bg: '#fff4e0', color: '#c47f0a' },
  glutenFree: { label: '🌾 Sem Glúten', bg: '#e2f5f3', color: '#0f7f78' },
  lactoseFree: { label: '🥛 Sem Lactose', bg: '#e5f1fa', color: '#1f6fa8' },
  lowCarb: { label: '🥑 Low Carb', bg: '#e6f6ef', color: '#0e9f6e' },
};

export function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const { favorites, toggleFavorite, shoppingListIds, toggleShoppingList } = useRecipes();

  const isFavorite = favorites.includes(recipe.id);
  const isInShoppingList = shoppingListIds.includes(recipe.id);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
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
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.85rem' }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isInShoppingList ? '✓ Na Lista de Compras' : '+ Lista de Compras'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(recipe.id)}
            className="btn btn-ghost btn-sm"
            style={{
              fontSize: '0.85rem',
              color: isFavorite ? '#e02424' : 'var(--green)',
              borderColor: isFavorite ? '#fca5a5' : '#d7ede3',
              background: isFavorite ? '#fde8e8' : '#fff',
            }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{isFavorite ? 'Favoritada' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="relative h-64 sm:h-80 w-full">
          <img
            src={recipe.imageURL}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09312b]/90 via-[#09312b]/30 to-transparent" />

          {/* Title Over Image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <div className="flex flex-wrap gap-2 mb-2.5">
              {recipe.tags.map((tag) => {
                const t = TAG_TRANSLATIONS[tag] || { label: tag, bg: 'rgba(255,255,255,0.2)', color: '#fff' };
                return (
                  <span
                    key={tag}
                    style={{
                      background: t.bg,
                      color: t.color,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      padding: '4px 12px',
                      borderRadius: '50px',
                    }}
                  >
                    {t.label}
                  </span>
                );
              })}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-head leading-tight text-white">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Overview Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '18px 24px', background: '#fff', borderTop: '1px solid #eef4f1' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: "'Poppins', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>TEMPO</span>
            <span style={{ fontSize: '1.1rem', fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12352f' }}>
              ⏱️ {recipe.prepTimeMinutes} min
            </span>
          </div>
          <div style={{ height: '36px', width: '1px', background: '#eef4f1' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: "'Poppins', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>DIFICULDADE</span>
            <span style={{ fontSize: '1.1rem', fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12352f', textTransform: 'capitalize' }}>
              {recipe.difficulty === 'easy' && 'Fácil'}
              {recipe.difficulty === 'medium' && 'Média'}
              {recipe.difficulty === 'hard' && 'Avançada'}
            </span>
          </div>
          <div style={{ height: '36px', width: '1px', background: '#eef4f1' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: "'Poppins', sans-serif", fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>RENDIMENTO</span>
            <span style={{ fontSize: '1.1rem', fontFamily: "'Poppins', sans-serif", fontWeight: 800, color: '#12352f' }}>
              🍽️ {recipe.servings} {recipe.servings === 1 ? 'porção' : 'porções'}
            </span>
          </div>
        </div>
      </div>

      {/* Macronutrient Highlights */}
      <div className="grid g-4" style={{ textAlign: 'center' }}>
        <div className="card" style={{ padding: '18px 14px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>CALORIAS</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--green)', fontFamily: "'Poppins', sans-serif", display: 'block', marginTop: '2px' }}>
            {recipe.calories}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>kcal/porção</span>
        </div>

        <div className="card" style={{ padding: '18px 14px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>PROTEÍNA</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--green)', fontFamily: "'Poppins', sans-serif", display: 'block', marginTop: '2px' }}>
            {recipe.protein}g
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>por porção</span>
        </div>

        <div className="card" style={{ padding: '18px 14px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>CARBOS</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber)', fontFamily: "'Poppins', sans-serif", display: 'block', marginTop: '2px' }}>
            {recipe.carbs}g
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>por porção</span>
        </div>

        <div className="card" style={{ padding: '18px 14px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>GORDURAS</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--orange)', fontFamily: "'Poppins', sans-serif", display: 'block', marginTop: '2px' }}>
            {recipe.fat}g
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>por porção</span>
        </div>
      </div>

      {/* Split Grid: Ingredients & Instructions */}
      <div className="grid g-2">
        {/* Ingredients */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', color: '#12352f', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🥗</span>
            <span>Ingredientes</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#f6fbf8',
                  borderRadius: '12px',
                  border: '1px solid #eef4f1',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%' }} />
                  <span style={{ fontWeight: 600, color: '#12352f' }}>{ing.name}</span>
                </div>
                <span style={{ fontSize: '0.82rem', fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: 'var(--muted)', background: '#fff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2f2ea' }}>
                  {ing.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', color: '#12352f', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👩‍🍳</span>
            <span>Modo de Preparo</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recipe.instructions.map((step, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.92rem', color: '#12352f', lineHeight: 1.6 }}>
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#e6f6ef',
                    color: 'var(--green)',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    border: '1px solid #c9eee0',
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ fontWeight: 500 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
