// src/features/auth/api/authApi.ts
import { api } from '../../../lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginAdmin({ email, password }: LoginCredentials): Promise<string> {
  const { data } = await api.post('/sessions', { email, password });
  return data.token; // Retorna o JWT gerado pelo backend
}