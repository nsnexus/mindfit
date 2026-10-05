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
import { updateDocument, getDocuments } from '@/lib/firebase/firestore';
import { registerWithEmail } from '@/lib/firebase/auth';
import { trackPixelEvent } from '@/lib/metaPixel';
import { Eye, EyeOff } from 'lucide-react';
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
    password: '',
    paymentMethod: 'pix',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixDataView | null>(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email) {
      setError('Por favor, preencha nome completo e e-mail.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = formData.email.toLowerCase().trim();
      const isSameLoggedInUser = firebaseUser && firebaseUser.email?.toLowerCase().trim() === cleanEmail;

      // 1. Verifica se já existe um cadastro com esse mesmo e-mail
      if (!isSameLoggedInUser) {
        try {
          const { where } = await import('firebase/firestore');
          const existingUsers = await getDocuments<{ id: string; email: string }>('users', [
            where('email', '==', cleanEmail),
          ]);

          if (existingUsers && existingUsers.length > 0) {
            setError('Esse e-mail já tem uma conta cadastrada. Faça login para acessar sua conta ou realizar o pagamento.');
            setIsLoading(false);
            return;
          }
        } catch (checkErr) {
          console.warn('Erro ao verificar e-mail existente:', checkErr);
        }
      }

      // 2. Realiza o cadastro do usuário no Firebase antes de gerar a cobrança
      let currentUserId = firebaseUser?.uid || null;

      if (!isSameLoggedInUser) {
        try {
          const newUser = await registerWithEmail(cleanEmail, formData.password, formData.fullName.trim());
          if (newUser) {
            currentUserId = newUser.uid;
          }
        } catch (authErr: any) {
          if (authErr?.code === 'auth/email-already-in-use') {
            setError('Esse e-mail já tem uma conta cadastrada. Faça login para acessar sua conta ou realizar o pagamento.');
            setIsLoading(false);
            return;
          }
          throw authErr;
        }
      }

      // 3. Gera a cobrança Pix no gateway
      if (formData.paymentMethod === 'pix') {
        const { password, ...orderData } = formData;
        const res = await fetch('/api/checkout/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...orderData,
            email: cleanEmail,
            userId: currentUserId,
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

        trackPixelEvent('InitiateCheckout', {
          value: data.amount,
          currency: 'BRL',
          content_name: 'Mindfit Acesso Vitalício',
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
    try {
      if (!pixData?.externalOrderId) {
        setError('Nenhum pedido Pix identificado.');
        return;
      }

      // Validação estrita: confere se o pedido foi comprovadamente confirmado no servidor/Efí
      const res = await fetch(`/api/checkout/status?orderId=${pixData.externalOrderId}`);
      if (!res.ok) {
        throw new Error('Falha ao validar o pagamento. Tente novamente em alguns instantes.');
      }
      const statusData = await res.json();
      if (!statusData.isPaid && statusData.status !== 'PAID') {
        setError('O pagamento deste pedido ainda não foi confirmado pela instituição bancária.');
        return;
      }

      if (firebaseUser && firebaseUser.email?.toLowerCase().trim() === formData.email.toLowerCase().trim()) {
        // Já estava logado com esta mesma conta — só libera o acesso
        await updateDocument('users', firebaseUser.uid, {
          isPremium: true,
          premiumSince: statusData.paidAt || new Date().toISOString(),
        });

        if (appUser) {
          setAppUser({ ...appUser, isPremium: true });
        }
      } else {
        // Cria a conta com email e senha definidos no formulário
        const newUser = await registerWithEmail(formData.email.trim(), formData.password, formData.fullName.trim());
        if (!newUser) {
          throw new Error('Não foi possível criar sua conta. Tente novamente.');
        }

        await updateDocument('users', newUser.uid, {
          isPremium: true,
          premiumSince: statusData.paidAt || new Date().toISOString(),
        });
      }

      router.push(ROUTES.ONBOARDING);
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setError('Esse e-mail já tem uma conta. Faça login para liberar o acesso vitalício.');
      } else {
        setError(err?.message || 'Pagamento confirmado, mas houve um erro ao liberar seu acesso. Fale com o suporte.');
      }
    }
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
                {error.includes('já tem uma conta') && (
                  <>
                    {' '}
                    <Link href={ROUTES.LOGIN} style={{ textDecoration: 'underline' }}>
                      Ir para o login →
                    </Link>
                  </>
                )}
              </div>
            )}

            {!pixData ? (
              <div className="checkout-form-card">
                <h2 className="checkout-form-title">Dados do Titular</h2>
                <p className="checkout-form-sub">
                  Preencha suas informações para liberação imediata do acesso.
                </p>

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
                      <label>Crie uma Senha</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="input-clean"
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                          style={{ paddingRight: '42px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#5b7a72',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                          }}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group-clean">
                      <label>Confirme a Senha</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="input-clean"
                          placeholder="Repita a senha"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          style={{ paddingRight: '42px' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#5b7a72',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                          }}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
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
                    {isLoading ? 'Criando cadastro e gerando Pix...' : 'Criar Cadastro e Gerar Pagamento →'}
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
