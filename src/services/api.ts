import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
});

// No seu src/services/api.ts, dentro do interceptor de requisição:
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('saas_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // IMPRIME O HEADER EXATO NO CONSOLE DO NAVEGADOR ANTES DE ENVIAR:
      console.log('📤 [AXIOS SENDING] Authorization Header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta MODIFICADO PARA APENAS LOGAR (Sem redirecionar)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 ERRO DA API CAPTURADO NO AXIOS:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // COMENTADO PARA NÃO JOGAR PRO LOGIN E PERMITIR A LEITURA:
    /*
    if (error.response?.status === 401) {
      Cookies.remove('saas_token');
      window.location.href = '/login';
    }
    */

    return Promise.reject(error);
  }
);