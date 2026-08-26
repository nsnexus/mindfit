// ============================================
// Onboarding Store (Zustand)
// ============================================
import { create } from 'zustand';
import type {
  Sex,
  ActivityLevel,
  Objective,
  DietaryRestriction,
  WorkoutPreference,
} from '@/types/user';
import { calculateTMB } from '@/lib/calculations/tmb';
import { calculateGET } from '@/lib/calculations/get';
import { calculateDailyCalorieTarget, calculateMacros } from '@/lib/calculations/macros';
import { runHealthChecks, type HealthWarning } from '@/lib/validators/health';

export interface OnboardingStateData {
  age: number;
  sex: Sex;
  weight: number;
  height: number;
  goalWeight: number;
  activityLevel: ActivityLevel;
  objective: Objective;
  dietaryRestrictions: DietaryRestriction[];
  workoutPreference: WorkoutPreference;
}

interface OnboardingStore {
  currentStep: number;
  totalSteps: number;
  data: OnboardingStateData;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<OnboardingStateData>) => void;
  toggleDietaryRestriction: (restriction: DietaryRestriction) => void;
  reset: () => void;

  // Selectors/Computed
  getResults: () => {
    tmb: number;
    get: number;
    calorieTarget: number;
    deficit: number;
    macros: { protein: number; carbs: number; fat: number };
    warnings: HealthWarning[];
  };
}

const initialData: OnboardingStateData = {
  age: 28,
  sex: 'female',
  weight: 70,
  height: 165,
  goalWeight: 63,
  activityLevel: 'light',
  objective: 'lose',
  dietaryRestrictions: ['none'],
  workoutPreference: 'home',
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentStep: 1,
  totalSteps: 5,
  data: initialData,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  updateData: (partial) =>
    set((state) => ({
      data: { ...state.data, ...partial },
    })),

  toggleDietaryRestriction: (restriction) =>
    set((state) => {
      let current = [...state.data.dietaryRestrictions];
      if (restriction === 'none') {
        return { data: { ...state.data, dietaryRestrictions: ['none'] } };
      }

      current = current.filter((r) => r !== 'none');
      if (current.includes(restriction)) {
        current = current.filter((r) => r !== restriction);
        if (current.length === 0) current = ['none'];
      } else {
        current.push(restriction);
      }
      return { data: { ...state.data, dietaryRestrictions: current } };
    }),

  reset: () => set({ currentStep: 1, data: initialData }),

  getResults: () => {
    const { data } = get();
    const tmb = calculateTMB(data.weight, data.height, data.age, data.sex);
    const getVal = calculateGET(tmb, data.activityLevel);
    const { target, deficit } = calculateDailyCalorieTarget(getVal, data.objective);
    const macroDistribution = calculateMacros(target, data.dietaryRestrictions);
    const warnings = runHealthChecks(data.weight, data.height, data.goalWeight, target);

    return {
      tmb,
      get: getVal,
      calorieTarget: target,
      deficit,
      macros: {
        protein: macroDistribution.protein,
        carbs: macroDistribution.carbs,
        fat: macroDistribution.fat,
      },
      warnings,
    };
  },
}));
