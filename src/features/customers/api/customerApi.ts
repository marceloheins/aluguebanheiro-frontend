// src/features/customers/api/customerApi.ts
import { api } from '@/services/api';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  document?: string;
  address?: string;
}

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get('/customers');
  return data;
}

export async function createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
  const { data } = await api.post('/customers', customerData);
  return data;
}