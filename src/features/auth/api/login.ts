import { api } from '../../../lib/api';
import Cookies from 'js-cookie';
import { LoginCredentials, LoginResponse } from '../types';

export async function authenticateUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<any>('/auth/login', credentials);
  
  // Extrai apenas a string do token
  const token = data?.token;

  if (token) {
    // Remove o cookie antigo antes de gravar o novo para evitar resíduos
    Cookies.remove('saas_token');
    Cookies.set('saas_token', token, { expires: 7, path: '/' });
    console.log('✅ Token salvo com sucesso:', token.substring(0, 15) + '...');
  } else {
    throw new Error('Token não encontrado na resposta');
  }
  
  return data;
}
