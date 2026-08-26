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
  primary: 'bg-[linear-gradient(135deg,#8bc34a_0%,#0e9f6e_45%,#1aa8a0_100%)] shadow-sm shadow-[#0e9f6e]/30',
  accent: 'bg-[linear-gradient(135deg,#ecb11f_0%,#f0870f_100%)] shadow-sm shadow-[#f0870f]/30',
  success: 'bg-[linear-gradient(135deg,#8bc34a_0%,#0e9f6e_45%,#1aa8a0_100%)] shadow-sm shadow-[#0e9f6e]/30',
  warning: 'bg-[linear-gradient(135deg,#ecb11f_0%,#f0870f_100%)] shadow-sm shadow-[#f0870f]/30',
  danger: 'bg-[#d24b4b] shadow-sm shadow-[#d24b4b]/30',
  info: 'bg-[#2f89c5] shadow-sm shadow-[#2f89c5]/30',
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
            <span className="text-xs sm:text-sm font-semibold text-[#12352f] font-head">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-bold text-[#5b7a72] bg-[#f0f9f4] px-2 py-0.5 rounded-full font-head">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-[#f0f9f4] rounded-full overflow-hidden border border-[#eaf3ef] p-[1px] ${sizeStyles[size]}`}
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
