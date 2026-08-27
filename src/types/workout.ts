// ============================================
// Types de Treinos e Exercícios
// ============================================

export type MuscleGroup = 'legs' | 'core' | 'cardio' | 'arms' | 'chest' | 'back' | 'fullBody';
export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'stretching' | 'fullBody';
export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType = 'none' | 'mat' | 'chair' | 'dumbbells' | 'resistanceBand';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  mediaURL: string;
  equipment: EquipmentType;
  difficulty: WorkoutDifficulty;
  cues: string[]; // Dicas de execução e postura
  targetSeconds?: number;
  targetReps?: number;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  type: WorkoutType;
  difficulty: WorkoutDifficulty;
  durationMinutes: number;
  equipment: EquipmentType;
  phase: (1 | 2 | 3)[];
  caloriesBurned: number;
  exercises: WorkoutExerciseItem[];
  isFeatured?: boolean;
}

export interface WorkoutSessionState {
  workout: Workout;
  currentExerciseIndex: number;
  currentSet: number;
  isResting: boolean;
  timeRemaining: number;
  isPaused: boolean;
  isCompleted: boolean;
}

// ============================================
// Wger.de API v2 Types
// ============================================

export interface WgerCategory {
  id: number;
  name: string;
}

export interface WgerMuscle {
  id: number;
  name: string;
  name_en?: string;
  is_front?: boolean;
  image_url_main?: string;
  image_url_secondary?: string;
}

export interface WgerEquipment {
  id: number;
  name: string;
}

export interface WgerExerciseImage {
  id: number;
  image: string;
  is_main?: boolean;
}

export interface WgerExerciseTranslation {
  id: number;
  name: string;
  description: string;
  language: number;
}

// ============================================
// Biblioteca de Exercícios (Firestore — coleção `exercises`)
// ============================================
// Fonte de verdade atual: dados curados e traduzidos para PT-BR, importados
// uma única vez da wger.de via scripts/sync-exercise-library.mjs. O app não
// consulta mais a API da wger em tempo de execução.
export interface FirestoreExercise {
  id: string; // doc id, ex: "wger-9"
  wgerId: number;
  name: string;
  description: string;
  categoryId: number;
  category: string;
  muscles: string[];
  musclesSecondary: string[];
  equipment: string[];
  imageURL: string;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface WgerExerciseInfo {
  id: number;
  uuid?: string;
  /** @deprecated a API não retorna isso no nível raiz — use getWgerTranslation() */
  name?: string;
  category: {
    id: number;
    name: string;
  };
  /** @deprecated a API não retorna isso no nível raiz — use getWgerTranslation() */
  description?: string;
  translations: WgerExerciseTranslation[];
  muscles: {
    id: number;
    name: string;
    name_en?: string;
    is_front?: boolean;
  }[];
  muscles_secondary: {
    id: number;
    name: string;
    name_en?: string;
  }[];
  equipment: {
    id: number;
    name: string;
  }[];
  images: {
    id: number;
    image: string;
    is_main?: boolean;
  }[];
  variations?: number[];
}

