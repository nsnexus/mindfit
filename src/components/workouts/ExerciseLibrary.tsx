// ============================================
// Exercise Library Explorer (Biblioteca própria — Firestore) — Mindfit
// ============================================
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Dumbbell,
  Sparkles,
  Info,
  X,
  ChevronRight,
  RefreshCw,
  Activity,
  Flame,
} from 'lucide-react';
import { getDocuments } from '@/lib/firebase/firestore';
import type { FirestoreExercise } from '@/types/workout';

const PAGE_SIZE = 18;

export function ExerciseLibrary() {
  const [allExercises, setAllExercises] = useState<FirestoreExercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedExercise, setSelectedExercise] = useState<FirestoreExercise | null>(null);

  // Carrega a biblioteca inteira (própria, já traduzida) uma única vez —
  // ~268 exercícios é pouco o suficiente para filtrar/paginar em memória,
  // sem precisar de chamadas repetidas à API externa da wger.
  useEffect(() => {
    async function loadExercises() {
      setIsLoading(true);
      const { where } = await import('firebase/firestore');
      const results = await getDocuments<FirestoreExercise>('exercises', [where('active', '==', true)]);
      setAllExercises(results);
      setIsLoading(false);
    }
    loadExercises();
  }, []);

  // Categorias derivadas dos exercícios carregados (id + nome já em PT-BR)
  const categories = useMemo(() => {
    const map = new Map<number, string>();
    for (const ex of allExercises) {
      if (!map.has(ex.categoryId)) map.set(ex.categoryId, ex.category);
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [allExercises]);

  const filteredExercises = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allExercises.filter((ex) => {
      if (selectedCategory !== null && ex.categoryId !== selectedCategory) return false;
      if (term && !ex.name.toLowerCase().includes(term) && !ex.description.toLowerCase().includes(term)) {
        return false;
      }
      return true;
    });
  }, [allExercises, selectedCategory, searchTerm]);

  // Reseta a paginação em memória sempre que o filtro muda
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchTerm]);

  const visibleExercises = filteredExercises.slice(0, visibleCount);
  const hasMore = visibleCount < filteredExercises.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-[0_8px_30px_-5px_rgba(14,159,110,0.06)] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl sm:text-2xl font-black font-[var(--font-heading)] text-neutral-900 tracking-tight">
                Biblioteca Oficial de Exercícios
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500">
              Exercícios com ilustrações e guia de postura, traduzidos e selecionados para você.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-bold self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5" /> Guia com Ilustrações
          </span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome (ex: Agachamento, Flexão, Prancha...)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Buscar
          </button>
        </form>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setSearchTerm('');
              setSearchInput('');
            }}
            className={`
              px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0
              ${
                selectedCategory === null && !searchTerm
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200'
              }
            `}
          >
            Todos os Exercícios
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0
                  ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200'
                  }
                `}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercises Grid */}
      {!isLoading && visibleExercises.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200/80 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <Info className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-neutral-900 font-[var(--font-heading)]">
            Nenhum exercício encontrado
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Tente buscar com outros termos ou selecione uma categoria diferente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visibleExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="group bg-white rounded-3xl border border-emerald-100/80 shadow-[0_8px_25px_-5px_rgba(14,159,110,0.06)] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              {/* Thumbnail Preview */}
              <div className="relative h-44 w-full bg-gradient-to-br from-neutral-50 to-emerald-50/40 flex items-center justify-center overflow-hidden border-b border-neutral-100">
                {ex.imageURL ? (
                  <img
                    src={ex.imageURL}
                    alt={ex.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Dumbbell className="w-7 h-7" />
                  </div>
                )}

                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-emerald-800 border border-emerald-500/20 shadow-sm">
                  {ex.category || 'Geral'}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-black text-neutral-900 text-base font-[var(--font-heading)] group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {ex.name || 'Exercício'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium line-clamp-2 mt-1 leading-relaxed">
                    {ex.description || 'Instruções de execução, ativação muscular e posicionamento correto.'}
                  </p>
                </div>

                {/* Muscle Tags */}
                <div className="pt-2 border-t border-neutral-100/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {ex.muscles?.slice(0, 2).map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-neutral-100 text-neutral-600"
                      >
                        {m}
                      </span>
                    ))}
                    {ex.muscles?.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-neutral-100 text-neutral-400">
                        +{ex.muscles.length - 2}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Ver guia <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Indicator / Load More */}
      {isLoading && (
        <div className="p-8 text-center flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Carregando exercícios...</span>
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-8 py-3.5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-emerald-800 text-xs font-black shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Carregar Mais Exercícios ➔
          </button>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200 relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedExercise.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-[var(--font-heading)] text-neutral-900">
                  {selectedExercise.name || 'Exercício'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="p-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            {selectedExercise.imageURL && (
              <div className="h-64 rounded-2xl bg-neutral-50 border border-neutral-200/80 p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedExercise.imageURL}
                  alt={selectedExercise.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Muscles Worked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-emerald-600" /> Músculos Principais
                </span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedExercise.muscles?.length > 0 ? (
                    selectedExercise.muscles.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-emerald-900 border border-emerald-200/80 shadow-xs"
                      >
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400">Geral do corpo</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-neutral-500" /> Equipamento Recomendado
                </span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedExercise.equipment?.length > 0 ? (
                    selectedExercise.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-neutral-800 border border-neutral-200 shadow-xs"
                      >
                        {eq}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500 font-semibold">Peso Corporal (Sem aparelhos)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Execution Guide */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                Instruções de Postura e Execução
              </h3>
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                {selectedExercise.description || (
                  <p>Mantenha a postura ereta, respiração ritmada e execute o movimento de forma controlada sem pressa para maximizar a queima calórica.</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
