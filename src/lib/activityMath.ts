// ============================================
// Cálculos de rastreio de atividade — distância, ritmo, calorias
// ============================================
import type { ActivityType, RoutePoint } from '@/types/activity';

const EARTH_RADIUS_M = 6371000;

/**
 * Distância entre dois pontos GPS (fórmula de Haversine), em metros.
 */
export function haversineDistance(a: RoutePoint, b: RoutePoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Soma a distância total percorrida numa rota, filtrando ruído de GPS
 * (pontos com baixa precisão ou saltos implausíveis são ignorados).
 */
export function totalRouteDistance(route: RoutePoint[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    total += haversineDistance(route[i - 1], route[i]);
  }
  return total;
}

/**
 * MET (Metabolic Equivalent of Task) estimado pela velocidade média,
 * baseado na tabela do Compendium of Physical Activities.
 */
export function estimateMET(type: ActivityType, speedKmh: number): number {
  if (type === 'caminhada') {
    if (speedKmh < 3.2) return 2.0;
    if (speedKmh < 4.8) return 2.8;
    if (speedKmh < 5.6) return 3.5;
    if (speedKmh < 6.4) return 4.3;
    if (speedKmh < 7.2) return 5.0;
    return 8.0; // caminhada bem acelerada / trote leve
  }

  if (type === 'ciclismo') {
    if (speedKmh < 16) return 4.0;
    if (speedKmh < 19) return 6.8;
    if (speedKmh < 22.4) return 8.0;
    if (speedKmh < 25.7) return 10.0;
    if (speedKmh < 30.6) return 12.0;
    return 15.8;
  }

  // corrida
  if (speedKmh < 8) return 8.3;
  if (speedKmh < 9.7) return 9.8;
  if (speedKmh < 10.8) return 10.5;
  if (speedKmh < 11.3) return 11.0;
  if (speedKmh < 12.1) return 11.8;
  if (speedKmh < 12.9) return 12.3;
  if (speedKmh < 14.5) return 12.8;
  if (speedKmh < 16.1) return 14.5;
  return 16.0;
}

/**
 * Calorias gastas: kcal/min = (MET * 3.5 * pesoKg) / 200
 */
export function estimateCalories(type: ActivityType, weightKg: number, durationSeconds: number, avgSpeedKmh: number): number {
  const met = estimateMET(type, avgSpeedKmh);
  const minutes = durationSeconds / 60;
  const kcalPerMin = (met * 3.5 * weightKg) / 200;
  return Math.round(kcalPerMin * minutes);
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Ritmo em min/km (usado pra corrida/caminhada). Retorna string tipo "5:32".
 */
export function formatPace(distanceMeters: number, durationSeconds: number): string {
  if (distanceMeters < 50) return '--:--';
  const paceSecPerKm = durationSeconds / (distanceMeters / 1000);
  const min = Math.floor(paceSecPerKm / 60);
  const sec = Math.round(paceSecPerKm % 60);
  return `${min}:${String(sec).padStart(2, '0')}`;
}

export function calcAvgSpeedKmh(distanceMeters: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return (distanceMeters / 1000) / (durationSeconds / 3600);
}
