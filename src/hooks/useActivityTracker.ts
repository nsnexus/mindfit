// ============================================
// useActivityTracker — rastreio de GPS em tempo real (corrida/caminhada/ciclismo)
// ============================================
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ActivityType, RoutePoint } from '@/types/activity';
import { haversineDistance, calcAvgSpeedKmh, estimateCalories } from '@/lib/activityMath';

export type TrackerStatus = 'idle' | 'tracking' | 'paused' | 'finished';

// Pontos com precisão pior que isso (metros) são descartados
const MAX_ACCURACY_M = 35;
// Deslocamento mínimo entre pontos aceitos, pra não acumular tremulação de GPS parado
const MIN_POINT_DISTANCE_M = 2;
// Velocidade instantânea acima disso é tratada como salto/erro de GPS
const MAX_PLAUSIBLE_SPEED_KMH = 45;

export function useActivityTracker() {
  const [status, setStatus] = useState<TrackerStatus>('idle');
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastPointRef = useRef<RoutePoint | null>(null);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch {
      // silencioso — nem todo navegador suporta, não é bloqueante
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
  }, []);

  // Reconquista o wake lock se a aba voltar a ficar visível durante o rastreio
  useEffect(() => {
    const onVisibility = () => {
      if (status === 'tracking' && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [status, requestWakeLock]);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePosition = useCallback((pos: GeolocationPosition) => {
    const point: RoutePoint = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      timestamp: pos.timestamp,
      accuracy: pos.coords.accuracy,
    };

    if (point.accuracy != null && point.accuracy > MAX_ACCURACY_M) {
      return; // GPS impreciso demais, descarta
    }

    const last = lastPointRef.current;
    if (last) {
      const dMeters = haversineDistance(last, point);
      const dtSeconds = (point.timestamp - last.timestamp) / 1000;
      const instSpeedKmh = dtSeconds > 0 ? (dMeters / 1000) / (dtSeconds / 3600) : 0;

      if (instSpeedKmh > MAX_PLAUSIBLE_SPEED_KMH) {
        return; // salto implausível, descarta
      }
      if (dMeters < MIN_POINT_DISTANCE_M) {
        return; // tremulação parado, ignora
      }

      setDistanceMeters((prev) => prev + dMeters);
      setCurrentSpeedKmh(instSpeedKmh);
    }

    lastPointRef.current = point;
    setRoute((prev) => [...prev, point]);
  }, []);

  const startWatch = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Este navegador não suporta GPS.');
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      (err) => setError(err.message || 'Não foi possível obter sua localização.'),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }, [handlePosition]);

  const start = useCallback(() => {
    setError(null);
    setRoute([]);
    setDistanceMeters(0);
    setElapsedSeconds(0);
    setCurrentSpeedKmh(0);
    lastPointRef.current = null;
    setStatus('tracking');
    requestWakeLock();
    startWatch();
  }, [requestWakeLock, startWatch]);

  const pause = useCallback(() => {
    stopWatch();
    setStatus('paused');
  }, [stopWatch]);

  const resume = useCallback(() => {
    setStatus('tracking');
    startWatch();
  }, [startWatch]);

  const finish = useCallback(
    (type: ActivityType, weightKg: number) => {
      stopWatch();
      releaseWakeLock();
      setStatus('finished');

      const avgSpeedKmh = calcAvgSpeedKmh(distanceMeters, elapsedSeconds);
      const calories = estimateCalories(type, weightKg || 70, elapsedSeconds, avgSpeedKmh);

      return {
        type,
        distanceMeters,
        durationSeconds: elapsedSeconds,
        avgSpeedKmh,
        calories,
        route,
      };
    },
    [stopWatch, releaseWakeLock, distanceMeters, elapsedSeconds, route]
  );

  const reset = useCallback(() => {
    stopWatch();
    releaseWakeLock();
    setStatus('idle');
    setRoute([]);
    setDistanceMeters(0);
    setElapsedSeconds(0);
    setCurrentSpeedKmh(0);
    lastPointRef.current = null;
    setError(null);
  }, [stopWatch, releaseWakeLock]);

  useEffect(() => () => {
    stopWatch();
    releaseWakeLock();
  }, [stopWatch, releaseWakeLock]);

  return {
    status,
    route,
    distanceMeters,
    elapsedSeconds,
    currentSpeedKmh,
    error,
    start,
    pause,
    resume,
    finish,
    reset,
  };
}
