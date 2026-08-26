// ============================================
// Admin Shell Layout — Mindfit
// ============================================
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-[#f5faf7] text-[#12352f]">
        {/* Admin Top Header */}
        <header className="bg-[#0f5e5a] text-white px-6 py-4 border-b border-[#0a3d3a] sticky top-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-head font-extrabold">
                <img
                  src="/icons/mindfit-simbolo.png"
                  alt="Mindfit"
                  className="w-7 h-7 object-contain"
                />
                <span className="text-lg">
                  Mind<span className="text-[#8bc34a]">fit</span>
                </span>
              </Link>
              <span className="pill text-[11px] font-head font-bold bg-[#8bc34a] text-[#0f5e5a]">
                Painel Admin
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs font-semibold">
              <Link href={ROUTES.ADMIN} className="hover:text-[#8bc34a] transition-colors">
                Métricas
              </Link>
              <Link href={ROUTES.ADMIN_USUARIOS} className="hover:text-[#8bc34a] transition-colors">
                Usuários
              </Link>
              <Link href={ROUTES.ADMIN_RECEITAS} className="hover:text-[#8bc34a] transition-colors">
                Receitas
              </Link>
              <Link href={ROUTES.ADMIN_TREINOS} className="hover:text-[#8bc34a] transition-colors">
                Treinos
              </Link>
              <Link
                href={ROUTES.DASHBOARD}
                className="text-[#c7e5db] hover:text-white transition-colors pl-3 border-l border-white/20"
              >
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
