// ============================================
// Cache Compartilhado de Exercícios (Firestore)
// ============================================
// Cache de segundo nível, compartilhado entre todos os usuários: a primeira
// pessoa que carrega uma categoria/busca consulta a API e salva o resultado
// aqui; todo mundo depois disso lê direto do Firestore, sem nova chamada
// externa. localStorage (por navegador) continua sendo o primeiro nível,
// mais rápido ainda.
import { getDocument, setDocument } from './firestore';
import type { WgerExerciseInfo, WgerCategory } from '@/types/workout';

const COLLECTION = 'exerciseCache';
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias — dados da wger raramente mudam

interface FirestoreTimestampLike {
  toMillis: () => number;
}

interface CachedListDoc {
  results: WgerExerciseInfo[];
  next: string | null;
  updatedAt?: FirestoreTimestampLike | null;
}

interface CachedCategoriesDoc {
  categories: WgerCategory[];
  updatedAt?: FirestoreTimestampLike | null;
}

function isFresh(updatedAt?: FirestoreTimestampLike | null): boolean {
  if (!updatedAt || typeof updatedAt.toMillis !== 'function') return false;
  return Date.now() - updatedAt.toMillis() < TTL_MS;
}

/** Normaliza uma chave livre (categoria+busca) em um ID de documento válido */
export function sanitizeCacheKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .slice(0, 120) || 'default';
}

export async function getCachedExerciseList(
  key: string
): Promise<{ results: WgerExerciseInfo[]; next: string | null } | null> {
  const doc = await getDocument<CachedListDoc>(COLLECTION, `list_${sanitizeCacheKey(key)}`);
  if (doc && isFresh(doc.updatedAt)) {
    return { results: doc.results, next: doc.next };
  }
  return null;
}

export async function setCachedExerciseList(
  key: string,
  results: WgerExerciseInfo[],
  next: string | null
): Promise<void> {
  await setDocument(COLLECTION, `list_${sanitizeCacheKey(key)}`, { results, next });
}

export async function getCachedCategories(): Promise<WgerCategory[] | null> {
  const doc = await getDocument<CachedCategoriesDoc>(COLLECTION, 'categories');
  if (doc && isFresh(doc.updatedAt)) {
    return doc.categories;
  }
  return null;
}

export async function setCachedCategories(categories: WgerCategory[]): Promise<void> {
  await setDocument(COLLECTION, 'categories', { categories });
}
