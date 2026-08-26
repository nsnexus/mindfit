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
  { label: 'Plano 21D', href: ROUTES.PLANO_ALIMENTAR, icon: Salad },
  { label: 'Treinos', href: ROUTES.TREINOS, icon: Dumbbell },
  { label: 'Evolução', href: ROUTES.PROGRESSO, icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-neutral-200/80 px-2 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
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
                flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl transition-all duration-200 relative
                ${
                  isActive
                    ? 'text-emerald-700 font-extrabold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }
              `}
            >
              <div
                className={`
                  p-1.5 rounded-xl transition-all duration-200 mb-0.5
                  ${isActive ? 'bg-emerald-500/15 text-emerald-600 scale-110 shadow-sm' : 'text-neutral-500'}
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
