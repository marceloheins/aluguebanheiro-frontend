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

export interface Rental {
  id: string;
  customerId: string;
  equipmentId: string;
  startDate: string;
  endDate?: string;
  totalValue: number;
  status: string;
  customer?: { name: string };
  equipment?: { serialNumber: string; type: string };
}

export async function getRentals(): Promise<Rental[]> {
  const { data } = await api.get('/rentals');
  return Array.isArray(data) ? data : [];
}
// Adicionar em src/features/rentals/api/rentalApi.ts
export async function exportRentalsCsv(month?: number, year?: number) {
  const params = new URLSearchParams();
  if (month) params.append('month', String(month));
  if (year) params.append('year', String(year));

  const response = await api.get(`/rentals/export?${params.toString()}`, {
    responseType: 'blob', // Essencial para baixar arquivos
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `relatorio-locacoes-${month || 'geral'}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function createRental(rentalData: {
  customerId: string;
  equipmentId: string;
  startDate: string;
  endDate?: string;
  totalValue: number;
}): Promise<Rental> {
  const { data } = await api.post('/rentals', rentalData);
  return data;
}