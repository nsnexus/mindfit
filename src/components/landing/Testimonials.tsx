// ============================================
// Landing Page: Social Proof & Transformations
// ============================================
import { Card } from '@/components/ui';

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
    <section className="py-20 px-4 sm:px-6 bg-neutral-50">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
            Histórias Reais
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-neutral-900">
            Quem experimentou, transformou.
          </h2>
          <p className="text-sm text-neutral-500">
            Pessoas reais que encontraram equilíbrio e resultados duradouros no Método 21 Dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} padding="lg" hoverable className="bg-white space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
                />
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{t.name}</h4>
                  <p className="text-xs text-neutral-400">{t.age} anos • {t.city}</p>
                </div>
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t.result}
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 italic leading-relaxed">
                "{t.comment}"
              </p>

              <div className="text-amber-400 text-sm">★★★★★</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
