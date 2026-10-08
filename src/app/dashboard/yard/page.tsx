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

function formatEquipType ( type: string): string {
  const translations: Record<string, string> = {
    PORTA_POTTY: 'Banheiro Químico',
    DUMPSTER: 'Caçamba',
  }
  return translations[type] || type;
}

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
          <h1 className="text-2xl font-bold text-emerald-900">Gestão de Pátio</h1>
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
                  ? 'bg-emerald-600 hover:bg-emerald-800 text-white' 
                  : 'bg-white  text-gray-600 border border-gray-200 hover:bg-gray-50'
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
    <div key={eq.id} className="bg-white rounded-xl shadow-sm border border-emerald-100/80 p-5 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
            {eq.serialNumber}
          </span>
          <div className="flex flex-col gap-2 items-end">
            {/* Badge Interativo: Status Comercial */}
            <div className="relative">
              <select
                value={eq.status}
                onChange={(e) => mutation.mutate({ id: eq.id, payload: { status: e.target.value as EquipmentStatus } })}
                disabled={mutation.isPending}
                className={`appearance-none cursor-pointer pl-3 pr-7 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${statusInfo.color} ${mutation.isPending ? 'opacity-50' : 'hover:brightness-95'}`}
              >
                <option value="AVAILABLE">Disponível</option>
                <option value="RENTED">Alugado</option>
                <option value="MAINTENANCE">Manutenção</option>
              </select>
              {/* Ícone customizado de seta para o select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Badge Interativo: Localização Física */}
            <div className="relative">
              <select
                value={eq.location}
                onChange={(e) => mutation.mutate({ id: eq.id, payload: { location: e.target.value as EquipmentLocation } })}
                disabled={mutation.isPending}
                className={`appearance-none cursor-pointer pl-3 pr-7 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${locationInfo.color} ${mutation.isPending ? 'opacity-50' : 'hover:brightness-95'}`}
              >
                <option value="YARD">No Pátio</option>
                <option value="AT_CLIENT">No Cliente</option>
                <option value="IN_TRANSIT">Em Trânsito</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium mb-1">
          Tipo: <span className="font-bold text-slate-900">{formatEquipType(eq.type)}</span>
        </p>
        {currentCustomer ? (
          <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-md border border-emerald-100 mt-2">
           Cliente: {currentCustomer}
          </p>
        ) : (
          <p className="text-xs text-slate-400 mt-2 italic">Sem cliente vinculado no momento.</p>
        )}
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