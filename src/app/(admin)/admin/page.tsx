// ============================================
// Painel Administrativo — Dashboard de Métricas (dados reais do Firestore)
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { APP_CONFIG } from '@/constants/config';
import { formatCurrency } from '@/lib/utils';
import { getDocuments } from '@/lib/firebase/firestore';
import type { AppUser } from '@/types/user';

interface OrderDoc {
  orderId?: string;
  customerName?: string;
  email?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  paidAt?: string;
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    async function load() {
      const [usersData, ordersData, visitsData] = await Promise.all([
        getDocuments<AppUser>('users'),
        getDocuments<OrderDoc>('orders'),
        getDocuments('analytics'),
      ]);
      setUsers(usersData);
      setOrders(ordersData);
      setVisitCount(visitsData.length);
      setIsLoading(false);
    }
    load();
  }, []);

  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.isPremium).length;
  const onboardedUsers = users.filter((u) => u.onboardingCompleted).length;

  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || !o.status);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0) || premiumUsers * APP_CONFIG.price;

  const visitToCheckoutRate = visitCount > 0 ? (orders.length / visitCount) * 100 : 0;
  const checkoutToPaidRate = orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0;
  const onboardingRate = totalUsers > 0 ? (onboardedUsers / totalUsers) * 100 : 0;

  const metrics = [
    { label: 'Visitas ao Site', value: visitCount.toLocaleString('pt-BR'), sub: 'sessões registradas', icon: '🌐' },
    { label: 'Cadastros Totais', value: totalUsers.toLocaleString('pt-BR'), sub: 'contas criadas', icon: '👥' },
    { label: 'Pix Gerados', value: orders.length.toLocaleString('pt-BR'), sub: `${pendingOrders.length} aguardando pagamento`, icon: '⚡' },
    { label: 'Vendas Confirmadas', value: paidOrders.length.toLocaleString('pt-BR'), sub: 'Pix pago', icon: '✅' },
    { label: 'Membros Vitalícios', value: premiumUsers.toLocaleString('pt-BR'), sub: `${totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}% dos cadastros`, icon: '⭐' },
    { label: 'Receita Bruta', value: formatCurrency(totalRevenue), sub: `${formatCurrency(APP_CONFIG.price)} / venda`, icon: '💰' },
    { label: 'Conversão: Visita → Pix', value: `${visitToCheckoutRate.toFixed(1)}%`, sub: 'de quem visitou, gerou Pix', icon: '📊' },
    { label: 'Conversão: Pix → Pago', value: `${checkoutToPaidRate.toFixed(1)}%`, sub: 'de quem gerou, pagou', icon: '📈' },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Visão Geral & Métricas de Negócio 📈
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Números reais direto do Firestore — visitas, cadastros, Pix gerados e vendas.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <Card key={m.label} padding="md" className="bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{m.icon}</span>
                </div>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-3">
                  {m.label}
                </p>
                <p className="text-2xl font-black text-neutral-900 font-[var(--font-heading)] mt-0.5">
                  {m.value}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">{m.sub}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="md" className="bg-white space-y-4">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <span>🎯</span>
                <span>Progresso dos Alunos</span>
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-neutral-700">
                  <span>Onboarding concluído</span>
                  <span className="text-primary-600">{onboardingRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary-600 h-full rounded-full" style={{ width: `${onboardingRate}%` }} />
                </div>
                <p className="text-[11px] text-neutral-400">
                  {onboardedUsers} de {totalUsers} usuários completaram o cadastro inicial.
                </p>
              </div>
            </Card>

            <Card padding="md" className="bg-white space-y-3">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
                <span>🧾</span>
                <span>Pedidos Recentes</span>
              </h3>
              {recentOrders.length === 0 ? (
                <p className="text-xs text-neutral-400">Nenhum pedido registrado ainda.</p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((o) => (
                    <div
                      key={o.orderId}
                      className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-800 truncate">{o.customerName || o.email || 'Sem nome'}</p>
                        <p className="text-neutral-400">{o.amount ? formatCurrency(Number(o.amount)) : '—'}</p>
                      </div>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          o.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {o.status === 'PAID' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
