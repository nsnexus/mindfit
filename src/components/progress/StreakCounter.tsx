// ============================================
// Streak Counter Component — Mindfit Reference Design
// ============================================
'use client';

import type { StreakInfo } from '@/types/progress';

interface StreakCounterProps {
  streak: StreakInfo;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="streak-card" style={{ marginBottom: '22px' }}>
      <div className="fire-badge">🔥</div>
      <div>
        <div className="s-lbl">✨ SEQUÊNCIA DE CONSISTÊNCIA</div>
        <div className="s-num">
          {streak.currentStreak}{' '}
          <small>{streak.currentStreak === 1 ? 'Dia Ativo' : 'Dias Ativos'}</small>
        </div>
        <div className="s-rec">
          Recorde pessoal: <b style={{ color: '#fff' }}>{streak.longestStreak} dias consecutivos</b>
        </div>
      </div>
      <div className="freeze">
        <div className="ft">❄️ FREEZE GENTIL</div>
        <p>
          Você possui <b style={{ color: '#fff' }}>{streak.freezesAvailable} perdões de descanso</b> disponíveis neste ciclo de 21 dias.
        </p>
        <div className="ok">✓ Sem culpa: descansar também faz parte do plano.</div>
      </div>
    </div>
  );
}
