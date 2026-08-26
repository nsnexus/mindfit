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
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#eef4f1]
          flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top: Brand Header & Nav */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-5 sm:p-6 border-b border-[#eef4f1] flex items-center justify-between shrink-0">
            <Link
              href={ROUTES.DASHBOARD}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 group"
            >
              <img
                src="/icons/mindfit-simbolo.png"
                alt="Mindfit"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-2xl font-extrabold font-head leading-none tracking-tight">
                <span className="text-[#0f5e5a]">Mind</span>
                <span className="text-[#0e9f6e]">fit</span>
              </span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-[#5b7a72] hover:text-[#12352f] hover:bg-[#f0f9f4] transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5 overflow-y-auto flex-1">
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
                    group relative flex items-center justify-between px-4 py-3 rounded-2xl font-head font-bold text-sm transition-all duration-200
                    ${
                      isActive
                        ? 'text-white shadow-[0_8px_22px_rgba(14,159,110,0.25)]'
                        : 'text-[#5b7a72] hover:bg-[#f0f9f4] hover:text-[#12352f]'
                    }
                  `}
                  style={isActive ? { background: 'linear-gradient(135deg, #8bc34a 0%, #0e9f6e 45%, #1aa8a0 100%)' } : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-8 h-8 rounded-xl flex items-center justify-center transition-colors
                        ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#f0f9f4] text-[#5b7a72] group-hover:bg-[#e6f6ef] group-hover:text-[#0e9f6e]'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="pill text-[10px] py-0.5 px-2">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile & Logout */}
        <div className="p-4 border-t border-[#eef4f1] flex items-center justify-between gap-2 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8bc34a] via-[#0e9f6e] to-[#1aa8a0] text-white font-extrabold font-head flex items-center justify-center text-sm shrink-0 shadow-md shadow-[#0e9f6e]/20">
              {appUser?.displayName?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-extrabold font-head text-[#12352f] block truncate leading-tight">
                {appUser?.displayName || 'Aluno(a)'}
              </span>
              <span className="text-[11px] text-[#0e9f6e] font-semibold block leading-tight">
                ⭐ Membro Vitalício
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sair da conta"
            className="p-2 rounded-xl text-[#5b7a72] hover:text-[#d24b4b] hover:bg-[#fdeaea] transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
