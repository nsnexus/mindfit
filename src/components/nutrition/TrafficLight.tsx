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
    bg: 'bg-[#e6f6ef] border-[#c9eee0]',
    text: 'text-[#0e9f6e]',
    dot: 'bg-[#0e9f6e]',
    desc: 'Volume alto, poucas calorias. Excelente para saciedade.',
  },
  yellow: {
    label: 'Densidade Moderada',
    bg: 'bg-[#fff4e0] border-[#ffe3b0]',
    text: 'text-[#c47f0a]',
    dot: 'bg-[#ecb11f]',
    desc: 'Equilíbrio calórico. Consuma em porções conscientes.',
  },
  red: {
    label: 'Alta Densidade Calórica',
    bg: 'bg-[#fdeaea] border-[#f7c9c9]',
    text: 'text-[#d24b4b]',
    dot: 'bg-[#d24b4b]',
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
