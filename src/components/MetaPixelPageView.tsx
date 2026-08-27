// ============================================
// Dispara PageView do Meta Pixel a cada navegação interna (SPA)
// ============================================
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPixelEvent } from '@/lib/metaPixel';

export function MetaPixelPageView() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // O script base já dispara o PageView do carregamento inicial da página —
    // só dispara de novo a partir da segunda navegação (troca de rota via SPA).
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPixelEvent('PageView');
  }, [pathname]);

  return null;
}
