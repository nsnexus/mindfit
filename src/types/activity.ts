// ============================================
// Activity Tracking Types (corrida / caminhada / ciclismo com GPS)
// ============================================
import type { Timestamp } from 'firebase/firestore';

export type ActivityType = 'corrida' | 'caminhada' | 'ciclismo';

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number; // epoch ms
  accuracy?: number;
}

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  startedAt: string; // ISO
  endedAt: string; // ISO
  durationSeconds: number; // tempo ativo (descontando pausas)
  distanceMeters: number;
  avgSpeedKmh: number;
  calories: number;
  route: RoutePoint[];
  createdAt?: Timestamp;
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  corrida: 'Corrida',
  caminhada: 'Caminhada',
  ciclismo: 'Ciclismo',
};
