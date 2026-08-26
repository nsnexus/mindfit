// ============================================
// Types de Receitas
// ============================================

export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
export type RecipeDifficulty = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
  category?: 'hortifruti' | 'carnes' | 'mercearia' | 'laticinios' | 'temperos';
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  category: RecipeCategory;
  tags: string[]; // ['lowCarb', 'vegan', 'quick', 'glutenFree', 'highProtein']
  prepTimeMinutes: number;
  difficulty: RecipeDifficulty;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  ingredients: Ingredient[];
  instructions: string[];
  phase: (1 | 2 | 3)[];
  isFeatured?: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  category: 'hortifruti' | 'carnes' | 'mercearia' | 'laticinios' | 'temperos';
  checked: boolean;
  recipeSource: string;
}
