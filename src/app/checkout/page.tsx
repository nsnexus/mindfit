// ============================================
// Página de Checkout — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { PricingCard } from '@/components/checkout/PricingCard';
import { PixQRCode } from '@/components/checkout/PixQRCode';
import { updateDocument } from '@/lib/firebase/firestore';
import { APP_CONFIG, DISCLAIMER_TEXT } from '@/constants/config';
import { ROUTES } from '@/constants/routes';
import { createPixCharge } from '@/lib/efi/payment';
import type { PaymentMethod, CheckoutFormData, PixChargeResponse } from '@/types/payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { appUser, firebaseUser, setAppUser } = useAuthStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: appUser?.displayName || '',
    email: appUser?.email || '',
    cpf: '',
    phone: '',
    paymentMethod: 'pix',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixChargeResponse | null>(null);
  const [error, setError] = useState('');

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.cpf) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    try {
      if (formData.paymentMethod === 'pix') {
        const pix = await createPixCharge(firebaseUser?.uid || 'anon', formData);
        setPixData(pix);
      } else {
        await handleUnlockAccess();
      }
    } catch {
      setError('Falha de comunicação com o gateway. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockAccess = async () => {
    if (firebaseUser) {
      await updateDocument('users', firebaseUser.uid, {
        isPremium: true,
      });

      if (appUser) {
        setAppUser({ ...appUser, isPremium: true });
      }
    }
    router.push(ROUTES.ONBOARDING);
  };

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container">
        {/* Brand Header */}
        <div className="checkout-header">
          <Link href={ROUTES.HOME} className="brand">
            <img src="/icons/mindfit-simbolo.png" alt="Mindfit" />
            <span>
              <span className="mind">Mind</span>
              <span className="fit">fit</span>
            </span>
          </Link>

          <div className="checkout-ssl-badge">
            <span>🔒</span>
            <span>Checkout Seguro SSL 256-bit</span>
          </div>
        </div>

        {/* Main Grid: Form + Pricing Summary */}
        <div className="checkout-grid">
          {/* Left Column: Form */}
          <div>
            {!pixData ? (
              <div className="checkout-form-card">
                <h2 className="checkout-form-title">Dados do Titular</h2>
                <p className="checkout-form-sub">
                  Preencha suas informações para liberação imediata do acesso.
                </p>

                {error && (
                  <div style={{
                    marginBottom: '18px',
                    padding: '12px 16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    color: '#dc2626',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreatePayment}>
                  <div className="form-group-clean">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      className="input-clean"
                      placeholder="Ex: Maria da Silva"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group-clean">
                    <label>E-mail de Acesso</label>
                    <input
                      type="email"
                      className="input-clean"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#5b7a72', marginTop: '4px', display: 'block' }}>
                      Você receberá a confirmação e o acesso neste e-mail.
                    </span>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group-clean">
                      <label>CPF (para emissão)</label>
                      <input
                        type="text"
                        className="input-clean"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>WhatsApp / Celular</label>
                      <input
                        type="text"
                        className="input-clean"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="payment-methods-box">
                    <div className="payment-methods-title">Forma de Pagamento</div>
                    <div className="payment-methods-grid">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'pix' })}
                        className={`payment-method-btn ${formData.paymentMethod === 'pix' ? 'active' : ''}`}
                      >
                        <span className="payment-tag-fast">MAIS RÁPIDO</span>
                        <span style={{ fontSize: '1.4rem' }}>📱</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Pix Instantâneo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                        className={`payment-method-btn ${formData.paymentMethod === 'credit_card' ? 'active' : ''}`}
                      >
                        <span style={{ fontSize: '1.4rem', marginTop: '16px' }}>💳</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Cartão de Crédito</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'boleto' })}
                        className={`payment-method-btn ${formData.paymentMethod === 'boleto' ? 'active' : ''}`}
                      >
                        <span style={{ fontSize: '1.4rem', marginTop: '16px' }}>📄</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Boleto Bancário</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginTop: '10px' }}
                  >
                    {isLoading
                      ? 'Processando...'
                      : formData.paymentMethod === 'pix'
                      ? 'Gerar QR Code Pix (R$ 49,90) →'
                      : 'Finalizar Pagamento (R$ 49,90) →'}
                  </button>
                </form>
              </div>
            ) : (
              <PixQRCode pixData={pixData} onConfirmSuccess={handleUnlockAccess} />
            )}

            <p style={{
              fontSize: '0.75rem',
              color: '#5b7a72',
              textAlign: 'center',
              marginTop: '16px',
              lineHeight: 1.5
            }}>
              {DISCLAIMER_TEXT}
            </p>
          </div>

          {/* Right Column: Pricing Summary */}
          <div>
            <PricingCard />
          </div>
        </div>
      </div>
    </div>
  );
}
