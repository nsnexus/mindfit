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

export interface WgerExerciseInfo {
  id: number;
  uuid?: string;
  name: string;
  category: {
    id: number;
    name: string;
  };
  description: string;
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

