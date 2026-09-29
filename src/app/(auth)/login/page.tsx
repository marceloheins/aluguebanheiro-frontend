// src/app/(auth)/login/page.tsx
"use client";

import { useState } from 'react';
import { useLogin } from '../../../features/auth/hooks/useLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Acesso ao Sistema</h1>
        
        {isError && (
          <p className="text-red-500 text-sm mb-4">Credenciais inválidas. Tente novamente.</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-blue-600 text-white rounded p-2 font-medium disabled:opacity-50"
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}