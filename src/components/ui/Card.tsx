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
    'bg-white border border-neutral-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]',
  elevated:
    'bg-white border border-neutral-100/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_6px_-2px_rgba(0,0,0,0.02)]',
  outlined:
    'bg-white border-2 border-neutral-200/90',
  glass:
    'glass-panel',
  emerald:
    'bg-gradient-to-br from-emerald-950 via-neutral-950 to-neutral-950 border border-emerald-500/25 shadow-2xl shadow-emerald-950/60 text-white',
  dark:
    'bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl text-white',
  interactive:
    'bg-white border border-neutral-200/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300',
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
        rounded-2xl sm:rounded-3xl transition-all duration-300
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverable ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10 cursor-pointer' : ''}
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
    <p className={`text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed ${className}`}>
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
    <div className={`mt-4 pt-4 border-t border-neutral-100/80 ${className}`}>
      {children}
    </div>
  );
}
