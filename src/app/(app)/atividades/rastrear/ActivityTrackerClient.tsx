// ============================================
// ActivityTrackerClient — tela de rastreio ao vivo (GPS + mapa + cronômetro)
// ============================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Play, Pause, Square, ChevronLeft, Flame, Clock, Route as RouteIcon, Gauge } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { ActivityMap } from '@/components/activities/ActivityMap';
import { ROUTES } from '@/constants/routes';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useActivities } from '@/hooks/useActivities';
import { useAuthStore } from '@/stores/authStore';
import { getSubDocument } from '@/lib/firebase/firestore';
import { ACTIVITY_LABELS, type ActivityType } from '@/types/activity';
import {
  formatDuration,
  formatDistance,
  formatPace,
  calcAvgSpeedKmh,
  estimateCalories,
} from '@/lib/activityMath';

const VALID_TYPES: ActivityType[] = ['corrida', 'caminhada', 'ciclismo'];

export function ActivityTrackerClient() {
  const router = useRouter();
  const params = useSearchParams();
  const typeParam = params.get('tipo') as ActivityType | null;
  const type: ActivityType = VALID_TYPES.includes(typeParam as ActivityType) ? (typeParam as ActivityType) : 'corrida';

  const { firebaseUser } = useAuthStore();
  const { saveActivity } = useActivities();
  const tracker = useActivityTracker();
  const [weightKg, setWeightKg] = useState(70);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [summary, setSummary] = useState<ReturnType<typeof tracker.finish> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!firebaseUser) return;
    getSubDocument<{ weight?: number }>('users', firebaseUser.uid, 'profile', 'current').then((p) => {
      if (p?.weight) setWeightKg(p.weight);
    });
  }, [firebaseUser]);

  const handleStart = () => {
    setStartedAt(new Date().toISOString());
    tracker.start();
  };

  const handleFinish = () => {
    const result = tracker.finish(type, weightKg);
    setSummary(result);
  };

  const handleSave = async () => {
    if (!summary || !startedAt) return;
    setIsSaving(true);
    const id = await saveActivity({ ...summary, startedAt });
    setIsSaving(false);
    if (id) {
      router.push(ROUTES.ATIVIDADE_DETALHE(id));
    } else {
      router.push(ROUTES.ATIVIDADES);
    }
  };

  const handleDiscard = () => {
    tracker.reset();
    setSummary(null);
    setStartedAt(null);
  };

  const avgSpeedKmh = calcAvgSpeedKmh(tracker.distanceMeters, tracker.elapsedSeconds);
  const liveCalories = estimateCalories(type, weightKg, tracker.elapsedSeconds, avgSpeedKmh);

  // === Tela de resumo pós-finalização ===
  if (summary) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-neutral-900">Atividade concluída 🎉</h1>
        </div>

        <Card padding="none" className="bg-white overflow-hidden" style={{ height: 280 }}>
          <ActivityMap route={summary.route} />
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card padding="md" className="bg-white text-center">
            <RouteIcon className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
            <p className="text-xl font-black text-neutral-900">{formatDistance(summary.distanceMeters)}</p>
            <p className="text-[11px] text-neutral-400">distância</p>
          </Card>
          <Card padding="md" className="bg-white text-center">
            <Clock className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
            <p className="text-xl font-black text-neutral-900">{formatDuration(summary.durationSeconds)}</p>
            <p className="text-[11px] text-neutral-400">tempo</p>
          </Card>
          <Card padding="md" className="bg-white text-center">
            <Gauge className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
            <p className="text-xl font-black text-neutral-900">
              {type === 'ciclismo' ? `${summary.avgSpeedKmh.toFixed(1)} km/h` : `${formatPace(summary.distanceMeters, summary.durationSeconds)} /km`}
            </p>
            <p className="text-[11px] text-neutral-400">{type === 'ciclismo' ? 'velocidade média' : 'ritmo médio'}</p>
          </Card>
          <Card padding="md" className="bg-white text-center">
            <Flame className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
            <p className="text-xl font-black text-neutral-900">{summary.calories}</p>
            <p className="text-[11px] text-neutral-400">kcal</p>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleDiscard} disabled={isSaving}>
            Descartar
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar atividade'}
          </Button>
        </div>
      </div>
    );
  }

  // === Tela de rastreio ao vivo ===
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(ROUTES.ATIVIDADES)}
          className="p-2 -ml-2 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-neutral-900">{ACTIVITY_LABELS[type]}</h1>
      </div>

      {tracker.error && (
        <Card padding="md" className="bg-red-50 border border-red-100">
          <p className="text-sm text-red-600 font-semibold">{tracker.error}</p>
          <p className="text-xs text-red-400 mt-1">
            Verifique se você liberou a permissão de localização pro navegador.
          </p>
        </Card>
      )}

      <Card padding="none" className="bg-white overflow-hidden" style={{ height: 300 }}>
        <ActivityMap route={tracker.route} live />
      </Card>

      <Card padding="lg" className="bg-white">
        <div className="text-center mb-4">
          <p className="text-5xl font-black text-neutral-900 tabular-nums tracking-tight">
            {formatDuration(tracker.elapsedSeconds)}
          </p>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-1">tempo ativo</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center">
            <p className="text-lg font-black text-neutral-900">{formatDistance(tracker.distanceMeters)}</p>
            <p className="text-[11px] text-neutral-400">distância</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-neutral-900">
              {type === 'ciclismo' ? `${avgSpeedKmh.toFixed(1)}` : formatPace(tracker.distanceMeters, tracker.elapsedSeconds)}
            </p>
            <p className="text-[11px] text-neutral-400">{type === 'ciclismo' ? 'km/h média' : 'ritmo /km'}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-neutral-900">{liveCalories}</p>
            <p className="text-[11px] text-neutral-400">kcal</p>
          </div>
        </div>

        {tracker.status === 'idle' && (
          <Button className="w-full" size="lg" onClick={handleStart}>
            <Play className="w-4 h-4 mr-1.5" /> Iniciar {ACTIVITY_LABELS[type].toLowerCase()}
          </Button>
        )}

        {tracker.status === 'tracking' && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={tracker.pause}>
              <Pause className="w-4 h-4 mr-1.5" /> Pausar
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleFinish}>
              <Square className="w-4 h-4 mr-1.5" /> Finalizar
            </Button>
          </div>
        )}

        {tracker.status === 'paused' && (
          <div className="flex gap-3">
            <Button className="flex-1" onClick={tracker.resume}>
              <Play className="w-4 h-4 mr-1.5" /> Retomar
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleFinish}>
              <Square className="w-4 h-4 mr-1.5" /> Finalizar
            </Button>
          </div>
        )}
      </Card>

      <p className="text-[11px] text-neutral-400 text-center px-4">
        {tracker.isNative
          ? 'Pode apagar a tela — o rastreio continua rodando em segundo plano.'
          : 'Mantenha a tela ligada e o app aberto durante a atividade pra não perder o rastreio de GPS.'}
      </p>
    </div>
  );
}
