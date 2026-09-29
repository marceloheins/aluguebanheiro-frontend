// src/lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.aluguebanheiro.com.br',
  timeout: 10000,
});

// Interceptor de Requisição: Injeta o token em todas as chamadas
api.interceptors.request.use((config) => {
  const token = Cookies.get('saas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de Resposta: Protege contra tokens expirados, adulterados ou inadimplência
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Se o backend retornar 401 (Não autorizado) ou 402 (Inadimplência/Bloqueado)
    if (status === 401 || status === 402) {
      // Remove o cookie corrompido ou de uma conta bloqueada
      Cookies.remove('saas_token');

      // Redireciona o usuário para o login (apenas se estiver rodando no navegador)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);