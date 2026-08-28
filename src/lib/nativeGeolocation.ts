// ============================================
// Abstração de GPS: usa rastreio nativo em segundo plano quando rodando
// dentro do app Android (Capacitor), cai pro navigator.geolocation padrão
// quando rodando no navegador (onde só funciona com a aba/tela ativa).
// ============================================

export interface RawGeoPoint {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

export interface GeoWatchHandle {
  stop: () => void;
}

let cachedIsNative: boolean | null = null;

export function isNativeApp(): boolean {
  if (cachedIsNative !== null) return cachedIsNative;
  try {
    // Import estático seria travado no build web (pacote nativo). Como só
    // precisamos de um boolean síncrono, checamos o objeto global que o
    // runtime do Capacitor injeta na WebView nativa.
    cachedIsNative = typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    cachedIsNative = false;
  }
  return cachedIsNative;
}

async function startNativeWatch(
  onPosition: (p: RawGeoPoint) => void,
  onError: (message: string) => void
): Promise<GeoWatchHandle> {
  const { registerPlugin } = await import('@capacitor/core');
  const BackgroundGeolocation = registerPlugin<any>('BackgroundGeolocation');

  // Android 13+ exige permissão de notificação pro serviço em primeiro
  // plano conseguir mostrar o aviso "rastreando localização".
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.requestPermissions();
  } catch {
    // segue sem — o serviço ainda tenta rodar, só pode falhar a notificação
  }

  let watcherId: string | null = null;
  try {
    watcherId = await BackgroundGeolocation.addWatcher(
      {
        backgroundMessage: 'Rastreando sua atividade — toque pra voltar ao Mindfit.',
        backgroundTitle: 'Mindfit está rastreando',
        requestPermissions: true,
        stale: false,
        distanceFilter: 3,
      },
      (location: any, error: any) => {
        if (error) {
          onError(error.message || 'Erro no GPS.');
          return;
        }
        if (!location) return;
        onPosition({
          lat: location.latitude,
          lng: location.longitude,
          timestamp: location.time || Date.now(),
          accuracy: location.accuracy,
        });
      }
    );
  } catch (err: any) {
    onError(err?.message || 'Não foi possível iniciar o GPS nativo.');
  }

  return {
    stop: () => {
      if (watcherId) {
        BackgroundGeolocation.removeWatcher({ id: watcherId }).catch(() => {});
      }
    },
  };
}

function startWebWatch(
  onPosition: (p: RawGeoPoint) => void,
  onError: (message: string) => void
): GeoWatchHandle {
  if (!('geolocation' in navigator)) {
    onError('Este navegador não suporta GPS.');
    return { stop: () => {} };
  }

  const watchId = navigator.geolocation.watchPosition(
    (pos) =>
      onPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: pos.timestamp,
        accuracy: pos.coords.accuracy,
      }),
    (err) => onError(err.message || 'Não foi possível obter sua localização.'),
    { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
  );

  return { stop: () => navigator.geolocation.clearWatch(watchId) };
}

/**
 * Inicia o rastreio de localização (nativo em segundo plano no app Android,
 * ou navigator.geolocation no navegador — só ativo com a aba em foco).
 */
export async function startGeoWatch(
  onPosition: (p: RawGeoPoint) => void,
  onError: (message: string) => void
): Promise<GeoWatchHandle> {
  if (isNativeApp()) {
    return startNativeWatch(onPosition, onError);
  }
  return startWebWatch(onPosition, onError);
}
