// ============================================
// API Route: Gerar Cobrança Pix (Éfi Bank)
// ============================================
import { NextResponse } from 'next/server';
import { createPixCharge } from '@/lib/efi/payment';
import type { CheckoutFormData } from '@/types/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, formData } = body as {
      userId: string;
      formData: CheckoutFormData;
    };

    if (!formData?.email || !formData?.fullName) {
      return NextResponse.json(
        { error: 'Dados de checkout incompletos.' },
        { status: 400 }
      );
    }

    const pixCharge = await createPixCharge(userId || 'anon', formData);

    return NextResponse.json({
      success: true,
      pix: pixCharge,
    });
  } catch (error: any) {
    console.error('Erro na rota de pagamento Pix:', error);
    return NextResponse.json(
      { error: 'Falha ao processar pagamento Pix. Tente novamente.' },
      { status: 500 }
    );
  }
}
