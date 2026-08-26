// ============================================
// Onboarding Wizard Page — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { ChevronLeft, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f5faf7] flex flex-col justify-between text-[#12352f]">
      {/* Top Header */}
      <header className="px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-[#eef4f1] sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-extrabold font-head">
              <span className="text-[#0f5e5a]">Mind</span>
              <span className="text-[#0e9f6e]">fit</span>
            </span>
          </Link>

          <span className="pill text-xs font-head font-bold">
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
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e2f2ea] shadow-[0_18px_45px_rgba(14,159,110,0.08)] space-y-6">
          {currentStep === 1 && <StepPersonalInfo />}
          {currentStep === 2 && <StepGoals />}
          {currentStep === 3 && <StepDiet />}
          {currentStep === 4 && <StepActivity />}
          {currentStep === 5 && <StepResult />}

          {/* Navigation Controls (Steps 1 to 4) */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#f0f6f3] gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-ghost py-3 px-5 text-sm font-head font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className={`
                  btn btn-primary py-3.5 px-7 text-sm font-head font-bold shadow-md shadow-[#0e9f6e]/20 flex items-center gap-2 cursor-pointer
                  ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span>Avançar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#5b7a72]">
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
