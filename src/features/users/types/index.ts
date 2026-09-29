// src/features/users/types/index.ts
export type UserRole = 'ADMIN' | 'DISPATCHER' | 'DRIVER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}