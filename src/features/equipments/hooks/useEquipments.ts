// src/features/equipments/hooks/useEquipments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEquipments, createEquipment } from '../api/equipmentApi';
import { CreateEquipmentDTO } from '../types';

export function useEquipments() {
  return useQuery({
    queryKey: ['equipments'],
    queryFn: getEquipments,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newEquipment: CreateEquipmentDTO) => createEquipment(newEquipment),
    onSuccess: () => {
      // Invalida o cache para forçar a listagem a recarregar instantaneamente
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
  });
}