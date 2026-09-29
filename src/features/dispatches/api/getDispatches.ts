// src/features/dispatches/api/getDispatches.ts
import { api } from '@/services/api';
import { Dispatch } from '../types';

export async function getDispatchesToday(): Promise<Dispatch[]> {
  const { data } = await api.get('/dispatches/today');
  return data;
}