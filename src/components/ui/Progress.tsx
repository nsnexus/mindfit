// ============================================
// Progress Bar Component — Mindfit Design System
// ============================================

export type ProgressColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: ProgressColor;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const colorStyles: Record<ProgressColor, string> = {
  primary: 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/30',
  accent: 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/30',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-sm shadow-amber-500/30',
  danger: 'bg-gradient-to-r from-rose-500 to-red-500 shadow-sm shadow-rose-500/30',
  info: 'bg-gradient-to-r from-sky-500 to-blue-500 shadow-sm shadow-sky-500/30',
};

const sizeStyles: Record<string, string> = {
  xs: 'h-1.5',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  animated = true,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / (max || 1)) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs sm:text-sm font-semibold text-neutral-700">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60 p-[1px] ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`
            ${sizeStyles[size]} rounded-full
            ${colorStyles[color]}
            ${animated ? 'transition-all duration-700 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
