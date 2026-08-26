// ============================================
// Landing Page: Perguntas Frequentes (FAQ)
// ============================================
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui';

const FAQS = [
  {
    q: 'O pagamento é mensal ou único?',
    a: 'O pagamento é 100% ÚNICO! Você paga apenas R$ 49,90 uma vez e tem acesso vitalício a toda a plataforma, sem nenhuma mensalidade ou cobrança recorrente.',
  },
  {
    q: 'Preciso de academia ou equipamentos para fazer os treinos?',
    a: 'Não! Todos os treinos do programa foram desenhados especificamente para serem feitos em casa usando apenas o peso do próprio corpo e objetos simples do dia a dia (como uma cadeira ou colchonete).',
  },
  {
    q: 'Os alimentos do plano são difíceis de encontrar ou caros?',
    a: 'De forma alguma! Nosso banco de alimentos e receitas é 100% adaptado à culinária brasileira real: arroz, feijão, frango, ovos, legumes da feira, frutas da época e aveia. Comida de verdade que você encontra em qualquer supermercado.',
  },
  {
    q: 'Quanto tempo por dia preciso dedicar?',
    a: 'Cerca de 15 a 20 minutos para os treinos guiados e apenas 2 a 3 minutos para registrar suas refeições no diário.',
  },
  {
    q: 'E se eu não me adaptar ou não gostar?',
    a: 'Você tem 7 dias de garantia incondicional. Basta solicitar dentro do prazo que devolveremos 100% do valor pago sem perguntas ou burocracia.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
            Dúvidas Comuns
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-heading)] text-neutral-900">
            Perguntas Frequentes
          </h2>
          <p className="text-sm text-neutral-500">
            Tudo o que você precisa saber antes de começar sua transformação de 21 dias.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card
                key={faq.q}
                padding="none"
                className="overflow-hidden border border-neutral-200 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-neutral-900 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl text-neutral-400 font-normal">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
