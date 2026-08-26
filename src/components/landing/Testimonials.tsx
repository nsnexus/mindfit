// ============================================
// Landing Page: Testimonials — Mindfit (Clean Design)
// ============================================
const TESTIMONIALS = [
  {
    initials: 'AC',
    name: 'Ana Clara',
    time: 'Usa há 3 meses',
    comment:
      'Em 21 dias eu não só perdi medida como criei uma rotina que consigo manter. As receitas salvaram meus dias corridos!',
  },
  {
    initials: 'RM',
    name: 'Rafael Moura',
    time: 'Usa há 5 meses',
    comment:
      'O que mais gostei é que não é dieta maluca. É reeducação de verdade. Os treinos em casa cabem na minha rotina.',
  },
  {
    initials: 'JS',
    name: 'Juliana Souza',
    time: 'Usa há 6 meses',
    comment:
      'Paguei uma vez e uso todo dia. As conquistas me motivam a não perder a sequência. Melhor investimento que fiz.',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-[1180px] mx-auto text-center space-y-4">
        <div className="inline-flex">
          <span className="pill">💬 Quem usa, aprova</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-[#12352f] tracking-tight">
          Histórias reais de transformação
        </h2>
        <p className="text-base sm:text-lg text-[#5b7a72] max-w-xl mx-auto pb-10">
          Resultados variam de pessoa para pessoa — mas a consistência sempre compensa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-[20px] p-8 border border-[#eaf3ef] shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="text-[#f5b301] text-base tracking-wider font-bold">
                  ★★★★★
                </div>
                <p className="text-sm sm:text-base text-[#37564e] italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center text-white font-bold font-[var(--font-heading)] text-sm shadow-md">
                  {t.initials}
                </div>
                <div>
                  <b className="font-[var(--font-heading)] text-sm text-[#12352f] block font-bold">
                    {t.name}
                  </b>
                  <span className="text-xs text-[#5b7a72] block">
                    {t.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
