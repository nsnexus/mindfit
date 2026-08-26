// ============================================
// Achievement Badge Card Component
// ============================================
import { Card, Badge, Progress } from '@/components/ui';
import type { UserBadge } from '@/types/progress';

interface AchievementBadgeProps {
  badge: UserBadge;
}

export function AchievementBadge({ badge }: AchievementBadgeProps) {
  const { badgeDef, unlocked, progressPercentage, currentValue } = badge;

  return (
    <Card
      padding="md"
      className={`
        flex flex-col justify-between transition-all duration-300
        ${unlocked
          ? 'bg-white border-amber-300 shadow-md ring-1 ring-amber-300/50'
          : 'bg-neutral-50/60 border-neutral-200 opacity-80'
        }
      `}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className={`
              w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm
              ${unlocked
                ? 'bg-gradient-accent text-neutral-900 ring-2 ring-amber-400'
                : 'bg-neutral-200 text-neutral-400 grayscale'
              }
            `}
          >
            {badgeDef.icon}
          </div>

          <Badge variant={unlocked ? 'premium' : 'default'} size="sm">
            {unlocked ? '✓ Desbloqueada' : 'Em progresso'}
          </Badge>
        </div>

        <h4 className="font-bold text-neutral-900 text-sm">{badgeDef.name}</h4>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
          {badgeDef.description}
        </p>
      </div>

      <div className="pt-4 border-t border-neutral-100 mt-3">
        <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 mb-1">
          <span>Progresso</span>
          <span>
            {currentValue} / {badgeDef.targetValue}
          </span>
        </div>
        <Progress
          value={progressPercentage}
          color={unlocked ? 'accent' : 'primary'}
          size="sm"
        />
      </div>
    </Card>
  );
}
