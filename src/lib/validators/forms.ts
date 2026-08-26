// ============================================
// Validações de Formulário (Zod)
// ============================================
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message: 'Você deve aceitar os termos',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const onboardingSchema = z.object({
  age: z.number().min(16, 'Idade mínima: 16 anos').max(100),
  sex: z.enum(['male', 'female']),
  weight: z.number().min(30, 'Peso mínimo: 30kg').max(300),
  height: z.number().min(100, 'Altura mínima: 100cm').max(250),
  goalWeight: z.number().min(30).max(300),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']),
  objective: z.enum(['lose', 'tone', 'maintain']),
  dietaryRestrictions: z.array(z.string()),
  workoutPreference: z.enum(['home', 'gym']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
