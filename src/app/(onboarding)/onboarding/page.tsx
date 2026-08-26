// ============================================
// Onboarding Wizard Page
// ============================================
'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button, Progress } from '@/components/ui';
import { StepPersonalInfo } from '@/components/onboarding/StepPersonalInfo';
import { StepGoals } from '@/components/onboarding/StepGoals';
import { StepDiet } from '@/components/onboarding/StepDiet';
import { StepActivity } from '@/components/onboarding/StepActivity';
import { StepResult } from '@/components/onboarding/StepResult';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

function OnboardingWizardContent() {
  const { currentStep, totalSteps, nextStep, prevStep, data } = useOnboardingStore();

  const isStep1Valid = Boolean(data.age && data.weight && data.height && data.sex);
  const isStep2Valid = Boolean(data.objective && data.goalWeight);
  const isStep3Valid = data.dietaryRestrictions.length > 0;
  const isStep4Valid = Boolean(data.activityLevel && data.workoutPreference);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      case 4:
        return isStep4Valid;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-6 py-4 bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-xl font-bold font-[var(--font-heading)] text-primary-600">
              🍃 {APP_CONFIG.name}
            </span>
          </Link>

          <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            Etapa {currentStep} de {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3">
          <Progress
            value={(currentStep / totalSteps) * 100}
            size="sm"
            color="primary"
            animated
          />
        </div>
      </header>

      {/* Main Step Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-card">
          {currentStep === 1 && <StepPersonalInfo />}
          {currentStep === 2 && <StepGoals />}
          {currentStep === 3 && <StepDiet />}
          {currentStep === 4 && <StepActivity />}
          {currentStep === 5 && <StepResult />}

          {/* Navigation Controls (Steps 1 to 4) */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-neutral-100 gap-4">
              {currentStep > 1 ? (
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  }
                >
                  Voltar
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={nextStep}
                disabled={!canProceed()}
                rightIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                Avançar
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} {APP_CONFIG.name}. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AuthGuard requireAuth>
      <OnboardingWizardContent />
    </AuthGuard>
  );
}
