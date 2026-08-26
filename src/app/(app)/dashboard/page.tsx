// ============================================
// Dashboard Principal — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useMeals } from '@/hooks/useMeals';
import { Card, Button, Badge, Progress } from '@/components/ui';
import { CalorieTracker } from '@/components/nutrition/CalorieTracker';
import { MacroChart } from '@/components/nutrition/MacroChart';
import { ROUTES } from '@/constants/routes';

export default function DashboardPage() {
  const { appUser } = useAuthStore();
  const { dailyLog, addWater } = useMeals();

  const userName = appUser?.displayName?.split(' ')[0] || 'Guerreiro(a)';
  const targetCalories = 1800;
  const targetMacros = { protein: 135, carbs: 180, fat: 60 };
  const waterTargetMl = 2500;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌱</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-[var(--font-heading)] text-neutral-900">
              Olá, {userName}!
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Bem-vindo ao seu painel diário do Método 21 Dias.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="success" size="md">
            🔥 Streak: 1 Dia
          </Badge>
          <Badge variant="default" size="md">
            Fase 1: Preparação
          </Badge>
        </div>
      </div>

      {/* Daily Motivational Quote */}
      <div className="p-4 bg-primary-50/80 border border-primary-100 rounded-2xl flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">💬</span>
        <p className="text-xs sm:text-sm text-primary-900 leading-relaxed font-medium">
          "A consistência supera a perfeição. Cada refeição consciente e cada copo d'água são passos firmes rumo à sua melhor versão."
        </p>
      </div>

      {/* Main Calorie Budget Gauge */}
      <CalorieTracker
        consumedCalories={dailyLog.totalCalories}
        targetCalories={targetCalories}
      />

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href={ROUTES.DIARIO}>
          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center group">
            <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
              📝
            </span>
            <span className="text-xs font-bold text-neutral-800 block">
              Registrar Refeição
            </span>
          </div>
        </Link>

        <Link href={ROUTES.PLANO_ALIMENTAR}>
          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center group">
            <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
              🥗
            </span>
            <span className="text-xs font-bold text-neutral-800 block">
              Ver Cardápio
            </span>
          </div>
        </Link>

        <Link href={ROUTES.TREINOS}>
          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center group">
            <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
              🏋️
            </span>
            <span className="text-xs font-bold text-neutral-800 block">
              Treino de Hoje
            </span>
          </div>
        </Link>

        <Link href={ROUTES.PROGRESSO}>
          <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center group">
            <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">
              📊
            </span>
            <span className="text-xs font-bold text-neutral-800 block">
              Minha Evolução
            </span>
          </div>
        </Link>
      </div>

      {/* Macros Tracker */}
      <MacroChart
        current={{
          protein: dailyLog.totalProtein,
          carbs: dailyLog.totalCarbs,
          fat: dailyLog.totalFat,
        }}
        target={targetMacros}
      />

      {/* Split Section: Water & Today's Workout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Water Tracker */}
        <Card padding="md">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💧</span>
              <div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  Hidratação do Dia
                </h3>
                <p className="text-xs text-neutral-400">Meta: {waterTargetMl} ml</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-blue-600">
              {dailyLog.waterMl} / {waterTargetMl} ml
            </span>
          </div>

          <div className="py-4">
            <Progress
              value={dailyLog.waterMl}
              max={waterTargetMl}
              color="accent"
              size="md"
              showLabel
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(250)}
              className="text-xs"
            >
              +250 ml 🥤
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(500)}
              className="text-xs"
            >
              +500 ml 🍶
            </Button>
          </div>
        </Card>

        {/* Workout Preview */}
        <Card padding="md">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  Treino do Dia
                </h3>
                <p className="text-xs text-neutral-400">Fase 1 • Mobilidade e Ativação</p>
              </div>
            </div>
            <Badge variant="warning">15 min</Badge>
          </div>

          <div className="py-3 space-y-1">
            <p className="font-semibold text-neutral-800 text-sm">
              Alongamento Dinâmico & Caminhada Ativa
            </p>
            <p className="text-xs text-neutral-500">
              Exercícios suaves de mobilidade articular para destravar o corpo e acelerar o metabolismo.
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <Link href={ROUTES.TREINOS}>
              <Button variant="primary" size="sm" fullWidth>
                Iniciar Treino Guiado →
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
