// src/components/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correção padrão do ícone do Leaflet no React devido ao empacotamento do Webpack/Next
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface CustomerLocation {
  id: string;
  name: string;
  phone: string;
  addressLat: number;
  addressLng: number;
}

interface MapProps {
  customers: CustomerLocation[];
}

export default function MapComponent({ customers }: MapProps) {
  // Coordenadas padrão central (ex: Mogi das Cruzes / SP como ponto de partida genérico)
  const defaultCenter = [-23.5227, -46.1856];

  // Filtra apenas clientes que possuem latitude e longitude cadastradas
  const validCustomers = customers.filter(c => c.addressLat && c.addressLng);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border shadow-sm z-0">
      <MapContainer 
        center={defaultCenter as [number, number]} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validCustomers.map((customer) => (
          <Marker 
            key={customer.id} 
            position={[customer.addressLat, customer.addressLng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-gray-900">{customer.name}</p>
                <p className="text-xs text-gray-600 mt-1">Tel: {customer.phone}</p>
                <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                  Obra Ativa
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}