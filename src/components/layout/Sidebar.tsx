// ============================================
// Desktop & Drawer Sidebar Component
// ============================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: '🏠' },
  { label: 'Diário Alimentar', href: ROUTES.DIARIO, icon: '📝' },
  { label: 'Plano 21 Dias', href: ROUTES.PLANO_ALIMENTAR, icon: '🥗' },
  { label: 'Receitas Fit', href: ROUTES.RECEITAS, icon: '📖' },
  { label: 'Treinos Guiados', href: ROUTES.TREINOS, icon: '🏋️' },
  { label: 'Meu Progresso', href: ROUTES.PROGRESSO, icon: '📊' },
  { label: 'Painel Admin', href: ROUTES.ADMIN, icon: '⚙️', adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { appUser, logout } = useAuth();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || appUser?.role === 'admin'
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-neutral-200
          flex flex-col justify-between transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
              <span className="text-2xl">🍃</span>
              <div>
                <span className="text-lg font-bold font-[var(--font-heading)] text-primary-700 block leading-none">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">
                  Método 21 Dias
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              aria-label="Fechar menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-neutral-100 space-y-3">
          {/* Quick cycle info widget */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Ciclo Atual</span>
              <span className="font-semibold text-primary-600">Dia 1 de 21</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-500 h-full w-[5%]" />
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>
    </>
  );
}
