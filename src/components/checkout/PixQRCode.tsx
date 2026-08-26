// ============================================
// Pix QR Code & Payment Instructions Component
// ============================================
'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import type { PixChargeResponse } from '@/types/payment';

interface PixQRCodeProps {
  pixData: PixChargeResponse;
  onConfirmSuccess: () => void;
}

export function PixQRCode({ pixData, onConfirmSuccess }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixData.pixCopiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Card padding="md" className="space-y-6 text-center animate-fade-in">
      <div>
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl mb-2">
          📱
        </div>
        <h3 className="text-xl font-bold text-neutral-900">
          Pague com Pix (Aprovação Instantânea)
        </h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          Abra o app do seu banco, escaneie o QR Code abaixo ou use o código Copia e Cola.
        </p>
      </div>

      {/* QR Code Container */}
      <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-500 inline-block shadow-sm">
        <img
          src={pixData.qrCodeBase64}
          alt="QR Code Pix"
          className="w-48 h-48 mx-auto"
        />
        <span className="text-[11px] font-bold text-emerald-700 mt-2 block">
          🍃 Mindfit Pagamentos • Éfi Bank
        </span>
      </div>

      {/* Copia e Cola Field */}
      <div className="space-y-2 text-left max-w-md mx-auto">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
          Código Pix Copia e Cola
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={pixData.pixCopiaECola}
            className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 select-all font-mono truncate"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="whitespace-nowrap flex-shrink-0"
          >
            {copied ? '✓ Copiado!' : 'Copiar'}
          </Button>
        </div>
      </div>

      {/* Timer & Instructions */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 max-w-md mx-auto text-left flex items-start gap-2">
        <span>⏱️</span>
        <p>
          Este QR Code é válido por <strong>30 minutos</strong>. Assim que o pagamento for detectado, sua conta é liberada automaticamente.
        </p>
      </div>

      {/* Instant Demo Unlock for testing */}
      <div className="pt-2 border-t border-neutral-100 max-w-md mx-auto">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onConfirmSuccess}
        >
          Simular Pagamento Aprovado (Sandbox) →
        </Button>
      </div>
    </Card>
  );
}
