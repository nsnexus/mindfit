// ============================================
// Abstração de GPS: usa rastreio nativo em segundo plano quando rodando
// dentro do app Android (Capacitor), cai pro navigator.geolocation padrão
// quando rodando no navegador (onde só funciona com a aba/tela ativa).
// ============================================
import { Capacitor, registerPlugin } from '@capacitor/core';

export interface RawGeoPoint {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

export interface GeoWatchHandle {
  stop: () => void;
}

/**
 * @capacitor/core é isomórfico (seguro importar tanto na web quanto no app
 * nativo) — ele mesmo resolve a ponte nativa internamente, muito mais
 * confiável que ler `window.Capacitor` na mão (jeito antigo daqui, que
 * ficava preso em falso quando checado cedo demais).
 */
export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

async function startNativeWatch(
  onPosition: (p: RawGeoPoint) => void,
  onError: (message: string, deniedForever?: boolean) => void
): Promise<GeoWatchHandle> {
  const BackgroundGeolocation = registerPlugin<any>('BackgroundGeolocation');

  // Pede a permissão de localização explicitamente pelo plugin oficial
  // primeiro — mais confiável que depender só do "requestPermissions" interno
  // do plugin de background (que às vezes não dispara o diálogo do Android
  // se chamado direto do addWatcher).
  try {
    const { Geolocation } = await import('@capacitor/geolocation');
    let status = await Geolocation.checkPermissions();
    if (status.location !== 'granted' && status.coarseLocation !== 'granted') {
      status = await Geolocation.requestPermissions();
    }
    if (status.location !== 'granted' && status.coarseLocation !== 'granted') {
      // Android já negou antes (ou negou agora e marcou "não perguntar de
      // novo") — nenhum novo diálogo vai aparecer, só dá pra liberar pelas
      // configurações do app.
      onError('Permissão de localização negada. Toque em "Abrir configurações" e libere Localização pro Mindfit.', true);
      return { stop: () => {} };
    }
  } catch (err: any) {
    onError(err?.message || 'Não foi possível pedir permissão de localização.');
  }

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
  onError: (message: string, deniedForever?: boolean) => void
): Promise<GeoWatchHandle> {
  if (isNativeApp()) {
    return startNativeWatch(onPosition, onError);
  }
  return startWebWatch(onPosition, onError);
}

/**
 * Abre a tela de configurações do app no Android (Localização/Permissões) —
 * único jeito de liberar o GPS depois que o Android já negou e parou de
 * mostrar o diálogo de permissão.
 */
export async function openNativeLocationSettings(): Promise<void> {
  try {
    const BackgroundGeolocation = registerPlugin<any>('BackgroundGeolocation');
    await BackgroundGeolocation.openSettings();
  } catch {
    // sem o que fazer se nem isso funcionar
  }
}
