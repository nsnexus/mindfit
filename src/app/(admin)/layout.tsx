// ============================================
// Admin Shell Layout
// ============================================
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-neutral-100 text-neutral-800">
        {/* Admin Top Header */}
        <header className="bg-neutral-900 text-white px-6 py-4 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-bold font-[var(--font-heading)]">
                <span className="text-xl">🍃</span>
                <span>{APP_CONFIG.name}</span>
              </Link>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-neutral-950">
                Painel Admin
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <Link href={ROUTES.ADMIN} className="hover:text-primary-300 transition-colors">
                Métricas
              </Link>
              <Link href={ROUTES.ADMIN_USUARIOS} className="hover:text-primary-300 transition-colors">
                Usuários
              </Link>
              <Link href={ROUTES.ADMIN_RECEITAS} className="hover:text-primary-300 transition-colors">
                Receitas
              </Link>
              <Link href={ROUTES.ADMIN_TREINOS} className="hover:text-primary-300 transition-colors">
                Treinos
              </Link>
              <Link href={ROUTES.DASHBOARD} className="text-neutral-400 hover:text-white transition-colors">
                ← Voltar ao App
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
