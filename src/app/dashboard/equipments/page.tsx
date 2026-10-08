// src/app/dashboard/equipments/page.tsx
'use client';

import { useState } from 'react';
import { useEquipments, useCreateEquipment } from '@/features/equipments/hooks/useEquipments';
import { toast } from 'sonner';

function formatEquipType(type: string): string {
  const translations: Record<string, string> = {
    PORTA_POTTY: 'Banheiro Químico',
    DUMPSTER: 'Caçamba',
  };
  return translations[type] || type;
}

export default function EquipmentsPage() {
  const { data: equipments = [], isLoading } = useEquipments();
  const { mutate: createEquipment, isPending: submitting } = useCreateEquipment();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Campos do formulário de equipamento
  const [serialNumber, setSerialNumber] = useState('');
  const [type, setType] = useState<'PORTA_POTTY' | 'DUMPSTER'>('PORTA_POTTY');
  const [status, setStatus] = useState<'AVAILABLE' | 'RENTED' | 'MAINTENANCE'>('AVAILABLE');
  const [location, setLocation] = useState<'YARD' | 'AT_CLIENT' | 'IN_TRANSIT'>('YARD');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    createEquipment(
      { 
        serialNumber, 
        type, 
        status, 
        location 
      } as any, 
      {
        onSuccess: () => {
          toast.success('Equipamento cadastrado com sucesso!');
          setSerialNumber('');
          setType('PORTA_POTTY');
          setStatus('AVAILABLE');
          setLocation('YARD');
          setIsModalOpen(false);
        },
        onError: (error: any) => {
          console.error('Erro ao cadastrar equipamento:', error);
          // O interceptor global do axios já exibe a mensagem de erro da API
        }
      }
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Disponível</span>;
      case 'RENTED': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Alugado</span>;
      case 'MAINTENANCE': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Manutenção</span>;
      default: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const locationLabel = (loc: string) => {
    switch (loc) {
      case 'YARD': return 'Pátio';
      case 'AT_CLIENT': return 'No Cliente';
      case 'IN_TRANSIT': return 'Em Trânsito';
      default: return loc;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Equipamentos</h1>
          <p className="text-gray-500 text-sm">Controle o estoque de banheiros químicos e caçambas.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          + Novo Equipamento
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Carregando equipamentos...</div>
        ) : equipments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum equipamento cadastrado ainda.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Série</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipments.map((eq) => (
                <tr key={eq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{eq.serialNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatEquipType(eq.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{statusBadge(eq.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {locationLabel(eq.location)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Cadastro de Equipamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-emerald-100">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">Cadastrar Novo Equipamento</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                  Número de Série / Identificação
                </label>
                <input
                  type="text"
                  required
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Ex: BAN-001 ou CAC-502"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                  Tipo de Equipamento
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="PORTA_POTTY">Banheiro Químico</option>
                  <option value="DUMPSTER">Caçamba</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                  Status Inicial
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="AVAILABLE">Disponível</option>
                  <option value="RENTED">Alugado</option>
                  <option value="MAINTENANCE">Manutenção</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                  Localização Inicial
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="YARD">No Pátio</option>
                  <option value="AT_CLIENT">No Cliente</option>
                  <option value="IN_TRANSIT">Em Trânsito</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
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
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  {submitting ? 'Salvando...' : 'Salvar Equipamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}