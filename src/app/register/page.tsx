// src/app/register/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api'; // Certifique-se de que o caminho do seu axios client está correto

export default function RegisterTenantPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    adminName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Envia os dados para a rota POST /tenants do seu backend Express
      await api.post('/tenants', formData);

      alert('Locadora cadastrada com sucesso! Faça login para acessar o sistema.');
      router.push('/login'); // Redireciona para a tela de login
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Erro ao registrar locadora. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* No topo do formulário (tanto em login/page.tsx quanto em register/page.tsx) */}
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
  
  
  <div className="mb-3">
    <img
      src="/icon.jpg" 
      alt="AlugueBanheiro Logo"
      className="h-20 w-auto object-contain drop-shadow-sm" 
    />
  </div>

  <h2 className="text-3xl font-extrabold text-emerald-500 tracking-tight">
    byAlugue Banheiro
  </h2>
  <p className="mt-1 text-sm text-emerald-800">
    Gestão inteligente, sustentável e limpa para sua frota.
  </p>
</div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-extrabold text-emerald-900">
          Cadastre sua Locadora
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-800">
          Gerencie banheiros químicos e caçambas de forma profissional.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-100 py-8 px-4 shadow-stone-500 sm:rounded-lg sm:px-10 border-2 border-emerald-100/80">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-emerald-700">Nome da Locadora</label>
              <div className="mt-1">
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: AlugueFácil Locações"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700">CNPJ da Locadora</label>
              <div className="mt-1">
                <input
                  name="document"
                  type="text"
                  required
                  value={formData.document}
                  onChange={handleChange}
                  placeholder="00.000.000/0001-00"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700">Seu Nome (Administrador)</label>
              <div className="mt-1">
                <input
                  name="adminName"
                  type="text"
                  required
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Ex: Carlos Silva"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700">E-mail de Acesso</label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@locadora.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700">Senha</label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
              >
                {loading ? 'Cadastrando...' : 'Criar Conta e Integrar Asaas'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}