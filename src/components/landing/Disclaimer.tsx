// ============================================
// Landing Page: Footer & Medical Disclaimer
// ============================================
import Link from 'next/link';
import { APP_CONFIG, DISCLAIMER_TEXT } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function Disclaimer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 px-4 sm:px-6 border-t border-neutral-800 text-xs">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top brand & links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 text-white font-bold text-lg font-[var(--font-heading)]">
            <span>🍃</span>
            <span>{APP_CONFIG.name}</span>
          </Link>

          <div className="flex gap-6 text-neutral-400">
            <Link href={ROUTES.LOGIN} className="hover:text-white transition-colors">
              Área do Aluno
            </Link>
            <Link href={ROUTES.CHECKOUT} className="hover:text-white transition-colors">
              Garantir Acesso
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidade (LGPD)
            </a>
          </div>
        </div>

        {/* Medical & Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800 space-y-2 text-neutral-500 leading-relaxed text-[11px]">
          <p className="font-semibold text-neutral-400">⚠️ Aviso Legal e Ético de Saúde:</p>
          <p>{DISCLAIMER_TEXT}</p>
          <p>
            O acompanhamento médico e nutricional é insubstituível. Nunca inicie qualquer programa de exercícios ou restrição alimentar sem antes consultar seu médico de confiança. A prática de atividades físicas deve respeitar os limites individuais de cada organismo.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-neutral-600 text-[10px]">
          © {new Date().getFullYear()} {APP_CONFIG.name} — Método 21 Dias. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
