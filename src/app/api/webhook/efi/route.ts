// ============================================
// Webhook da Éfi Bank — Liberação Automática de Acesso
// ============================================
import { NextResponse } from 'next/server';
import { validateEfiWebhook } from '@/lib/efi/payment';

export async function POST(request: Request) {
  try {
    const isValido = validateEfiWebhook();
    if (!isValido) {
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }

    const payload = await request.json();

    // Notificação Pix recebida
    // Estrutura padrão Éfi: { pix: [ { txid: string, valor: string, horario: string } ] }
    console.log('[Webhook Éfi Bank] Notificação recebida:', JSON.stringify(payload));

    return NextResponse.json({ status: 'success', received: true });
  } catch (error) {
    console.error('[Webhook Éfi Bank] Erro ao processar webhook:', error);
    return NextResponse.json({ error: 'Erro interno ao processar webhook' }, { status: 500 });
  }
}
