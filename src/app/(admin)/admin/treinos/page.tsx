// ============================================
// Painel Administrativo — Gestão de Treinos (CRUD + montagem de exercícios)
// ============================================
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { WORKOUTS_SEED, EXERCISES_SEED } from '@/data/workouts-seed';
import { Card, Button, Input, Modal, Badge } from '@/components/ui';
import { getDocuments, setDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadFileWithProgress } from '@/lib/firebase/storage';
import { descriptionToCues } from '@/lib/wgerApi';
import type { Workout, WorkoutExerciseItem, Exercise, FirestoreExercise } from '@/types/workout';

/**
 * Treinos antigos (do seed local) guardam só `exercises` (ids do
 * EXERCISES_SEED local), sem `exercisesList` denormalizado. Resolve isso
 * pra exibir/editar corretamente — sem isso, o modal mostraria "0
 * exercícios" e salvar apagaria os exercícios reais do treino.
 */
function resolveExercisesList(w: Workout): Exercise[] {
  if (w.exercisesList && w.exercisesList.length > 0) return w.exercisesList;
  if (!w.exercises || w.exercises.length === 0) return [];

  const resolved: Exercise[] = [];
  for (const cfg of w.exercises) {
    const found = EXERCISES_SEED.find((e) => e.id === cfg.exerciseId);
    if (!found) continue;
    resolved.push({ ...found, targetSeconds: cfg.durationSeconds ?? found.targetSeconds });
  }
  return resolved;
}

const DEFAULT_FORM: Partial<Workout> = {
  title: '',
  description: '',
  imageURL: '',
  type: 'hiit',
  difficulty: 'beginner',
  durationMinutes: 15,
  caloriesBurned: 120,
  phase: [1],
  exercisesList: [],
};

