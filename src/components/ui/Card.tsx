// ============================================
// Card Component — Mindfit Design System
// ============================================
import type { ReactNode, HTMLAttributes } from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'emerald' | 'dark' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-white border border-[#eaf3ef] shadow-[0_8px_22px_rgba(14,159,110,0.10)]',
  elevated:
    'bg-white border border-[#eaf3ef] shadow-[0_18px_45px_rgba(14,159,110,0.18)]',
  outlined:
    'bg-white border-2 border-[#eaf3ef]',
  glass:
    'glass-panel',
  emerald:
    'bg-[linear-gradient(135deg,#0f5e5a_0%,#0a3d3a_100%)] border border-[#1aa8a0]/25 shadow-2xl shadow-[#0a3d3a]/60 text-white',
  dark:
    'bg-[#12352f]/95 backdrop-blur-xl border border-white/10 shadow-2xl text-white',
  interactive:
    'bg-white border border-[#eaf3ef] hover:border-transparent hover:shadow-[0_18px_45px_rgba(14,159,110,0.18)] transition-all duration-300',
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3.5 sm:p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-10',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-[20px] transition-all duration-300
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverable ? 'hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(14,159,110,0.18)] cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-lg sm:text-xl font-bold tracking-tight text-inherit ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs sm:text-sm text-[#5b7a72] mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-4 pt-4 border-t border-[#eaf3ef] ${className}`}>
      {children}
    </div>
  );
}
