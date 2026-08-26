// ============================================
// Landing Page: Perguntas Frequentes (FAQ) — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    q: 'O pagamento é mensal ou único?',
    a: 'O pagamento é 100% ÚNICO! Você paga apenas R$ 49,90 uma única vez e tem acesso vitalício a toda a plataforma e suas atualizações, sem nenhuma mensalidade ou cobrança surpresa no futuro.',
  },
  {
    q: 'Preciso de academia ou equipamentos para fazer os treinos?',
    a: 'Não! Todos os treinos do programa foram desenhados especificamente para serem feitos em casa usando apenas o peso do próprio corpo e no máximo um colchonete ou toalha.',
  },
  {
    q: 'Os alimentos do plano são difíceis de encontrar ou caros?',
    a: 'De forma alguma! Nosso banco de alimentos e receitas é 100% adaptado à culinária brasileira real: arroz, feijão, frango, ovos, legumes da feira, frutas da época e aveia. Comida de verdade que você encontra em qualquer supermercado ou feira.',
  },
  {
    q: 'Quanto tempo por dia preciso dedicar?',
    a: 'Cerca de 15 a 20 minutos para os treinos guiados e apenas 2 a 3 minutos para registrar suas refeições e água no diário.',
  },
  {
    q: 'E se eu não me adaptar ou não gostar?',
    a: 'Você tem 7 dias de garantia incondicional. Basta nos enviar um e-mail ou mensagem que devolveremos 100% do valor pago sem perguntas ou burocracia.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 bg-neutral-950 border-t border-white/10 text-white">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/30">
            <HelpCircle className="w-3.5 h-3.5" /> Dúvidas Comuns
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-heading)] text-white tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-base text-neutral-400">
            Tudo o que você precisa saber antes de iniciar sua transformação de 21 dias.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl sm:rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left font-extrabold text-base sm:text-lg text-white flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className="font-[var(--font-heading)]">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-emerald-500/20 text-emerald-300' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-neutral-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
