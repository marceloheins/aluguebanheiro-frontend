// src/app/(dashboard)/map/page.tsx
"use client";

import dynamic from 'next/dynamic';
import { useCustomers } from '@/features/customers/hooks/useCustomers';

// Importação dinâmica isolada para o lado do cliente
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center bg-gray-50 border rounded-lg">Carregando mapa logístico...</div>,
});

export default function MapPage() {
  const { data: customers, isLoading } = useCustomers();

  if (isLoading) return <div className="p-8 text-gray-500">Carregando dados das obras...</div>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mapa Logístico de Obras</h1>
        <p className="text-sm text-gray-500">Visualize a distribuição geográfica dos clientes e ativos alocados na cidade.</p>
      </div>

      <MapComponent customers={customers || []} />
    </main>
  );
}