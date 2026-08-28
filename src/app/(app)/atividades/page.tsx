// ============================================
// Atividades — histórico de corridas/caminhadas/pedaladas rastreadas por GPS
// ============================================
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Footprints, Bike, PersonStanding, MapPin, Trash2, Flame, Clock, Route as RouteIcon, Target, Pencil, Check } from 'lucide-react';
import { Card, Progress } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useActivities } from '@/hooks/useActivities';
import { useWeeklyGoal } from '@/hooks/useWeeklyGoal';
import { ACTIVITY_LABELS, type ActivityType } from '@/types/activity';
import { formatDistance, formatDuration, formatPace } from '@/lib/activityMath';

const TYPE_ICON: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  corrida: PersonStanding,
  caminhada: Footprints,
  ciclismo: Bike,
};

const TYPE_OPTIONS: { type: ActivityType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'corrida', label: 'Corrida', icon: PersonStanding },
  { type: 'caminhada', label: 'Caminhada', icon: Footprints },
  { type: 'ciclismo', label: 'Ciclismo', icon: Bike },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export default function AtividadesPage() {
  const router = useRouter();
  const { activities, isLoading, totals, removeActivity } = useActivities();
  const { goalKm, weekDistanceKm, progressPercent, updateGoal } = useWeeklyGoal(activities);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(goalKm));

  const startTracking = (type: ActivityType) => {
    router.push(`${ROUTES.ATIVIDADE_RASTREAR}?tipo=${type}`);
  };

  const openGoalEdit = () => {
    setGoalInput(String(goalKm));
    setIsEditingGoal(true);
  };

  const saveGoal = () => {
    const parsed = Number(goalInput);
    if (parsed > 0) updateGoal(parsed);
    setIsEditingGoal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Atividades 🏃</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Rastreie corrida, caminhada ou pedalada com GPS — percurso no mapa, distância e calorias.
        </p>
      </div>

      {/* Iniciar nova atividade */}
      <Card padding="md" className="bg-white">
        <h3 className="font-bold text-neutral-900 text-sm mb-3">Começar agora</h3>
        <div className="grid grid-cols-3 gap-3">
          {TYPE_OPTIONS.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => startTracking(type)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[#eef4f1] hover:border-[#0e9f6e] hover:bg-[#f0f9f4] transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#f0f9f4] text-[#0e9f6e] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-neutral-700">{label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Meta semanal */}
      <Card padding="md" className="bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#0e9f6e]" /> Meta da semana
          </h3>
          {!isEditingGoal && (
            <button
              onClick={openGoalEdit}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-[#0e9f6e] hover:bg-[#f0f9f4] transition-colors"
              aria-label="Editar meta semanal"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isEditingGoal ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl border border-[#d7ede3] text-sm font-bold text-neutral-900 focus-ring"
              autoFocus
            />
            <span className="text-xs text-neutral-400">km por semana</span>
            <button
              onClick={saveGoal}
              className="ml-auto p-2 rounded-xl bg-[#0e9f6e] text-white hover:brightness-105 transition-all"
              aria-label="Salvar meta"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-lg font-black text-neutral-900">{weekDistanceKm.toFixed(1)} km</span>
              <span className="text-xs text-neutral-400">meta: {goalKm} km</span>
            </div>
            <Progress value={weekDistanceKm} max={goalKm} color={progressPercent >= 100 ? 'success' : 'primary'} />
            <p className="text-[11px] text-neutral-400 mt-2">
              {progressPercent >= 100
                ? '🎉 Meta da semana batida!'
                : `Faltam ${Math.max(0, goalKm - weekDistanceKm).toFixed(1)} km pra bater a meta.`}
            </p>
          </>
        )}
      </Card>

      {/* Totais gerais */}
      {activities.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card padding="md" className="bg-white text-center">
            <RouteIcon className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
            <p className="text-lg font-black text-neutral-900">{formatDistance(totals.distanceMeters)}</p>
            <p className="text-[11px] text-neutral-400">distância total</p>
          </Card>
          <Card padding="md" className="bg-white text-center">
            <Clock className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
            <p className="text-lg font-black text-neutral-900">{formatDuration(totals.durationSeconds)}</p>
            <p className="text-[11px] text-neutral-400">tempo ativo</p>
          </Card>
          <Card padding="md" className="bg-white text-center">
            <Flame className="w-4 h-4 text-[#0e9f6e] mx-auto mb-1" />
            <p className="text-lg font-black text-neutral-900">{totals.calories.toLocaleString('pt-BR')}</p>
            <p className="text-[11px] text-neutral-400">kcal queimadas</p>
          </Card>
        </div>
      )}

      {/* Histórico */}
      <div>
        <h3 className="font-bold text-neutral-900 text-sm mb-3">Histórico</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <Card padding="lg" className="bg-white text-center">
            <MapPin className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">Nenhuma atividade rastreada ainda.</p>
            <p className="text-xs text-neutral-400 mt-1">Escolha corrida, caminhada ou ciclismo acima pra começar.</p>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {activities.map((a) => {
              const Icon = TYPE_ICON[a.type];
              return (
                <Card key={a.id} padding="none" className="bg-white overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    <Link
                      href={ROUTES.ATIVIDADE_DETALHE(a.id)}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-[#f0f9f4] text-[#0e9f6e] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-neutral-900 text-sm">{ACTIVITY_LABELS[a.type]}</p>
                          <span className="text-[11px] text-neutral-400">{formatDate(a.startedAt)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                          <span>{formatDistance(a.distanceMeters)}</span>
                          <span>{formatDuration(a.durationSeconds)}</span>
                          {a.type !== 'ciclismo' && (
                            <span>{formatPace(a.distanceMeters, a.durationSeconds)} /km</span>
                          )}
                          <span className="text-[#0e9f6e] font-semibold">{a.calories} kcal</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Excluir esta atividade?')) removeActivity(a.id);
                      }}
                      className="p-2 rounded-xl text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      aria-label="Excluir atividade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
