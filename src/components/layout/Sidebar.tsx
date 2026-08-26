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
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-2xl border-r border-neutral-200/80
          flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          lg:translate-x-0 lg:static lg:z-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-neutral-100/90 flex items-center justify-between">
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
          <nav className="p-4 space-y-1.5">
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
                    group relative flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200
                    ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-500/20'
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

        {/* Footer / Cycle Card & Logout */}
        <div className="p-4 border-t border-neutral-100/90 space-y-3">
          {/* Quick cycle info widget */}
          <div className="p-4 bg-gradient-to-br from-emerald-950 to-neutral-950 rounded-2xl border border-emerald-500/30 text-white shadow-lg shadow-emerald-950/20 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Ciclo Ativo
              </span>
              <span className="font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 text-[11px]">
                Dia 1 de 21
              </span>
            </div>

            <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden p-[1px]">
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full w-[5%] rounded-full shadow-sm shadow-emerald-400/50" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-300 mt-2">
              <span>Fase 1: Preparação</span>
              <span className="text-emerald-400 font-bold">5% concluído</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-neutral-500 hover:text-red-600 hover:bg-red-50/80 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>
    </>
  );
}
