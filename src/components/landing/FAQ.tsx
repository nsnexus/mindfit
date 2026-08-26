// ============================================
// Landing Page: FAQ — Mindfit (Clean Design)
// ============================================
'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'O acesso é realmente vitalício?',
    a: 'Sim! Você paga uma única vez R$ 49,90 e tem acesso a toda a plataforma para sempre, incluindo as atualizações futuras. Sem mensalidade.',
  },
  {
    q: 'Preciso de equipamentos para os treinos?',
    a: 'Não. Temos treinos completos para fazer em casa sem nenhum equipamento, além de opções para quem treina na academia.',
  },
  {
    q: 'Funciona para qualquer objetivo?',
    a: 'O Mindfit é focado em emagrecimento saudável e criação de hábitos. Você personaliza suas metas no onboarding de acordo com o seu perfil.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você tem 7 dias de garantia incondicional. Se não for para você, devolvemos 100% do valor, sem burocracia.',
  },
  {
    q: 'Substitui um nutricionista ou médico?',
    a: 'Não. O Mindfit é uma ferramenta educativa de apoio à sua jornada. Recomendamos sempre acompanhamento profissional, especialmente se você tem alguma condição de saúde.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-[#f5faf7]" id="faq">
      <div className="max-w-[1180px] mx-auto space-y-4">
        <div className="text-center space-y-3 pb-8">
          <div className="inline-flex">
            <span className="pill">❓ Dúvidas frequentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-[#12352f] tracking-tight">
            Ainda com perguntas?
          </h2>
          <p className="text-base sm:text-lg text-[#5b7a72] max-w-xl mx-auto">
            Reunimos as dúvidas mais comuns antes de você começar.
          </p>
        </div>

        <div className="max-w-[760px] mx-auto space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-[#eaf3ef] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left font-bold text-base sm:text-lg text-[#12352f] flex items-center justify-between gap-4 font-[var(--font-heading)] hover:bg-[#fafdfc] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`text-2xl text-[#0e9f6e] font-light shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-[#5b7a72] leading-relaxed border-t border-[#f0f6f3] pt-4">
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
