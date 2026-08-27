// ============================================
// Meta Pixel — Helper de rastreamento de eventos
// ============================================
export const META_PIXEL_ID = '1646850203812371';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Dispara um evento do Meta Pixel (PageView, InitiateCheckout, Purchase, etc).
 * Seguro pra chamar mesmo antes do script carregar ou em SSR (vira no-op).
 */
export function trackPixelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    window.fbq('track', eventName, params);
  } catch (err) {
    console.error('[Meta Pixel] Erro ao disparar evento:', eventName, err);
  }
}
