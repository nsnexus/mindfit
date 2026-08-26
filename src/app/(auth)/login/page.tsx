// ============================================
// Página de Login (Email e Senha) — Mindfit
// ============================================
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      const code = err?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-email'
      ) {
        setError('E-mail ou senha incorretos.');
      } else if (code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente em alguns minutos.');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold font-head text-[#12352f] mb-1.5">
        Bem-vindo de volta! 👋
      </h2>
      <p className="text-sm text-[#5b7a72] mb-6">
        Entre com seu e-mail e senha para acessar sua conta.
      </p>

      {/* Error message */}
      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail de acesso"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <div>
          <Input
            label="Sua senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#5b7a72] hover:text-[#12352f] font-semibold cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            }
          />
          <div className="flex justify-end mt-1.5">
            <Link
              href={ROUTES.RECUPERAR_SENHA}
              className="text-xs text-[#0e9f6e] hover:underline font-semibold"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-base py-3.5 mt-2"
        >
          {isLoading ? 'Entrando...' : 'Entrar na minha conta →'}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-xs sm:text-sm text-[#5b7a72]">
        Não tem uma conta?{' '}
        <Link
          href={ROUTES.CHECKOUT}
          className="text-[#0e9f6e] hover:underline font-bold"
        >
          Garantir acesso vitalício
        </Link>
      </p>
    </div>
  );
}
