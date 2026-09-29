// src/features/dispatches/hooks/useDispatches.ts
import { useQuery } from '@tanstack/react-query';
import { getDispatchesToday } from '../api/getDispatches';

export function useDispatchesToday() {
  return useQuery({
    queryKey: ['dispatches', 'today'], // Chave única para o cache
    queryFn: getDispatchesToday,
  });
}