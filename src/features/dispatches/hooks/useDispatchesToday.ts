// src/features/dispatches/hooks/useDispatchesToday.ts
import { useQuery } from '@tanstack/react-query';
import { getDispatchesToday } from '../api/getDispatches';

export function useDispatchesToday() {
  return useQuery({
    queryKey: ['dispatches', 'today'],
    queryFn: getDispatchesToday,
    refetchInterval: 1000 * 30, // Atualiza a cada 30 segundos automaticamente em segundo plano
  });
}