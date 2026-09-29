// src/features/rentals/hooks/useRentals.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRentals, createRental } from '../api/rentalApi';
import { CreateRentalDTO } from '../types';

export function useRentals() {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: getRentals,
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newRental: CreateRentalDTO) => createRental(newRental),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['equipments'] }); // Atualiza status do estoque
    },
  });
}