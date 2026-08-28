// ============================================
// Painel Administrativo — Gestão de Usuários (dados reais do Firestore)
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui';
import { getDocuments, updateDocument } from '@/lib/firebase/firestore';
import type { AppUser } from '@/types/user';

function formatDate(value: any): string {
  try {
    if (value?.toDate) return value.toDate().toLocaleDateString('pt-BR');
    if (typeof value === 'string') return new Date(value).toLocaleDateString('pt-BR');
    return '—';
  } catch {
    return '—';
  }
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  useEffect(() => {
    getDocuments<AppUser>('users').then((list) => {
      setUsers(list);
      setIsLoading(false);
    });
  }, []);

  const togglePremium = async (user: AppUser) => {
    setPendingAction(user.uid);
    try {
      await updateDocument('users', user.uid, { isPremium: !user.isPremium });
      setUsers((prev) => prev.map((u) => (u.uid === user.uid ? { ...u, isPremium: !u.isPremium } : u)));
    } finally {
      setPendingAction(null);
    }
  };

  const toggleRole = async (user: AppUser) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Confirma tornar ${user.displayName || user.email} ${newRole === 'admin' ? 'admin' : 'usuário comum'}?`)) return;

    setPendingAction(user.uid);
    try {
      await updateDocument('users', user.uid, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.uid === user.uid ? { ...u, role: newRole } : u)));
    } finally {
      setPendingAction(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Gestão de Usuários 👥
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            {users.length} conta{users.length === 1 ? '' : 's'} cadastrada{users.length === 1 ? '' : 's'} — dados reais do Firestore.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card padding="none" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-4">Usuário</th>
                <th className="p-4">Papel</th>
                <th className="p-4">Status Acesso</th>
                <th className="p-4">Onboarding</th>
                <th className="p-4">Cadastro</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">
                    Carregando usuários...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-neutral-900">{user.displayName || 'Sem nome'}</p>
                      <p className="text-xs text-neutral-400">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.role === 'admin' ? 'premium' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-xs ${
                          user.isPremium ? 'text-emerald-600' : 'text-neutral-400'
                        }`}
                      >
                        {user.isPremium ? '⭐ Vitalício' : 'Gratuito'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-neutral-500">
                        {user.onboardingCompleted ? '✓ Concluído' : 'Pendente'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-neutral-500">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePremium(user)}
                        disabled={pendingAction === user.uid}
                        className="text-xs"
                      >
                        {user.isPremium ? 'Revogar Premium' : 'Conceder Premium'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRole(user)}
                        disabled={pendingAction === user.uid}
                        className="text-xs"
                      >
                        {user.role === 'admin' ? 'Tornar User' : 'Tornar Admin'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
