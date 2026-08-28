// ============================================
// Gerador de card de compartilhamento (estilo Strava) — Canvas 2D, 100% client-side
// ============================================
import type { Activity } from '@/types/activity';
import { ACTIVITY_LABELS } from '@/types/activity';
import { formatDistance, formatDuration, formatPace } from './activityMath';

const WIDTH = 1080;
const HEIGHT = 1350; // proporção 4:5, boa pro feed e stories do Instagram

function drawRoute(ctx: CanvasRenderingContext2D, route: Activity['route'], box: { x: number; y: number; w: number; h: number }) {
  if (route.length < 2) return;

  const lats = route.map((p) => p.lat);
  const lngs = route.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latSpan = maxLat - minLat || 0.0005;
  const lngSpan = maxLng - minLng || 0.0005;

  // Mantém proporção real (evita rota "esticada")
  const scale = Math.min(box.w / lngSpan, box.h / latSpan) * 0.85;
  const drawW = lngSpan * scale;
  const drawH = latSpan * scale;
  const offsetX = box.x + (box.w - drawW) / 2;
  const offsetY = box.y + (box.h - drawH) / 2;

  ctx.beginPath();
  route.forEach((p, i) => {
    const x = offsetX + (p.lng - minLng) * scale;
    const y = offsetY + (maxLat - p.lat) * scale; // inverte lat (imagem cresce pra baixo)
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Marcadores de início/fim
  const start = route[0];
  const end = route[route.length - 1];
  const startX = offsetX + (start.lng - minLng) * scale;
  const startY = offsetY + (maxLat - start.lat) * scale;
  const endX = offsetX + (end.lng - minLng) * scale;
  const endY = offsetY + (maxLat - end.lat) * scale;

  ctx.beginPath();
  ctx.arc(startX, startY, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#8bc34a';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(endX, endY, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#ecb11f';
  ctx.fill();
}

function statBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: string,
  label: string,
  align: 'left' | 'right' = 'left'
) {
  ctx.textAlign = align;
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 64px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(value, x, y);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '700 26px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(label.toUpperCase(), x, y + 36);
}

function formatShareDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * Desenha o card num canvas e devolve um Blob PNG pronto pra compartilhar/baixar.
 */
export async function generateActivityShareCard(activity: Activity): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas não suportado');

  // Fundo — gradiente da marca
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, '#0f5e5a');
  bg.addColorStop(0.55, '#0a3d3a');
  bg.addColorStop(1, '#0e9f6e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Marca d'água / wordmark
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 46px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText('Mindfit', 64, 100);

  // Tipo de atividade + data
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '700 32px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(ACTIVITY_LABELS[activity.type], 64, 150);
  ctx.font = '500 26px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText(formatShareDate(activity.startedAt), 64, 185);

  // Painel translúcido com o percurso
  const panel = { x: 64, y: 230, w: WIDTH - 128, h: 620 };
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.roundRect(panel.x, panel.y, panel.w, panel.h, 32);
  ctx.fill();

  if (activity.route.length >= 2) {
    drawRoute(ctx, activity.route, { x: panel.x + 40, y: panel.y + 40, w: panel.w - 80, h: panel.h - 80 });
  } else {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '600 28px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('🏃 Mindfit', panel.x + panel.w / 2, panel.y + panel.h / 2);
  }

  // Estatísticas — grade 2x2
  const col1X = 64;
  const col2X = WIDTH - 64;
  const row1Y = panel.y + panel.h + 130;
  const row2Y = row1Y + 150;

  statBlock(ctx, col1X, row1Y, formatDistance(activity.distanceMeters), 'distância', 'left');
  statBlock(ctx, col2X, row1Y, formatDuration(activity.durationSeconds), 'tempo', 'right');

  const paceOrSpeed =
    activity.type === 'ciclismo'
      ? `${activity.avgSpeedKmh.toFixed(1)} km/h`
      : `${formatPace(activity.distanceMeters, activity.durationSeconds)} /km`;
  statBlock(ctx, col1X, row2Y, paceOrSpeed, activity.type === 'ciclismo' ? 'velocidade média' : 'ritmo médio', 'left');
  statBlock(ctx, col2X, row2Y, `${activity.calories} kcal`, 'calorias', 'right');

  // Rodapé
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '600 24px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText('mindfit.nsnexus.com.br', WIDTH / 2, HEIGHT - 48);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Falha ao gerar imagem'));
    }, 'image/png');
  });
}

/**
 * Compartilha (Web Share API com arquivo, quando suportado) ou baixa o card gerado.
 */
export async function shareOrDownloadActivityCard(activity: Activity): Promise<'shared' | 'downloaded'> {
  const blob = await generateActivityShareCard(activity);
  const fileName = `mindfit-${activity.type}-${activity.id}.png`;
  const file = new File([blob], fileName, { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: `Minha ${ACTIVITY_LABELS[activity.type].toLowerCase()} no Mindfit`,
      text: `${formatDistance(activity.distanceMeters)} em ${formatDuration(activity.durationSeconds)} 💪`,
    });
    return 'shared';
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
