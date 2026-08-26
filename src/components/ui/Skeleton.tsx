// ============================================
// Skeleton Component (Loading Placeholder)
// ============================================

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full' | '2xl';
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  const roundedStyles: Record<string, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
    '2xl': 'rounded-2xl',
  };

  return (
    <div
      className={`skeleton ${roundedStyles[rounded]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/** Card-shaped skeleton */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-neutral-200 p-5 ${className}`}>
      <Skeleton height="160px" rounded="lg" className="mb-4" />
      <Skeleton height="20px" width="70%" className="mb-2" />
      <Skeleton height="16px" width="90%" className="mb-2" />
      <Skeleton height="16px" width="50%" />
    </div>
  );
}

/** Text-line skeleton */
export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="14px"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}
