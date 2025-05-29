
// Export all types from the various type files
export * from './enums';
export * from './payment.types';
export * from './machine.types';

// Adicionar novos exports para tipos de autenticação enterprise
export * from './auth.types';

// Export ClientStatus enum
export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
}

// Export common interfaces
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: import('./enums').UserRole;
  created_at: string;
  status: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}
