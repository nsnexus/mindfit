// ============================================
// Exercise Library Explorer (Powered by wger.de) — Mindfit
// ============================================
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Dumbbell,
  Sparkles,
  Layers,
  Info,
  X,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Activity,
  Flame,
} from 'lucide-react';
import {
  fetchWgerExercises,
  fetchWgerCategories,
  cleanHtml,
  getWgerTranslation,
  CATEGORY_TRANSLATIONS,
  MUSCLE_TRANSLATIONS,
} from '@/lib/wgerApi';
import {
  getCachedExerciseList,
  setCachedExerciseList,
  getCachedCategories,
  setCachedCategories,
} from '@/lib/firebase/exerciseCache';
import type { WgerExerciseInfo, WgerCategory } from '@/types/workout';

const CACHE_TTL = 1000 * 60 * 60 * 12; // 12h

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data as T;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // storage cheia ou bloqueada — ignora, cache é so otimizacao
  }
}

export function ExerciseLibrary() {
  const [exercises, setExercises] = useState<WgerExerciseInfo[]>([]);
  const [categories, setCategories] = useState<WgerCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<WgerExerciseInfo | null>(null);

  // Carrega categorias na montagem: localStorage (instantâneo) → Firestore
  // (compartilhado entre usuários) → API (só se ninguém buscou isso ainda)
  useEffect(() => {
    async function loadCategories() {
      const local = readCache<WgerCategory[]>('mindfit_ex_categories');
      if (local) {
        setCategories(local);
        return;
      }

      const shared = await getCachedCategories();
      if (shared) {
        setCategories(shared);
        writeCache('mindfit_ex_categories', shared);
        return;
      }

      const cats = await fetchWgerCategories();
      if (cats.length > 0) {
        setCategories(cats);
        writeCache('mindfit_ex_categories', cats);
        setCachedCategories(cats);
      }
    }
    loadCategories();
  }, []);

  // Carrega exercícios ao mudar filtros: localStorage → Firestore (galeria
  // compartilhada) → API wger como último recurso. Cada nível encontrado
  // "sobe" para os níveis mais rápidos, populando a galeria pros próximos.
  useEffect(() => {
    let isCancelled = false;
    const filterKey = `${selectedCategory ?? 'all'}_${searchTerm || 'none'}`;
    const localKey = `mindfit_ex_list_${filterKey}`;

    async function loadExercises() {
      const local = readCache<{ results: WgerExerciseInfo[]; next: string | null }>(localKey);
      if (local) {
        setExercises(local.results);
        setOffset(18);
        setHasMore(!!local.next);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const shared = await getCachedExerciseList(filterKey);
      if (shared && !isCancelled) {
        setExercises(shared.results);
        setOffset(18);
        setHasMore(!!shared.next);
        setIsLoading(false);
        writeCache(localKey, shared);
        return;
      }

      const res = await fetchWgerExercises({
        limit: 18,
        offset: 0,
        category: selectedCategory || undefined,
        term: searchTerm || undefined,
      });

      if (!isCancelled) {
        setExercises(res.results || []);
        setOffset(18);
        setHasMore(!!res.next);
        setIsLoading(false);
        if (res.results?.length > 0) {
          writeCache(localKey, { results: res.results, next: res.next });
          setCachedExerciseList(filterKey, res.results, res.next);
        }
      }
    }

    loadExercises();

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, searchTerm]);

  // Carrega mais exercícios (paginação infinita)
  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const res = await fetchWgerExercises({
      limit: 18,
      offset,
      category: selectedCategory || undefined,
      term: searchTerm || undefined,
    });

    setExercises((prev) => [...prev, ...(res.results || [])]);
    setOffset((prev) => prev + 18);
    setHasMore(!!res.next);
    setIsLoading(false);
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
              Mais de 800 exercícios com ilustrações anatômicas e guia de postura em tempo real.
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
              placeholder="Buscar por nome (ex: Squat, Push-up, Plank, Crunch...)"
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
            const translatedName = CATEGORY_TRANSLATIONS[cat.name] || cat.name;

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
                {translatedName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercises Grid */}
      {exercises.length === 0 && !isLoading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200/80 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <Info className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-neutral-900 font-[var(--font-heading)]">
            Nenhum exercício encontrado
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Tente buscar com outros termos em inglês ou português, ou selecione uma categoria diferente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {exercises.map((ex) => {
            const mainImage = ex.images?.find((img) => img.is_main)?.image || ex.images?.[0]?.image;
            const categoryName = CATEGORY_TRANSLATIONS[ex.category?.name] || ex.category?.name || 'Geral';
            const { name: exName, description: exDescription } = getWgerTranslation(ex);
            const cleanDesc = cleanHtml(exDescription);

            return (
              <div
                key={ex.id}
                onClick={() => setSelectedExercise(ex)}
                className="group bg-white rounded-3xl border border-emerald-100/80 shadow-[0_8px_25px_-5px_rgba(14,159,110,0.06)] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                {/* Thumbnail Preview */}
                <div className="relative h-44 w-full bg-gradient-to-br from-neutral-50 to-emerald-50/40 flex items-center justify-center overflow-hidden border-b border-neutral-100">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={exName}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Dumbbell className="w-7 h-7" />
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-emerald-800 border border-emerald-500/20 shadow-sm">
                    {categoryName}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-black text-neutral-900 text-base font-[var(--font-heading)] group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {exName || 'Exercício'}
                    </h3>
                    <p className="text-xs text-neutral-400 font-medium line-clamp-2 mt-1 leading-relaxed">
                      {cleanDesc || 'Instruções de execução, ativação muscular e posicionamento correto.'}
                    </p>
                  </div>

                  {/* Muscle Tags */}
                  <div className="pt-2 border-t border-neutral-100/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {ex.muscles?.slice(0, 2).map((m) => (
                        <span
                          key={m.id}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-neutral-100 text-neutral-600"
                        >
                          {MUSCLE_TRANSLATIONS[m.name] || m.name}
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
            );
          })}
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
          {(() => {
            const { name: modalName, description: modalDescription } = getWgerTranslation(selectedExercise);
            return (
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200 relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {CATEGORY_TRANSLATIONS[selectedExercise.category?.name] || selectedExercise.category?.name}
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-[var(--font-heading)] text-neutral-900">
                  {modalName || 'Exercício'}
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

            {/* Images Gallery */}
            {selectedExercise.images && selectedExercise.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedExercise.images.map((img) => (
                  <div
                    key={img.id}
                    className="h-48 rounded-2xl bg-neutral-50 border border-neutral-200/80 p-3 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={img.image}
                      alt={modalName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
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
                        key={m.id}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-emerald-900 border border-emerald-200/80 shadow-xs"
                      >
                        {MUSCLE_TRANSLATIONS[m.name] || m.name}
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
                        key={eq.id}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-neutral-800 border border-neutral-200 shadow-xs"
                      >
                        {eq.name}
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
                {cleanHtml(modalDescription) || (
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
            );
          })()}
        </div>
      )}
    </div>
  );
}
