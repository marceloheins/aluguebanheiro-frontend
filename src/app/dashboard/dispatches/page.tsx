// src/app/dashboard/dispatches/page.tsx
'use client';

import { useDispatchesToday } from '@/features/dispatches/hooks/useDispatchesToday';

export default function DispatchesPage() {
  const { data: dispatches = [], isLoading } = useDispatchesToday();

  if (isLoading) {
    return <div className="p-8 text-gray-500">Carregando ordens de serviço...</div>;
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-900">Gestão de Ordens de Serviço (Dispatches)</h1>
      </div>

      {dispatches.length === 0 ? (
        <div className="p-8 bg-white border border-gray-200 rounded-lg text-center text-gray-500 shadow-sm">
          Nenhuma ordem de serviço registrada para hoje.
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Tipo</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Motorista</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dispatches.map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-500">{dispatch.id.slice(0, 8)}...</td>
                  <td className="p-4 text-sm font-semibold">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${
                      dispatch.type === 'DELIVERY' ? 'bg-blue-100 text-blue-800' : 
                      dispatch.type === 'COLLECTION' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dispatch.type === 'DELIVERY' ? 'Entrega' : dispatch.type === 'COLLECTION' ? 'Recolhimento' : 'Limpeza'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700 font-medium">
                    {dispatch.driver?.name || 'Não atribuído'}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {dispatch.customer?.name || 'N/A'}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      dispatch.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      dispatch.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {dispatch.status === 'COMPLETED' ? 'Concluída' : dispatch.status === 'IN_PROGRESS' ? 'Em Rota' : 'Pendente'}
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