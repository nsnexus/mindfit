// ============================================
// Definição de Badges e Conquistas do Mindfit
// ============================================
import type { AchievementBadgeDef } from '@/types/progress';

export const ACHIEVEMENTS_DEFINITIONS: AchievementBadgeDef[] = [
  {
    id: 'primeiro-passo',
    name: 'Primeiro Passo',
    description: 'Completou o primeiro dia de registro de hábitos no Mindfit.',
    icon: '🔥',
    category: 'streak',
    targetValue: 1,
  },
  {
    id: 'semana-imparavel',
    name: 'Semana Imparável',
    description: 'Manteve 7 dias consecutivos de consistência sem quebrar a sequência.',
    icon: '💪',
    category: 'streak',
    targetValue: 7,
  },
  {
    id: 'metodo-21-dias-concluido',
    name: 'Mente & Corpo Renovados',
    description: 'Concluiu o ciclo completo de 21 dias do programa!',
    icon: '🏆',
    category: 'streak',
    targetValue: 21,
  },
  {
    id: 'mestre-da-hidratacao',
    name: 'Mestre da Hidratação',
    description: 'Atingiu a meta diária de água por 7 dias seguidos.',
    icon: '💧',
    category: 'water',
    targetValue: 7,
  },
  {
    id: 'primeira-foto',
    name: 'Registro Histórico',
    description: 'Fez o primeiro upload de foto para registrar sua evolução visual.',
    icon: '📸',
    category: 'photo',
    targetValue: 1,
  },
  {
    id: 'maquina-de-treino',
    name: 'Máquina de Treino',
    description: 'Concluiu 10 treinos guiados na plataforma.',
    icon: '🏋️',
    category: 'workout',
    targetValue: 10,
  },
  {
    id: 'diario-fiel',
    name: 'Diário Fiel',
    description: 'Registrou refeições no diário alimentar por 14 dias.',
    icon: '🥗',
    category: 'nutrition',
    targetValue: 14,
  },
];
