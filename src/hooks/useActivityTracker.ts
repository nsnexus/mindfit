// ============================================
// useActivityTracker — rastreio de GPS em tempo real (corrida/caminhada/ciclismo)
// No app nativo (Capacitor/Android), o rastreio continua com a tela apagada
// via serviço em primeiro plano; no navegador, exige aba/tela ativas.
// ============================================
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ActivityType, RoutePoint } from '@/types/activity';
import { haversineDistance, calcAvgSpeedKmh, estimateCalories } from '@/lib/activityMath';
import { startGeoWatch, isNativeApp, type GeoWatchHandle, type RawGeoPoint } from '@/lib/nativeGeolocation';

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
  const [permissionDeniedForever, setPermissionDeniedForever] = useState(false);

  const watchRef = useRef<GeoWatchHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const lastPointRef = useRef<RoutePoint | null>(null);

  // Cronômetro por relógio de parede — mesmo se o timer JS for pausado pelo
  // sistema (app em segundo plano), o tempo real é recalculado certinho
  // assim que voltar a rodar.
  const startedAtRef = useRef<number | null>(null);
  const pausedAccumMsRef = useRef(0);
  const pausedAtRef = useRef<number | null>(null);

  const recomputeElapsed = useCallback(() => {
    if (!startedAtRef.current) return 0;
    const now = Date.now();
    return Math.max(0, Math.floor((now - startedAtRef.current - pausedAccumMsRef.current) / 1000));
  }, []);

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
        setElapsedSeconds(recomputeElapsed());
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [status, requestWakeLock, recomputeElapsed]);

  const stopWatch = useCallback(() => {
    watchRef.current?.stop();
    watchRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePosition = useCallback((raw: RawGeoPoint) => {
    const point: RoutePoint = { lat: raw.lat, lng: raw.lng, timestamp: raw.timestamp, accuracy: raw.accuracy };

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

  const startWatch = useCallback(async () => {
    const handle = await startGeoWatch(handlePosition, (message, deniedForever) => {
      setError(message);
      setPermissionDeniedForever(!!deniedForever);
    });
    watchRef.current = handle;
    timerRef.current = setInterval(() => {
      setElapsedSeconds(recomputeElapsed());
    }, 1000);
  }, [handlePosition, recomputeElapsed]);

  const start = useCallback(() => {
    setError(null);
    setPermissionDeniedForever(false);
    setRoute([]);
    setDistanceMeters(0);
    setElapsedSeconds(0);
    setCurrentSpeedKmh(0);
    lastPointRef.current = null;
    pausedAccumMsRef.current = 0;
    pausedAtRef.current = null;
    startedAtRef.current = Date.now();
    setStatus('tracking');
    requestWakeLock();
    startWatch();
  }, [requestWakeLock, startWatch]);

  const pause = useCallback(() => {
    stopWatch();
    pausedAtRef.current = Date.now();
    setStatus('paused');
  }, [stopWatch]);

  const resume = useCallback(() => {
    if (pausedAtRef.current) {
      pausedAccumMsRef.current += Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    setStatus('tracking');
    startWatch();
  }, [startWatch]);

  const finish = useCallback(
    (type: ActivityType, weightKg: number) => {
      stopWatch();
      releaseWakeLock();
      setStatus('finished');

      const finalElapsed = recomputeElapsed();
      setElapsedSeconds(finalElapsed);
      const avgSpeedKmh = calcAvgSpeedKmh(distanceMeters, finalElapsed);
      const calories = estimateCalories(type, weightKg || 70, finalElapsed, avgSpeedKmh);

      return {
        type,
        distanceMeters,
        durationSeconds: finalElapsed,
        avgSpeedKmh,
        calories,
        route,
      };
    },
    [stopWatch, releaseWakeLock, distanceMeters, route, recomputeElapsed]
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
    startedAtRef.current = null;
    pausedAccumMsRef.current = 0;
    pausedAtRef.current = null;
    setError(null);
    setPermissionDeniedForever(false);
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
    permissionDeniedForever,
    isNative: isNativeApp(),
    start,
    pause,
    resume,
    finish,
    reset,
  };
}