export default function AdminTreinosPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [library, setLibrary] = useState<FirestoreExercise[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const [formData, setFormData] = useState<Partial<Workout>>(DEFAULT_FORM);

  // Carrega treinos do Firestore; se a coleção estiver vazia, migra o seed
  // local uma única vez (compatibilidade com os treinos que já existiam).
  useEffect(() => {
    async function load() {
      setIsLoadingList(true);
      const [fromDb, exercises] = await Promise.all([
        getDocuments<Workout>('workouts'),
        loadLibrary(),
      ]);

      if (fromDb.length === 0) {
        await Promise.all(WORKOUTS_SEED.map((w) => setDocument('workouts', w.id, w)));
        setWorkouts(WORKOUTS_SEED);
      } else {
        setWorkouts(fromDb);
      }
      setLibrary(exercises);
      setIsLoadingList(false);
    }

    async function loadLibrary(): Promise<FirestoreExercise[]> {
      const { where } = await import('firebase/firestore');
      return getDocuments<FirestoreExercise>('exercises', [where('active', '==', true)]);
    }

    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este treino?')) return;
    await deleteDocument('workouts', id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Selecione um arquivo de imagem.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Imagem muito grande (máximo 10MB).');
      return;
    }

    const workoutId = editingWorkout?.id || `trk-${Date.now()}`;
    const ext = file.name.split('.').pop() || 'jpg';

    setIsUploadingImage(true);
    setUploadProgress(0);
    try {
      const url = await uploadFileWithProgress(
        `workouts/${workoutId}/cover.${ext}`,
        file,
        { contentType: file.type },
        (progress) => setUploadProgress(progress)
      );
      setFormData((prev) => ({ ...prev, imageURL: url }));
    } catch (err) {
      console.error('Erro ao subir imagem:', err);
      alert('Falha ao subir a imagem. Tente novamente.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // --- Montagem dos exercícios do treino ---

  const exercisesList = formData.exercisesList || [];

  const addExercise = (ex: FirestoreExercise) => {
    if (exercisesList.some((e) => e.id === ex.id)) return; // já adicionado

    const newExercise: Exercise = {
      id: ex.id,
      name: ex.name,
      description: ex.description,
      muscleGroup: 'fullBody',
      mediaURL: ex.imageURL,
      equipment: 'none',
      difficulty: formData.difficulty || 'beginner',
      cues: descriptionToCues(ex.description),
      targetSeconds: 30,
    };

    setFormData((prev) => ({
      ...prev,
      exercisesList: [...(prev.exercisesList || []), newExercise],
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setFormData((prev) => ({
      ...prev,
      exercisesList: (prev.exercisesList || []).filter((e) => e.id !== exerciseId),
    }));
  };

  const moveExercise = (index: number, direction: -1 | 1) => {
    setFormData((prev) => {
      const list = [...(prev.exercisesList || [])];
      const target = index + direction;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, exercisesList: list };
    });
  };

  const updateExerciseConfig = (
    exerciseId: string,
    field: 'sets' | 'targetSeconds' | 'restSeconds',
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      exercisesList: (prev.exercisesList || []).map((e) =>
        e.id === exerciseId
          ? field === 'targetSeconds'
            ? { ...e, targetSeconds: value }
            : e
          : e
      ),
      // sets/restSeconds ficam guardados à parte, no exerciseConfigMap abaixo
    }));
    if (field === 'sets' || field === 'restSeconds') {
      setExerciseConfigMap((prev) => ({
        ...prev,
        [exerciseId]: { ...prev[exerciseId], [field]: value },
      }));
    }
  };

  // sets/restSeconds por exercício (não fazem parte do tipo Exercise em si,
  // vão para o array `exercises` — WorkoutExerciseItem)
  const [exerciseConfigMap, setExerciseConfigMap] = useState<
    Record<string, { sets: number; restSeconds: number }>
  >({});

  useEffect(() => {
    if (!isModalOpen) return;
    const map: Record<string, { sets: number; restSeconds: number }> = {};
    const existingConfigs = editingWorkout?.exercises || [];
    for (const ex of exercisesList) {
      const existing = existingConfigs.find((c) => c.exerciseId === ex.id);
      map[ex.id] = {
        sets: existing?.sets ?? 3,
        restSeconds: existing?.restSeconds ?? 15,
      };
    }
    setExerciseConfigMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const pickerResults = useMemo(() => {
    const term = pickerSearch.trim().toLowerCase();
    const alreadyAdded = new Set(exercisesList.map((e) => e.id));
    return library
      .filter((ex) => !alreadyAdded.has(ex.id))
      .filter((ex) => !term || ex.name.toLowerCase().includes(term) || ex.category.toLowerCase().includes(term))
      .slice(0, 40);
  }, [library, pickerSearch, exercisesList]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSaving(true);
    try {
      const exercises: WorkoutExerciseItem[] = exercisesList.map((ex) => ({
        exerciseId: ex.id,
        sets: exerciseConfigMap[ex.id]?.sets ?? 3,
        durationSeconds: ex.targetSeconds ?? 30,
        restSeconds: exerciseConfigMap[ex.id]?.restSeconds ?? 15,
      }));

      const id = editingWorkout?.id || `trk-${Date.now()}`;
      const workout: Workout = {
        id,
        title: formData.title || '',
        description: formData.description || '',
        imageURL:
          formData.imageURL ||
          exercisesList[0]?.mediaURL ||
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
        type: formData.type || 'hiit',
        difficulty: formData.difficulty || 'beginner',
        durationMinutes: Number(formData.durationMinutes) || 15,
        equipment: 'none',
        phase: formData.phase || [1],
        caloriesBurned: Number(formData.caloriesBurned) || 120,
        exercises,
        exercisesList,
      };

      await setDocument('workouts', id, workout);
      setWorkouts((prev) =>
        editingWorkout ? prev.map((w) => (w.id === id ? workout : w)) : [workout, ...prev]
      );

      setIsModalOpen(false);
      setEditingWorkout(null);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = workouts.filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Gerenciamento de Treinos 🏋️
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Adicione e configure os treinos guiados e seus exercícios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar treino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant="primary"
            onClick={() => {
              setEditingWorkout(null);
              setFormData(DEFAULT_FORM);
              setIsModalOpen(true);
            }}
            className="whitespace-nowrap"
          >
            + Novo Treino
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card padding="none" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-4">Treino</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Exercícios</th>
                <th className="p-4">Duração</th>
                <th className="p-4">Gasto Estimado</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoadingList ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">
                    Carregando treinos...
                  </td>
                </tr>
              ) : (
                filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-neutral-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={w.imageURL}
                          alt={w.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-neutral-100"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">{w.title}</p>
                          <p className="text-xs text-neutral-400 line-clamp-1">{w.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="default" size="sm">
                        {w.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-neutral-600">
                      {(w.exercisesList?.length ?? w.exercises?.length ?? 0)} exercícios
                    </td>
                    <td className="p-4 font-semibold text-neutral-700">
                      ⏱️ {w.durationMinutes} min
                    </td>
                    <td className="p-4 font-bold text-primary-700">
                      ~{w.caloriesBurned} kcal
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const resolvedList = resolveExercisesList(w);
                          setEditingWorkout({ ...w, exercisesList: resolvedList });
                          setFormData({ ...w, exercisesList: resolvedList });
                          setIsModalOpen(true);
                        }}
                        className="text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(w.id)}
                        className="text-xs"
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorkout ? 'Editar Treino' : 'Novo Treino'}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Upload de imagem */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Foto do Treino</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                {formData.imageURL ? (
                  <img src={formData.imageURL} alt="Prévia" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300 text-2xl">
                    📷
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? `Enviando... ${Math.round(uploadProgress)}%` : '📤 Subir Imagem'}
                </Button>
                <p className="text-[11px] text-neutral-400">
                  JPG ou PNG, até 10MB. Se não subir nenhuma, usa a foto do 1º exercício.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Título do Treino"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Queima de Gordura 15 Minutos"
          />

          <Input
            label="Descrição"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ex: Treino dinâmico focado em acelerar o metabolismo."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duração (min)"
              type="number"
              value={formData.durationMinutes || ''}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
            />

            <Input
              label="Calorias (kcal)"
              type="number"
              value={formData.caloriesBurned || ''}
              onChange={(e) => setFormData({ ...formData, caloriesBurned: Number(e.target.value) })}
            />
          </div>

          {/* Exercícios do treino */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-neutral-700">
                Exercícios do Treino ({exercisesList.length})
              </label>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsPickerOpen(true)}>
                + Adicionar Exercício
              </Button>
            </div>

            {exercisesList.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                <p className="text-xs text-neutral-400">
                  Nenhum exercício ainda — clique em "Adicionar Exercício" e escolha da Biblioteca.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {exercisesList.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100"
                  >
                    <img
                      src={ex.mediaURL}
                      alt={ex.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 bg-neutral-200"
                    />

                    <span className="flex-1 text-xs font-bold text-neutral-800 truncate" title={ex.name}>
                      {ex.name}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min={1}
                        value={exerciseConfigMap[ex.id]?.sets ?? 3}
                        onChange={(e) => updateExerciseConfig(ex.id, 'sets', Number(e.target.value))}
                        className="w-11 text-center text-[11px] border border-neutral-200 rounded-lg py-1"
                        title="Séries"
                      />
                      <span className="text-[10px] text-neutral-400">séries</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min={5}
                        step={5}
                        value={ex.targetSeconds ?? 30}
                        onChange={(e) => updateExerciseConfig(ex.id, 'targetSeconds', Number(e.target.value))}
                        className="w-11 text-center text-[11px] border border-neutral-200 rounded-lg py-1"
                        title="Duração (s)"
                      />
                      <span className="text-[10px] text-neutral-400">seg</span>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveExercise(idx, -1)}
                        disabled={idx === 0}
                        className="w-6 h-6 rounded-md text-neutral-400 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer"
                        title="Mover para cima"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExercise(idx, 1)}
                        disabled={idx === exercisesList.length - 1}
                        className="w-6 h-6 rounded-md text-neutral-400 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer"
                        title="Mover para baixo"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExercise(ex.id)}
                        className="w-6 h-6 rounded-md text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Remover"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={isSaving || isUploadingImage}>
              {isSaving ? 'Salvando...' : 'Salvar Treino'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Seletor de exercícios da Biblioteca */}
      <Modal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="Adicionar Exercício da Biblioteca"
        size="lg"
      >
        <div className="space-y-3">
          <Input
            placeholder="Buscar por nome ou categoria..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            autoFocus
          />

          <div className="max-h-[420px] overflow-y-auto space-y-1.5 pr-1">
            {pickerResults.length === 0 ? (
              <p className="text-center text-xs text-neutral-400 py-8">
                Nenhum exercício encontrado (ou todos já foram adicionados).
              </p>
            ) : (
              pickerResults.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => {
                    addExercise(ex);
                    setIsPickerOpen(false);
                    setPickerSearch('');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors text-left cursor-pointer"
                >
                  <img
                    src={ex.imageURL}
                    alt={ex.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-neutral-100"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-800 truncate">{ex.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{ex.category}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
