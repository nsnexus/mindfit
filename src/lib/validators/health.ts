// ============================================
// Validações de Segurança de Saúde
// ============================================
import { HEALTH_LIMITS } from '@/constants/config';
import { calculateBMI } from '@/lib/utils';

export interface HealthWarning {
  type: 'danger' | 'warning' | 'info';
  message: string;
  action?: string;
}

/**
 * Valida se a meta calórica é segura
 */
export function validateCalorieTarget(calories: number): HealthWarning | null {
  if (calories < HEALTH_LIMITS.MIN_DAILY_CALORIES) {
    return {
      type: 'danger',
      message: `A meta de ${Math.round(calories)} kcal/dia está abaixo do mínimo seguro (${HEALTH_LIMITS.MIN_DAILY_CALORIES} kcal).`,
      action: `Ajustamos automaticamente para ${HEALTH_LIMITS.MIN_DAILY_CALORIES} kcal/dia.`,
    };
  }
  return null;
}

/**
 * Valida IMC e retorna avisos adequados
 */
export function validateBMI(
  weight: number,
  height: number
): HealthWarning | null {
  const bmi = calculateBMI(weight, height);

  if (bmi < HEALTH_LIMITS.MIN_BMI) {
    return {
      type: 'warning',
      message: `Seu IMC (${bmi.toFixed(1)}) indica que você pode estar abaixo do peso.`,
      action:
        'Recomendamos consultar um profissional de saúde antes de iniciar um programa de emagrecimento.',
    };
  }

  if (bmi >= HEALTH_LIMITS.HIGH_BMI) {
    return {
      type: 'warning',
      message: `Seu IMC (${bmi.toFixed(1)}) indica obesidade grau III.`,
      action:
        'Para sua segurança, recomendamos fortemente acompanhamento médico e nutricional.',
    };
  }

  return null;
}

/**
 * Valida se a meta de perda de peso é saudável
 */
export function validateWeightLossGoal(
  currentWeight: number,
  goalWeight: number,
  cycleDays: number = 21
): HealthWarning | null {
  const totalLoss = currentWeight - goalWeight;

  if (totalLoss <= 0) return null; // Não quer emagrecer

  const weeksInCycle = cycleDays / 7;
  const weeklyLoss = totalLoss / weeksInCycle;

  if (weeklyLoss > HEALTH_LIMITS.MAX_WEEKLY_LOSS_KG) {
    return {
      type: 'warning',
      message: `A meta de perder ${totalLoss.toFixed(1)}kg em ${cycleDays} dias (${weeklyLoss.toFixed(1)}kg/semana) pode ser agressiva.`,
      action: `Recomendamos uma perda de até ${HEALTH_LIMITS.MAX_WEEKLY_LOSS_KG}kg/semana para resultado sustentável.`,
    };
  }

  return null;
}

/**
 * Executa todas as validações de saúde
 */
export function runHealthChecks(
  weight: number,
  height: number,
  goalWeight: number,
  calorieTarget: number
): HealthWarning[] {
  const warnings: HealthWarning[] = [];

  const bmiWarning = validateBMI(weight, height);
  if (bmiWarning) warnings.push(bmiWarning);

  const calorieWarning = validateCalorieTarget(calorieTarget);
  if (calorieWarning) warnings.push(calorieWarning);

  const weightWarning = validateWeightLossGoal(weight, goalWeight);
  if (weightWarning) warnings.push(weightWarning);

  return warnings;
}
