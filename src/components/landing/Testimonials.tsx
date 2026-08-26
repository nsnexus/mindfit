// ============================================
// Landing Page: Social Proof & Transformations — Mindfit
// ============================================
import { Star, CheckCircle2, TrendingDown, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Juliana Mendes',
    age: 34,
    city: 'São Paulo, SP',
    result: '-4.8 kg em 21 dias',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    comment:
      'Eu vivia no efeito sanfona porque não conseguia cortar o arroz e o feijão. O Mindfit me ensinou a técnica da volumetria e eu emagreci comendo comida normal junto com a minha família!',
  },
  {
    name: 'Rodrigo Silveira',
    age: 41,
    city: 'Belo Horizonte, MG',
    result: '-6.2 kg em 21 dias',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    comment:
      'Com rotina corrida de trabalho e dois filhos pequenos, os treinos de 15 minutos e a lista de compras automática me pouparam horas na semana e me deram uma disposição que eu não sentia há anos.',
  },
  {
    name: 'Camila Ferreira',
    age: 28,
    city: 'Curitiba, PR',
    result: '-3.9 kg em 21 dias',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment:
      'O que mais me surpreendeu foi a mecânica de streak sem culpa. Nos dias de descanso eu usei o freeze e não desisti. A plataforma é intuitiva, linda e te mantém motivada todos os dias!',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 bg-neutral-950/90 border-t border-white/10 text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Histórias Reais
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
            Resultados que falam por si
          </h2>
          <p className="text-base text-neutral-400">
            Pessoas reais que alcançaram consistência, desincharam e transformaram sua saúde no Método 21 Dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/40 group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-md"
                  />
                  <div>
                    <h4 className="font-extrabold text-base text-white font-[var(--font-heading)]">
                      {t.name}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {t.age} anos • {t.city}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{t.result}</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aluna Verificada
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
