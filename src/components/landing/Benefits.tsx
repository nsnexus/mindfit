// ============================================
// Landing Page: Benefits & 3-Phase Method Section
// ============================================
import { Card } from '@/components/ui';

const PHASES = [
  {
    phase: '1',
    title: 'Fase 1: Preparação & Limpeza',
    days: 'Dias 1 a 7',
    icon: '🌱',
    color: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-400',
    desc: 'Desinflamação metabólica acelerada, eliminação de retenção hídrica, ativação intestinal e ajuste natural do paladar para quebrar o ciclo de compulsão por doces.',
    highlights: ['Detox natural de 7 dias', 'Cardápios anti-inchaço', 'Ativação matinal leve'],
  },
  {
    phase: '2',
    title: 'Fase 2: Queima Ativa & Porções',
    days: 'Dias 8 a 14',
    icon: '🔥',
    color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-400',
    desc: 'Ativação da queima contínua de gordura com a técnica do semáforo de volumetria e treinos guiados de 15 minutos para acelerar seu gasto calórico diário.',
    highlights: ['Semáforo volumétrico', 'Treinos intervalados rápidos', 'Aumento de disposição'],
  },
  {
    phase: '3',
    title: 'Fase 3: Consistência & Manutenção',
    days: 'Dias 15 a 21',
    icon: '🏆',
    color: 'from-teal-500/20 to-teal-700/10 border-teal-500/30 text-teal-400',
    desc: 'Consolidação de novos hábitos neurológicos, autonomia para comer fora sem culpa e blindagem contra o efeito sanfona para você manter seus resultados.',
    highlights: ['Autonomia nas escolhas', 'Prevenção do efeito sanfona', 'Metabolismo reprogramado'],
  },
];

const FEATURES = [
  {
    icon: '🥗',
    title: 'Cardápios Brasileiros Reais',
    desc: 'Arroz, feijão, frango, ovos e frutas da estação. Comida de verdade, gostosa e acessível para o seu bolso.',
  },
  {
    icon: '🚦',
    title: 'Semáforo de Volumetria',
    desc: 'Aprenda a comer pratos cheios e volumosos com menos calorias, sem nunca passar fome.',
  },
  {
    icon: '⏱️',
    title: 'Treinos de 15 Min em Casa',
    desc: 'Vídeos guiados com cronômetro sonoro e demonstrações para fazer na sala sem nenhum equipamento.',
  },
  {
    icon: '🧊',
    title: 'Gamificação & Freeze Gentil',
    desc: 'Ganhe medalhas e mantenha sua sequência mesmo em dias de descanso com perdão inteligente.',
  },
];

export function Benefits() {
  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 border-t border-white/10 bg-neutral-950/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            A Metodologia
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
            Como funciona o Método 21 Dias?
          </h2>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Dividimos sua jornada em 3 fases estratégicas para seu corpo e sua mente se adaptarem com leveza e resultados visíveis semana a semana.
          </p>
        </div>

        {/* The 3 Phases Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PHASES.map((p) => (
            <div
              key={p.phase}
              className={`
                rounded-2xl p-6 sm:p-8 bg-gradient-to-b ${p.color} bg-neutral-900/80
                border backdrop-blur-xl shadow-xl flex flex-col justify-between
                transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl
              `}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{p.icon}</span>
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                    {p.days}
                  </span>
                </div>

                <h3 className="font-bold text-xl sm:text-2xl text-white font-[var(--font-heading)] pt-2">
                  {p.title}
                </h3>

                <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
            >
              <span className="text-3xl p-2.5 rounded-xl bg-emerald-500/10 inline-block border border-emerald-500/20">
                {f.icon}
              </span>
              <h4 className="font-bold text-white text-lg font-[var(--font-heading)]">
                {f.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
