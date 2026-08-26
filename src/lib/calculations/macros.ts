// ============================================
// Cálculo de Meta Calórica Segura e Distribuição de Macros
// ============================================
import { HEALTH_LIMITS, MACRO_RATIOS } from '@/constants/config';
import type { Objective, DietaryRestriction } from '@/types/user';

export interface MacroDistribution {
  calories: number;
  protein: number; // gramas
  carbs: number;   // gramas
  fat: number;     // gramas
  proteinKcal: number;
  carbsKcal: number;
  fatKcal: number;
  deficitKcal: number;
}

/**
 * Calcula a meta calórica diária segura com base no objetivo
 */
export function calculateDailyCalorieTarget(
  get: number,
  objective: Objective
): { target: number; deficit: number } {
  let deficit = 0;

  switch (objective) {
    case 'lose':
      deficit = 400; // Déficit padrão seguro e sustentável
      break;
    case 'tone':
      deficit = 200; // Leve déficit com ênfase em recomposição corporal
      break;
    case 'maintain':
      deficit = 0;
      break;
  }

  let target = get - deficit;

  // Trava de segurança inegociável: nunca abaixo do piso saudável
  if (target < HEALTH_LIMITS.MIN_DAILY_CALORIES) {
    target = HEALTH_LIMITS.MIN_DAILY_CALORIES;
    deficit = Math.max(0, get - target);
  }

  return { target: Math.round(target), deficit: Math.round(deficit) };
}

/**
 * Calcula a divisão de macronutrientes em gramas e calorias
 */
export function calculateMacros(
  dailyCalories: number,
  dietaryRestrictions: DietaryRestriction[] = []
): MacroDistribution {
  const isLowCarb = dietaryRestrictions.includes('lowCarb');

  // Ajuste fino caso usuário tenha selecionado Low-Carb
  const ratios = isLowCarb
    ? { protein: 0.35, carbs: 0.25, fat: 0.4 }
    : MACRO_RATIOS;

  const proteinKcal = Math.round(dailyCalories * ratios.protein);
  const carbsKcal = Math.round(dailyCalories * ratios.carbs);
  const fatKcal = Math.round(dailyCalories * ratios.fat);

  // 1g Proteína = 4 kcal, 1g Carboidrato = 4 kcal, 1g Gordura = 9 kcal
  const protein = Math.round(proteinKcal / 4);
  const carbs = Math.round(carbsKcal / 4);
  const fat = Math.round(fatKcal / 9);

  return {
    calories: dailyCalories,
    protein,
    carbs,
    fat,
    proteinKcal,
    carbsKcal,
    fatKcal,
    deficitKcal: 0,
  };
}
