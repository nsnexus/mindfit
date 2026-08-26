// ============================================
// Badge Component — Mindfit Design System
// ============================================
import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium' | 'dark' | 'emerald';
export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100/90 text-neutral-700 border border-neutral-200/80',
  success: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 font-bold',
  emerald: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold backdrop-blur-md shadow-sm',
  warning: 'bg-amber-500/10 text-amber-800 border border-amber-500/25 font-bold',
  danger: 'bg-rose-500/10 text-rose-700 border border-rose-500/25 font-bold',
  info: 'bg-blue-500/10 text-blue-700 border border-blue-500/25 font-bold',
  premium: 'bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-black shadow-md shadow-amber-500/20 border border-amber-300',
  dark: 'bg-neutral-900/90 text-neutral-200 border border-white/15 backdrop-blur-md',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[10px] tracking-wide',
  sm: 'px-2.5 py-0.5 text-xs font-semibold',
  md: 'px-3.5 py-1 text-xs sm:text-sm font-bold',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  icon,
  pulse = false,
  className = '',
  children,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
