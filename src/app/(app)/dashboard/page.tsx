// ============================================
// Dashboard Principal — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import {
  Flame,
  Sparkles,
  UtensilsCrossed,
  Salad,
  Dumbbell,
  LineChart,
  Droplets,
  Zap,
  ArrowRight,
  Quote,
  CheckCircle2,
} from 'lucide-react';
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌱</span>
            <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
              Olá, {userName}!
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Bem-vindo ao seu painel diário do Método 21 Dias. Vamos juntos rumo à sua meta!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="warning" size="md" icon={<Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />}>
            Streak: 1 Dia
          </Badge>
          <Badge variant="emerald" size="md" pulse>
            Fase 1: Preparação
          </Badge>
        </div>
      </div>

      {/* Daily Motivational Quote */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-500/20 rounded-3xl flex items-start gap-3.5 shadow-sm">
        <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
          <Quote className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
          "A constância vence a perfeição. Cada copo d'água, cada prato volumoso e consciente te deixam mais perto da sua melhor versão."
        </p>
      </div>

      {/* Main Calorie Budget Gauge */}
      <CalorieTracker
        consumedCalories={dailyLog.totalCalories}
        targetCalories={targetCalories}
      />

      {/* Quick Action Shortcuts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link href={ROUTES.DIARIO} className="group">
          <div className="p-4 sm:p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 text-center">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-neutral-900 block tracking-tight">
              Registrar Refeição
            </span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">Diário diário</span>
          </div>
        </Link>

        <Link href={ROUTES.PLANO_ALIMENTAR} className="group">
          <div className="p-4 sm:p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 text-center">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Salad className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-neutral-900 block tracking-tight">
              Ver Cardápio
            </span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">Plano 21 dias</span>
          </div>
        </Link>

        <Link href={ROUTES.TREINOS} className="group">
          <div className="p-4 sm:p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 text-center">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-neutral-900 block tracking-tight">
              Treino de Hoje
            </span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">15 min em casa</span>
          </div>
        </Link>

        <Link href={ROUTES.PROGRESSO} className="group">
          <div className="p-4 sm:p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 text-center">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all">
              <LineChart className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-neutral-900 block tracking-tight">
              Minha Evolução
            </span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">Pesos & fotos</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Water Tracker */}
        <Card padding="md" className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                    Hidratação do Dia
                  </h3>
                  <p className="text-xs text-neutral-400">Meta: {waterTargetMl} ml</p>
                </div>
              </div>
              <span className="text-sm sm:text-base font-black text-blue-600 font-[var(--font-heading)]">
                {dailyLog.waterMl} / {waterTargetMl} ml
              </span>
            </div>

            <div className="py-4">
              <Progress
                value={dailyLog.waterMl}
                max={waterTargetMl}
                color="info"
                size="md"
                showLabel
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(250)}
              className="text-xs font-bold"
            >
              +250 ml 🥤
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addWater(500)}
              className="text-xs font-bold"
            >
              +500 ml 🍶
            </Button>
          </div>
        </Card>

        {/* Workout Preview */}
        <Card padding="md" className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                    Treino do Dia
                  </h3>
                  <p className="text-xs text-neutral-400">Fase 1 • Mobilidade e Ativação</p>
                </div>
              </div>
              <Badge variant="warning" size="sm">15 min</Badge>
            </div>

            <div className="py-3 space-y-1.5">
              <p className="font-extrabold text-neutral-900 text-sm">
                Alongamento Dinâmico & Caminhada Ativa
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Exercícios suaves de mobilidade articular para destravar o corpo e acelerar o gasto calórico diário.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <Link href={ROUTES.TREINOS}>
              <Button variant="primary" size="md" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                Iniciar Treino Guiado
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
