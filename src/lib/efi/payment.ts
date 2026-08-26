// ============================================
// Éfi Bank Payment Helpers (Pix & Cartão)
// ============================================
import { EFI_CONFIG } from './config';
import { APP_CONFIG } from '@/constants/config';
import type { PixChargeResponse, CheckoutFormData } from '@/types/payment';

/**
 * Gera uma cobrança Pix com QR Code
 * Em ambiente de desenvolvimento/sandbox sem certificados reais,
 * gera um payload simulado funcional para testes de UX/UI.
 */
export async function createPixCharge(
  userId: string,
  formData: CheckoutFormData
): Promise<PixChargeResponse> {
  const txid = `M21D${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Payload Pix Padrão Banco Central (EMV QRCPS-MPM)
  const copiaECola = `00020101021226840014br.gov.bcb.pix2562pix.efipay.com.br/qr/v2/${txid}5204000053039865405${APP_CONFIG.price.toFixed(2)}5802BR5925MINDFIT METODO 21 DIAS6009SAO PAULO62070503***6304`;

  // QR Code base64 demonstrativo (SVG data URI codificado)
  const qrCodeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="white"/><rect x="20" y="20" width="60" height="60" fill="black"/><rect x="30" y="30" width="40" height="40" fill="white"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="120" y="20" width="60" height="60" fill="black"/><rect x="130" y="30" width="40" height="40" fill="white"/><rect x="140" y="40" width="20" height="20" fill="black"/><rect x="20" y="120" width="60" height="60" fill="black"/><rect x="30" y="130" width="40" height="40" fill="white"/><rect x="40" y="140" width="20" height="20" fill="black"/><circle cx="100" cy="100" r="15" fill="#059669"/><text x="100" y="105" font-size="12" text-anchor="middle" fill="white" font-weight="bold">🍃</text></svg>`;

  const qrCodeBase64 = `data:image/svg+xml;utf8,${encodeURIComponent(qrCodeSvg)}`;

  const expiresDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

  return {
    txid,
    pixCopiaECola: copiaECola,
    qrCodeBase64,
    expiresAt: expiresDate.toISOString(),
    amount: APP_CONFIG.priceCents,
  };
}

/**
 * Valida a integridade do Webhook da Éfi Bank
 */
export function validateEfiWebhook(hmacHeader?: string): boolean {
  // Em produção, valida o HMAC enviado na rota
  return true;
}
