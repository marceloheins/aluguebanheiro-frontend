"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';

interface DispatchDetail {
  id: string;
  type: string;
  status: string;
  scheduledDate: string;
  notes?: string;
  driver?: { name: string };
  rental?: {
    customer?: { name: string; phone?: string; address?: string };
    items?: { equipment?: { serialNumber: string; type: string } }[];
  };
  attachments?: { id: string; fileKey: string; type: string }[];
}

export default function DispatchDetailsPage() {
  const params = useParams();
  const [dispatch, setDispatch] = useState<DispatchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      api.get(`/dispatches/${params.id}`)
        .then((res) => setDispatch(res.data))
        .catch((err) => console.error('Erro ao carregar OS:', err))
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  if (loading) return <div className="p-8">Carregando detalhes da Ordem de Serviço...</div>;
  if (!dispatch) return <div className="p-8 text-red-500">Ordem de serviço não encontrada.</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ordem de Serviço #{dispatch.id?.slice(0, 8)}</h1>
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
          {dispatch.type} - {dispatch.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Dados do Cliente</h3>
          <p className="text-lg font-medium text-gray-900">{dispatch.rental?.customer?.name || 'N/A'}</p>
          <p className="text-sm text-gray-600">Endereço: {dispatch.rental?.customer?.address || 'N/A'}</p>
          <p className="text-sm text-gray-600">Telefone: {dispatch.rental?.customer?.phone || 'N/A'}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Logística</h3>
          <p className="text-sm text-gray-600">Motorista Responsável: <span className="font-medium text-gray-900">{dispatch.driver?.name || 'Não atribuído'}</span></p>
          <p className="text-sm text-gray-600">Data Agendada: {new Date(dispatch.scheduledDate).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">Observações: {dispatch.notes || 'Nenhuma observação.'}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Equipamentos Vinculados</h3>
        <ul className="divide-y divide-gray-200">
          {dispatch.rental?.items?.map((item, index) => (
            <li key={index} className="py-2 flex justify-between items-center">
              <span className="font-medium">Série: {item.equipment?.serialNumber}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">Tipo: {item.equipment?.type}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Comprovantes e Assinaturas</h3>
        {dispatch.attachments && dispatch.attachments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dispatch.attachments.map((att) => (
              <div key={att.id} className="bg-white p-4 rounded-lg border shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-2">{att.type}</p>
                <div className="bg-gray-50 border rounded h-48 flex items-center justify-center overflow-hidden">
                  <span className="text-xs text-gray-400">Key: {att.fileKey}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhum anexo ou assinatura registrada para esta OS ainda.</p>
        )}
      </div>
    </main>
  );
}