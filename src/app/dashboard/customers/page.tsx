// src/app/dashboard/customers/page.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCustomers, useCreateCustomer } from '@/features/customers/hooks/useCustomers';

export default function CustomersPage() {
  const { data: customers = [], isLoading } = useCustomers();
  const { mutate: createCustomer, isPending: submitting } = useCreateCustomer();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Campos do formulário
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [address, setAddress] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    createCustomer(
      { name, phone, email, document, address },
      {
        onSuccess: () => {
          toast.success('Cliente cadastrado com sucesso!');
          setName('');
          setPhone('');
          setEmail('');
          setDocument('');
          setAddress('');
          setIsModalOpen(false);
          // Não precisamos mais chamar fetchCustomers()! 
          // O React Query invalida o cache e atualiza a tela sozinho.
        },
        onError: () => {
          
        }
      }
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Gestão de Clientes</h1>
          <p className="text-gray-500 text-sm">Visualize e cadastre os clientes do seu tenant.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Novo Cliente
        </button>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Carregando clientes...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum cliente cadastrado ainda.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.document || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">Cadastrar Novo Cliente</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo / Empresa</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: Construtora Silva"
                />
              </div>
              {/* Demais campos do form (Telefone, E-mail, Documento, Endereço)... */}
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}