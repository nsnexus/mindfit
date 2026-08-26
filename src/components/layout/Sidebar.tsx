// ============================================
// Desktop & Drawer Sidebar Component — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Salad,
  ChefHat,
  Dumbbell,
  LineChart,
  Settings,
  LogOut,
  X,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';
import { Badge } from '@/components/ui';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Diário Alimentar', href: ROUTES.DIARIO, icon: UtensilsCrossed },
  { label: 'Plano 21 Dias', href: ROUTES.PLANO_ALIMENTAR, icon: Salad },
  { label: 'Receitas Fit', href: ROUTES.RECEITAS, icon: ChefHat },
  { label: 'Treinos Guiados', href: ROUTES.TREINOS, icon: Dumbbell },
  { label: 'Meu Progresso', href: ROUTES.PROGRESSO, icon: LineChart },
  { label: 'Painel Admin', href: ROUTES.ADMIN, icon: Settings, adminOnly: true },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-emerald-950/10
          flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top: Brand Header & Nav */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
            <Link
              href={ROUTES.DASHBOARD}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                <img
                  src="/icons/mindfit-simbolo.png"
                  alt="Mindfit"
                  className="w-6 h-6 object-contain brightness-0 invert"
                />
              </div>
              <div>
                <span className="text-xl font-black font-[var(--font-heading)] text-neutral-900 block leading-none tracking-tight">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[11px] text-emerald-600 font-bold tracking-wider uppercase flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" /> Método 21 Dias
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto flex-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200
                    ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-500/25'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-600 rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-8 h-8 rounded-xl flex items-center justify-center transition-colors
                        ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : 'bg-neutral-100 text-neutral-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <Badge variant="success" size="xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile & Logout */}
        <div className="p-3.5 border-t border-neutral-100 flex items-center justify-between gap-2 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
              {appUser?.displayName?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-black text-neutral-900 block truncate leading-tight">
                {appUser?.displayName || 'Aluno(a)'}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block leading-tight">
                ⭐ Membro Vitalício
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sair da conta"
            className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
