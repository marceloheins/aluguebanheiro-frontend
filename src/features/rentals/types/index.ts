// src/features/rentals/types/index.ts
export interface Rental {
  id: string;
  customerId: string;
  equipmentId: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'FINISHED';
  customer?: { name: string; phone: string };
  equipment?: { serialNumber: string; type: string };
}

export interface CreateRentalDTO {
  customerId: string;
  equipmentId: string;
  startDate: string;
  endDate?: string;
}