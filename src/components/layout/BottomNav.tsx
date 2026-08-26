// ============================================
// Mobile Bottom Navigation Bar
// ============================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface MobileNavItem {
  label: string;
  href: string;
  icon: string;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: 'Início', href: ROUTES.DASHBOARD, icon: '🏠' },
  { label: 'Diário', href: ROUTES.DIARIO, icon: '📝' },
  { label: 'Plano', href: ROUTES.PLANO_ALIMENTAR, icon: '🥗' },
  { label: 'Treinos', href: ROUTES.TREINOS, icon: '🏋️' },
  { label: 'Evolução', href: ROUTES.PROGRESSO, icon: '📊' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200
                ${isActive ? 'text-primary-600 font-semibold' : 'text-neutral-500 hover:text-neutral-700'}
              `}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-[11px] leading-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-primary-600 rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
