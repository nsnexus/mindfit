// ============================================
// Types de Nutrição e Refeições
// ============================================

export type TrafficLightColor = 'green' | 'yellow' | 'red';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  category: 'grãos' | 'proteínas' | 'legumes' | 'frutas' | 'laticínios' | 'oleaginosas' | 'bebidas' | 'doces' | 'outros';
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  trafficLight: TrafficLightColor; // Baseado na densidade calórica (Barbara Rolls)
  commonPortionG: number;
  commonPortionLabel: string;
}

export interface LoggedFood {
  foodId: string;
  name: string;
  quantityG: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  trafficLight: TrafficLightColor;
  loggedAt: string; // ISO String
}

export interface MealSection {
  type: MealType;
  title: string;
  foods: LoggedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DailyLogData {
  date: string; // "YYYY-MM-DD"
  meals: Record<MealType, MealSection>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterMl: number;
  weight?: number;
  sleepHours?: number;
  workoutCompleted: boolean;
  notes?: string;
}

export interface DayPlan {
  day: number; // 1 a 21
  phase: 1 | 2 | 3;
  phaseName: string;
  focusTitle: string;
  dailyTip: string;
  meals: {
    type: MealType;
    title: string;
    description: string;
    estimatedCalories: number;
    options: string[];
    trafficLight: TrafficLightColor;
  }[];
}
