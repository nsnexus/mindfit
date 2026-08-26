// ============================================
// Onboarding — Passo 5: Resultado & Plano Personalizado
// ============================================
'use client';

import { useOnboarding } from '@/hooks/useOnboarding';
import { Card, Button, Badge } from '@/components/ui';
import { DISCLAIMER_TEXT } from '@/constants/config';

export function StepResult() {
  const { getResults, saveProfileAndFinish, isSaving, error } = useOnboarding();
  const results = getResults();

  const totalMacroKcal =
    results.macros.protein * 4 + results.macros.carbs * 4 + results.macros.fat * 9;
  const proteinPercent = Math.round(((results.macros.protein * 4) / totalMacroKcal) * 100);
  const carbsPercent = Math.round(((results.macros.carbs * 4) / totalMacroKcal) * 100);
  const fatPercent = Math.round(((results.macros.fat * 9) / totalMacroKcal) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce-in">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Seu Plano Personalizado Está Pronto!
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base">
          Calculamos suas necessidades com base na sua fisiologia e objetivo.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Calorie Target Card */}
      <Card variant="elevated" className="bg-gradient-primary text-white p-6 sm:p-8">
        <div className="text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-primary-200 mb-1">
            Meta Calórica Diária Recomendada
          </p>
          <div className="flex items-baseline justify-center gap-1 my-2">
            <span className="text-5xl sm:text-6xl font-extrabold font-[var(--font-heading)]">
              {results.calorieTarget}
            </span>
            <span className="text-lg font-medium text-primary-200">kcal / dia</span>
          </div>
          <p className="text-xs sm:text-sm text-primary-100 max-w-sm mx-auto mt-2">
            {results.deficit > 0
              ? `Déficit moderado e seguro de ~${results.deficit} kcal em relação ao seu gasto total.`
              : 'Manutenção de energia com foco em reeducação e vitalidade.'}
          </p>
        </div>

        {/* Metabolic Details */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20 text-center">
          <div>
            <p className="text-xs text-primary-200">Taxa Metabólica Basal (TMB)</p>
            <p className="text-xl font-bold mt-0.5">{results.tmb} kcal</p>
          </div>
          <div>
            <p className="text-xs text-primary-200">Gasto Energético Total (GET)</p>
            <p className="text-xl font-bold mt-0.5">{results.get} kcal</p>
          </div>
        </div>
      </Card>

      {/* Macronutrient Distribution Card */}
      <Card padding="md">
        <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center justify-between">
          <span>Distribuição de Macronutrientes</span>
          <Badge variant="success">Balanceado</Badge>
        </h3>

        <div className="grid grid-cols-3 gap-3 text-center">
          {/* Protein */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
            <span className="text-xl">🥩</span>
            <p className="text-xs font-semibold text-neutral-600 mt-1">Proteínas</p>
            <p className="text-lg font-bold text-neutral-900 mt-0.5">
              {results.macros.protein}g
            </p>
            <span className="text-[10px] text-neutral-400 font-medium">{proteinPercent}%</span>
          </div>

          {/* Carbs */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
            <span className="text-xl">🍚</span>
            <p className="text-xs font-semibold text-neutral-600 mt-1">Carboidratos</p>
            <p className="text-lg font-bold text-neutral-900 mt-0.5">
              {results.macros.carbs}g
            </p>
            <span className="text-[10px] text-neutral-400 font-medium">{carbsPercent}%</span>
          </div>

          {/* Fats */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
            <span className="text-xl">🥑</span>
            <p className="text-xs font-semibold text-neutral-600 mt-1">Gorduras</p>
            <p className="text-lg font-bold text-neutral-900 mt-0.5">
              {results.macros.fat}g
            </p>
            <span className="text-[10px] text-neutral-400 font-medium">{fatPercent}%</span>
          </div>
        </div>
      </Card>

      {/* Health Warnings / Safety Traps */}
      {results.warnings.length > 0 && (
        <div className="space-y-2.5">
          {results.warnings.map((w, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3
                ${w.type === 'danger'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
                }
              `}
            >
              <span className="text-base flex-shrink-0">
                {w.type === 'danger' ? '🛡️' : '💡'}
              </span>
              <div>
                <p className="font-semibold">{w.message}</p>
                {w.action && <p className="mt-1 opacity-90">{w.action}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className="pt-2">
        <Button
          onClick={saveProfileAndFinish}
          isLoading={isSaving}
          size="xl"
          fullWidth
          variant="accent"
          className="shadow-lg hover:shadow-xl"
        >
          Acessar Minha Plataforma →
        </Button>
      </div>

      {/* Legal & Medical Disclaimer */}
      <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
