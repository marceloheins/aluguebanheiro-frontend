// src/features/users/api/userApi.ts
import { api } from '../../../lib/api';
import { User, CreateUserDTO } from '../types';

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get('/users');
  return data;
}

export async function createUser(payload: CreateUserDTO): Promise<User> {
  const { data } = await api.post('/users', payload);
  return data;
}