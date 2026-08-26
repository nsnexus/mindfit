// ============================================
// Wger.de Fitness & Exercise API Client — Mindfit
// ============================================
import type {
  WgerExerciseInfo,
  WgerCategory,
  WgerMuscle,
} from '@/types/workout';

const WGER_BASE_URL = 'https://wger.de/api/v2';

/**
 * Tradução amigável das categorias da wger para o português
 */
export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Abs: 'Abdômen & Core',
  Arms: 'Braços (Bíceps & Tríceps)',
  Back: 'Costas & Dorsal',
  Calves: 'Panturrilhas',
  Chest: 'Peitoral',
  Legs: 'Pernas & Glúteos',
  Shoulders: 'Ombros & Deltoides',
};

/**
 * Tradução amigável dos músculos para o português
 */
export const MUSCLE_TRANSLATIONS: Record<string, string> = {
  'Biceps brachii': 'Bíceps',
  'Triceps brachii': 'Tríceps',
  'Rectus abdominis': 'Abdômen Reto',
  'Pectoralis major': 'Peitoral Maior',
  'Quadriceps femoris': 'Quadríceps',
  'Gastrocnemius': 'Panturrilhas',
  'Gluteus maximus': 'Glúteos',
  'Latissimus dorsi': 'Dorsal / Costas',
  'Deltoideus': 'Deltoides (Ombros)',
  'Trapezius': 'Trapézio',
  'Hamstrings': 'Posterior de Coxa',
};

export interface FetchExercisesParams {
  limit?: number;
  offset?: number;
  category?: number;
  term?: string;
  language?: number; // 2 = English (most complete), Portuguese is also available
}

export interface WgerApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Remove tags HTML das descrições da wger
 */
export function cleanHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Busca lista de exercícios com detalhes completos (imagens, músculos, categoria)
 */
export async function fetchWgerExercises(
  params: FetchExercisesParams = {}
): Promise<WgerApiResponse<WgerExerciseInfo>> {
  const { limit = 20, offset = 0, category, term } = params;

  try {
    const queryParams = new URLSearchParams();
    queryParams.set('limit', String(limit));
    queryParams.set('offset', String(offset));
    queryParams.set('language', '2'); // Idioma com base de dados mais rica

    if (category) {
      queryParams.set('category', String(category));
    }

    if (term) {
      queryParams.set('term', term);
    }

    const res = await fetch(`${WGER_BASE_URL}/exerciseinfo/?${queryParams.toString()}`, {
      next: { revalidate: 3600 }, // Cache de 1 hora
    });

    if (!res.ok) {
      throw new Error(`Erro ao consultar API wger (HTTP ${res.status})`);
    }

    const data: WgerApiResponse<WgerExerciseInfo> = await res.json();
    return data;
  } catch (err) {
    console.error('[Wger API Error]:', err);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}

/**
 * Busca todas as categorias de exercícios disponíveis na wger
 */
export async function fetchWgerCategories(): Promise<WgerCategory[]> {
  try {
    const res = await fetch(`${WGER_BASE_URL}/exercisecategory/`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];
    const data: WgerApiResponse<WgerCategory> = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('[Wger Categories Error]:', err);
    return [];
  }
}

/**
 * Busca a lista de músculos anatômicos
 */
export async function fetchWgerMuscles(): Promise<WgerMuscle[]> {
  try {
    const res = await fetch(`${WGER_BASE_URL}/muscle/`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];
    const data: WgerApiResponse<WgerMuscle> = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('[Wger Muscles Error]:', err);
    return [];
  }
}
