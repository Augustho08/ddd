'use client';

import { FormEvent, useState } from 'react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('1533');
  const [password, setPassword] = useState('1533');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error || 'Credenciais inválidas.');
        return;
      }

      window.location.href = '/admin';
    } catch {
      setError('Não foi possível realizar o login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px', background: '#0b1020', color: '#edf2ff' }}>
      <section style={{ width: '100%', maxWidth: 420, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32 }}>
        <h1 style={{ marginBottom: 12 }}>Login administrativo</h1>
        <p style={{ marginBottom: 24, color: '#cbd5e1' }}>Faça login para gerenciar a galeria.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span>Usuário</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Usuário"
              autoComplete="username"
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #374151', background: '#0f172a', color: '#fff' }}
            />
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              autoComplete="current-password"
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #374151', background: '#0f172a', color: '#fff' }}
            />
          </label>

          {error ? (
            <p style={{ margin: 0, color: '#fca5a5' }}>{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: '12px 16px', borderRadius: 10, border: 'none', background: '#38bdf8', color: '#082f49', fontWeight: 700, cursor: isLoading ? 'wait' : 'pointer' }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
