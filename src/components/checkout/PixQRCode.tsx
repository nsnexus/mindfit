// ============================================
// Pix QR Code & Real-time Auto-Confirmation Component
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Copy, Check, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { trackPixelEvent } from '@/lib/metaPixel';

export interface PixDataView {
  externalOrderId: string;
  txid: string;
  pixCopiaECola: string;
  qrCodeUrl?: string;
  amount: number;
}

interface PixQRCodeProps {
  pixData: PixDataView;
  onConfirmSuccess: () => void;
}

export function PixQRCode({ pixData, onConfirmSuccess }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  // Copiar código Pix
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixData.pixCopiaECola);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  // Polling automático de status do pagamento a cada 3 segundos
  useEffect(() => {
    if (!pixData.externalOrderId || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/status?orderId=${pixData.externalOrderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isPaid || data.status === 'PAID') {
            setIsPaid(true);
            setIsChecking(false);
            clearInterval(interval);

            trackPixelEvent('Purchase', {
              value: pixData.amount,
              currency: 'BRL',
              content_name: 'Mindfit Acesso Vitalício',
              content_ids: [pixData.externalOrderId],
            });

            setTimeout(() => {
              onConfirmSuccess();
            }, 1500);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar status do pagamento:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pixData.externalOrderId, isPaid, onConfirmSuccess]);

  const qrImageUrl =
    pixData.qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
      pixData.pixCopiaECola
    )}`;

  if (isPaid) {
    return (
      <div className="checkout-form-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#e6f6ef',
            color: '#0e9f6e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#12352f', marginBottom: '8px' }}>
          Pagamento Confirmado! 🎉
        </h2>
        <p style={{ color: '#5b7a72', fontSize: '0.9rem', marginBottom: '24px' }}>
          Seu acesso vitalício ao Mindfit foi liberado com sucesso. Redirecionando para o seu plano...
        </p>
        <button
          type="button"
          onClick={onConfirmSuccess}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          Acessar Meu Plano Agora →
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-form-card" style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <span className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles className="w-3.5 h-3.5" /> Pix com Aprovação Instantânea
        </span>
        <h2 className="checkout-form-title" style={{ marginTop: '12px' }}>
          Escaneie o QR Code ou Copie o Código
        </h2>
        <p className="checkout-form-sub">
          Abra o app do seu banco, escolha <b>Pagar com Pix</b> e finalize em segundos.
        </p>
      </div>

      {/* QR Code Frame */}
      <div
        style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '24px',
          border: '2px dashed #0e9f6e',
          display: 'inline-block',
          boxShadow: '0 12px 30px rgba(14,159,110,0.12)',
          marginBottom: '24px',
        }}
      >
        <img
          src={qrImageUrl}
          alt="QR Code Pix"
          style={{
            width: '210px',
            height: '210px',
            margin: '0 auto',
            borderRadius: '12px',
            display: 'block',
          }}
        />
        <div
          style={{
            marginTop: '12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0f5e5a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck className="w-4 h-4 text-[#0e9f6e]" />
          <span>Valor: R$ {pixData.amount ? pixData.amount.toFixed(2).replace('.', ',') : '29,90'}</span>
        </div>
      </div>

      {/* Pix Copia e Cola Field */}
      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#5b7a72',
            marginBottom: '6px',
          }}
        >
          Código Pix Copia e Cola
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            readOnly
            value={pixData.pixCopiaECola}
            style={{
              flex: 1,
              padding: '12px 14px',
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              background: '#f5faf7',
              border: '1.5px solid #d4ece3',
              borderRadius: '14px',
              color: '#12352f',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-primary"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar Pix
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auto-checking Indicator */}
      <div
        style={{
          padding: '14px 18px',
          background: '#f5faf7',
          borderRadius: '16px',
          border: '1px solid #d4ece3',
          fontSize: '0.82rem',
          color: '#12352f',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'left',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#0e9f6e',
            boxShadow: '0 0 0 4px rgba(14,159,110,0.2)',
            animation: 'pulse 2s infinite',
          }}
        />
        <div>
          <b>Aguardando pagamento...</b>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#5b7a72' }}>
            Assim que você pagar no app do banco, esta tela será liberada automaticamente.
          </span>
        </div>
      </div>

      {/* Simulation/Manual verification button */}
      <button
        type="button"
        onClick={onConfirmSuccess}
        className="btn btn-ghost"
        style={{ width: '100%', fontSize: '0.85rem', padding: '12px' }}
      >
        Já realizei o pagamento →
      </button>
    </div>
  );
}
