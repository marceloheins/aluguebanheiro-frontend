// src/features/dispatches/types/index.ts
export interface Dispatch {
  id: string;
  rentalId: string;
  customer?: { name: string}
  driver?: { name: string}
  driverId: string;
  type: 'DELIVERY' | 'COLLECTION' | 'CLEANING';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  scheduledDate: string;
}