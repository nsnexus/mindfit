// ============================================
// Painel Administrativo — Gestão de Usuários
// ============================================
'use client';

import { useState } from 'react';
import { Card, Button, Badge, Input } from '@/components/ui';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

const INITIAL_USERS: MockUser[] = [
  {
    id: 'usr_1',
    name: 'Juliana Mendes',
    email: 'juliana.mendes@email.com',
    role: 'user',
    isPremium: true,
    onboardingCompleted: true,
    createdAt: '2026-08-20',
  },
  {
    id: 'usr_2',
    name: 'Rodrigo Silveira',
    email: 'rodrigo.silveira@email.com',
    role: 'user',
    isPremium: true,
    onboardingCompleted: true,
    createdAt: '2026-08-21',
  },
  {
    id: 'usr_3',
    name: 'Camila Ferreira',
    email: 'camila.ferreira@email.com',
    role: 'user',
    isPremium: true,
    onboardingCompleted: true,
    createdAt: '2026-08-22',
  },
  {
    id: 'usr_4',
    name: 'Administrador Master',
    email: 'admin@mindfit.com',
    role: 'admin',
    isPremium: true,
    onboardingCompleted: true,
    createdAt: '2026-08-01',
  },
];

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');

  const togglePremium = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isPremium: !u.isPremium } : u))
    );
  };

  const toggleRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Gestão de Usuários 👥
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Gerencie permissões, status premium e perfis cadastrados.
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
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-neutral-900">{user.name}</p>
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
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePremium(user.id)}
                      className="text-xs"
                    >
                      {user.isPremium ? 'Revogar Premium' : 'Conceder Premium'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRole(user.id)}
                      className="text-xs"
                    >
                      {user.role === 'admin' ? 'Tornar User' : 'Tornar Admin'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
