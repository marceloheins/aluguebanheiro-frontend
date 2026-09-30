



'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

interface Customer {
  id: string;
  name: string;
}

interface Equipment {
  id: string;
  serialNumber: string;
  type: string;
}

export default function NewRentalPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  
  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carrega clientes e equipamentos disponíveis no pátio
    api.get('/customers').then((res) => setCustomers(res.data));
    api.get('/equipments?status=AVAILABLE').then((res) => setEquipments(res.data));
  }, []);

  const handleToggleEquipment = (id: string) => {
    setSelectedEquipments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEquipments.length === 0) {
      alert('Selecione pelo menos um equipamento para o contrato.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/rentals', {
        customerId,
        startDate,
        endDate: endDate || undefined,
        totalValue: Number(totalValue),
        equipmentIds: selectedEquipments,
      });

      alert('Contrato criado com sucesso!');
      router.push('/dashboard/rentals');
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      alert('Erro ao registrar locação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-sm border mt-6">
      <h1 className="text-2xl font-bold mb-6">Novo Contrato de Locação (Multi-itens)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente (Construtora / Evento)</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">Selecione um cliente...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Término (Opcional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Valor Total do Contrato (R$)</label>
          <input
            type="number"
            step="0.01"
            value={totalValue}
            onChange={(e) => setTotalValue(e.target.value)}
            required
            placeholder="0.00"
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Equipamentos Disponíveis no Pátio (Selecione um ou mais)</label>
          {equipments.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum equipamento disponível no momento.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded-md bg-gray-50">
              {equipments.map((eq) => {
                const isSelected = selectedEquipments.includes(eq.id);
                return (
                  <div
                    key={eq.id}
                    onClick={() => handleToggleEquipment(eq.id)}
                    className={`p-2 rounded border cursor-pointer flex justify-between items-center ${
                      isSelected ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <span>{eq.serialNumber} ({eq.type})</span>
                    <span className="text-xs font-bold">{isSelected ? '✓ Selecionado' : '+ Adicionar'}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition"
        >
          {loading ? 'Salvando Contrato...' : 'Criar Contrato e Alocar Equipamentos'}
        </button>
      </form>
    </main>
  );
}