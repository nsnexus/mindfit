// ============================================
// Onboarding Wizard Page — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { Sparkles, ChevronLeft, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-mesh flex flex-col justify-between selection:bg-emerald-500 selection:text-neutral-950">
      {/* Top Header */}
      <header className="px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            </div>
            <span className="text-xl font-black font-[var(--font-heading)] text-neutral-900">
              {APP_CONFIG.name}
            </span>
          </Link>

          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            Etapa {currentStep} de {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3">
          <Progress
            value={(currentStep / totalSteps) * 100}
            size="xs"
            color="primary"
            animated
          />
        </div>
      </header>

      {/* Main Step Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xl space-y-6">
          {currentStep === 1 && <StepPersonalInfo />}
          {currentStep === 2 && <StepGoals />}
          {currentStep === 3 && <StepDiet />}
          {currentStep === 4 && <StepActivity />}
          {currentStep === 5 && <StepResult />}

          {/* Navigation Controls (Steps 1 to 4) */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between pt-6 border-t border-neutral-100 gap-4">
              {currentStep > 1 ? (
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  className="font-bold text-sm"
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
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-black text-sm shadow-md"
              >
                Avançar
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} {APP_CONFIG.name} — Método 21 Dias. Todos os direitos reservados.
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
