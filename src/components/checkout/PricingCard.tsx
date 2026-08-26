// ============================================
// Pricing Summary Card — Mindfit Checkout
// ============================================
export function PricingCard() {
  return (
    <div className="price-card" style={{ maxWidth: '100%' }}>
      {/* Price Top Header */}
      <div className="price-top" style={{ padding: '32px 24px' }}>
        <span className="tag">🔒 ACESSO VITALÍCIO</span>
        <div className="price-old">de R$ 197,00 por</div>
        <div className="price-now" style={{ fontSize: '3.2rem' }}>
          <small>R$</small> 49<small>,90</small>
        </div>
        <div className="price-sub">pagamento único • acesso para sempre</div>
      </div>

      {/* Price Body */}
      <div className="price-body" style={{ padding: '28px 24px' }}>
        <ul>
          <li>
            <span className="chk">✓</span> Plano alimentar personalizado e ilimitado
          </li>
          <li>
            <span className="chk">✓</span> Mais de 500 receitas + lista de compras automática
          </li>
          <li>
            <span className="chk">✓</span> Fichas guiadas de treinos rápidos (15 min com cronômetro)
          </li>
          <li>
            <span className="chk">✓</span> Acompanhamento de peso, medidas e fotos
          </li>
          <li>
            <span className="chk">✓</span> Sistema de metas, conquistas e desafios
          </li>
          <li>
            <span className="chk">✓</span> Todas as atualizações futuras incluídas
          </li>
        </ul>

        <div className="guarantee" style={{ borderTop: '1px solid #eef4f1', paddingTop: '16px' }}>
          🛡️ Garantia incondicional de 7 dias — ou seu dinheiro de volta
        </div>
      </div>
    </div>
  );
}
