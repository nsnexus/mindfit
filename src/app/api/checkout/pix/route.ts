// ============================================
// API Route: Gerar Cobrança Pix via NSNexus Gateway
// ============================================
import { NextResponse } from 'next/server';
import { createPixPayment } from '@/lib/nsnexusPay';
import { setDocument } from '@/lib/firebase/firestore';
import { APP_CONFIG } from '@/constants/config';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, cpf, phone, userId } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Nome completo e e-mail são obrigatórios.' },
        { status: 400 }
      );
    }

    const externalOrderId = `mindfit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mindfit.pages.dev';
    const webhookUrl = `${appUrl}/api/webhooks/payment`;

    // 1. Cria cobrança no Gateway Centralizado NSNexus
    const pixResult = await createPixPayment({
      appId: 'metodo-21-dias',
      externalOrderId,
      amount: APP_CONFIG.price, // R$ 29.90
      description: `Mindfit Método 21 Dias - ${fullName}`,
      webhookUrl,
      payer: {
        name: fullName,
        email,
      },
    });

    // 2. Salva o pedido pendente no Firestore
    await setDocument('orders', externalOrderId, {
      orderId: externalOrderId,
      appId: 'metodo-21-dias',
      userId: userId || null,
      customerName: fullName,
      email: email.toLowerCase().trim(),
      cpf: cpf || '',
      phone: phone || '',
      amount: APP_CONFIG.price,
      status: 'PENDING',
      txid: pixResult.txid,
      pixCopiaECola: pixResult.pixCopiaECola,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      externalOrderId,
      txid: pixResult.txid,
      pixCopiaECola: pixResult.pixCopiaECola,
      qrCodeUrl: pixResult.qrCodeUrl,
      amount: APP_CONFIG.price,
    });
  } catch (err: any) {
    console.error('[API Checkout Pix Error]:', err.message);
    return NextResponse.json(
      { error: err.message || 'Erro ao processar cobrança Pix.' },
      { status: 500 }
    );
  }
}
