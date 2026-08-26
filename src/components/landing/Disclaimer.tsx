// ============================================
// Landing Page: Footer — Mindfit
// ============================================
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function Disclaimer() {
  return (
    <footer>
      <div className="container">
        <div className="top">
          <Link href={ROUTES.HOME} className="brand">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
            />
            <span>
              <span className="mind">Mind</span>
              <span className="fit">fit</span>
            </span>
          </Link>
          <div className="foot-links">
            <a href="#recursos">Recursos</a>
            <a href="#metodo">Método 21</a>
            <a href="#planos">Planos</a>
            <a href="#faq">Dúvidas</a>
            <Link href={ROUTES.LOGIN}>Área do Aluno</Link>
          </div>
        </div>
        <p className="disclaimer">
          ⚠️ Aviso: Os resultados variam de pessoa para pessoa e dependem de fatores individuais como dedicação, rotina e organismo. O conteúdo do Mindfit tem caráter educativo e não substitui acompanhamento médico, nutricional ou de outro profissional de saúde. Consulte sempre um profissional antes de iniciar qualquer dieta ou programa de exercícios.
        </p>
        <p className="copyright">
          © {new Date().getFullYear()} Mindfit. Todos os direitos reservados. Feito com 💚 para a sua saúde.
        </p>
      </div>
    </footer>
  );
}
