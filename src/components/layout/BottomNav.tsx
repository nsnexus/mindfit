// ============================================
// Mobile Bottom Navigation Bar — Mindfit
// ============================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Salad,
  Dumbbell,
  LineChart,
  Route,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: 'Início', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Diário', href: ROUTES.DIARIO, icon: UtensilsCrossed },
  { label: 'Plano', href: ROUTES.PLANO_ALIMENTAR, icon: Salad },
  { label: 'Treinos', href: ROUTES.TREINOS, icon: Dumbbell },
  { label: 'Ativ.', href: ROUTES.ATIVIDADES, icon: Route },
  { label: 'Evolução', href: ROUTES.PROGRESSO, icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-[#eef4f1] px-1 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-w-0 rounded-xl transition-all duration-200 relative
                ${
                  isActive
                    ? 'text-[#0e9f6e] font-extrabold'
                    : 'text-[#5b7a72] hover:text-[#12352f]'
                }
              `}
            >
              <div
                className={`
                  p-1 rounded-lg transition-all duration-200 mb-0.5
                  ${isActive ? 'bg-[#e6f6ef] text-[#0e9f6e] scale-110 shadow-sm' : 'text-[#5b7a72]'}
                `}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] leading-tight tracking-tight font-head whitespace-nowrap">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-[#0e9f6e] rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
