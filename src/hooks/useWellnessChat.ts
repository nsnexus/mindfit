// ============================================
// useWellnessChat — histórico + envio de mensagens do assistente de bem-estar
// ============================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getSubDocuments, setSubDocument } from '@/lib/firebase/firestore';
import type { WellnessMessage } from '@/types/wellness';

export function useWellnessChat() {
  const { firebaseUser } = useAuthStore();
  const [messages, setMessages] = useState<WellnessMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uid = firebaseUser?.uid;

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }
    getSubDocuments<WellnessMessage>('users', uid, 'wellnessMessages').then((list) => {
      list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      setMessages(list);
      setIsLoading(false);
    });
  }, [uid]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !firebaseUser) return;

      setError(null);
      setIsSending(true);

      const userMsg: WellnessMessage = {
        id: `msg_${Date.now()}_u`,
        role: 'user',
        text: trimmed,
        createdAt: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      await setSubDocument('users', firebaseUser.uid, 'wellnessMessages', userMsg.id, userMsg);

      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch('/api/wellness/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${idToken}` },
          body: JSON.stringify({
            history: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Falha ao obter resposta.');

        const assistantMsg: WellnessMessage = {
          id: `msg_${Date.now()}_a`,
          role: 'assistant',
          text: data.text,
          flagged: !!data.flagged,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        await setSubDocument('users', firebaseUser.uid, 'wellnessMessages', assistantMsg.id, assistantMsg);
      } catch (err: any) {
        console.error('Erro no chat de bem-estar:', err);
        setError(err?.message || 'Não foi possível enviar sua mensagem. Tente novamente.');
      } finally {
        setIsSending(false);
      }
    },
    [firebaseUser, messages]
  );

  return { messages, isLoading, isSending, error, sendMessage };
}
