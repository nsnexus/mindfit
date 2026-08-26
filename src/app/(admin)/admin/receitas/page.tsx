// ============================================
// Painel Administrativo — Gestão de Receitas (CRUD)
// ============================================
'use client';

import { useState } from 'react';
import { RECIPES_SEED } from '@/data/recipes-seed';
import { Card, Button, Input, Modal, Badge } from '@/components/ui';
import type { Recipe } from '@/types/recipe';

export default function AdminReceitasPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES_SEED);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    category: 'lunch',
    prepTimeMinutes: 15,
    difficulty: 'easy',
    servings: 1,
    calories: 300,
    protein: 25,
    carbs: 20,
    fat: 10,
    tags: ['highProtein'],
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingRecipe) {
      setRecipes((prev) =>
        prev.map((r) => (r.id === editingRecipe.id ? ({ ...r, ...formData } as Recipe) : r))
      );
    } else {
      const newRecipe: Recipe = {
        id: `rec-${Date.now()}`,
        title: formData.title || '',
        description: formData.description || '',
        imageURL: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
        category: formData.category || 'lunch',
        tags: formData.tags || [],
        prepTimeMinutes: Number(formData.prepTimeMinutes) || 15,
        difficulty: formData.difficulty || 'easy',
        servings: Number(formData.servings) || 1,
        calories: Number(formData.calories) || 300,
        protein: Number(formData.protein) || 25,
        carbs: Number(formData.carbs) || 20,
        fat: Number(formData.fat) || 10,
        ingredients: [{ name: 'Ingrediente principal', quantity: '1 porção', category: 'mercearia' }],
        instructions: ['Passo 1 do preparo.'],
        phase: [1, 2, 3],
      };
      setRecipes((prev) => [newRecipe, ...prev]);
    }

    setIsModalOpen(false);
    setEditingRecipe(null);
  };

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Gerenciamento de Receitas 📖
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Adicione, edite ou remova receitas disponíveis no aplicativo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar receita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant="primary"
            onClick={() => {
              setEditingRecipe(null);
              setFormData({
                title: '',
                description: '',
                category: 'lunch',
                prepTimeMinutes: 15,
                calories: 300,
                protein: 25,
                carbs: 20,
                fat: 10,
              });
              setIsModalOpen(true);
            }}
            className="whitespace-nowrap"
          >
            + Nova Receita
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card padding="none" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-4">Receita</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Tempo</th>
                <th className="p-4">Calorias</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/50">
                  <td className="p-4">
                    <p className="font-bold text-neutral-900">{r.title}</p>
                    <p className="text-xs text-neutral-400 line-clamp-1">{r.description}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="default" size="sm">
                      {r.category}
                    </Badge>
                  </td>
                  <td className="p-4 font-semibold text-neutral-700">
                    ⏱️ {r.prepTimeMinutes} min
                  </td>
                  <td className="p-4 font-bold text-primary-700">
                    {r.calories} kcal
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingRecipe(r);
                        setFormData(r);
                        setIsModalOpen(true);
                      }}
                      className="text-xs"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(r.id)}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecipe ? 'Editar Receita' : 'Nova Receita'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Título da Receita"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Panqueca Proteica"
          />

          <Input
            label="Descrição Breve"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ex: Rápida, fofinha e com alto teor de fibras."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tempo (minutos)"
              type="number"
              value={formData.prepTimeMinutes || ''}
              onChange={(e) => setFormData({ ...formData, prepTimeMinutes: Number(e.target.value) })}
            />

            <Input
              label="Calorias (kcal)"
              type="number"
              value={formData.calories || ''}
              onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
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
              Salvar Receita
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
