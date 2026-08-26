// ============================================
// API Route: Checar Status do Pagamento
// ============================================
import { NextResponse } from 'next/server';
import { getDocument } from '@/lib/firebase/firestore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId não fornecido' }, { status: 400 });
    }

    const order = await getDocument<{ status: string; paidAt?: string }>('orders', orderId);

    if (!order) {
      return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({
      status: order.status || 'PENDING',
      isPaid: order.status === 'PAID',
      paidAt: order.paidAt || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
