// ============================================
// Bem-Estar — chat de apoio emocional com IA (não substitui terapia)
// ============================================
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, HeartHandshake, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';
import { useWellnessChat } from '@/hooks/useWellnessChat';

export default function BemEstarPage() {
  const { messages, isLoading, isSending, error, sendMessage } = useWellnessChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-[#0e9f6e]" /> Bem-Estar
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Um espaço pra colocar seus pensamentos e sentimentos em palavras.
        </p>
      </div>

      {/* Aviso permanente — importante manter sempre visível */}
      <Card padding="sm" className="bg-amber-50 border border-amber-100 mb-4 shrink-0">
        <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
          <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
          Este é um assistente de IA de apoio, <strong>não um profissional de saúde</strong> — não substitui terapia
          ou acompanhamento médico. Em emergência, ligue <strong>188</strong> (CVV) ou <strong>192</strong>.
        </p>
      </Card>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-3 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <Card padding="lg" className="bg-white text-center">
            <HeartHandshake className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">Como você está se sentindo hoje?</p>
            <p className="text-xs text-neutral-400 mt-1">Escreva à vontade — esse espaço é só seu.</p>
          </Card>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[linear-gradient(135deg,#8bc34a_0%,#0e9f6e_45%,#1aa8a0_100%)] text-white rounded-br-md'
                    : m.flagged
                      ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-md'
                      : 'bg-white border border-[#eaf3ef] text-neutral-800 rounded-bl-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#eaf3ef] px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 pt-2 shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Escreva o que você está sentindo..."
          rows={1}
          className="flex-1 resize-none px-4 py-3 rounded-2xl border border-[#d7ede3] text-sm focus-ring max-h-32"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className="w-11 h-11 shrink-0 rounded-2xl bg-[linear-gradient(135deg,#8bc34a_0%,#0e9f6e_45%,#1aa8a0_100%)] text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
          aria-label="Enviar mensagem"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
