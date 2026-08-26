// ============================================
// Página de Login (Email e Senha) — Mindfit
// ============================================
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

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
      <h2
        className="font-head text-[#12352f] leading-tight mb-2"
        style={{ fontSize: '1.85rem', fontWeight: 800 }}
      >
        Bem-vindo de volta! 👋
      </h2>
      <p className="text-[#5b7a72] mb-7" style={{ fontSize: '0.92rem' }}>
        Entre com seu e-mail e senha para acessar sua conta.
      </p>

      {/* Error message */}
      {error && (
        <div
          className="mb-5 flex items-center gap-2"
          style={{
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: '14px',
            color: '#dc2626',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          {error}
        </div>
      )}

      {/* Email form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="font-head"
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#12352f',
              marginBottom: '8px',
            }}
          >
            E-mail de acesso
          </label>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#5b7a72',
                pointerEvents: 'none',
              }}
            >
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                border: '1.5px solid #cdeadd',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontFamily: "'Inter', sans-serif",
                color: '#12352f',
                background: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0e9f6e';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(14,159,110,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#cdeadd';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label
              htmlFor="password"
              className="font-head"
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#12352f',
              }}
            >
              Sua senha
            </label>
            <Link
              href={ROUTES.RECUPERAR_SENHA}
              style={{
                fontSize: '0.82rem',
                color: '#0e9f6e',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#5b7a72',
                pointerEvents: 'none',
              }}
            >
              <Lock size={18} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '14px 50px 14px 44px',
                border: '1.5px solid #cdeadd',
                borderRadius: '14px',
                fontSize: '0.95rem',
                fontFamily: "'Inter', sans-serif",
                color: '#12352f',
                background: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0e9f6e';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(14,159,110,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#cdeadd';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#5b7a72',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '15px 28px',
            fontSize: '1rem',
            marginTop: '6px',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Entrando...' : 'Entrar na minha conta →'}
        </button>
      </form>

      {/* Register link */}
      <p
        className="text-center"
        style={{
          marginTop: '24px',
          fontSize: '0.9rem',
          color: '#5b7a72',
        }}
      >
        Não tem uma conta?{' '}
        <Link
          href={ROUTES.CHECKOUT}
          style={{ color: '#0e9f6e', fontWeight: 700, textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Garantir acesso vitalício
        </Link>
      </p>
    </div>
  );
}
