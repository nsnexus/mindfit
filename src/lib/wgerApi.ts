// ============================================
// Biblioteca de Exercícios — Mindfit
// ============================================
// A partir desta versão, o app não depende mais da API ao vivo da wger.de:
// os ~268 exercícios curados (com imagem + tradução PT-BR) já foram
// importados uma única vez para a coleção `exercises` do Firestore por
// scripts/sync-exercise-library.mjs. As funções abaixo que geram treinos
// (fetchValidExercisesForFocus, fetchReplacementExercise,
// generateCustomWorkoutFromWger, generateWeeklyPlanFromWger) leem dessa
// coleção. As funções fetchWgerExercises/fetchWgerCategories/fetchWgerMuscles
// e getWgerTranslation/cleanHtml continuam exportadas apenas para uso futuro
// em ferramentas de re-sync administrativas — nenhum caminho do app em
// produção as chama mais.
import type {
  WgerExerciseInfo,
  WgerCategory,
  WgerMuscle,
  FirestoreExercise,
} from '@/types/workout';
import { getDocuments } from '@/lib/firebase/firestore';

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

/** Mapeamento de foco muscular -> categorias da wger */
export const FOCUS_CATEGORY_MAP: Record<string, number[]> = {
  fullBody: [10, 9, 11, 12, 8],
  abs: [10],
  legs: [9, 14],
  arms: [8, 13],
  back: [12, 13],
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
 * Extrai nome e descrição de um exercício da wger.
 * A API não retorna esses campos no nível raiz — eles ficam dentro de
 * `translations[]`, um item por idioma. Tenta o idioma pedido (2 = inglês,
 * base mais completa), cai para o primeiro disponível se não achar.
 */
export function getWgerTranslation(
  exercise: WgerExerciseInfo,
  languageId = 2
): { name: string; description: string } {
  const translations = exercise.translations || [];
  const match =
    translations.find((t) => t.language === languageId && t.name) ||
    translations.find((t) => t.name) ||
    null;

  return {
    name: match?.name || '',
    description: match?.description || '',
  };
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
 * Quebra a descrição real do exercício em frases curtas para exibir como
 * dicas de execução — nada de texto genérico fixo, é sempre o texto real
 * do exercício vindo da wger.
 */
export function descriptionToCues(description: string): string[] {
  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 6);

  return sentences.length > 0 ? sentences.slice(0, 5) : description ? [description] : [];
}

/**
 * Busca lista de exercícios com detalhes completos (imagens, músculos, categoria)
 */
export async function fetchWgerExercises(
  params: FetchExercisesParams = {}
): Promise<WgerApiResponse<WgerExerciseInfo>> {
  const { limit = 20, offset = 0, category, term } = params;

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

  const url = `${WGER_BASE_URL}/exerciseinfo/?${queryParams.toString()}`;

  // Uma tentativa extra antes de desistir — absorve falha de rede pontual
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) {
        throw new Error(`Erro ao consultar API wger (HTTP ${res.status})`);
      }
      const data: WgerApiResponse<WgerExerciseInfo> = await res.json();
      return data;
    } catch (err) {
      if (attempt === 1) {
        console.error('[Wger API Error]:', err);
      } else {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  return { count: 0, next: null, previous: null, results: [] };
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

/** Fotos genéricas usadas só quando o exercício real não tem imagem própria na wger */
const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=70',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=70',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=70',
];

export interface WorkoutQuestionnaireData {
  weight?: number;
  height?: number;
  goalWeight?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'lose' | 'tone' | 'strength';
  focus: 'fullBody' | 'abs' | 'legs' | 'arms' | 'back';
  equipment: 'none' | 'dumbbells' | 'gym';
}

export interface BuiltWgerExercise {
  id: string;
  wgerId: number;
  name: string;
  description: string;
  muscleGroup: string;
  mediaURL: string;
  equipment: string;
  difficulty: string;
  cues: string[];
  targetSeconds: number;
}

/** Monta o item de exercício exibido/usado no treino a partir de um documento real do Firestore */
export function buildExerciseListItem(
  ex: FirestoreExercise,
  opts: { focus: string; equipment: string; difficulty: string; durationSeconds: number },
  imageIdx = 0
): BuiltWgerExercise {
  const description = ex.description || '';

  return {
    id: ex.id,
    wgerId: ex.wgerId,
    name: ex.name || 'Exercício',
    description,
    muscleGroup: opts.focus === 'abs' ? 'core' : opts.focus === 'legs' ? 'legs' : 'fullBody',
    mediaURL: ex.imageURL || PLACEHOLDER_PHOTOS[imageIdx % PLACEHOLDER_PHOTOS.length],
    equipment: opts.equipment === 'none' ? 'none' : 'dumbbells',
    difficulty: opts.difficulty,
    cues: descriptionToCues(description),
    targetSeconds: opts.durationSeconds,
  };
}

/** Busca exercícios ativos da biblioteca (Firestore) para um conjunto de categorias da wger */
async function getExercisesByCategoryIds(categoryIds: number[]): Promise<FirestoreExercise[]> {
  if (typeof window === 'undefined' || categoryIds.length === 0) return [];
  const { where } = await import('firebase/firestore');
  // Firestore limita cláusulas "in" a 10 valores — nossos mapas de foco usam no máximo 5
  return getDocuments<FirestoreExercise>('exercises', [
    where('active', '==', true),
    where('categoryId', 'in', categoryIds.slice(0, 10)),
  ]);
}

const FITNESS_TIMING: Record<string, { targetCount: number; durationSeconds: number; restSeconds: number; sets: number }> = {
  beginner: { targetCount: 4, durationSeconds: 30, restSeconds: 20, sets: 2 },
  intermediate: { targetCount: 5, durationSeconds: 40, restSeconds: 15, sets: 3 },
  advanced: { targetCount: 6, durationSeconds: 45, restSeconds: 15, sets: 3 },
};

/**
 * Busca exercícios reais e válidos (com nome + descrição) para um foco,
 * já deduplicados, lendo da biblioteca própria no Firestore. Usado tanto
 * para montar um treino do zero quanto para trocar um exercício específico
 * por outro.
 */
export async function fetchValidExercisesForFocus(
  focus: WorkoutQuestionnaireData['focus'],
  excludeWgerIds: number[] = []
): Promise<FirestoreExercise[]> {
  const categories = FOCUS_CATEGORY_MAP[focus] || FOCUS_CATEGORY_MAP.fullBody;
  const results = await getExercisesByCategoryIds(categories);

  const seen = new Set<number>(excludeWgerIds);
  const valid: FirestoreExercise[] = [];

  for (const ex of results) {
    if (seen.has(ex.wgerId)) continue;
    if (!ex.name || !ex.description) continue;
    seen.add(ex.wgerId);
    valid.push(ex);
  }

  return valid;
}

/**
 * Busca um único exercício real alternativo para substituir outro no plano
 * (mesmo foco, diferente do que já está na lista).
 */
export async function fetchReplacementExercise(
  focus: WorkoutQuestionnaireData['focus'],
  excludeWgerIds: number[] = []
): Promise<FirestoreExercise | null> {
  const candidates = await fetchValidExercisesForFocus(focus, excludeWgerIds);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Gera um treino guiado personalizado buscando exercícios reais da
 * biblioteca própria (Firestore) de acordo com o perfil, foco e medidas do aluno.
 */
export async function generateCustomWorkoutFromWger(
  profile: WorkoutQuestionnaireData
) {
  const timing = FITNESS_TIMING[profile.fitnessLevel] || FITNESS_TIMING.beginner;
  const { targetCount, durationSeconds, restSeconds, sets } = timing;

  const validExercises = await fetchValidExercisesForFocus(profile.focus);
  const selectedWgerList = validExercises.slice(0, targetCount);

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

  const exercisesList = selectedWgerList.map((wgerEx, idx) =>
    buildExerciseListItem(
      wgerEx,
      { focus: profile.focus, equipment: profile.equipment, difficulty: profile.fitnessLevel, durationSeconds },
      idx
    )
  );

  return {
    id: `custom-wger-${Date.now()}`,
    title: `Treino Personalizado: ${focusLabels[profile.focus] || 'Metabólico'}`,
    description: `Treino guiado exclusivo gerado com base nas suas medidas e foco (${levelLabels[profile.fitnessLevel] || 'Iniciante'}).`,
    imageURL: PLACEHOLDER_PHOTOS[Math.floor(Math.random() * PLACEHOLDER_PHOTOS.length)],
    type: 'hiit' as const,
    difficulty: profile.fitnessLevel,
    durationMinutes: Math.round((exercisesList.length * sets * (durationSeconds + restSeconds)) / 60) || 15,
    equipment: profile.equipment === 'none' ? ('none' as const) : ('dumbbells' as const),
    phase: [1, 2, 3] as (1 | 2 | 3)[],
    caloriesBurned: profile.fitnessLevel === 'beginner' ? 140 : profile.fitnessLevel === 'intermediate' ? 180 : 230,
    exercisesList,
    exercises: exercisesList.map((ex) => ({
      exerciseId: ex.id,
      sets,
      restSeconds,
      durationSeconds,
    })),
  };
}

export const WEEKDAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export interface WeeklyPlanDay {
  day: string;
  dayIndex: number;
  isRestDay: boolean;
  focus?: WorkoutQuestionnaireData['focus'];
  workout?: Awaited<ReturnType<typeof generateCustomWorkoutFromWger>>;
}

export interface WeeklyPlan {
  generatedAt: number;
  profile: WorkoutQuestionnaireData;
  days: WeeklyPlanDay[];
}

/**
 * Monta um plano de treino semanal completo, distribuindo os dias de treino
 * e descanso conforme o nível informado e buscando exercícios reais para cada dia.
 */
export async function generateWeeklyPlanFromWger(
  profile: WorkoutQuestionnaireData
): Promise<WeeklyPlan> {
  const trainingSlotsByLevel: Record<string, number[]> = {
    beginner: [0, 2, 4], // Seg, Qua, Sex
    intermediate: [0, 1, 3, 4], // Seg, Ter, Qui, Sex
    advanced: [0, 1, 2, 3, 4], // Seg a Sex
  };

  const focusRotation: WorkoutQuestionnaireData['focus'][] =
    profile.focus === 'fullBody'
      ? ['fullBody', 'legs', 'back', 'arms', 'abs']
      : [profile.focus, 'fullBody', 'legs', 'back', 'arms'];

  const trainingSlots = trainingSlotsByLevel[profile.fitnessLevel] || trainingSlotsByLevel.beginner;

  // Gera um dia de treino por vez (as categorias de cada dia já buscam em
  // paralelo dentro de generateCustomWorkoutFromWger). Gerar os 5 dias
  // todos ao mesmo tempo dispara ate 25 requisicoes simultaneas do
  // navegador para a wger.de, que falha sob essa carga.
  const days: WeeklyPlanDay[] = [];

  for (let i = 0; i < WEEKDAYS.length; i++) {
    const slotPosition = trainingSlots.indexOf(i);

    if (slotPosition === -1) {
      days.push({ day: WEEKDAYS[i], dayIndex: i, isRestDay: true });
      continue;
    }

    const dayFocus = focusRotation[slotPosition % focusRotation.length] || 'fullBody';
    const workout = await generateCustomWorkoutFromWger({ ...profile, focus: dayFocus });
    workout.id = `${workout.id}-d${i}`;

    days.push({
      day: WEEKDAYS[i],
      dayIndex: i,
      isRestDay: false,
      focus: dayFocus,
      workout,
    });
  }

  return {
    generatedAt: Date.now(),
    profile,
    days,
  };
}
