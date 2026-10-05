
"use client";

import { useLogin } from '@/features/auth/hooks/useLogin';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {mutate: login, isPending, isError} = useLogin();
 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({email, password});
  };


  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Cabeçalho com Logo e Título */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <div className="mb-3">
          <img 
            src="/icon.jpg" 
            alt="AlugueBanheiro Logo" 
            className="h-20 w-auto object-contain drop-shadow-sm rounded-xl" 
          />
        </div>
        
        <h2 className="text-3xl font-bold text-emerald-500 tracking-tight">
          byAlugue Banheiro
        </h2>
        <p className="mt-1 text-sm text-emerald-800">
          Acesse o painel operacional da sua locadora.
        </p>
        

      </div>

      {/* Caixa do Formulário */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-50 py-8 px-6 shadow-sm-600 rounded-2xl sm:px-10 border-2 border-emerald-100/80">
          
       {isError && (
          <p className="text-red-500 text-sm mb-4">Credenciais inválidas. Tente Novamente !</p>
        )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@locadora.com"
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition"
              >
                {isPending ? 'Entrando...' : 'Entrar no Sistema'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Ainda não tem uma conta?{' '}
              <a href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition">
                Cadastre sua locadora
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}