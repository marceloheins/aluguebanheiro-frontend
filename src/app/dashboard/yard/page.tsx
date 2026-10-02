// src/app/dashboard/yard/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getYardEquipments, updateEquipmentStatusAndLocation, Equipment, EquipmentStatus, EquipmentLocation } from '@/features/equipments/api/equipmentApi';
import { useState } from 'react';

const statusConfig: Record<EquipmentStatus, { label: string; color: string }> = {
  AVAILABLE: { label: 'Disponível', color: 'bg-green-100 text-green-800 border-green-200' },
  RENTED: { label: 'Alugado', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  MAINTENANCE: { label: 'Em Manutenção', color: 'bg-amber-100 text-amber-800 border-amber-200' },
};

const locationConfig: Record<EquipmentLocation, { label: string; color: string }> = {
  YARD: { label: 'No Pátio', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  AT_CLIENT: { label: 'No Cliente / Obra', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  IN_TRANSIT: { label: 'Em Trânsito', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
};

export default function YardManagementPage() {
  const queryClient = useQueryClient();
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  const { data: equipments, isLoading } = useQuery<Equipment[]>({
    queryKey: ['yard-equipments'],
    queryFn: getYardEquipments,
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status?: EquipmentStatus; location?: EquipmentLocation } }) => 
      updateEquipmentStatusAndLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yard-equipments'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar equipamento:', error);
      alert('Não foi possível atualizar o equipamento.');
    },
  });

  if (isLoading) return <div className="p-8 text-gray-500">Carregando painel do pátio...</div>;

  // Filtro por localização física
  const filteredEquipments = locationFilter === 'ALL' 
    ? equipments 
    : equipments?.filter(e => e.location === locationFilter);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Pátio</h1>
          <p className="text-sm text-gray-500">Controle o status comercial e a localização física dos ativos em tempo real.</p>
        </div>

        {/* Filtros por Localização Física */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'ALL', label: 'Todos' },
            { key: 'YARD', label: 'No Pátio' },
            { key: 'AT_CLIENT', label: 'No Cliente' },
            { key: 'IN_TRANSIT', label: 'Em Trânsito' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setLocationFilter(filter.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                locationFilter === filter.key 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Ativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments?.map((eq) => {
          const statusInfo = statusConfig[eq.status] || { label: eq.status, color: 'bg-gray-100 text-gray-800' };
          const locationInfo = locationConfig[eq.location] || { label: eq.location, color: 'bg-gray-100 text-gray-800' };
          const currentCustomer = eq.rentalItem?.[0]?.rental?.customer?.name;

          return (
            <div key={eq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded">
                    {eq.serialNumber}
                  </span>
                  <div className="flex gap-1.5">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${locationInfo.color}`}>
                      {locationInfo.label}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 font-medium mb-1">Tipo: {eq.type}</p>
                {currentCustomer && (
                  <p className="text-xs text-blue-600 mb-3">Cliente/Obra: {currentCustomer}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
                {/* Alterar Status Comercial */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Status Comercial:</span>
                  <select
                    value={eq.status}
                    onChange={(e) => mutation.mutate({ id: eq.id, payload: { status: e.target.value as EquipmentStatus } })}
                    disabled={mutation.isPending}
                    className="border rounded p-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="AVAILABLE">Disponível</option>
                    <option value="RENTED">Alugado</option>
                    <option value="MAINTENANCE">Manutenção</option>
                  </select>
                </div>

                {/* Alterar Localização Física */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Localização:</span>
                  <select
                    value={eq.location}
                    onChange={(e) => mutation.mutate({ id: eq.id, payload: { location: e.target.value as EquipmentLocation } })}
                    disabled={mutation.isPending}
                    className="border rounded p-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="YARD">No Pátio</option>
                    <option value="AT_CLIENT">No Cliente</option>
                    <option value="IN_TRANSIT">Em Trânsito</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEquipments?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500">
          Nenhum equipamento encontrado com esta localização.
        </div>
      )}
    </main>
  );
}