// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Tenta apenas 1 vez se falhar antes de mostrar o erro
      refetchOnWindowFocus: false, // Evita requisições extras ao trocar de abas
      staleTime: 1000 * 60 * 5, // Mantém o dado em cache fresco por 5 minutos
    },
  },
});