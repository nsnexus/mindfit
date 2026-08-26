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
    desc: 'Desinflamação metabólica, ajuste natural do paladar, eliminação de retenção hídrica e ativação de rotinas diárias com leveza.',
  },
  {
    phase: '2',
    title: 'Fase 2: Queima Ativa & Porções',
    days: 'Dias 8 a 14',
    icon: '🔥',
    desc: 'Controle de porções através do semáforo volumétrico, treinos guiados intervalados para queima acelerada e aumento da energia.',
  },
  {
    phase: '3',
    title: 'Fase 3: Consistência & Manutenção',
    days: 'Dias 15 a 21',
    icon: '🏆',
    desc: 'Consolidação dos novos hábitos neurológicos, autonomia alimentar e prevenção definitiva do efeito sanfona.',
  },
];

const FEATURES = [
  {
    icon: '🥗',
    title: 'Cardápios Brasileiros Reais',
    desc: 'Arroz, feijão, frango, frutas da época e receitas práticas de até 20 minutos. Nada de ingredientes caros ou inacessíveis.',
  },
  {
    icon: '🚦',
    title: 'Semáforo de Volumetria',
    desc: 'Aprenda a comer mais volume com menos calorias, sem precisar passar fome ou viver de folhas secas.',
  },
  {
    icon: '⏱️',
    title: 'Treinos Guiados em Casa',
    desc: 'Exercícios curtos de 12 a 20 minutos com cronômetro sonoro e demonstrações visuais para qualquer nível.',
  },
  {
    icon: '🧊',
    title: 'Gamificação Sem Culpa',
    desc: 'Streaks com "Freeze Gentil" que perdoam dias de descanso. Aqui você constrói constância com acolhimento.',
  },
];

export function Benefits() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* The 3 Phases */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
            A Metodologia
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-neutral-900">
            Como funciona o Método 21 Dias?
          </h2>
          <p className="text-sm sm:text-base text-neutral-500">
            Dividimos a transformação em 3 ciclos estratégicos para seu corpo e sua mente se adaptarem sem sofrimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHASES.map((p) => (
            <Card key={p.phase} padding="lg" hoverable className="border-2 border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{p.icon}</span>
                <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                  {p.days}
                </span>
              </div>
              <h3 className="font-bold text-lg text-neutral-900 mb-2">{p.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-neutral-100">
          {FEATURES.map((f) => (
            <div key={f.title} className="space-y-2">
              <span className="text-3xl block">{f.icon}</span>
              <h4 className="font-bold text-neutral-900 text-base">{f.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
