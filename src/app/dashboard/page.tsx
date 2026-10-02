// src/app/dashboard/page.tsx
"use client";

import { api } from '@/services/api';
import { useDispatchesToday } from '../../features/dispatches/hooks/useDispatches';

export default function DashboardPage() {
  // Vamos adicionar logs para ver se o componente está montando
  console.log("🟢 DashboardPage renderizando...");

  const { data: dispatches, isLoading, isError, error } = useDispatchesToday();

  // Log de erro da query, caso exista
  if (isError) {
    console.error("🚨 Erro retornado pelo hook useDispatchesToday:", error);
  }

  if (isLoading) return <div className="p-8 text-gray-500">Carregando operações do dia...</div>;
  if (isError) return <div className="p-8 text-red-500">Erro ao carregar o painel operacional: {String(error)}</div>;

  // ... restante do seu código de métricas e listagem ...
  // Métricas rápidas no topo
  const total = dispatches?.length || 0;
  const completed = dispatches?.filter((d) => d.status === 'COMPLETED').length || 0;
  const pending = total - completed;

  // Trecho inserido na página de Contratos ou Dashboard
const handleExport = async () => {
  try {
    const response = await api.get('/rentals/export', {
      responseType: 'blob', // Importante para receber arquivos binários/texto puro
    });

    // Cria um link temporário no navegador para disparar o download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-locacoes.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
  }
};

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Visão Operacional de Hoje</h1>
        <p className="text-sm text-gray-500">Acompanhe em tempo real o andamento das entregas e coletas na rua.</p>
         <button
          onClick={handleExport}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          Exportar Relatório
        </button>
      
      
      </div>



     
      

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-500">Total de OS Hoje</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-500">Concluídas com Sucesso</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{completed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm font-medium text-gray-500">Pendentes / Em Rota</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{pending}</p>
        </div>
      </div>

      {/* Lista de Ordens de Serviço */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Ordens de Serviço Agendadas</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {dispatches?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhuma ordem de serviço para hoje.</div>
          ) : (
            dispatches?.map((dispatch) => (
              <div key={dispatch.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      dispatch.type === 'DELIVERY' ? 'bg-blue-100 text-blue-800' :
                      dispatch.type === 'COLLECTION' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dispatch.type === 'DELIVERY' ? 'Entrega' : dispatch.type === 'COLLECTION' ? 'Coleta' : 'Limpeza'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">ID: {dispatch.id.slice(0, 8)}</span>
                  </div>
                  <p className="text-base font-medium text-gray-900">
                    Cliente: {dispatch.customer?.name || 'Não informado'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Motorista responsável: <span className="font-medium text-gray-700">{dispatch.driver?.name || 'A definir'}</span>
                  </p>
                </div>

                <div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    dispatch.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    dispatch.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {dispatch.status === 'COMPLETED' ? 'Concluída' : dispatch.status === 'IN_PROGRESS' ? 'Em Andamento' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}