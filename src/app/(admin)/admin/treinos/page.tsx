// ============================================
// Painel Administrativo — Gestão de Treinos (CRUD)
// ============================================
'use client';

import { useState } from 'react';
import { WORKOUTS_SEED } from '@/data/workouts-seed';
import { Card, Button, Input, Modal, Badge } from '@/components/ui';
import type { Workout } from '@/types/workout';

export default function AdminTreinosPage() {
  const [workouts, setWorkouts] = useState<Workout[]>(WORKOUTS_SEED);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const [formData, setFormData] = useState<Partial<Workout>>({
    title: '',
    description: '',
    type: 'hiit',
    difficulty: 'beginner',
    durationMinutes: 15,
    caloriesBurned: 120,
    phase: [1],
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingWorkout) {
      setWorkouts((prev) =>
        prev.map((w) => (w.id === editingWorkout.id ? ({ ...w, ...formData } as Workout) : w))
      );
    } else {
      const newWorkout: Workout = {
        id: `trk-${Date.now()}`,
        title: formData.title || '',
        description: formData.description || '',
        imageURL: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
        type: formData.type || 'hiit',
        difficulty: formData.difficulty || 'beginner',
        durationMinutes: Number(formData.durationMinutes) || 15,
        equipment: 'none',
        phase: formData.phase || [1],
        caloriesBurned: Number(formData.caloriesBurned) || 120,
        exercises: [{ exerciseId: 'polichinelo', sets: 3, durationSeconds: 30, restSeconds: 20 }],
      };
      setWorkouts((prev) => [newWorkout, ...prev]);
    }

    setIsModalOpen(false);
    setEditingWorkout(null);
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
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-neutral-50/50">
                  <td className="p-4">
                    <p className="font-bold text-neutral-900">{w.title}</p>
                    <p className="text-xs text-neutral-400 line-clamp-1">{w.description}</p>
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
              ))}
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
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              Salvar Treino
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
