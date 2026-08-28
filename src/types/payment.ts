// ============================================
// Types de Pagamento (Éfi Bank) & Checkout
// ============================================

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'expired';

export interface PixChargeResponse {
  txid: string;
  pixCopiaECola: string;
  qrCodeBase64: string;
  expiresAt: string;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number; // em centavos (ex: 4990)
  amountFormatted: string; // "R$ 29,90"
  method: PaymentMethod;
  status: PaymentStatus;
  txid?: string;
  chargeId?: string;
  paidAt?: string;
  createdAt: string;
  guaranteeExpiresAt: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  paymentMethod: PaymentMethod;
}
