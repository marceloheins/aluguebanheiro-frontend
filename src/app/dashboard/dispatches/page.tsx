'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function DispatchesPage() {
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dispatches/today')
      .then((res) => setDispatches(res.data))
      .catch((err) => console.error('Erro ao buscar ordens de serviço:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Carregando ordens de serviço...</div>;

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Ordens de Serviço (Dispatches)</h1>
      </div>

      {dispatches.length === 0 ? (
        <p className="text-gray-500">Nenhuma ordem de serviço registrada.</p>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Tipo</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Motorista</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dispatches.map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium text-gray-500">{dispatch.id.slice(0, 8)}...</td>
                  <td className="p-3 text-sm font-semibold">
                    <span className={`px-2 py-1 rounded text-xs ${dispatch.type === 'DELIVERY' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                      {dispatch.type === 'DELIVERY' ? 'Entrega' : 'Recolhimento'}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{dispatch.driver?.name || 'Não atribuído'}</td>
                  <td className="p-3 text-sm">{dispatch.rental?.customer?.name || 'N/A'}</td>
                  <td className="p-3 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">
                      {dispatch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}