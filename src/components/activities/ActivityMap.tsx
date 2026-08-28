// ============================================
// ActivityMap — mapa Leaflet/OpenStreetMap com o percurso da atividade
// (client-only: Leaflet mexe com `window`, não roda no servidor)
// ============================================
'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { RoutePoint } from '@/types/activity';

interface ActivityMapProps {
  route: RoutePoint[];
  /** Se true, o mapa recentra automaticamente no último ponto (uso durante rastreio ao vivo) */
  live?: boolean;
  className?: string;
}

export function ActivityMap({ route, live = false, className = '' }: ActivityMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  // Inicializa o mapa uma única vez
  useEffect(() => {
    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const start = route[0] ?? { lat: -23.5505, lng: -46.6333 }; // fallback: São Paulo
      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([start.lat, start.lng], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const dotIcon = L.divIcon({
        className: '',
        html: '<div style="width:14px;height:14px;border-radius:50%;background:#0e9f6e;border:3px solid white;box-shadow:0 0 0 2px rgba(14,159,110,0.35)"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      polylineRef.current = L.polyline([], { color: '#0e9f6e', weight: 5, opacity: 0.9 }).addTo(map);
      markerRef.current = L.marker([start.lat, start.lng], { icon: dotIcon }).addTo(map);
      mapRef.current = map;

      // Aplica a rota já existente (ex: abrindo detalhe de atividade finalizada)
      if (route.length > 0) {
        const latlngs = route.map((p) => [p.lat, p.lng]) as [number, number][];
        polylineRef.current.setLatLngs(latlngs);
        markerRef.current.setLatLng(latlngs[latlngs.length - 1]);
        if (route.length > 1) {
          map.fitBounds(polylineRef.current.getBounds(), { padding: [30, 30] });
        }
      }
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza a rota conforme novos pontos chegam
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || route.length === 0) return;

    const latlngs = route.map((p) => [p.lat, p.lng]) as [number, number][];
    polylineRef.current?.setLatLngs(latlngs);

    const last = latlngs[latlngs.length - 1];
    markerRef.current?.setLatLng(last);

    if (live) {
      map.panTo(last, { animate: true });
    } else if (route.length > 1) {
      map.fitBounds(polylineRef.current.getBounds(), { padding: [30, 30] });
    }
  }, [route, live]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 240, borderRadius: 20, overflow: 'hidden' }}
    />
  );
}
