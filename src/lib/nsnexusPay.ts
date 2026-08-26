// ============================================
// NSNexus Centralized Pix Gateway Helper — Mindfit
// ============================================

export interface CreatePixOptions {
  appId: string; // Ex: 'metodo-21-dias'
  externalOrderId: string; // ID do pedido no banco do seu novo site
  amount: number; // Valor (Ex: 49.90)
  description?: string; // Descrição opcional que aparece no banco do cliente
  webhookUrl?: string; // URL do webhook do seu novo site que receberá o aviso de pago
  payer?: {
    name?: string;
    email?: string;
  };
}

export interface PixResponse {
  success: boolean;
  txid: string;
  pixCopiaECola: string;
  status: string;
  amount: number;
  appId: string;
  externalOrderId: string;
  createdAt: string;
  qrCodeUrl?: string;
}

/**
 * Cria uma cobrança Pix via Gateway Centralizado NSNexus
 */
export async function createPixPayment(options: CreatePixOptions): Promise<PixResponse> {
  const gatewayUrl = process.env.NSNEXUS_GATEWAY_URL || 'https://nsmusic.nsnexus.com.br';
  const apiKey = process.env.NSNEXUS_GATEWAY_API_KEY;

  if (!apiKey) {
    throw new Error('NSNEXUS_GATEWAY_API_KEY não configurada nas variáveis de ambiente');
  }

  const response = await fetch(`${gatewayUrl}/api/gateway/v1/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Gateway-Api-Key': apiKey,
    },
    body: JSON.stringify({
      appId: options.appId,
      externalOrderId: options.externalOrderId,
      amount: options.amount,
      description: options.description || `Pagamento ${options.appId} - ${options.externalOrderId}`,
      webhookUrl: options.webhookUrl,
      payer: options.payer,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || `Erro ao gerar Pix no Gateway (HTTP ${response.status})`);
  }

  const data = (await response.json()) as PixResponse;
  // Gera URL do QR Code baseado no pixCopiaECola caso não venha da API
  if (!data.qrCodeUrl && data.pixCopiaECola) {
    data.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.pixCopiaECola)}`;
  }

  return data;
}
