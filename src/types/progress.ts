// ============================================
// Types de Progresso e Gamificação
// ============================================
import type { Timestamp } from 'firebase/firestore';

export interface ProgressMeasurements {
  waist?: number; // Cintura em cm
  hip?: number;   // Quadril em cm
  chest?: number; // Peito em cm
  arm?: number;   // Braço em cm
  thigh?: number; // Coxa em cm
}

export interface ProgressEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  weight: number; // kg
  measurements?: ProgressMeasurements;
  photoFrontURL?: string;
  photoSideURL?: string;
  photoBackURL?: string;
  notes?: string;
}

export interface AchievementBadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'workout' | 'nutrition' | 'water' | 'photo';
  targetValue: number;
}

export interface UserBadge {
  id: string;
  badgeDef: AchievementBadgeDef;
  unlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
  progressPercentage: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  freezesAvailable: number; // Máximo 2 por ciclo de 21 dias
  freezesUsed: number;
  isActiveToday: boolean;
}
