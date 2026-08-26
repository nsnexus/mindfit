// ============================================
// Cálculo do Gasto Energético Total (GET)
// ============================================
import { ACTIVITY_FACTORS } from '@/constants/config';
import type { ActivityLevel } from '@/types/user';

/**
 * Calcula o GET multiplicando a TMB pelo fator de atividade diária
 */
export function calculateGET(tmb: number, activityLevel: ActivityLevel): number {
  const factor = ACTIVITY_FACTORS[activityLevel] || 1.2;
  return Math.round(tmb * factor);
}
