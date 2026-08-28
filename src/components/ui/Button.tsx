// ============================================
// Button Component — Mindfit Design System
// ============================================
'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[linear-gradient(135deg,#8bc34a_0%,#0e9f6e_45%,#1aa8a0_100%)] hover:brightness-105 text-white font-bold shadow-[0_18px_45px_rgba(14,159,110,0.18)] hover:shadow-[0_22px_55px_rgba(14,159,110,0.32)] hover:-translate-y-0.5 active:scale-[0.98] font-head',
  accent:
    'bg-[linear-gradient(135deg,#ecb11f_0%,#f0870f_100%)] hover:brightness-105 text-white font-black shadow-[0_14px_35px_rgba(240,135,15,0.25)] hover:-translate-y-0.5 active:scale-[0.98] tracking-tight font-head',
  secondary:
    'bg-white hover:bg-[#f5faf7] text-[#12352f] font-semibold border border-[#eaf3ef] shadow-sm active:scale-[0.98] font-head',
  outline:
    'border-2 border-[#d7ede3] hover:border-[#0e9f6e] text-[#0e9f6e] bg-white hover:bg-[#f5faf7] font-bold active:scale-[0.98] font-head',
  ghost:
    'text-[#5b7a72] hover:text-[#12352f] hover:bg-[#f0f9f4] active:bg-[#e6f6ef] font-semibold active:scale-[0.98] font-head',
  danger:
    'bg-[#d24b4b] hover:bg-[#c23e3e] text-white font-bold shadow-md shadow-[#d24b4b]/25 active:scale-[0.98] font-head',
  glass:
    'bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/20 backdrop-blur-xl font-bold shadow-lg shadow-black/10 active:scale-[0.98] font-head',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-[11px] rounded-full gap-1',
  sm: 'px-4 py-2 text-xs rounded-full gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-full gap-2',
  lg: 'px-7 py-3.5 text-base rounded-full gap-2.5',
  xl: 'px-8 py-4 text-base sm:text-lg rounded-full gap-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center cursor-pointer select-none
          whitespace-nowrap
          transition-all duration-200 ease-out
          focus-ring
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
