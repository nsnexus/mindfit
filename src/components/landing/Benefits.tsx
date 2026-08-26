// ============================================
// Landing Page: Features & Method 21 — Mindfit
// ============================================
import {
  Salad,
  ChefHat,
  Dumbbell,
  LineChart,
  Award,
  Brain,
  Sparkles,
  Flame,
  Trophy,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Salad,
    tag: 'Sem dietas malucas',
    title: 'Plano alimentar personalizado',
    description:
      'Cardápios calculados para o seu objetivo, com déficit calórico seguro e opções low carb, vegana e sem lactose.',
    gradient: 'from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0]',
    shadowColor: 'rgba(14, 159, 110, 0.25)',
  },
  {
    icon: ChefHat,
    tag: '+500 Opções práticas',
    title: 'Receitas práticas',
    description:
      'Mais de 500 receitas saudáveis, gostosas e rápidas — com calorias, macros e lista de compras automática.',
    gradient: 'from-[#1aa8a0] via-[#0e9f6e] to-[#8bc34a]',
    shadowColor: 'rgba(26, 168, 160, 0.25)',
  },
  {
    icon: Dumbbell,
    tag: '15 Min em Casa',
    title: 'Treinos guiados',
    description:
      'Fichas práticas passo a passo com cronômetro para fazer em casa ou na academia, sem necessidade de equipamentos.',
    gradient: 'from-[#0e9f6e] to-[#0f5e5a]',
    shadowColor: 'rgba(15, 94, 90, 0.25)',
  },
  {
    icon: LineChart,
    tag: 'Métricas & Fotos',
    title: 'Acompanhe seu progresso',
    description:
      'Gráficos de peso, medidas e fotos antes/depois. Veja sua evolução e mantenha a motivação lá em cima.',
    gradient: 'from-[#8bc34a] to-[#0e9f6e]',
    shadowColor: 'rgba(139, 195, 74, 0.25)',
  },
  {
    icon: Award,
    tag: 'Gamificação & Medalhas',
    title: 'Metas e conquistas',
    description:
      'Sequências de dias (streaks), badges e desafios que transformam hábitos saudáveis em algo leve e motivador.',
    gradient: 'from-[#f59e0b] via-[#eab308] to-[#8bc34a]',
    shadowColor: 'rgba(245, 158, 11, 0.25)',
  },
  {
    icon: Brain,
    tag: 'Reprogramação Mental',
    title: 'Mentalidade & hábitos',
    description:
      'Micro-lições diárias sobre nutrição e comportamento para você emagrecer de forma consistente sem efeito sanfona.',
    gradient: 'from-[#1aa8a0] via-[#0f5e5a] to-[#12352f]',
    shadowColor: 'rgba(26, 168, 160, 0.25)',
  },
];

export function Benefits() {
  return (
    <>
      {/* 1. FEATURES SECTION */}
      <section className="features" id="recursos">
        <div className="container center">
          <span className="pill">✨ Tudo que você precisa</span>
          <h2 className="sec-title" style={{ marginTop: '16px' }}>
            Uma plataforma completa para emagrecer com saúde
          </h2>
          <p className="sec-sub">
            Chega de juntar mil apps e planilhas. O Mindfit reúne alimentação, treino e mentalidade num só lugar.
          </p>

          <div className="grid">
            {FEATURES.map((f) => {
              const IconComponent = f.icon;
              return (
                <div
                  key={f.title}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div>
                    {/* Top Row: Icon + Mini Tag */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white`}
                        style={{
                          boxShadow: `0 10px 24px ${f.shadowColor}`,
                          borderRadius: '16px',
                        }}
                      >
                        <IconComponent className="w-7 h-7 text-white" strokeWidth={2.2} />
                      </div>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#0e9f6e',
                          background: '#e6f6ef',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontFamily: 'var(--font-heading), Poppins, sans-serif',
                        }}
                      >
                        {f.tag}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                      {f.title}
                    </h3>

                    <p style={{ margin: 0 }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA / METODO 21 */}
      <section className="method" id="como">
        <div className="container center">
          <span className="pill">🎯 O Método 21 Dias</span>
          <h2 className="sec-title" style={{ marginTop: '16px' }}>
            Transformação em 3 fases
          </h2>
          <p className="sec-sub">
            Baseado na ciência da formação de hábitos: mudanças pequenas e consistentes que se tornam permanentes.
          </p>

          <div className="phases">
            <div className="phase">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="day">DIAS 1–7</span>
                <div className="w-8 h-8 rounded-xl bg-[#0e9f6e]/10 text-[#0e9f6e] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3>Preparação</h3>
              <p>
                Reeducação alimentar, limpeza da rotina e primeiros passos. Seu corpo começa a responder e a mente entra no jogo.
              </p>
            </div>

            <div className="phase">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="day" style={{ color: '#8bc34a' }}>DIAS 8–14</span>
                <div className="w-8 h-8 rounded-xl bg-[#8bc34a]/15 text-[#659828] flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <h3>Aceleração</h3>
              <p>
                Controle de porções e treinos entram de vez. É aqui que os resultados começam a aparecer no espelho e na balança.
              </p>
            </div>

            <div className="phase">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="day" style={{ color: '#1aa8a0' }}>DIAS 15–21</span>
                <div className="w-8 h-8 rounded-xl bg-[#1aa8a0]/10 text-[#1aa8a0] flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
              <h3>Consistência</h3>
              <p>
                Os hábitos se consolidam. Você aprende a manter os resultados de forma leve e sustentável — sem efeito sanfona.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
