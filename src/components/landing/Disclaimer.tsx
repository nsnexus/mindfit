// ============================================
// Landing Page: Footer — Mindfit (Clean Design)
// ============================================
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function Disclaimer() {
  return (
    <footer className="bg-[#0a3d3a] text-[#9fc7bd] py-14 px-6 text-sm">
      <div className="max-w-[1180px] mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#14524d]">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 font-[var(--font-heading)] font-extrabold text-xl text-white">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-8 h-8 object-contain"
            />
            <span>
              Mind<span className="text-[#0e9f6e]">fit</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm">
            <a href="#recursos" className="hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#metodo" className="hover:text-white transition-colors">
              Método 21
            </a>
            <a href="#planos" className="hover:text-white transition-colors">
              Planos
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Dúvidas
            </a>
            <Link href={ROUTES.LOGIN} className="hover:text-white transition-colors">
              Área do Aluno
            </Link>
          </div>
        </div>

        {/* Disclaimer Note */}
        <p className="text-xs text-[#6fa093] leading-relaxed max-w-4xl">
          ⚠️ Aviso: Os resultados variam de pessoa para pessoa e dependem de fatores individuais como dedicação, rotina e organismo. O conteúdo do Mindfit tem caráter educativo e não substitui acompanhamento médico, nutricional ou de outro profissional de saúde. Consulte sempre um profissional antes de iniciar qualquer dieta ou programa de exercícios.
        </p>

        {/* Copyright */}
        <p className="text-xs text-[#6fa093] pt-2">
          © {new Date().getFullYear()} Mindfit. Todos os direitos reservados. Feito com 💚 para a sua saúde.
        </p>
      </div>
    </footer>
  );
}
