// ============================================
// Painel Administrativo — Gestão de Receitas (CRUD com Firestore + upload de imagem)
// ============================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { RECIPES_SEED } from '@/data/recipes-seed';
import { Card, Button, Input, Modal, Badge } from '@/components/ui';
import { getDocuments, setDocument, deleteDocument } from '@/lib/firebase/firestore';
import { uploadFileWithProgress } from '@/lib/firebase/storage';
import type { Recipe, Ingredient } from '@/types/recipe';

const CATEGORY_OPTIONS: { value: Recipe['category']; label: string }[] = [
  { value: 'breakfast', label: '☕ Café da Manhã' },
  { value: 'lunch', label: '🥘 Almoço' },
  { value: 'dinner', label: '🍲 Jantar' },
  { value: 'snack', label: '🍎 Lanche' },
  { value: 'dessert', label: '🍫 Sobremesa' },
];

const DIFFICULTY_OPTIONS: { value: Recipe['difficulty']; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' },
];

const TAG_OPTIONS = [
  { value: 'quick', label: '⚡ Rápido' },
  { value: 'vegetarian', label: '🌱 Vegetariano' },
  { value: 'vegan', label: '🌿 Vegano' },
  { value: 'highProtein', label: '🥩 Proteico' },
  { value: 'glutenFree', label: '🌾 Sem Glúten' },
  { value: 'lowCarb', label: '🥑 Low Carb' },
];

const INGREDIENT_CATEGORY_OPTIONS: { value: NonNullable<Ingredient['category']>; label: string }[] = [
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'mercearia', label: 'Mercearia' },
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'temperos', label: 'Temperos' },
];

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

  // --- Ingredientes ---
  const ingredients = formData.ingredients || [];

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { name: '', quantity: '', category: 'mercearia' }],
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index),
    }));
  };

  // --- Modo de preparo ---
  const instructions = formData.instructions || [];

  const addInstruction = () => {
    setFormData((prev) => ({ ...prev, instructions: [...(prev.instructions || []), ''] }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: (prev.instructions || []).map((s, i) => (i === index ? value : s)),
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: (prev.instructions || []).filter((_, i) => i !== index),
    }));
  };

  const moveInstruction = (index: number, direction: -1 | 1) => {
    setFormData((prev) => {
      const list = [...(prev.instructions || [])];
      const target = index + direction;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, instructions: list };
    });
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const current = prev.tags || [];
      return {
        ...prev,
        tags: current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const cleanIngredients = ingredients.filter((i) => i.name.trim());
    const cleanInstructions = instructions.map((s) => s.trim()).filter(Boolean);

    if (cleanIngredients.length === 0) {
      alert('Adicione pelo menos 1 ingrediente.');
      return;
    }
    if (cleanInstructions.length === 0) {
      alert('Adicione pelo menos 1 passo do modo de preparo.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingRecipe) {
        const updated: Recipe = {
          ...editingRecipe,
          ...formData,
          ingredients: cleanIngredients,
          instructions: cleanInstructions,
        } as Recipe;
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
          ingredients: cleanIngredients,
          instructions: cleanInstructions,
          phase: formData.phase || [1, 2, 3],
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
                difficulty: 'easy',
                servings: 1,
                prepTimeMinutes: 15,
                calories: 300,
                protein: 25,
                carbs: 20,
                fat: 10,
                tags: [],
                ingredients: [],
                instructions: [],
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
        size="xl"
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Categoria</label>
              <select
                value={formData.category || 'lunch'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Recipe['category'] })}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm bg-white"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Dificuldade</label>
              <select
                value={formData.difficulty || 'easy'}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Recipe['difficulty'] })}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm bg-white"
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <Input
              label="Porções"
              type="number"
              value={formData.servings || ''}
              onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const isActive = (formData.tags || []).includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-neutral-200 text-neutral-500'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-neutral-700">
                Ingredientes ({ingredients.length})
              </label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                + Adicionar Ingrediente
              </Button>
            </div>

            {ingredients.length === 0 ? (
              <div className="text-center py-6 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                <p className="text-xs text-neutral-400">Nenhum ingrediente ainda.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ingrediente"
                      value={ing.name}
                      onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Quantidade"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(idx, 'quantity', e.target.value)}
                      className="w-28 h-9 px-3 rounded-lg border border-neutral-200 text-xs"
                    />
                    <select
                      value={ing.category || 'mercearia'}
                      onChange={(e) => updateIngredient(idx, 'category', e.target.value)}
                      className="w-28 h-9 px-2 rounded-lg border border-neutral-200 text-xs bg-white shrink-0"
                    >
                      {INGREDIENT_CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modo de Preparo */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-neutral-700">
                Modo de Preparo ({instructions.length} passo{instructions.length === 1 ? '' : 's'})
              </label>
              <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                + Adicionar Passo
              </Button>
            </div>

            {instructions.length === 0 ? (
              <div className="text-center py-6 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                <p className="text-xs text-neutral-400">Nenhum passo ainda.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-9 flex items-center justify-center text-xs font-bold text-neutral-400 shrink-0">
                      {idx + 1}.
                    </span>
                    <textarea
                      placeholder={`Passo ${idx + 1}`}
                      value={step}
                      onChange={(e) => updateInstruction(idx, e.target.value)}
                      rows={2}
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-xs resize-none"
                    />
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveInstruction(idx, -1)}
                        disabled={idx === 0}
                        className="w-7 h-[17px] rounded text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 text-[10px] cursor-pointer"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveInstruction(idx, 1)}
                        disabled={idx === instructions.length - 1}
                        className="w-7 h-[17px] rounded text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 text-[10px] cursor-pointer"
                      >
                        ↓
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInstruction(idx)}
                      className="w-8 h-9 rounded-lg text-red-500 hover:bg-red-50 shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
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
