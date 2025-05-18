
import { PixKey } from './payment.types';

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  timestamp: string;
  data?: any;
}

export enum UserRole {
  ADMIN = "ADMIN",
  FINANCIAL = "FINANCIAL",
  LOGISTICS = "LOGISTICS",
  PARTNER = "PARTNER",
  CLIENT = "CLIENT",
  USER = "USER"
}

export interface Fee {
  id: string;
  name: string;
  percentage: number;
  fixed_amount?: number;
  is_active: boolean;
  description?: string;
}

export * from './payment.types';
export * from './enums';
