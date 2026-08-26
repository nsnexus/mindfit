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
  Target,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useMeals } from '@/hooks/useMeals';
import { Progress } from '@/components/ui';
import { CalorieTracker } from '@/components/nutrition/CalorieTracker';
import { MacroChart } from '@/components/nutrition/MacroChart';
import { ROUTES } from '@/constants/routes';

export default function DashboardPage() {
  const { appUser } = useAuthStore();
  const { dailyLog, addWater } = useMeals();

  const userName = appUser?.displayName?.split(' ')[0] || 'Aluno(a)';
  const targetCalories = 1800;
  const targetMacros = { protein: 135, carbs: 180, fat: 60 };
  const waterTargetMl = 2500;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Unified Welcome Hero Card */}
      <div className="p-6 sm:p-7 bg-white rounded-3xl border border-emerald-100/90 shadow-[0_10px_30px_-5px_rgba(14,159,110,0.07)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl animate-bounce">🌱</span>
              <h1 className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
                Olá, {userName}!
              </h1>
            </div>
            <p className="text-neutral-500 text-xs sm:text-sm font-medium">
              Painel diário do Método 21 Dias • Foco total no seu resultado!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 text-xs font-black shadow-xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Streak: 1 Dia</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Fase 1: Preparação</span>
            </div>
          </div>
        </div>

        {/* Motivational Quote inside Hero */}
        <div className="mt-3.5 flex items-center gap-3 text-xs sm:text-sm text-emerald-950 font-medium bg-emerald-50/70 p-3 sm:p-3.5 rounded-2xl border border-emerald-100/80">
          <Quote className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>"A constância vence a perfeição. Cada copo d'água, cada prato consciente te deixam mais perto da sua melhor versão."</span>
        </div>
      </div>

      {/* 2. Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Calories, Shortcuts, Macros */}
        <div className="lg:col-span-8 space-y-6">
          {/* Calorie Budget Widget */}
          <CalorieTracker
            consumedCalories={dailyLog.totalCalories}
            targetCalories={targetCalories}
          />

          {/* Quick Action Shortcuts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Registrar Refeição */}
            <Link href={ROUTES.DIARIO} className="group block">
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-emerald-100 shadow-[0_8px_25px_-5px_rgba(14,159,110,0.06)] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-neutral-900 block tracking-tight font-[var(--font-heading)]">
                  Registrar Refeição
                </span>
                <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">Diário diário</span>
              </div>
            </Link>

            {/* Ver Cardápio */}
            <Link href={ROUTES.PLANO_ALIMENTAR} className="group block">
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-teal-100 shadow-[0_8px_25px_-5px_rgba(20,184,166,0.06)] hover:border-teal-400 hover:shadow-xl hover:shadow-teal-900/10 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center mb-3 shadow-md shadow-teal-600/30 group-hover:scale-110 transition-transform">
                  <Salad className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-neutral-900 block tracking-tight font-[var(--font-heading)]">
                  Ver Cardápio
                </span>
                <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">Plano 21 dias</span>
              </div>
            </Link>

            {/* Treino de Hoje */}
            <Link href={ROUTES.TREINOS} className="group block">
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-amber-100 shadow-[0_8px_25px_-5px_rgba(245,158,11,0.06)] hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mb-3 shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-neutral-900 block tracking-tight font-[var(--font-heading)]">
                  Treino de Hoje
                </span>
                <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">15 min em casa</span>
              </div>
            </Link>

            {/* Minha Evolução */}
            <Link href={ROUTES.PROGRESSO} className="group block">
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-sky-100 shadow-[0_8px_25px_-5px_rgba(14,165,233,0.06)] hover:border-sky-400 hover:shadow-xl hover:shadow-sky-900/10 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-sky-500/30 group-hover:scale-110 transition-transform">
                  <LineChart className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-neutral-900 block tracking-tight font-[var(--font-heading)]">
                  Minha Evolução
                </span>
                <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">Pesos & fotos</span>
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
        </div>

        {/* Right Column (4 cols): Active 21-Day Cycle, Today's Workout, Hydration */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active 21-Day Cycle Progress Card */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c3c37] via-[#0f544c] to-[#082824] rounded-3xl border border-emerald-500/30 text-white shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#8bc34a]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[#bfe0d5] font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-[var(--font-heading)]">
                <Flame className="w-4 h-4 text-[#8bc34a]" /> Ciclo Ativo
              </span>
              <span className="font-black text-[#8bc34a] bg-white/10 px-3 py-1 rounded-full border border-white/20 text-xs font-[var(--font-heading)]">
                Dia 1 de 21
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#e2f5ee]">Fase 1: Preparação & Limpeza</span>
                <span className="text-[#8bc34a]">5%</span>
              </div>
              <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden p-[1px]">
                <div className="bg-gradient-to-r from-[#8bc34a] to-[#0e9f6e] h-full w-[5%] rounded-full shadow-sm" />
              </div>
            </div>

            <p className="text-[11px] text-[#c7e5db] leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
              💡 <b>Foco de Hoje:</b> Elimine refrigerantes e beba pelo menos 2,5 litros de água para desinchar.
            </p>
          </div>

          {/* Workout of the Day */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-emerald-100 shadow-[0_8px_25px_-5px_rgba(14,159,110,0.06)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-neutral-900 text-sm sm:text-base font-[var(--font-heading)]">
                    Treino do Dia
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-semibold">15 min • Sem aparelhos</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Fase 1
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-extrabold text-neutral-900 text-xs sm:text-sm">
                Alongamento Dinâmico & Caminhada Ativa
              </p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Exercícios suaves de ativação para destravar as articulações e queimar calorias.
              </p>
            </div>

            <Link href={ROUTES.TREINOS} className="block w-full pt-1">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-600/25 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Iniciar Treino Guiado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Hydration Tracker */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-emerald-100 shadow-[0_8px_25px_-5px_rgba(14,159,110,0.06)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-xs">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-neutral-900 text-sm sm:text-base font-[var(--font-heading)]">
                    Hidratação
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-semibold">Meta: {waterTargetMl} ml</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-blue-600 font-[var(--font-heading)]">
                {dailyLog.waterMl} / {waterTargetMl} ml
              </span>
            </div>

            <Progress
              value={dailyLog.waterMl}
              max={waterTargetMl}
              color="info"
              size="sm"
            />

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => addWater(250)}
                className="py-2.5 px-3 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                +250 ml 🥤
              </button>
              <button
                type="button"
                onClick={() => addWater(500)}
                className="py-2.5 px-3 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                +500 ml 🍶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

