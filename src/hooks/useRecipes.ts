// ============================================
// useRecipes Hook
// ============================================
'use client';

import { useState, useMemo, useEffect } from 'react';
import { RECIPES_SEED } from '@/data/recipes-seed';
import { getDocuments } from '@/lib/firebase/firestore';
import type { Recipe } from '@/types/recipe';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES_SEED);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shoppingListIds, setShoppingListIds] = useState<string[]>([]);

  // Carrega as receitas do Firestore (o que o admin gerencia). Mostra o
  // seed local de imediato pra não deixar a tela em branco, e substitui
  // assim que a busca real terminar. Se a coleção estiver vazia (Firestore
  // ainda não populado) ou a busca falhar, mantém o seed local.
  useEffect(() => {
    async function load() {
      try {
        const fromDb = await getDocuments<Recipe>('recipes');
        if (fromDb.length > 0) setRecipes(fromDb);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Load favorites & shopping list from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('mindfit_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedList = localStorage.getItem('mindfit_shopping_list');
      if (savedList) setShoppingListIds(JSON.parse(savedList));
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      try {
        localStorage.setItem('mindfit_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleShoppingList = (recipeId: string) => {
    setShoppingListIds((prev) => {
      const updated = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      try {
        localStorage.setItem('mindfit_shopping_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearShoppingList = () => {
    setShoppingListIds([]);
    try {
      localStorage.removeItem('mindfit_shopping_list');
    } catch {}
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.ingredients.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || recipe.category === selectedCategory;

      const matchesTag =
        selectedTag === 'all' || recipe.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [recipes, search, selectedCategory, selectedTag]);

  const selectedShoppingRecipes = useMemo(() => {
    return recipes.filter((r) => shoppingListIds.includes(r.id));
  }, [recipes, shoppingListIds]);

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    isLoading,
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
    toggleShoppingList,
    clearShoppingList,
  };
}
