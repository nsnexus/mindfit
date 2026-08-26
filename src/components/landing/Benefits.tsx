// ============================================
// Landing Page: Benefits & 3-Phase Method — Mindfit
// ============================================
import { Leaf, Flame, Trophy, Salad, Scale, Dumbbell, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';

const PHASES = [
  {
    phase: '1',
    title: 'Fase 1: Preparação & Desinflamação',
    days: 'Dias 1 a 7',
    icon: Leaf,
    color: 'from-emerald-950/80 via-neutral-900 to-neutral-950 border-emerald-500/30 text-emerald-400',
    desc: 'Desinflamação acelerada, corte natural da retenção líquida e quebra do ciclo de compulsão por doces e ultraprocessados.',
    highlights: ['Detox natural de 7 dias', 'Cardápios anti-inchaço', 'Ativação metabólica matinal'],
  },
  {
    phase: '2',
    title: 'Fase 2: Queima Ativa & Volumetria',
    days: 'Dias 8 a 14',
    icon: Flame,
    color: 'from-amber-950/80 via-neutral-900 to-neutral-950 border-amber-500/30 text-amber-400',
    desc: 'Ativação da queima acelerada de gordura corporal utilizando a técnica do semáforo volumétrico para comer pratos fartos sem passar fome.',
    highlights: ['Semáforo de porções volumétricas', 'Treinos intervalados de 15 min', 'Aumento imediato de energia'],
  },
  {
    phase: '3',
    title: 'Fase 3: Consolidação & Autonomia',
    days: 'Dias 15 a 21',
    icon: Trophy,
    color: 'from-teal-950/80 via-neutral-900 to-neutral-950 border-teal-500/30 text-teal-400',
    desc: 'Consolidação de hábitos permanentes, autonomia para comer fora sem medo de engordar e blindagem total contra o efeito sanfona.',
    highlights: ['Blindagem anti-efeito sanfona', 'Liberdade nas refeições livres', 'Metabolismo acelerado reprogramado'],
  },
];

const FEATURES = [
  {
    icon: Salad,
    title: 'Cardápios Brasileiros Reais',
    desc: 'Arroz, feijão, frango, ovos, legumes e frutas da estação. Comida gostosa, acessível e fácil de preparar.',
  },
  {
    icon: Scale,
    title: 'Semáforo de Volumetria',
    desc: 'Coma pratos cheios e volumosos que saciam de verdade ingerindo menos calorias.',
  },
  {
    icon: Dumbbell,
    title: 'Treinos de 15 Min em Casa',
    desc: 'Vídeos guiados com cronômetro sonoro para fazer na sala sem nenhum equipamento.',
  },
  {
    icon: Sparkles,
    title: 'Gamificação & Freeze Gentil',
    desc: 'Ganhe medalhas e mantenha sua sequência de dias sem culpa, com perdão em dias atípicos.',
  },
];

export function Benefits() {
  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 border-t border-white/10 bg-neutral-950">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[160px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/30">
            A Metodologia em 3 Fases
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
            Como funciona o Método 21 Dias?
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Uma progressão estratégica dividida em 3 semanas para seu corpo e sua mente se adaptarem com leveza, garantindo resultados visíveis desde a primeira semana.
          </p>
        </div>

        {/* The 3 Phases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PHASES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.phase}
                className={`
                  rounded-3xl p-6 sm:p-8 bg-gradient-to-b ${p.color}
                  border backdrop-blur-2xl shadow-xl flex flex-col justify-between
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group
                `}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white tracking-wider">
                      {p.days}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-xl sm:text-2xl text-white font-[var(--font-heading)] pt-2 tracking-tight">
                    {p.title}
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 space-y-2.5">
                  {p.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 space-y-3 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-white text-lg font-[var(--font-heading)]">
                  {f.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mid-page CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black font-[var(--font-heading)] text-white">
              Pronta para dar o primeiro passo?
            </h3>
            <p className="text-sm text-neutral-300">
              Tenha em mãos o passo a passo completo para os seus 21 dias hoje mesmo.
            </p>
          </div>
          <Link href={ROUTES.CHECKOUT} className="inline-block">
            <Button variant="accent" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />} className="font-black">
              Quero Minha Vaga com 75% de Desconto
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
