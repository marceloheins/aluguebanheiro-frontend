// src/services/authService.ts
import * as SecureStore from 'expo-secure-store';
 // Seu client Axios configurado
import { api } from '../lib/api';
const TOKEN_KEY = 'saas_driver_jwt';

export async function loginDriver(email: string, password: string): Promise<string> {
  try {
    const response = await api.post('/sessions', { email, password });
    const { token } = response.data;

    // Salva o JWT de forma criptografada no SecureStore
    await SecureStore.setItemAsync(TOKEN_KEY, token);

    return token;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao realizar login.');
  }
}

export async function getStoredToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logoutDriver(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}