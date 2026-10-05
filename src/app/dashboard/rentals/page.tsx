'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Link from 'next/link';
import {FileText, Plus, Download, Calendar, DollarSign, User} from 'lucide-react';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    api.get('/rentals')
      .then((res) => setRentals(res.data))
      .catch((err) => console.error('Erro ao buscar contratos:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === rentals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rentals.map((r) => r.id));
    }
  };

  const handleExportSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Selecione pelo menos um contrato para exportar.');
      return;
    }

    try {
      setExporting(true);
      const selectedData = rentals.filter((r) => selectedIds.includes(r.id));
      
      // 1. Adicionado o campo "Contratante" no cabeçalho do CSV
      const csvHeader = 'ID;Contratante;Início;Status;Valor Total\n';
      const csvRows = selectedData.map((r) => {
        const customerName = r.customer?.name ? `"${r.customer.name}"` : '"N/A"';
        return `${r.id};${customerName};${new Date(r.startDate).toLocaleDateString()};${r.status};${r.totalValue}`;
      }).join('\n');

      // 2. BOM (\uFEFF) para UTF-8 correto no Excel
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contratos-selecionados-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar selecionados:', error);
      alert('Erro ao gerar relatório dos selecionados.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="p-8">Carregando contratos...</div>;

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contratos de Locação</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportSelected}
            disabled={exporting || selectedIds.length === 0}
            className="bg-gray-600 text-white px-4 py-2 rounded-md font-bold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {exporting ? 'Exportando...' : `Exportar  (${selectedIds.length})`}
          </button>
          <Link href="/dashboard/rentals/new" className="bg-emerald-600 text-white px-4 py-2 rounded-md font-bold hover:bg-emerald-700 transition">
            + Novo Contrato
          </Link>
        </div>
      </div>

      {rentals.length === 0 ? (
        <p className="text-gray-500">Nenhum contrato cadastrado.</p>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === rentals.length && rentals.length > 0}
                  />
                </th>
                <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Contratante</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Início</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rentals.map((rental) => {
                const isSelected = selectedIds.includes(rental.id);
                return (
                  <tr key={rental.id} className={`hover:bg-gray-50 ${isSelected ? 'bg-emerald-100/60' : ''}`}>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(rental.id)}
                      />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-500">{rental.id.slice(0, 8)}...</td>
                    <td className="p-3 text-sm font-semibold text-gray-900">{rental.customer?.name || 'Cliente não encontrado'}</td>
                    <td className="p-3 text-sm">{new Date(rental.startDate).toLocaleDateString()}</td>
                    <td className="p-3 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{rental.status}</span></td>
                    <td className="p-3 text-sm font-bold">R$ {rental.totalValue?.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}