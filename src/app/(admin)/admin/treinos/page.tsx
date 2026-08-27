// ============================================
// Painel Administrativo — Gestão de Treinos (CRUD com Firestore + upload de imagem)
// ============================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { WORKOUTS_SEED } from '@/data/workouts-seed';
import { Card, Button, Input, Modal, Badge } from '@/components/ui';
import { getDocuments, setDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadFileWithProgress } from '@/lib/firebase/storage';
import type { Workout } from '@/types/workout';

export default function AdminTreinosPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Workout>>({
    title: '',
    description: '',
    imageURL: '',
    type: 'hiit',
    difficulty: 'beginner',
    durationMinutes: 15,
    caloriesBurned: 120,
    phase: [1],
  });

  // Carrega do Firestore; se a coleção ainda estiver vazia, migra o seed
  // local uma única vez (compatibilidade com os treinos que já existiam).
  useEffect(() => {
    async function load() {
      setIsLoadingList(true);
      const fromDb = await getDocuments<Workout>('workouts');

      if (fromDb.length === 0) {
        await Promise.all(WORKOUTS_SEED.map((w) => setDocument('workouts', w.id, w)));
        setWorkouts(WORKOUTS_SEED);
      } else {
        setWorkouts(fromDb);
      }
      setIsLoadingList(false);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSaving(true);
    try {
      if (editingWorkout) {
        const updated: Workout = { ...editingWorkout, ...formData } as Workout;
        await setDocument('workouts', editingWorkout.id, updated);
        setWorkouts((prev) => prev.map((w) => (w.id === editingWorkout.id ? updated : w)));
      } else {
        const newWorkout: Workout = {
          id: `trk-${Date.now()}`,
          title: formData.title || '',
          description: formData.description || '',
          imageURL:
            formData.imageURL ||
            'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
          type: formData.type || 'hiit',
          difficulty: formData.difficulty || 'beginner',
          durationMinutes: Number(formData.durationMinutes) || 15,
          equipment: 'none',
          phase: formData.phase || [1],
          caloriesBurned: Number(formData.caloriesBurned) || 120,
          exercises: [{ exerciseId: 'polichinelo', sets: 3, durationSeconds: 30, restSeconds: 20 }],
        };
        await setDocument('workouts', newWorkout.id, newWorkout);
        setWorkouts((prev) => [newWorkout, ...prev]);
      }

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
              setFormData({
                title: '',
                description: '',
                imageURL: '',
                type: 'hiit',
                difficulty: 'beginner',
                durationMinutes: 15,
                caloriesBurned: 120,
                phase: [1],
              });
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
                <th className="p-4">Duração</th>
                <th className="p-4">Gasto Estimado</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoadingList ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400 text-sm">
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
                          setEditingWorkout(w);
                          setFormData(w);
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
        size="md"
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
                <p className="text-[11px] text-neutral-400">JPG ou PNG, até 10MB.</p>
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
    </div>
  );
}
