// ============================================
// Landing Page: Features & Method 21 — Mindfit
// ============================================
export function Benefits() {
  return (
    <>
      {/* FEATURES */}
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
            <div className="card">
              <div className="ic">🥗</div>
              <h3>Plano alimentar personalizado</h3>
              <p>
                Cardápios calculados para o seu objetivo, com déficit calórico seguro e opções low carb, vegana e sem lactose.
              </p>
            </div>
            <div className="card">
              <div className="ic">👨‍🍳</div>
              <h3>Receitas práticas</h3>
              <p>
                Mais de 500 receitas saudáveis, gostosas e rápidas — com calorias, macros e lista de compras automática.
              </p>
            </div>
            <div className="card">
              <div className="ic">💪</div>
              <h3>Treinos guiados</h3>
              <p>
                Fichas práticas passo a passo com cronômetro para fazer em casa ou na academia, sem necessidade de equipamentos.
              </p>
            </div>
            <div className="card">
              <div className="ic">📊</div>
              <h3>Acompanhe seu progresso</h3>
              <p>
                Gráficos de peso, medidas e fotos antes/depois. Veja sua evolução e mantenha a motivação lá em cima.
              </p>
            </div>
            <div className="card">
              <div className="ic">🔥</div>
              <h3>Metas e conquistas</h3>
              <p>
                Sequências, badges e desafios que transformam hábitos saudáveis em algo leve e viciante (do bem!).
              </p>
            </div>
            <div className="card">
              <div className="ic">🧠</div>
              <h3>Mentalidade & hábitos</h3>
              <p>
                Micro-lições diárias sobre nutrição e comportamento para você emagrecer sem efeito sanfona.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA / METODO 21 */}
      <section className="method" id="metodo">
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
              <div className="day">DIAS 1–7</div>
              <h3>Preparação</h3>
              <p>
                Reeducação alimentar, limpeza da rotina e primeiros passos. Seu corpo começa a responder e a mente entra no jogo.
              </p>
            </div>
            <div className="phase">
              <div className="day">DIAS 8–14</div>
              <h3>Aceleração</h3>
              <p>
                Controle de porções e treinos entram de vez. É aqui que os resultados começam a aparecer no espelho e na balança.
              </p>
            </div>
            <div className="phase">
              <div className="day">DIAS 15–21</div>
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
