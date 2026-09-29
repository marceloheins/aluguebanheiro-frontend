'use client';

import { useState, useEffect } from 'react';
import { getRentals, createRental, exportRentalsCsv, Rental } from '@/features/rentals/api/rentalApi';
import { getCustomers, Customer } from '@/features/customers/api/customerApi';
import { getEquipments, Equipment } from '@/features/equipments/api/equipmentApi';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    try {
      const [rentalsData, customersData, equipmentsData] = await Promise.all([
        getRentals(),
        getCustomers(),
        getEquipments(),
      ]);
      setRentals(rentalsData);
      setCustomers(customersData);
      // Filtra apenas equipamentos disponíveis para nova locação
      setEquipments(equipmentsData.filter(eq => eq.status === 'AVAILABLE'));
    } catch (error) {
      console.error('Erro ao carregar dados de locação:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createRental({
        customerId,
        equipmentId,
        startDate,
        endDate: endDate || undefined,
        totalValue: Number(totalValue),
      });
      setCustomerId('');
      setEquipmentId('');
      setStartDate('');
      setEndDate('');
      setTotalValue('');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Erro ao registrar locação:', error);
      alert('Erro ao registrar locação.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Locações</h1>
          <p className="text-gray-500 text-sm">Controle contratos, vigências e alocação de equipamentos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Nova Locação
        </button>
      </div>

      <div className="flex space-x-3">
  <button
    onClick={() => exportRentalsCsv()}
    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
  >
    📥 Exportar CSV
  </button>
  <button
    onClick={() => setIsModalOpen(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
  >
    + Nova Locação
  </button>
</div>
      

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando locações...</div>
        ) : rentals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum contrato de locação registrado.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {rental.customer?.name || 'Cliente'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {rental.equipment?.serialNumber} ({rental.equipment?.type})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rental.startDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    R$ {Number(rental.totalValue).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {rental.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Locação / Contrato</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Selecione um cliente...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipamento Disponível</label>
                <select
                  required
                  value={equipmentId}
                  onChange={(e) => setEquipmentId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Selecione um equipamento...</option>
                  {equipments.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.serialNumber} - {eq.type === 'PORTA_POTTY' ? 'Banheiro' : 'Caçamba'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previsão Fim</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="0.00"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : 'Criar Contrato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}