// ============================================
// Painel Administrativo — Dashboard de Métricas
// ============================================
'use client';

import { Card } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const metrics = [
    {
      label: 'Cadastros Totais',
      value: '1.248',
      growth: '+14% esta semana',
      icon: '👥',
    },
    {
      label: 'Membros Vitalícios',
      value: '842',
      growth: '+8% esta semana',
      icon: '⭐',
    },
    {
      label: 'Receita Bruta (Éfi)',
      value: formatCurrency(842 * APP_CONFIG.price),
      growth: 'R$ 49,90 / venda',
      icon: '💰',
    },
    {
      label: 'Taxa de Conversão',
      value: '67.4%',
      growth: 'Checkout Pix',
      icon: '📊',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Visão Geral & Métricas de Negócio 📈
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Desempenho de vendas, retenção de coortes e crescimento da plataforma {APP_CONFIG.name}.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} padding="md" className="bg-white">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{m.icon}</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {m.growth}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-3">
              {m.label}
            </p>
            <p className="text-2xl font-black text-neutral-900 font-[var(--font-heading)] mt-0.5">
              {m.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Cohort Retention & Payment Methods Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md" className="bg-white space-y-4">
          <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
            <span>🔥</span>
            <span>Retenção por Coorte (21 Dias)</span>
          </h3>
          <div className="space-y-3">
            {[
              { phase: 'Semana 1 (Dias 1-7)', completion: '92%' },
              { phase: 'Semana 2 (Dias 8-14)', completion: '84%' },
              { phase: 'Semana 3 (Dias 15-21)', completion: '78%' },
            ].map((cohort) => (
              <div key={cohort.phase} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-neutral-700">
                  <span>{cohort.phase}</span>
                  <span className="text-primary-600">{cohort.completion}</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full"
                    style={{ width: cohort.completion }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md" className="bg-white space-y-4">
          <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
            <span>📱</span>
            <span>Métodos de Pagamento (Éfi Bank)</span>
          </h3>
          <div className="space-y-3">
            {[
              { method: 'Pix Instantâneo (QR Code / Copia e Cola)', share: '86%' },
              { method: 'Cartão de Crédito', share: '11%' },
              { method: 'Boleto Bancário', share: '3%' },
            ].map((p) => (
              <div key={p.method} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl text-xs font-semibold">
                <span className="text-neutral-700">{p.method}</span>
                <span className="text-neutral-900 font-bold">{p.share}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
