// src/app/dashboard/rentals/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useEquipments } from '@/features/equipments/hooks/useEquipments';
import { useCreateRental } from '@/features/rentals/hooks/useRentals';
import { toast } from 'sonner';
import { usePricing } from '@/features/pricing/hooks/usePricing';

// Tabela de preços sugeridos por tipo de equipamento (Ajuste conforme sua tabela comercial)
const EQUIPMENT_PRICES: Record<string, number> = {
  PORTA_POTTY: 150.00, // Diária ou valor base do Banheiro Químico
  DUMPSTER: 280.00,    // Diária ou valor base da Caçamba
};

function formatEquipType(type: string): string {
  const translations: Record<string, string> = {
    PORTA_POTTY: 'Banheiro Químico',
    DUMPSTER: 'Caçamba',
  };
  return translations[type] || type;
}

export default function NewRentalPage() {
  const router = useRouter();
  const { data: pricingTable } = usePricing();
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: allEquipments = [], isLoading: loadingEquipments } = useEquipments();
  const { mutate: createRental, isPending: submitting } = useCreateRental();

  // Filtramos apenas equipamentos disponíveis no pátio
  const availableEquipments = allEquipments.filter(
    (eq) => eq.status === 'AVAILABLE' && eq.location === 'YARD'
  );

  // Estados do Formulário
  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);

  // 🧠 CÁLCULO AUTOMÁTICO DE VALOR
  useEffect(() => {
    if (selectedEquipments.length === 0 || !pricingTable) {
      setTotalValue('');
      return;
    }

    // Soma o valor base dos equipamentos selecionados
    let calculatedTotal = 0;
    selectedEquipments.forEach((eqId) => {
      const equip = availableEquipments.find((e) => e.id === eqId);
      if (equip) {
        const basePrice = pricingTable[equip.type as keyof typeof pricingTable] || 100;
        calculatedTotal += basePrice;
      }
    });

    // Se houver data de início e término, podemos multiplicar pelos dias (opcional)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      calculatedTotal = calculatedTotal * diffDays;
    }

    setTotalValue(calculatedTotal.toFixed(2));
  }, [selectedEquipments, startDate, endDate, availableEquipments]);

  const handleToggleEquipment = (id: string) => {
    setSelectedEquipments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEquipments.length === 0) {
      toast.error('Selecione pelo menos um equipamento para o contrato.');
      return;
    }

    createRental(
      {
        customerId,
        startDate,
        endDate: endDate || undefined,
        totalValue: Number(totalValue),
        equipmentIds: selectedEquipments,
      } as any,
      {
        onSuccess: () => {
          toast.success('Contrato criado com sucesso!');
          router.push('/dashboard/rentals');
        },
        onError: (error: any) => {
          console.error('Erro ao criar contrato:', error);
        }
      }
    );
  };

  const isLoadingData = loadingCustomers || loadingEquipments;

  if (isLoadingData) {
    return <div className="p-8 text-center text-gray-500">Carregando dados para o contrato...</div>;
  }

  return (
    <main className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-emerald-100 mt-6">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">Novo Contrato de Locação</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            Cliente (Construtora / Evento)
          </label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
          >
            <option value="">Selecione um cliente...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              Data de Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
              Data de Término (Opcional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Valor Total do Contrato (R$)
            </label>
            <span className="text-[11px] text-slate-400 italic">Calculado automaticamente (editável)</span>
          </div>
          <input
            type="number"
            step="0.01"
            value={totalValue}
            onChange={(e) => setTotalValue(e.target.value)}
            required
            placeholder="0.00"
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-emerald-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            Equipamentos Disponíveis no Pátio
          </label>
          {availableEquipments.length === 0 ? (
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
              Nenhum equipamento disponível no pátio no momento. Cadastre ou retorne equipamentos para o pátio.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto border border-slate-200 p-3 rounded-xl bg-slate-50">
              {availableEquipments.map((eq) => {
                const isSelected = selectedEquipments.includes(eq.id);
                const suggestedPrice = EQUIPMENT_PRICES[eq.type] || 100;
                return (
                  <div
                    key={eq.id}
                    onClick={() => handleToggleEquipment(eq.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                      isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs' : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-800">{eq.serialNumber}</span>
                      <span className="text-xs text-slate-500">{formatEquipType(eq.type)}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-1">R$ {suggestedPrice.toFixed(2)}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {isSelected ? 'Selecionado ✓' : '+ Adicionar'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 text-white p-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors mt-6 disabled:opacity-50 shadow-sm"
        >
          {submitting ? 'Salvando Contrato...' : 'Criar Contrato e Alocar Equipamentos'}
        </button>
      </form>
    </main>
  );
}