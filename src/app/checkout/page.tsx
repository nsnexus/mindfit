// ============================================
// Página de Checkout — Mindfit (Éfi Bank)
// ============================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { PricingCard } from '@/components/checkout/PricingCard';
import { PixQRCode } from '@/components/checkout/PixQRCode';
import { Input, Button, Card } from '@/components/ui';
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
        // Simulação de cartão/boleto
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
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold font-[var(--font-heading)] text-primary-700">
              {APP_CONFIG.name}
            </span>
          </Link>

          <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
            🔒 Checkout Seguro SSL 256-bit
          </span>
        </div>

        {/* Main Grid: Form + Pricing Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form or Pix Display (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {!pixData ? (
              <Card padding="lg" className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                    Dados do Comprador 👤
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Preencha suas informações para emissão da cobrança e liberação imediata.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreatePayment} className="space-y-4">
                  <Input
                    label="Nome Completo"
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />

                  <Input
                    label="E-mail de Acesso"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    hint="Você receberá a confirmação e o acesso neste e-mail."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="CPF (para emissão)"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />

                    <Input
                      label="WhatsApp / Celular"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Forma de Pagamento
                    </label>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'pix', label: 'Pix Instantâneo', icon: '📱' },
                        { id: 'credit_card', label: 'Cartão de Crédito', icon: '💳' },
                        { id: 'boleto', label: 'Boleto Bancário', icon: '📄' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, paymentMethod: item.id as PaymentMethod })
                          }
                          className={`
                            p-3 rounded-2xl border-2 text-center transition-all
                            ${formData.paymentMethod === item.id
                              ? 'border-primary-600 bg-primary-50 text-primary-900 font-bold shadow-sm'
                              : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
                            }
                          `}
                        >
                          <span className="text-xl block mb-1">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="xl"
                    fullWidth
                    isLoading={isLoading}
                    className="mt-6 shadow-lg hover:shadow-xl"
                  >
                    {formData.paymentMethod === 'pix'
                      ? 'Gerar QR Code Pix (R$ 49,90) →'
                      : 'Finalizar Pagamento (R$ 49,90) →'}
                  </Button>
                </form>
              </Card>
            ) : (
              <PixQRCode
                pixData={pixData}
                onConfirmSuccess={handleUnlockAccess}
              />
            )}

            <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
              {DISCLAIMER_TEXT}
            </p>
          </div>

          {/* Right Column: Pricing Summary (5 cols) */}
          <div className="lg:col-span-5">
            <PricingCard />
          </div>
        </div>
      </div>
    </div>
  );
}
