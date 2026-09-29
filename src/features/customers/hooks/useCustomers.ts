// src/features/customers/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, createCustomer, CreateCustomerPayload } from '../api/customerApi';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCustomer: CreateCustomerPayload) => createCustomer(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}