// ============================================
// Landing Page: Hero Section — Mindfit Premium
// ============================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  Salad,
  Dumbbell,
  Clock,
  Star,
  TrendingDown,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export function Hero() {
  const [currentWeight, setCurrentWeight] = useState<number>(75);
  const [targetWeight, setTargetWeight] = useState<number>(68);

  const weightDiff = Math.max(1, currentWeight - targetWeight);
  const estimated21DaysLoss = Math.min(weightDiff, +(weightDiff * 0.55).toFixed(1));

  return (
    <section className="relative pt-12 pb-24 sm:pt-20 sm:pb-36 px-4 sm:px-6 overflow-hidden bg-neutral-950 text-white">
      {/* Radiant Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[450px] sm:h-[600px] bg-gradient-to-b from-emerald-500/25 via-emerald-600/10 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-amber-500/15 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Top Header Value Proposition */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-xs sm:text-sm font-bold text-emerald-300 shadow-xl shadow-emerald-950/60 backdrop-blur-xl animate-fade-in">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Método Clínico de 21 Dias • Acesso Vitalício sem Mensalidade</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-[var(--font-heading)] text-white tracking-tight leading-[1.06]">
            Desinche, queime gordura e transforme seu corpo em{' '}
            <span className="text-gradient-emerald">
              21 dias
            </span>
            .
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Sem passar fome, sem cortar arroz e feijão e sem horas na academia. Um plano alimentar com comidas brasileiras reais, treinos em casa de 15 minutos e diário interativo.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md sm:max-w-none mx-auto">
            <Link href={ROUTES.CHECKOUT} className="w-full sm:w-auto">
              <Button
                variant="accent"
                size="xl"
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="px-8 py-4 sm:py-5 text-base sm:text-lg font-black tracking-tight"
              >
                Começar Minha Transformação (R$ 49,90)
              </Button>
            </Link>

            <Link href={ROUTES.LOGIN} className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="xl"
                fullWidth
                className="px-6 py-4 sm:py-5 text-base font-bold text-neutral-200 hover:text-white"
              >
                Já sou aluna (Entrar)
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-neutral-400 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <strong className="text-white">4.9/5</strong> (+1.850 alunas)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 7 dias de garantia incondicional
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Zap className="w-4 h-4 text-amber-400" /> Liberação imediata no celular
            </span>
          </div>
        </div>

        {/* Interactive Feature Showcase & Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
          {/* Left: Interactive 21-Day Weight Loss Simulator (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-card-dark rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500/20 to-transparent w-32 h-32 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Simulador de Resultados
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-[var(--font-heading)] text-white">
                Qual é a sua meta?
              </h3>
              <p className="text-xs text-neutral-400">
                Descubra sua projeção realista para os primeiros 21 dias do método.
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-neutral-300">Meu peso atual:</span>
                  <span className="text-white text-sm bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    {currentWeight} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={130}
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-neutral-300">Meu peso desejado:</span>
                  <span className="text-emerald-400 text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    {targetWeight} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={currentWeight - 1}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-300 uppercase tracking-wider font-bold block">
                    Estimativa em 21 Dias
                  </span>
                  <span className="text-3xl font-black font-[var(--font-heading)] text-gradient-gold">
                    -{estimated21DaysLoss} kg
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                🎯 Em 21 dias você completará as <strong>3 Fases (Detox, Queima Ativa e Consolidação)</strong>, eliminando o inchaço e acelerando seu metabolismo de forma contínua.
              </p>
            </div>

            <Link href={ROUTES.CHECKOUT} className="block">
              <Button variant="accent" size="lg" fullWidth className="font-black text-sm">
                Quero Eliminar Meus Primeiros Quilos →
              </Button>
            </Link>
          </div>

          {/* Right: Floating App UI Mockup (7 cols) */}
          <div className="lg:col-span-7 relative">
            {/* Ambient Backlight */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

            {/* App Preview Frame */}
            <div className="relative rounded-3xl border border-white/20 bg-neutral-900/90 backdrop-blur-2xl shadow-2xl p-4 sm:p-6 space-y-4 overflow-hidden">
              {/* Fake App Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    M
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Painel Mindfit</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Ciclo Ativo: Dia 1 de 21</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" /> 1 Dia
                  </span>
                </div>
              </div>

              {/* Mockup Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Calorie Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-400">
                    <span>Meta Diária</span>
                    <span className="text-emerald-400 font-bold">1.800 kcal</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-[var(--font-heading)] text-white">
                      1.350
                    </span>
                    <span className="text-xs text-neutral-400">kcal restantes</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full w-[35%]" />
                  </div>
                </div>

                {/* Workout Card */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Treino de Hoje
                    </span>
                    <Badge variant="warning" size="xs">15 min</Badge>
                  </div>
                  <span className="text-sm font-bold text-white block">
                    Queima de Gordura em Casa
                  </span>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sem equipamentos</span>
                  </div>
                </div>
              </div>

              {/* Today's Meal Plan Mockup */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/25 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <Salad className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white block">
                      Cardápio Fase 1 (Detox & Desinflamação)
                    </span>
                    <span className="text-[11px] text-emerald-300 font-medium">
                      Omelete com espinafre, arroz, feijão, frango grelhado e lanche da tarde
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 shrink-0 bg-amber-400/10 px-2.5 py-1 rounded-full">
                  Semáforo Verde
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
