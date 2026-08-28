// ============================================
// ActivityDetailClient — detalhe de uma atividade rastreada (mapa + stats)
// ============================================
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Flame, Clock, Route as RouteIcon, Gauge, Footprints, Bike, PersonStanding, Trash2 } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { ActivityMap } from '@/components/activities/ActivityMap';
import { ROUTES } from '@/constants/routes';
import { useActivities } from '@/hooks/useActivities';
import { ACTIVITY_LABELS, type Activity, type ActivityType } from '@/types/activity';
import { formatDuration, formatDistance, formatPace } from '@/lib/activityMath';

const TYPE_ICON: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  corrida: PersonStanding,
  caminhada: Footprints,
  ciclismo: Bike,
};

function formatFullDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function ActivityDetailClient({ activityId }: { activityId: string }) {
  const router = useRouter();
  const { getActivity, removeActivity } = useActivities();
  const [activity, setActivity] = useState<Activity | null | undefined>(undefined);

  useEffect(() => {
    getActivity(activityId).then(setActivity);
  }, [activityId, getActivity]);

  if (activity === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (activity === null) {
    return (
      <Card padding="lg" className="bg-white text-center">
        <p className="text-sm text-neutral-500">Atividade não encontrada.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push(ROUTES.ATIVIDADES)}>
          Voltar
        </Button>
      </Card>
    );
  }

  const Icon = TYPE_ICON[activity.type];

  const handleDelete = async () => {
    if (!confirm('Excluir esta atividade?')) return;
    await removeActivity(activity.id);
    router.push(ROUTES.ATIVIDADES);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(ROUTES.ATIVIDADES)}
            className="p-2 -ml-2 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#f0f9f4] text-[#0e9f6e] flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 leading-tight">{ACTIVITY_LABELS[activity.type]}</h1>
              <p className="text-[11px] text-neutral-400 leading-tight">{formatFullDate(activity.startedAt)}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 rounded-xl text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          aria-label="Excluir atividade"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <Card padding="none" className="bg-white overflow-hidden" style={{ height: 320 }}>
        <ActivityMap route={activity.route} />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card padding="md" className="bg-white text-center">
          <RouteIcon className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
          <p className="text-xl font-black text-neutral-900">{formatDistance(activity.distanceMeters)}</p>
          <p className="text-[11px] text-neutral-400">distância</p>
        </Card>
        <Card padding="md" className="bg-white text-center">
          <Clock className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
          <p className="text-xl font-black text-neutral-900">{formatDuration(activity.durationSeconds)}</p>
          <p className="text-[11px] text-neutral-400">tempo</p>
        </Card>
        <Card padding="md" className="bg-white text-center">
          <Gauge className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
          <p className="text-xl font-black text-neutral-900">
            {activity.type === 'ciclismo'
              ? `${activity.avgSpeedKmh.toFixed(1)} km/h`
              : `${formatPace(activity.distanceMeters, activity.durationSeconds)} /km`}
          </p>
          <p className="text-[11px] text-neutral-400">{activity.type === 'ciclismo' ? 'velocidade média' : 'ritmo médio'}</p>
        </Card>
        <Card padding="md" className="bg-white text-center">
          <Flame className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
          <p className="text-xl font-black text-neutral-900">{activity.calories}</p>
          <p className="text-[11px] text-neutral-400">kcal</p>
        </Card>
      </div>
    </div>
  );
}
