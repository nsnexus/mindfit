// ============================================
// Landing Page: Pricing — Mindfit
// ============================================
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function PricingSection() {
  return (
    <section className="pricing" id="planos">
      <div className="container center">
        <span className="pill">💎 Oferta de lançamento</span>
        <h2 className="sec-title" style={{ marginTop: '16px' }}>
          Pague uma vez. Use para sempre.
        </h2>
        <p className="sec-sub">
          Sem mensalidade, sem pegadinha. Um único pagamento e o Mindfit é seu para a vida toda.
        </p>
        <div className="price-card">
          <div className="price-top">
            <span className="tag">🔒 ACESSO VITALÍCIO</span>
            <div className="price-old">de R$ 197,00 por</div>
            <div className="price-now">
              <small>R$</small> 49<small>,90</small>
            </div>
            <div className="price-sub">pagamento único • acesso para sempre</div>
          </div>
          <div className="price-body">
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
            <Link href={ROUTES.CHECKOUT} className="btn btn-primary">
              Garantir meu acesso vitalício →
            </Link>
            <div className="guarantee">
              🛡️ Garantia incondicional de 7 dias — ou seu dinheiro de volta
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
