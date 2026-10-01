// src/features/equipments/api/equipmentApi.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('saas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type EquipmentStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' ;
export type EquipmentLocation = 'YARD' | 'AT_CLIENT' | 'IN_TRANSIT';

export interface Equipment {
  id: string;
  tenantId: string;
  type: 'DUMPSTER' | 'PORTA_POTTY';
  status: EquipmentStatus;
  location: EquipmentLocation;
  serialNumber: string;
  rentalItem?: Array<{
    rental: {
      customer: {
        name: string;
      };
    };
  }>;
}

export async function getEquipments(): Promise<Equipment[]> {
  const { data } = await api.get('/equipments');
  return Array.isArray(data) ? data : [];
}
export async function getYardEquipments(): Promise<Equipment[]> {
  const { data } = await api.get('/equipments/yard');
  return Array.isArray(data) ? data : [];
}

export async function createEquipment(equipmentData: Omit<Equipment, 'id' | 'tenantId'>): Promise<Equipment> {
  const { data } = await api.post('/equipments', equipmentData);
  return data;
}

export async function updateEquipmentStatusAndLocation(
  id: string,
  data:{ status?: EquipmentStatus; location?: EquipmentLocation}
): Promise<Equipment> {
  const response = await api.patch(`/equipments/${id}/status`, data);
  return response.data;
  
}