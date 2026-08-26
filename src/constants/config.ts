// ============================================
// Constantes do Produto
// ============================================

export const APP_CONFIG = {
  name: 'Mindfit',
  tagline: 'Transforme seus hábitos. Transforme seu corpo.',
  description:
    'Plataforma de emagrecimento saudável com plano alimentar personalizado, receitas, treinos guiados e acompanhamento de progresso em ciclos de 21 dias.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  price: 49.9,
  priceCents: 4990,
  currency: 'BRL',
  guaranteeDays: 7,
  cycleDays: 21,
} as const;

export const HEALTH_LIMITS = {
  /** Calorias mínimas permitidas por dia */
  MIN_DAILY_CALORIES: 1200,
  /** Déficit máximo permitido em kcal */
  MAX_DEFICIT: 500,
  /** Déficit mínimo para emagrecimento */
  MIN_DEFICIT: 250,
  /** IMC mínimo (abaixo disso, não deve emagrecer) */
  MIN_BMI: 18.5,
  /** IMC onde recomendamos acompanhamento profissional */
  HIGH_BMI: 40,
  /** Perda máxima recomendada por semana (kg) */
  MAX_WEEKLY_LOSS_KG: 1.0,
} as const;

export const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
} as const;

export const MACRO_RATIOS = {
  protein: 0.3, // 30%
  carbs: 0.4,   // 40%
  fat: 0.3,     // 30%
} as const;

export const PHASE_NAMES: Record<number, string> = {
  1: 'Preparação',
  2: 'Controle',
  3: 'Consistência',
};

export const PHASE_DESCRIPTIONS: Record<number, string> = {
  1: 'Preparação mental + limpeza alimentar (Dias 1-7)',
  2: 'Controle de porções + introdução de treinos (Dias 8-14)',
  3: 'Consistência + manutenção (Dias 15-21)',
};

export const DISCLAIMER_TEXT =
  'Resultados variam de pessoa a pessoa. Este conteúdo é educativo e não substitui acompanhamento médico ou nutricional.';
