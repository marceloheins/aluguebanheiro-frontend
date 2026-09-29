// frontend/src/features/auth/types.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}