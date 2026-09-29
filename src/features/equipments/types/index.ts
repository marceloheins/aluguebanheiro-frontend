// src/features/equipments/types/index.ts
export type EquipmentType = 'DUMPSTER' | 'PORTA_POTTY';
export type EquipmentStatus = 'AVAILABLE' | 'IN_USE_AT_CLIENT' | 'MAINTENANCE';

export interface Equipment {
  id: string;
  serialNumber: string;
  type: EquipmentType;
  status: EquipmentStatus;
  createdAt: string;
}

export interface CreateEquipmentDTO {
  serialNumber: string;
  type: EquipmentType;
}