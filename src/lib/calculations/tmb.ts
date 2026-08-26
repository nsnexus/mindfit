// ============================================
// Cálculo de Taxa Metabólica Basal (TMB)
// Fórmula: Mifflin-St Jeor (Padrão Ouro Clínico)
// ============================================
import type { Sex } from '@/types/user';

/**
 * Calcula a TMB usando a equação de Mifflin-St Jeor:
 * - Homem: (10 × peso em kg) + (6.25 × altura em cm) - (5 × idade) + 5
 * - Mulher: (10 × peso em kg) + (6.25 × altura em cm) - (5 × idade) - 161
 */
export function calculateTMB(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex
): number {
  const baseTMB = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const result = sex === 'male' ? baseTMB + 5 : baseTMB - 161;
  return Math.round(result);
}
