// src/features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '../api/login';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: authenticateUser,
    onSuccess: (data) => {
     
      // Redireciona para o dashboard após o login bem-sucedido
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('Falha na autenticação:', error);
      // Aqui você pode disparar um toast de erro (ex: shadcn/ui toast)
    }
  });
}