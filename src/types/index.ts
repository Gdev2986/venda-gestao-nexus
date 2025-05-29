
export enum UserRole {
  CLIENT = 'CLIENT',
  USER = 'USER', 
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
  LOGISTICS = 'LOGISTICS',
  FINANCIAL = 'FINANCIAL'
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
}
