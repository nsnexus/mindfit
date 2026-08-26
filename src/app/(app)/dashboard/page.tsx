// ============================================
// Dashboard Principal — Mindfit Official Design
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
      {/* 1. Hero Welcome Card with Official Mindfit Aesthetic */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_10px_35px_rgba(14,159,110,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eef4f1]">
          <div className="space-y-1">
            <span className="pill text-xs mb-1.5">
              🌱 Método 21 Dias • Ciclo Ativo
            </span>
            <h1 className="font-head text-3xl sm:text-4xl font-extrabold text-[#12352f] tracking-tight leading-tight">
              Olá, <span className="gradient-text">{userName}</span>!
            </h1>
            <p className="text-[#5b7a72] text-xs sm:text-sm font-medium">
              Painel diário com suas metas nutricionais, treinos guiados e acompanhamento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fff8e6] border border-[#fde68a] text-[#b45309] text-xs font-head font-bold shadow-xs">
              <Flame className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
              <span>Streak: 1 Dia</span>
            </div>
            <div className="pill text-xs font-head font-bold">
              <span className="w-2 h-2 rounded-full bg-[#0e9f6e] animate-pulse" />
              <span>Fase 1: Preparação</span>
            </div>
          </div>
        </div>

        {/* Motivational Quote pill inside Hero */}
        <div className="mt-4 flex items-center gap-3 text-xs sm:text-sm text-[#0f5e5a] font-medium bg-[#e6f6ef] p-3.5 sm:p-4 rounded-2xl border border-[#c9eee0]">
          <Quote className="w-4 h-4 text-[#0e9f6e] shrink-0" />
          <span>"A constância vence a perfeição. Cada copo d'água, cada prato consciente te deixam mais perto da sua meta."</span>
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
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_8px_25px_rgba(14,159,110,0.06)] hover:border-[#0e9f6e] hover:shadow-[0_14px_35px_rgba(14,159,110,0.14)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] text-white flex items-center justify-center mb-3 shadow-md shadow-[#0e9f6e]/20 group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="font-head font-extrabold text-[#12352f] text-xs sm:text-sm block tracking-tight">
                  Registrar Refeição
                </span>
                <span className="text-[11px] text-[#5b7a72] font-medium block mt-0.5">Diário diário</span>
              </div>
            </Link>

            {/* Ver Cardápio */}
            <Link href={ROUTES.PLANO_ALIMENTAR} className="group block">
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_8px_25px_rgba(14,159,110,0.06)] hover:border-[#0e9f6e] hover:shadow-[0_14px_35px_rgba(14,159,110,0.14)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] text-white flex items-center justify-center mb-3 shadow-md shadow-[#0e9f6e]/20 group-hover:scale-110 transition-transform">
                  <Salad className="w-6 h-6" />
                </div>
                <span className="font-head font-extrabold text-[#12352f] text-xs sm:text-sm block tracking-tight">
                  Ver Cardápio
                </span>
                <span className="text-[11px] text-[#5b7a72] font-medium block mt-0.5">Plano 21 dias</span>
              </div>
            </Link>

            {/* Treino de Hoje */}
            <Link href={ROUTES.TREINOS} className="group block">
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_8px_25px_rgba(14,159,110,0.06)] hover:border-[#0e9f6e] hover:shadow-[0_14px_35px_rgba(14,159,110,0.14)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center mb-3 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className="font-head font-extrabold text-[#12352f] text-xs sm:text-sm block tracking-tight">
                  Treino de Hoje
                </span>
                <span className="text-[11px] text-[#5b7a72] font-medium block mt-0.5">15 min em casa</span>
              </div>
            </Link>

            {/* Minha Evolução */}
            <Link href={ROUTES.PROGRESSO} className="group block">
              <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_8px_25px_rgba(14,159,110,0.06)] hover:border-[#0e9f6e] hover:shadow-[0_14px_35px_rgba(14,159,110,0.14)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center mb-3 shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
                  <LineChart className="w-6 h-6" />
                </div>
                <span className="font-head font-extrabold text-[#12352f] text-xs sm:text-sm block tracking-tight">
                  Minha Evolução
                </span>
                <span className="text-[11px] text-[#5b7a72] font-medium block mt-0.5">Pesos & fotos</span>
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
          <div className="p-6 bg-gradient-to-br from-[#09312b] via-[#0d473e] to-[#06231f] rounded-3xl border border-[#0e9f6e]/30 text-white shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#8bc34a]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="pill text-[10px] bg-white/10 text-[#8bc34a] border border-white/20 font-bold">
                <Flame className="w-3.5 h-3.5 text-[#8bc34a]" /> Ciclo Ativo
              </span>
              <span className="font-head font-extrabold text-[#8bc34a] bg-white/10 px-3 py-1 rounded-full border border-white/20 text-xs">
                Dia 1 de 21
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-head font-bold">
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
          <div className="p-6 bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_8px_25px_rgba(14,159,110,0.06)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eef4f1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-head font-extrabold text-[#12352f] text-sm sm:text-base">
                    Treino do Dia
                  </h3>
                  <p className="text-[11px] text-[#5b7a72] font-medium">15 min • Sem aparelhos</p>
                </div>
              </div>
              <span className="pill text-[10px] py-0.5 px-2.5 bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                Fase 1
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-head font-bold text-[#12352f] text-xs sm:text-sm">
                Alongamento Dinâmico & Caminhada Ativa
              </p>
              <p className="text-[11px] text-[#5b7a72] leading-relaxed">
                Exercícios suaves de ativação para destravar as articulações e queimar calorias.
              </p>
            </div>

            <Link href={ROUTES.TREINOS} className="block w-full pt-1">
              <button
                type="button"
                className="btn btn-primary w-full py-3.5 text-xs sm:text-sm font-bold shadow-md shadow-[#0e9f6e]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Iniciar Treino Guiado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Hydration Tracker */}
          <div className="p-6 bg-white rounded-3xl border border-[#e2f2ea] shadow-[0_8px_25px_rgba(14,159,110,0.06)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eef4f1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-xs">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-head font-extrabold text-[#12352f] text-sm sm:text-base">
                    Hidratação
                  </h3>
                  <p className="text-[11px] text-[#5b7a72] font-medium">Meta: {waterTargetMl} ml</p>
                </div>
              </div>
              <span className="font-head font-extrabold text-xs sm:text-sm text-[#0e9f6e]">
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
                className="btn btn-ghost py-2.5 px-3 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                +250 ml 🥤
              </button>
              <button
                type="button"
                onClick={() => addWater(500)}
                className="btn btn-ghost py-2.5 px-3 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
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


