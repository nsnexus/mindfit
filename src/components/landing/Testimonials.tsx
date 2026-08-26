// ============================================
// Landing Page: Social Proof & Transformations
// ============================================
const TESTIMONIALS = [
  {
    name: 'Juliana Mendes',
    age: 34,
    city: 'São Paulo, SP',
    result: '-4.8 kg em 21 dias',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    comment:
      'Eu vivia no efeito sanfona porque não conseguia cortar arroz e feijão. O Mindfit me ensinou o semáforo volumétrico e eu emagreci comendo comida de verdade com a minha família!',
  },
  {
    name: 'Rodrigo Silveira',
    age: 41,
    city: 'Belo Horizonte, MG',
    result: '-6.2 kg em 21 dias',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    comment:
      'Rotina corrida de trabalho e filhos. Os treinos de 15 minutos e a lista de compras automática salvaram meu tempo e me deram uma disposição que eu não sentia há 10 anos.',
  },
  {
    name: 'Camila Ferreira',
    age: 28,
    city: 'Curitiba, PR',
    result: '-3.9 kg em 21 dias',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment:
      'O que mais amei foi a mecânica de streak sem culpa. Nos dias difíceis usei o freeze e não desisti. A plataforma é linda, fácil e super motivadora!',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 bg-neutral-900/90 border-t border-white/10">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-500/30">
            Histórias Reais
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
            Quem experimentou, transformou.
          </h2>
          <p className="text-base text-neutral-400">
            Alunas e alunos reais que conquistaram constância e resultados duradouros no Método 21 Dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/30"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-base text-white font-[var(--font-heading)]">
                      {t.name}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {t.age} anos • {t.city}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span>⚡</span>
                  <span>{t.result}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span className="text-amber-400 font-bold text-sm tracking-widest">
                  ★★★★★
                </span>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  ✓ Aluna Verificada
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
