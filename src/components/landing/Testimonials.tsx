// ============================================
// Landing Page: Testimonials — Mindfit
// ============================================
export function Testimonials() {
  return (
    <section className="tst">
      <div className="container center">
        <span className="pill">💬 Quem usa, aprova</span>
        <h2 className="sec-title" style={{ marginTop: '16px' }}>
          Histórias reais de transformação
        </h2>
        <p className="sec-sub">
          Resultados variam de pessoa para pessoa — mas a consistência sempre compensa.
        </p>
        <div className="grid">
          <div className="tst-card">
            <div>
              <div className="stars">★★★★★</div>
              <p>
                "Em 21 dias eu não só perdi medida como criei uma rotina que consigo manter. As receitas salvaram meus dias corridos!"
              </p>
            </div>
            <div className="tst-who">
              <div className="tst-av">AC</div>
              <div>
                <b>Ana Clara</b>
                <span>Usa há 3 meses</span>
              </div>
            </div>
          </div>

          <div className="tst-card">
            <div>
              <div className="stars">★★★★★</div>
              <p>
                "O que mais gostei é que não é dieta maluca. É reeducação de verdade. Os treinos em casa cabem na minha rotina."
              </p>
            </div>
            <div className="tst-who">
              <div className="tst-av">RM</div>
              <div>
                <b>Rafael Moura</b>
                <span>Usa há 5 meses</span>
              </div>
            </div>
          </div>

          <div className="tst-card">
            <div>
              <div className="stars">★★★★★</div>
              <p>
                "Paguei uma vez e uso todo dia. As conquistas me motivam a não perder a sequência. Melhor investimento que fiz."
              </p>
            </div>
            <div className="tst-who">
              <div className="tst-av">JS</div>
              <div>
                <b>Juliana Souza</b>
                <span>Usa há 6 meses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
