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
  default: 'bg-[#f0f9f4] text-[#5b7a72] border border-[#eaf3ef]',
  success: 'bg-[#e6f6ef] text-[#0e9f6e] border border-[#c9eee0] font-bold',
  emerald: 'bg-[#12352f]/90 text-[#8bc34a] border border-[#1aa8a0]/40 font-bold backdrop-blur-md shadow-sm',
  warning: 'bg-[#fff4e0] text-[#c47f0a] border border-[#ffe3b0] font-bold',
  danger: 'bg-[#fdeaea] text-[#d24b4b] border border-[#f7c9c9] font-bold',
  info: 'bg-[#e5f1fa] text-[#1f6fa8] border border-[#c6e2f5] font-bold',
  premium: 'bg-[linear-gradient(135deg,#ecb11f_0%,#f0870f_100%)] text-white font-black shadow-md shadow-[#f0870f]/20',
  dark: 'bg-[#12352f]/90 text-white/85 border border-white/15 backdrop-blur-md',
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
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8bc34a] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0e9f6e]" />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
