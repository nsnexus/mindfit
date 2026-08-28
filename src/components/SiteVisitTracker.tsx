// ============================================
// Registra uma visita real (1 por sessão de navegador) no Firestore,
// pra alimentar as métricas reais do admin — nada de número inventado.
// ============================================
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setDocument } from '@/lib/firebase/firestore';

const SESSION_FLAG = 'mindfit_visit_logged';

export function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_FLAG)) return;
      sessionStorage.setItem(SESSION_FLAG, '1');
    } catch {
      // sessionStorage bloqueado (modo privado etc) — segue sem rastrear
      return;
    }

    const id = `visit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setDocument('analytics', id, {
      type: 'visit',
      path: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
