// ============================================
// Página de Cadastro (Email e Senha) — Mindfit
// ============================================
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { DISCLAIMER_TEXT } from '@/constants/config';

export default function CadastroPage() {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Informe seu nome completo.');
      return;
    }
    if (!email) {
      setError('Informe seu e-mail.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!acceptTerms) {
      setError('Você precisa aceitar os termos para continuar.');
      return;
    }

    try {
      await register(email, password, name.trim());
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado.');
      } else if (code === 'auth/invalid-email') {
        setError('E-mail inválido.');
      } else if (code === 'auth/weak-password') {
        setError('Senha muito fraca. Use pelo menos 6 caracteres.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold font-[var(--font-heading)] text-[#12352f] mb-1.5">
        Crie sua conta 🌱
      </h2>
      <p className="text-sm text-[#5b7a72] mb-6">
        Cadastre-se com seu e-mail e inicie seus 21 dias.
      </p>

      {/* Error message */}
      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Register form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome completo"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          hint="Mínimo de 6 caracteres"
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

        <Input
          label="Confirmar senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="accept-terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[#d7ede3] text-[#0e9f6e] focus:ring-[#0e9f6e] cursor-pointer"
          />
          <label htmlFor="accept-terms" className="text-xs text-[#5b7a72] leading-snug">
            Li e concordo com os Termos de Uso e Política de Privacidade.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-base py-3.5 mt-4"
        >
          {isLoading ? 'Criando conta...' : 'Criar minha conta →'}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-xs sm:text-sm text-[#5b7a72]">
        Já tem uma conta?{' '}
        <Link
          href={ROUTES.LOGIN}
          className="text-[#0e9f6e] hover:underline font-bold"
        >
          Fazer login
        </Link>
      </p>
    </div>
  );
}
