// ============================================
// Webhook de Pagamento — NSNexus Gateway
// ============================================
import { NextResponse } from 'next/server';
import { setDocument, updateDocument, getDocument, getDocuments } from '@/lib/firebase/firestore';
import { where } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    // 1. Valida se a notificação realmente veio do seu Gateway
    const signature =
      req.headers.get('x-gateway-signature') ||
      req.headers.get('x-gateway-secret') ||
      req.headers.get('x-gateway-api-key');

    const expectedSecret = process.env.NSNEXUS_GATEWAY_API_KEY;

    if (!signature || signature !== expectedSecret) {
      console.warn('[Webhook] Assinatura do gateway inválida ou não fornecida');
      return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
    }

    const payload = await req.json();
    const { event, externalOrderId, status, amount, txid, payer } = payload;

    console.log(`[Webhook Gateway] Recebido: ${event} | Status: ${status} | Pedido: ${externalOrderId}`);

    // 2. Quando o pagamento é confirmado
    if (event === 'payment.approved' || status === 'PAID') {
      console.log(`[Pagamento Aprovado] Pedido: ${externalOrderId} | Valor: R$ ${amount}`);

      // Atualiza o documento do pedido no Firestore
      await updateDocument('orders', externalOrderId, {
        status: 'PAID',
        paidAt: new Date().toISOString(),
        amount: Number(amount),
        txid: txid || '',
      });

      // Busca dados do pedido para encontrar o usuário
      const order = await getDocument<{ userId?: string; email?: string }>('orders', externalOrderId);
      const targetEmail = order?.email || payer?.email;
      const targetUserId = order?.userId;

      if (targetUserId) {
        await updateDocument('users', targetUserId, {
          isPremium: true,
          paymentId: txid || externalOrderId,
          premiumSince: new Date().toISOString(),
        });
      } else if (targetEmail) {
        // Localiza usuário por e-mail caso não tenha userId direto
        const users = await getDocuments<{ id: string; email: string }>('users', [
          where('email', '==', targetEmail.toLowerCase().trim()),
        ]);

        if (users && users.length > 0) {
          await updateDocument('users', users[0].id, {
            isPremium: true,
            paymentId: txid || externalOrderId,
            premiumSince: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('[Webhook Error]:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
