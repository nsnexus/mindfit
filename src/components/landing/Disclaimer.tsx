// ============================================
// Landing Page: Footer & Medical Disclaimer
// ============================================
import Link from 'next/link';
import { APP_CONFIG, DISCLAIMER_TEXT } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export function Disclaimer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 px-4 sm:px-6 border-t border-white/10 text-xs relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top brand & links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 text-white font-extrabold text-xl font-[var(--font-heading)]">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-7 h-7 object-contain"
            />
            <span>{APP_CONFIG.name}</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-400 text-xs">
            <Link href={ROUTES.LOGIN} className="hover:text-emerald-400 transition-colors">
              Área do Aluno
            </Link>
            <Link href={ROUTES.CHECKOUT} className="hover:text-emerald-400 transition-colors">
              Garantir Vaga Vitalícia
            </Link>
            <span className="text-neutral-700">•</span>
            <span className="text-neutral-500">Pagamento 100% Seguro via Pix</span>
          </div>
        </div>

        {/* Medical & Legal Disclaimer */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-neutral-500 leading-relaxed text-[11px] max-w-4xl mx-auto">
          <p className="font-semibold text-neutral-400 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>Aviso Ético & Legal de Saúde:</span>
          </p>
          <p>{DISCLAIMER_TEXT}</p>
          <p>
            O acompanhamento médico e nutricional individualizado é insubstituível. Este aplicativo é uma ferramenta de apoio educacional e organização de hábitos de estilo de vida. Consulte sempre seu médico antes de iniciar novos exercícios físicos ou alterações alimentares.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-neutral-600 text-[11px] pt-4">
          © {new Date().getFullYear()} {APP_CONFIG.name} — Método 21 Dias. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
