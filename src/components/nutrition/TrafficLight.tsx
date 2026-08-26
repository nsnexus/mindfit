// ============================================
// Semáforo de Densidade Calórica (Volumetria)
// ============================================
import type { TrafficLightColor } from '@/types/meal';

interface TrafficLightProps {
  color: TrafficLightColor;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const CONFIG: Record<
  TrafficLightColor,
  { label: string; bg: string; text: string; dot: string; desc: string }
> = {
  green: {
    label: 'Alta Densidade Nutricional',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    desc: 'Volume alto, poucas calorias. Excelente para saciedade.',
  },
  yellow: {
    label: 'Densidade Moderada',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    desc: 'Equilíbrio calórico. Consuma em porções conscientes.',
  },
  red: {
    label: 'Alta Densidade Calórica',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    desc: 'Muitas calorias em pouco volume. Consuma com moderação.',
  },
};

export function TrafficLight({
  color,
  showLabel = true,
  size = 'sm',
}: TrafficLightProps) {
  const item = CONFIG[color];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${item.bg} ${item.text}
        ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}
      `}
      title={item.desc}
    >
      <span className={`w-2 h-2 rounded-full ${item.dot} animate-pulse`} />
      {showLabel && item.label}
    </span>
  );
}
