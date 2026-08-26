// ============================================
// Landing Page: Final CTA Banner — Mindfit
// ============================================
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function FinalCTA() {
  return (
    <section className="cta-final">
      <div className="container">
        <h2>Comece sua transformação hoje 🌿</h2>
        <p>
          Junte-se a milhares de pessoas que descobriram que emagrecer com saúde pode ser leve. Sua melhor versão começa agora.
        </p>
        <Link href={ROUTES.CHECKOUT} className="btn btn-primary">
          Quero meu acesso vitalício por R$ 49,90
        </Link>
      </div>
    </section>
  );
}
