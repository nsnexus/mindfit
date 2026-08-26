// ============================================
// Landing Page: Features & Method 21 — Mindfit
// ============================================
export function Benefits() {
  return (
    <>
      {/* 1. FEATURES SECTION */}
      <section className="py-24 px-6 bg-white" id="recursos">
        <div className="max-w-[1180px] mx-auto text-center space-y-4">
          <div className="inline-flex">
            <span className="pill">✨ Tudo que você precisa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-[#12352f] tracking-tight">
            Uma plataforma completa para emagrecer com saúde
          </h2>
          <p className="text-base sm:text-lg text-[#5b7a72] max-w-2xl mx-auto pb-10">
            Chega de juntar mil apps e planilhas. O Mindfit reúne alimentação, treino e mentalidade num só lugar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 text-left pt-2">
            <div className="card-clean space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center text-2xl shadow-md">
                🥗
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Plano alimentar personalizado
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Cardápios calculados para o seu objetivo, com déficit calórico seguro e opções low carb, vegana e sem lactose.
              </p>
            </div>

            <div className="card-clean space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center text-2xl shadow-md">
                👨‍🍳
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Receitas práticas
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Mais de 500 receitas saudáveis, gostosas e rápidas — com calorias, macros e lista de compras automática.
              </p>
            </div>

            <div className="card-clean space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center text-2xl shadow-md">
                💪
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Treinos guiados
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Exercícios em vídeo para fazer em casa ou na academia, do iniciante ao avançado, com ou sem equipamento.
              </p>
            </div>

            <div className="card-clean space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center text-2xl shadow-md">
                📊
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Acompanhe seu progresso
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Gráficos de peso, medidas e fotos antes/depois. Veja sua evolução e mantenha a motivação lá em cima.
              </p>
            </div>

            <div className="card-clean space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center text-2xl shadow-md">
                🔥
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Metas e conquistas
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Sequências, badges e desafios que transformam hábitos saudáveis em algo leve e motivador para a rotina.
              </p>
            </div>

            <div className="card-clean space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] flex items-center justify-center text-2xl shadow-md">
                🧠
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Mentalidade & hábitos
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Micro-lições diárias sobre nutrição e comportamento para você emagrecer de forma consistente sem efeito sanfona.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METHOD 21 SECTION */}
      <section className="py-24 px-6 bg-[#f5faf7]" id="metodo">
        <div className="max-w-[1180px] mx-auto text-center space-y-4">
          <div className="inline-flex">
            <span className="pill">🎯 O Método 21 Dias</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-[#12352f] tracking-tight">
            Transformação em 3 fases
          </h2>
          <p className="text-base sm:text-lg text-[#5b7a72] max-w-2xl mx-auto pb-10">
            Baseado na ciência da formação de hábitos: mudanças pequenas e consistentes que se tornam permanentes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white rounded-[20px] p-8 border-t-[5px] border-t-[#0e9f6e] shadow-[0_10px_30px_rgba(14,159,110,0.06)] border border-[#eaf3ef] space-y-2.5">
              <div className="font-[var(--font-heading)] font-extrabold text-sm text-[#0e9f6e] tracking-wider uppercase">
                DIAS 1–7
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Preparação
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Reeducação alimentar, limpeza da rotina e primeiros passos. Seu corpo começa a responder e a mente entra no jogo.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-8 border-t-[5px] border-t-[#8bc34a] shadow-[0_10px_30px_rgba(14,159,110,0.06)] border border-[#eaf3ef] space-y-2.5">
              <div className="font-[var(--font-heading)] font-extrabold text-sm text-[#8bc34a] tracking-wider uppercase">
                DIAS 8–14
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Aceleração
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Controle de porções e treinos entram de vez. É aqui que os resultados começam a aparecer no espelho e na balança.
              </p>
            </div>

            <div className="bg-white rounded-[20px] p-8 border-t-[5px] border-t-[#1aa8a0] shadow-[0_10px_30px_rgba(14,159,110,0.06)] border border-[#eaf3ef] space-y-2.5">
              <div className="font-[var(--font-heading)] font-extrabold text-sm text-[#1aa8a0] tracking-wider uppercase">
                DIAS 15–21
              </div>
              <h3 className="text-xl font-bold font-[var(--font-heading)] text-[#12352f]">
                Consistência
              </h3>
              <p className="text-sm text-[#5b7a72] leading-relaxed">
                Os hábitos se consolidam. Você aprende a manter os resultados de forma leve e sustentável — sem efeito sanfona.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
