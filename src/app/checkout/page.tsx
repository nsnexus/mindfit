// ============================================
// Página de Checkout — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { PricingCard } from '@/components/checkout/PricingCard';
import { PixQRCode, type PixDataView } from '@/components/checkout/PixQRCode';
import { updateDocument } from '@/lib/firebase/firestore';
import { DISCLAIMER_TEXT } from '@/constants/config';
import { ROUTES } from '@/constants/routes';
import type { PaymentMethod, CheckoutFormData } from '@/types/payment';

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
  const [pixData, setPixData] = useState<PixDataView | null>(null);
  const [error, setError] = useState('');

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email) {
      setError('Por favor, preencha nome completo e e-mail.');
      return;
    }

    setIsLoading(true);
    try {
      if (formData.paymentMethod === 'pix') {
        const res = await fetch('/api/checkout/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            userId: firebaseUser?.uid || null,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Erro ao gerar Pix no gateway.');
        }

        setPixData({
          externalOrderId: data.externalOrderId,
          txid: data.txid,
          pixCopiaECola: data.pixCopiaECola,
          qrCodeUrl: data.qrCodeUrl,
          amount: data.amount,
        });
      } else {
        await handleUnlockAccess();
      }
    } catch (err: any) {
      setError(err.message || 'Falha de comunicação com o gateway. Tente novamente.');
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
          {/* Left Column: Form / Pix */}
          <div>
            {!pixData ? (
              <div className="checkout-form-card">
                <h2 className="checkout-form-title">Dados do Titular</h2>
                <p className="checkout-form-sub">
                  Preencha suas informações para liberação imediata do acesso.
                </p>

                {error && (
                  <div
                    style={{
                      marginBottom: '18px',
                      padding: '12px 16px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '12px',
                      color: '#dc2626',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
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
                      required
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
                      required
                    />
                    <span style={{ fontSize: '0.75rem', color: '#5b7a72', marginTop: '4px', display: 'block' }}>
                      Você receberá a confirmação e o acesso neste e-mail.
                    </span>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group-clean">
                      <label>CPF (opcional)</label>
                      <input
                        type="text"
                        className="input-clean"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      />
                    </div>

                    <div className="form-group-clean">
                      <label>WhatsApp (opcional)</label>
                      <input
                        type="tel"
                        className="input-clean"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Payment Method Badge (Pix Exclusivo) */}
                  <div
                    style={{
                      marginTop: '20px',
                      marginBottom: '24px',
                      padding: '14px 16px',
                      background: '#e6f6ef',
                      borderRadius: '16px',
                      border: '1.5px solid #bfe3d5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0e9f6e' }}>
                        Pagamento via Pix Instantâneo
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#0f5e5a', marginTop: '2px' }}>
                        Aprovação em segundos e liberação imediata do seu acesso vitalício.
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '1.05rem', justifyContent: 'center' }}
                  >
                    {isLoading ? 'Gerando cobrança Pix...' : 'Gerar QR Code Pix →'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.78rem', color: '#5b7a72' }}>
                    🔒 Ambiente 100% criptografado com tecnologia SSL.
                  </div>
                </form>
              </div>
            ) : (
              <PixQRCode
                pixData={pixData}
                onConfirmSuccess={handleUnlockAccess}
              />
            )}
          </div>

          {/* Right Column: Pricing & Order Summary */}
          <div>
            <PricingCard />
          </div>
        </div>

        {/* Security & Disclaimer Footer */}
        <div style={{ maxWidth: '820px', margin: '40px auto 0', textAlign: 'center', fontSize: '0.78rem', color: '#5b7a72', lineHeight: 1.6 }}>
          <p>{DISCLAIMER_TEXT}</p>
        </div>
      </div>
    </div>
  );
}
