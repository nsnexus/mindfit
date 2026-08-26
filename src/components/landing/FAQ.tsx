// ============================================
// Landing Page: FAQ — Mindfit
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
    q: 'Substitui um nutricionista ou médico?',
    a: 'Não. O Mindfit é uma ferramenta educativa de apoio à sua jornada. Recomendamos sempre acompanhamento profissional, especialmente se você tem alguma condição de saúde.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="center">
          <span className="pill">❓ Dúvidas frequentes</span>
          <h2 className="sec-title" style={{ marginTop: '16px' }}>
            Ainda com perguntas?
          </h2>
          <p className="sec-sub">
            Reunimos as dúvidas mais comuns antes de você começar.
          </p>
        </div>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="faq-q"
                >
                  <span>{faq.q}</span>
                  <span className="plus">+</span>
                </button>
                <div className="faq-a">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
