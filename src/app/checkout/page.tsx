// ============================================
// Página de Checkout — Mindfit (Clean Design)
// ============================================
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { PricingCard } from '@/components/checkout/PricingCard';
import { PixQRCode } from '@/components/checkout/PixQRCode';
import { Input } from '@/components/ui';
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
    <div className="min-h-screen bg-[#f5faf7] py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-[1040px] mx-auto space-y-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href={ROUTES.HOME} className="brand">
            <img
              src="/icons/mindfit-simbolo.png"
              alt="Mindfit"
            />
            <span>
              <span className="mind">Mind</span>
              <span className="fit">fit</span>
            </span>
          </Link>

          <span className="text-xs text-[#5b7a72] font-semibold flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#eaf3ef] shadow-sm">
            🔒 Checkout Seguro SSL 256-bit
          </span>
        </div>

        {/* Main Grid: Form + Pricing Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form or Pix Display (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {!pixData ? (
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#eaf3ef] shadow-[0_10px_30px_rgba(14,159,110,0.06)] space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[#12352f]">
                    Dados do Titular
                  </h2>
                  <p className="text-xs text-[#5b7a72] mt-1">
                    Preencha suas informações para liberação imediata do acesso.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreatePayment} className="space-y-4">
                  <Input
                    label="Nome Completo"
                    placeholder="Ex: Maria da Silva"
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
                    <label className="block text-xs sm:text-sm font-bold text-[#12352f] mb-2 font-[var(--font-heading)]">
                      Forma de Pagamento
                    </label>

                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      {[
                        { id: 'pix', label: 'Pix Instantâneo', icon: '📱', highlight: 'Mais rápido' },
                        { id: 'credit_card', label: 'Cartão de Crédito', icon: '💳' },
                        { id: 'boleto', label: 'Boleto Bancário', icon: '📄' },
                      ].map((item) => {
                        const isSelected = formData.paymentMethod === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, paymentMethod: item.id as PaymentMethod })
                            }
                            className={`
                              p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center gap-1
                              ${
                                isSelected
                                  ? 'border-[#0e9f6e] bg-[#e6f6ef] text-[#0f5e5a] font-bold shadow-sm'
                                  : 'border-[#eaf3ef] hover:border-[#cbd5d0] bg-white text-[#5b7a72]'
                              }
                            `}
                          >
                            {item.highlight && (
                              <span className="absolute -top-2 bg-[#0e9f6e] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm">
                                {item.highlight}
                              </span>
                            )}
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-[11px] leading-tight">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full text-base sm:text-lg py-4 mt-6"
                  >
                    {isLoading ? (
                      'Processando...'
                    ) : formData.paymentMethod === 'pix' ? (
                      'Gerar QR Code Pix (R$ 49,90) →'
                    ) : (
                      'Finalizar Pagamento (R$ 49,90) →'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <PixQRCode
                pixData={pixData}
                onConfirmSuccess={handleUnlockAccess}
              />
            )}

            <p className="text-[11px] text-[#5b7a72] text-center leading-relaxed">
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
