import { UserRole, AccountStatus } from '@prisma/client';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: AccountStatus;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: AccountStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
