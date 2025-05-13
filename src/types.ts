
// User role enum
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  PARTNER = "PARTNER",
  LOGISTICS = "LOGISTICS",
  FINANCIAL = "FINANCIAL"
}

// Type guard to check if a string is a valid UserRole
export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

// Convert string to UserRole enum
export function toUserRole(role: string): UserRole | null {
  if (isValidUserRole(role)) {
    return role as UserRole;
  }
  return null;
}

// Payment status enum
export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

// Machine status enum
export enum MachineStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
  DEACTIVATED = "DEACTIVATED"
}

// Service request status enum
export enum ServiceRequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// Machine types enum
export enum MachineType {
  TYPE_A = "TYPE_A",
  TYPE_B = "TYPE_B",
  TYPE_C = "TYPE_C",
  TYPE_D = "TYPE_D"
}

// Common interfaces for entities
export interface User {
  id: string;
  email: string;
  role: UserRole | string;
  full_name?: string;
  created_at?: string;
}
