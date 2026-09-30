// src/app/(dashboard)/users/page.tsx
"use client";

import { useState } from 'react';
import { useUsers, useCreateUser } from '../../../features/users/hooks/useUsers';
import { UserRole } from '../../../features/users/types';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const { mutate: createUser, isPending } = useCreateUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DRIVER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    createUser(
      { name, email, password, role },
      {
        onSuccess: () => {
          setName('');
          setEmail('');
          setPassword('');
          setRole('DRIVER');
        },
      }
    );
  };

  if (isLoading) return <div className="p-8 text-gray-500">Carregando equipe...</div>;

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Equipe</h1>
        <p className="text-sm text-gray-500">Cadastre e gerencie motoristas, despachantes e administradores da locadora.</p>
      </div>

      {/* Formulário de Novo Usuário */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            required
          />
        </div>
        

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            placeholder="email@locadora.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Função / Cargo</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full border rounded-md p-2 text-sm bg-white"
          >
            <option value="DRIVER">Motorista</option>
            <option value="DISPATCHER">Despachante</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition disabled:opacity-50 h-9.5"
        >
          {isPending ? 'Salvando...' : 'Adicionar Membro'}
        </button>
      </form>

      {/* Tabela de Listagem de Membros */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Função</th>
              <th className="p-4">Cadastrado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {users?.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Nenhum usuário cadastrado na equipe.
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'DISPATCHER'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role === 'ADMIN' ? 'Administrador' : user.role === 'DISPATCHER' ? 'Despachante' : 'Motorista'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}