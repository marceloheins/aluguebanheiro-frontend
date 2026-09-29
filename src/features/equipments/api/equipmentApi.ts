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

export interface Equipment {
  id: string;
  tenantId: string;
  type: 'DUMPSTER' | 'PORTA_POTTY';
  status: 'AVAILABLE' | 'IN_USE_AT_CLIENT' | 'MAINTENANCE';
  serialNumber: string;
}

export async function getEquipments(): Promise<Equipment[]> {
  const { data } = await api.get('/equipments');
  return Array.isArray(data) ? data : [];
}

export async function createEquipment(equipmentData: Omit<Equipment, 'id' | 'tenantId'>): Promise<Equipment> {
  const { data } = await api.post('/equipments', equipmentData);
  return data;
}