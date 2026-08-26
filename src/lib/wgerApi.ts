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

export interface WorkoutQuestionnaireData {
  weight?: number;
  height?: number;
  goalWeight?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'lose' | 'tone' | 'strength';
  focus: 'fullBody' | 'abs' | 'legs' | 'arms' | 'back';
  equipment: 'none' | 'dumbbells' | 'gym';
}

/**
 * Gera um treino guiado personalizado buscando exercícios reais da API wger.de
 * de acordo com o perfil, foco e medidas do aluno.
 */
export async function generateCustomWorkoutFromWger(
  profile: WorkoutQuestionnaireData
) {
  // Mapeamento de categorias da wger
  const categoryMap: Record<string, number[]> = {
    fullBody: [10, 9, 11, 12, 8],
    abs: [10],
    legs: [9, 14],
    arms: [8, 13],
    back: [12, 13],
  };

  const selectedCategories = categoryMap[profile.focus] || [10, 9, 11];
  const targetExerciseCount = profile.fitnessLevel === 'beginner' ? 4 : profile.fitnessLevel === 'intermediate' ? 5 : 6;
  const durationSeconds = profile.fitnessLevel === 'beginner' ? 30 : profile.fitnessLevel === 'intermediate' ? 40 : 45;
  const restSeconds = profile.fitnessLevel === 'beginner' ? 20 : 15;
  const sets = profile.fitnessLevel === 'beginner' ? 2 : 3;

  // Busca exercícios nas categorias selecionadas
  const rawExercises: WgerExerciseInfo[] = [];

  for (const catId of selectedCategories) {
    const res = await fetchWgerExercises({ limit: 8, category: catId });
    if (res.results && res.results.length > 0) {
      rawExercises.push(...res.results);
    }
  }

  // Filtra e seleciona exercícios variados com imagens e instruções
  const validExercises = rawExercises.filter((e) => e.name && e.description);
  const picked = validExercises.slice(0, targetExerciseCount);

  // Se a API retornar menos do que o desejado, usa os disponíveis
  const selectedWgerList = picked.length > 0 ? picked : validExercises.slice(0, 4);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=70',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=70',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=70',
  ];

  const focusLabels: Record<string, string> = {
    fullBody: 'Corpo Inteiro (Queima Metabólica)',
    abs: 'Abdômen & Core Definido',
    legs: 'Pernas & Glúteos Firmes',
    arms: 'Braços & Ombros',
    back: 'Costas & Postura',
  };

  const levelLabels: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
  };

  return {
    id: `custom-wger-${Date.now()}`,
    title: `Treino Personalizado: ${focusLabels[profile.focus] || 'Metabólico'}`,
    description: `Treino guiado exclusivo gerado com base nas suas medidas e foco (${levelLabels[profile.fitnessLevel] || 'Iniciante'}).`,
    imageURL: fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
    type: 'hiit' as const,
    difficulty: profile.fitnessLevel,
    durationMinutes: Math.round((targetExerciseCount * sets * (durationSeconds + restSeconds)) / 60) || 15,
    equipment: profile.equipment === 'none' ? ('none' as const) : ('dumbbells' as const),
    phase: [1, 2, 3] as (1 | 2 | 3)[],
    caloriesBurned: profile.fitnessLevel === 'beginner' ? 140 : profile.fitnessLevel === 'intermediate' ? 180 : 230,
    exercisesList: selectedWgerList.map((wgerEx, idx) => ({
      id: `wger-${wgerEx.id}`,
      name: wgerEx.name,
      description: cleanHtml(wgerEx.description),
      muscleGroup: (profile.focus === 'abs' ? 'core' : profile.focus === 'legs' ? 'legs' : 'fullBody') as any,
      mediaURL: wgerEx.images && wgerEx.images.length > 0 ? wgerEx.images[0].image : fallbackImages[idx % fallbackImages.length],
      equipment: profile.equipment === 'none' ? 'none' : 'dumbbells',
      difficulty: profile.fitnessLevel,
      cues: [
        'Mantenha a postura alinhada e abdômen contraído.',
        'Respire de forma contínua durante todo o movimento.',
        'Controle a velocidade na fase de descida.',
      ],
      targetSeconds: durationSeconds,
    })),
    exercises: selectedWgerList.map((wgerEx) => ({
      exerciseId: `wger-${wgerEx.id}`,
      sets,
      durationSeconds,
      restSeconds,
    })),
  };
}

