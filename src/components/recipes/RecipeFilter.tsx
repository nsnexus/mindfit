// ============================================
// Recipe Filter & Search Component
// ============================================
'use client';

import { Input } from '@/components/ui';
import type { RecipeCategory } from '@/types/recipe';

interface RecipeFilterProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'Todas', icon: '🍽️' },
  { id: 'breakfast', label: 'Café da Manhã', icon: '🍳' },
  { id: 'lunch', label: 'Almoço', icon: '🥗' },
  { id: 'dinner', label: 'Jantar', icon: '🍲' },
  { id: 'snack', label: 'Lanches', icon: '🍎' },
  { id: 'dessert', label: 'Sobremesas Fit', icon: '🍫' },
];

const TAG_CHIPS: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos os Filtros' },
  { id: 'quick', label: '⚡ Rápido (≤ 15 min)' },
  { id: 'highProtein', label: '🥩 Alto em Proteína' },
  { id: 'lowCarb', label: '🥑 Low-Carb' },
  { id: 'glutenFree', label: '🌾 Sem Glúten' },
  { id: 'vegan', label: '🌱 Vegano' },
];

export function RecipeFilter({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTag,
  onTagChange,
}: RecipeFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Input
        placeholder="Buscar receita por nome ou ingrediente (ex: frango, banana, abóbora...)"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`
                px-4 py-2 rounded-2xl font-semibold whitespace-nowrap flex items-center gap-2 transition-all
                ${isSelected
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tag Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {TAG_CHIPS.map((chip) => {
          const isSelected = selectedTag === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onTagChange(chip.id)}
              className={`
                px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors
                ${isSelected
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }
              `}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
