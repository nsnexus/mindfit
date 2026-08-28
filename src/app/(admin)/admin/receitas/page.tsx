// ============================================
// Painel Administrativo — Gestão de Receitas (CRUD com Firestore + upload de imagem)
// ============================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { RECIPES_SEED } from '@/data/recipes-seed';
import { Card, Button, Input, Modal, Badge } from '@/components/ui';
import { getDocuments, setDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadFileWithProgress } from '@/lib/firebase/storage';
import type { Recipe } from '@/types/recipe';

export default function AdminReceitasPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    imageURL: '',
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

  // Carrega do Firestore; se a coleção estiver vazia, migra o seed local
  // uma única vez (compatibilidade com as receitas que já existiam).
  useEffect(() => {
    async function load() {
      setIsLoadingList(true);
      const fromDb = await getDocuments<Recipe>('recipes');

      if (fromDb.length === 0) {
        await Promise.all(RECIPES_SEED.map((r) => setDocument('recipes', r.id, r)));
        setRecipes(RECIPES_SEED);
      } else {
        setRecipes(fromDb);
      }
      setIsLoadingList(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) return;
    await deleteDocument('recipes', id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
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

    const recipeId = editingRecipe?.id || `rec-${Date.now()}`;
    const ext = file.name.split('.').pop() || 'jpg';

    setIsUploadingImage(true);
    setUploadProgress(0);
    try {
      const url = await uploadFileWithProgress(
        `recipes/${recipeId}/cover.${ext}`,
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
      if (editingRecipe) {
        const updated: Recipe = { ...editingRecipe, ...formData } as Recipe;
        await setDocument('recipes', editingRecipe.id, updated);
        setRecipes((prev) => prev.map((r) => (r.id === editingRecipe.id ? updated : r)));
      } else {
        const newRecipe: Recipe = {
          id: `rec-${Date.now()}`,
          title: formData.title || '',
          description: formData.description || '',
          imageURL:
            formData.imageURL ||
            'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
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
        await setDocument('recipes', newRecipe.id, newRecipe);
        setRecipes((prev) => [newRecipe, ...prev]);
      }

      setIsModalOpen(false);
      setEditingRecipe(null);
    } finally {
      setIsSaving(false);
    }
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
                imageURL: '',
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
              {isLoadingList ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400 text-sm">
                    Carregando receitas...
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.imageURL}
                          alt={r.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-neutral-100"
                        />
                        <div>
                          <p className="font-bold text-neutral-900">{r.title}</p>
                          <p className="text-xs text-neutral-400 line-clamp-1">{r.description}</p>
                        </div>
                      </div>
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
                ))
              )}
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
          {/* Upload de imagem */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Foto do Prato</label>
            <div className="flex items-center gap-3">
              <div
                className={`w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200 ${formData.imageURL ? 'cursor-zoom-in' : ''}`}
                onClick={() => formData.imageURL && setIsImageZoomOpen(true)}
                title={formData.imageURL ? 'Clique para ampliar' : undefined}
              >
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

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Proteína (g)"
              type="number"
              value={formData.protein || ''}
              onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
            />
            <Input
              label="Carboidrato (g)"
              type="number"
              value={formData.carbs || ''}
              onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
            />
            <Input
              label="Gordura (g)"
              type="number"
              value={formData.fat || ''}
              onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
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
              {isSaving ? 'Salvando...' : 'Salvar Receita'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Zoom da foto */}
      {isImageZoomOpen && formData.imageURL && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setIsImageZoomOpen(false)}
        >
          <img
            src={formData.imageURL}
            alt="Foto em tamanho grande"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
          />
          <button
            type="button"
            onClick={() => setIsImageZoomOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 text-neutral-800 flex items-center justify-center text-lg font-bold cursor-pointer"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
