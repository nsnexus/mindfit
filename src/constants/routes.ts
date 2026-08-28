// ============================================
// Rotas da Aplicação
// ============================================

export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  CADASTRO: '/cadastro',
  RECUPERAR_SENHA: '/recuperar-senha',
  CHECKOUT: '/checkout',

  // Onboarding
  ONBOARDING: '/onboarding',

  // App (protegidas)
  DASHBOARD: '/dashboard',
  PLANO_ALIMENTAR: '/plano-alimentar',
  RECEITAS: '/receitas',
  RECEITA_DETALHE: (id: string) => `/receitas/${id}`,
  TREINOS: '/treinos',
  TREINO_ATIVO: (id: string) => `/treinos/${id}`,
  ATIVIDADES: '/atividades',
  ATIVIDADE_RASTREAR: '/atividades/rastrear',
  ATIVIDADE_DETALHE: (id: string) => `/atividades/${id}`,
  PROGRESSO: '/progresso',
  DIARIO: '/diario',
  BEM_ESTAR: '/bem-estar',
  IMC: '/imc',
  PERFIL: '/perfil',

  // Admin (protegidas + role admin)
  ADMIN: '/admin',
  ADMIN_RECEITAS: '/admin/receitas',
  ADMIN_TREINOS: '/admin/treinos',
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_CARDAPIOS: '/admin/cardapios',
} as const;

/**
 * Rotas que NÃO precisam de autenticação
 */
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.CADASTRO,
  ROUTES.RECUPERAR_SENHA,
  ROUTES.CHECKOUT,
];

/**
 * Rotas que precisam de role admin
 */
export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_RECEITAS,
  ROUTES.ADMIN_TREINOS,
  ROUTES.ADMIN_USUARIOS,
  ROUTES.ADMIN_CARDAPIOS,
];
