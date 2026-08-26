// ============================================
// Página de Recuperação de Senha — Mindfit
// ============================================
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export default function RecuperarSenhaPage() {
  const { sendResetEmail, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Informe seu e-mail.');
      return;
    }

    try {
      await sendResetEmail(email);
      setSuccess(true);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setSuccess(true);
      } else if (code === 'auth/invalid-email') {
        setError('E-mail inválido.');
      } else {
        setError('Erro ao enviar. Tente novamente.');
      }
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#e6f6ef] text-[#0e9f6e] rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
          ✉️
        </div>
        <h2 className="text-2xl font-extrabold font-head text-[#12352f]">
          E-mail enviado!
        </h2>
        <p className="text-sm text-[#5b7a72] max-w-sm mx-auto leading-relaxed">
          Se existe uma conta com <strong className="text-[#12352f]">{email}</strong>, você receberá um link para redefinir sua senha.
        </p>
        <p className="text-xs text-[#5b7a72]">
          Não recebeu? Verifique sua pasta de spam.
        </p>
        <div className="pt-4">
          <Link href={ROUTES.LOGIN} className="btn btn-ghost w-full text-sm">
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={ROUTES.LOGIN}
        className="inline-flex items-center gap-1 text-xs text-[#5b7a72] hover:text-[#0e9f6e] mb-6 font-semibold"
      >
        ← Voltar para login
      </Link>

      <h2 className="text-2xl sm:text-3xl font-extrabold font-head text-[#12352f] mb-1.5">
        Recuperar senha 🔑
      </h2>
      <p className="text-sm text-[#5b7a72] mb-6">
        Informe seu e-mail e enviaremos um link para você redefinir sua senha.
      </p>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail cadastrado"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full text-base py-3.5 mt-2"
        >
          {isLoading ? 'Enviando...' : 'Enviar link de recuperação →'}
        </button>
      </form>
    </div>
  );
}
