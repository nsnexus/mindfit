// ============================================
// Automatic Shopping List Generator Modal
// ============================================
'use client';

import { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import type { ShoppingListItem, Recipe } from '@/types/recipe';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipes: Recipe[];
  onClearList: () => void;
}

const CATEGORY_NAMES: Record<string, { label: string; icon: string }> = {
  hortifruti: { label: 'Hortifrúti (Frutas & Legumes)', icon: '🥬' },
  carnes: { label: 'Carnes, Aves & Ovos', icon: '🥩' },
  laticinios: { label: 'Laticínios & Queijos', icon: '🥛' },
  mercearia: { label: 'Grãos, Pães & Mercearia', icon: '🌾' },
  temperos: { label: 'Temperos & Especiarias', icon: '🧂' },
};

export function ShoppingListModal({
  isOpen,
  onClose,
  selectedRecipes,
  onClearList,
}: ShoppingListModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Group all ingredients from selected recipes
  const itemsByCategory = selectedRecipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ing) => {
      const cat = ing.category || 'mercearia';
      if (!acc[cat]) acc[cat] = [];

      const itemId = `${recipe.id}-${ing.name}`;
      acc[cat].push({
        id: itemId,
        name: ing.name,
        quantity: ing.quantity,
        category: cat,
        checked: Boolean(checkedItems[itemId]),
        recipeSource: recipe.title,
      });
    });
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const toggleCheck = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCopyToClipboard = () => {
    let text = `🛒 Lista de Compras — Mindfit\n\n`;
    Object.entries(itemsByCategory).forEach(([catKey, items]) => {
      text += `${CATEGORY_NAMES[catKey]?.label || catKey}:\n`;
      items.forEach((item) => {
        text += `- ${item.name} (${item.quantity})\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lista de Compras Automática 🛒"
      size="lg"
    >
      <div className="space-y-6">
        <p className="text-xs sm:text-sm text-neutral-500">
          Ingredientes consolidados e organizados por seções de supermercado a partir das suas receitas selecionadas.
        </p>

        {selectedRecipes.length === 0 ? (
          <div className="text-center py-10 text-neutral-400">
            <span className="text-4xl block mb-2">📋</span>
            <p className="text-sm">Nenhuma receita selecionada para a lista.</p>
            <p className="text-xs mt-1 text-neutral-400">
              Navegue pelas receitas e adicione à lista para gerar seus ingredientes.
            </p>
          </div>
        ) : (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {Object.entries(itemsByCategory).map(([catKey, items]) => (
              <div key={catKey} className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5 pb-1 border-b border-neutral-100">
                  <span>{CATEGORY_NAMES[catKey]?.icon || '📦'}</span>
                  <span>{CATEGORY_NAMES[catKey]?.label || catKey}</span>
                </h4>

                <div className="space-y-1.5">
                  {items.map((item) => {
                    const isChecked = checkedItems[item.id];
                    return (
                      <label
                        key={item.id}
                        className={`
                          flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm
                          ${isChecked
                            ? 'bg-neutral-50 border-neutral-200 text-neutral-400 line-through'
                            : 'bg-white border-neutral-100 text-neutral-800 hover:border-neutral-200'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(isChecked)}
                          onChange={() => toggleCheck(item.id)}
                          className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-neutral-400 font-semibold">
                            {item.quantity}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        {selectedRecipes.length > 0 && (
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleCopyToClipboard}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              }
            >
              {copied ? '✓ Copiado para a Área de Transferência!' : 'Copiar Lista (WhatsApp)'}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={onClearList}
            >
              Limpar Lista
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
