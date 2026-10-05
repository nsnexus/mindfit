// ============================================
// API Route: Checar Status do Pagamento
// ============================================
import { NextResponse } from 'next/server';
import { getDocument, updateDocument, getDocuments } from '@/lib/firebase/firestore';
import { getPixCharge } from '@/lib/nsnexusPay';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId não fornecido' }, { status: 400 });
    }

    const order = await getDocument<{
      status: string;
      paidAt?: string;
      txid?: string;
      userId?: string;
      email?: string;
      amount?: number;
    }>('orders', orderId);

    if (!order) {
      return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 });
    }

    // 1. Já confirmado previamente no Firestore
    if (order.status === 'PAID') {
      return NextResponse.json({
        status: 'PAID',
        isPaid: true,
        paidAt: order.paidAt || null,
      });
    }

    // 2. Se ainda está pendente no Firestore, consulta a Efí em tempo real pelo Gateway
    if (order.txid) {
      try {
        const liveCharge = await getPixCharge(order.txid);
        if (
          liveCharge &&
          (liveCharge.status === 'PAID' ||
            liveCharge.status === 'CONCLUIDA' ||
            liveCharge.status === 'concluida')
        ) {
          const paidAt = liveCharge.paidAt || new Date().toISOString();

          // Atualiza o pedido no Firestore
          await updateDocument('orders', orderId, {
            status: 'PAID',
            paidAt,
          });

          // Se tiver usuário associado, já libera o acesso no banco
          if (order.userId) {
            await updateDocument('users', order.userId, {
              isPremium: true,
              paymentId: order.txid,
              premiumSince: paidAt,
            });
          } else if (order.email) {
            const { where } = await import('firebase/firestore');
            const users = await getDocuments<{ id: string; email: string }>('users', [
              where('email', '==', order.email.toLowerCase().trim()),
            ]);
            if (users && users.length > 0) {
              await updateDocument('users', users[0].id, {
                isPremium: true,
                paymentId: order.txid,
                premiumSince: paidAt,
              });
            }
          }

          return NextResponse.json({
            status: 'PAID',
            isPaid: true,
            paidAt,
          });
        }
      } catch (checkErr) {
        console.warn('[Status Check Live]: Erro ao consultar Efí via gateway:', checkErr);
      }
    }

    return NextResponse.json({
      status: order.status || 'PENDING',
      isPaid: false,
      paidAt: null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
