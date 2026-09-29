// src/app/(dashboard)/dispatch/[id]/page.tsx
"use client";


import { SecureImage } from '../../../../components/ui/SecureImage';
import { useDispatchDetails } from '../../../../features/dispatches/hooks/useDispatchesToday';

// ... outras importações

export default function DispatchDetailsPage({ params }: { params: { id: string } }) {
  const { data: dispatch, isLoading } = useDispatchDetails(params.id);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ordem de Serviço #{dispatch.id.slice(0, 8)}</h1>
      
      {/* Dados do despacho omitidos por brevidade... */}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Renderiza a Foto do Local */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Foto do Local (Obra)</h3>
          <SecureImage 
            fileKey={dispatch.photoLocationKey} 
            alt="Foto do local de entrega" 
            className="w-full h-48"
          />
        </div>

        {/* Renderiza a Assinatura (Proof of Delivery) */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Assinatura do Responsável</h3>
          <SecureImage 
            fileKey={dispatch.signatureKey} 
            alt="Assinatura do cliente" 
            className="w-full h-48 object-contain bg-gray-50"
          />
        </div>
      </div>
    </main>
  );
}