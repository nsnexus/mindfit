// ============================================
// User Types
// ============================================
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'admin' | 'collaborator';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Objective = 'lose' | 'tone' | 'maintain';
export type DietaryRestriction = 'vegan' | 'vegetarian' | 'lowCarb' | 'glutenFree' | 'lactoseFree' | 'none';
export type WorkoutPreference = 'home' | 'gym';
export type Sex = 'male' | 'female';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
  isPremium: boolean;
  premiumSince?: Timestamp;
  paymentId?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  onboardingCompleted: boolean;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  lgpdConsent: boolean;
}

export interface UserProfile {
  age: number;
  sex: Sex;
  weight: number;
  height: number;
  goalWeight: number;
  activityLevel: ActivityLevel;
  objective: Objective;
  dietaryRestrictions: DietaryRestriction[];
  workoutPreference: WorkoutPreference;
  tmb: number;
  get: number;
  dailyCalorieTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  currentPhase: 1 | 2 | 3;
  currentDay: number;
  cycleStartDate: Timestamp;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  freezesAvailable: number;
  freezesUsed: number;
  totalActiveDays: number;
}
