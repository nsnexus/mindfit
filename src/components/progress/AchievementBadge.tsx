// ============================================
// Achievement Badge Card Component — Mindfit Reference Design
// ============================================
import type { UserBadge } from '@/types/progress';

interface AchievementBadgeProps {
  badge: UserBadge;
}

export function AchievementBadge({ badge }: AchievementBadgeProps) {
  const { badgeDef, unlocked } = badge;

  return (
    <div className={`medal ${unlocked ? '' : 'locked'}`}>
      <div className="m-ic">{badgeDef.icon}</div>
      <b>{badgeDef.name}</b>
      <span>{unlocked ? '✓ Desbloqueada' : badgeDef.description}</span>
    </div>
  );
}
