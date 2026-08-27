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

  // Uma tentativa extra antes de desistir — evita cair no fallback por uma
  // falha de rede pontual (mais provável quando várias buscas rodam juntas)
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

/**
 * Exercícios de reserva (sem dependência de rede), usados quando a busca
 * de exercícios não retorna nada utilizável para o foco selecionado.
 */
const FALLBACK_EXERCISES: Record<string, { name: string; description: string }[]> = {
  fullBody: [
    { name: 'Polichinelo', description: 'Salte abrindo pernas e braços simultaneamente, retornando à posição inicial de forma controlada.' },
    { name: 'Agachamento Livre', description: 'Pés na largura dos ombros, desça flexionando joelhos e quadril mantendo a coluna neutra.' },
    { name: 'Flexão de Braço', description: 'Apoie mãos e pés no chão, desça o tronco controlado e empurre de volta mantendo o corpo alinhado.' },
    { name: 'Prancha Abdominal', description: 'Apoie antebraços e pontas dos pés no chão, mantenha o corpo reto contraindo o abdômen.' },
    { name: 'Burpee', description: 'Agache, jogue os pés para trás em posição de prancha, retorne e salte para cima.' },
    { name: 'Afundo Alternado', description: 'Dê um passo à frente flexionando ambos os joelhos a 90°, alterne as pernas.' },
  ],
  abs: [
    { name: 'Prancha Abdominal', description: 'Apoie antebraços e pontas dos pés no chão, mantenha o corpo reto contraindo o abdômen.' },
    { name: 'Abdominal Supra', description: 'Deitado, flexione o tronco em direção aos joelhos contraindo o abdômen.' },
    { name: 'Elevação de Pernas', description: 'Deitado de costas, eleve as pernas estendidas mantendo a lombar apoiada.' },
    { name: 'Prancha Lateral', description: 'Apoie um antebraço e a lateral do pé no chão, mantenha o quadril elevado e alinhado.' },
  ],
  legs: [
    { name: 'Agachamento Livre', description: 'Pés na largura dos ombros, desça flexionando joelhos e quadril mantendo a coluna neutra.' },
    { name: 'Afundo Alternado', description: 'Dê um passo à frente flexionando ambos os joelhos a 90°, alterne as pernas.' },
    { name: 'Elevação de Panturrilha', description: 'Em pé, eleve os calcanhares o máximo possível e desça controlado.' },
    { name: 'Ponte de Glúteo', description: 'Deitado, pés apoiados no chão, eleve o quadril contraindo os glúteos.' },
  ],
  arms: [
    { name: 'Flexão de Braço', description: 'Apoie mãos e pés no chão, desça o tronco controlado e empurre de volta mantendo o corpo alinhado.' },
    { name: 'Tríceps no Banco', description: 'Apoie as mãos na borda de um banco/cadeira, desça o corpo flexionando os cotovelos.' },
    { name: 'Prancha com Toque no Ombro', description: 'Em posição de prancha, toque o ombro oposto alternadamente mantendo o quadril estável.' },
  ],
  back: [
    { name: 'Superman', description: 'Deitado de bruços, eleve simultaneamente braços e pernas contraindo a lombar.' },
    { name: 'Prancha Abdominal', description: 'Apoie antebraços e pontas dos pés no chão, mantenha o corpo reto contraindo o abdômen.' },
    { name: 'Ponte de Glúteo', description: 'Deitado, pés apoiados no chão, eleve o quadril contraindo os glúteos.' },
  ],
};

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

  // Busca exercícios nas categorias selecionadas (em paralelo — bem mais rápido que sequencial)
  const categoryResults = await Promise.all(
    selectedCategories.map((catId) => fetchWgerExercises({ limit: 8, category: catId }))
  );
  const rawExercises: WgerExerciseInfo[] = categoryResults.flatMap((res) => res.results || []);

  // Filtra e seleciona exercícios variados com imagens e instruções
  const validExercises = rawExercises.filter((e) => e.name && e.description);
  const picked = validExercises.slice(0, targetExerciseCount);

  // Se a API retornar menos do que o desejado, usa os disponíveis
  let selectedWgerList = picked.length > 0 ? picked : validExercises.slice(0, 4);

  // Se a API não devolveu nada utilizável, cai para uma lista fixa local
  // (garante que o treino nunca fique sem exercícios)
  if (selectedWgerList.length === 0) {
    const fallbackList = FALLBACK_EXERCISES[profile.focus] || FALLBACK_EXERCISES.fullBody;
    selectedWgerList = fallbackList.map((ex, idx) => ({
      id: `fallback-${idx}`,
      name: ex.name,
      description: ex.description,
      images: [],
    })) as unknown as WgerExerciseInfo[];
  }

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
  // navegador para a wger.de, que falha sob essa carga e cai no fallback.
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

