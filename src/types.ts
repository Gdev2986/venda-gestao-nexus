
export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER",
  LOGISTICS = "LOGISTICS",
  MANAGER = "MANAGER",
  FINANCE = "FINANCE",
  SUPPORT = "SUPPORT",
  USER = "USER"
}

// Valid role type for parameter validation
export type ValidRole = 
  | "ADMIN" 
  | "CLIENT" 
  | "FINANCIAL" 
  | "PARTNER" 
  | "LOGISTICS" 
  | "MANAGER" 
  | "FINANCE" 
  | "SUPPORT" 
  | "USER";

export type DatabaseNotificationType = 
  | "PAYMENT" 
  | "BALANCE" 
  | "MACHINE" 
  | "COMMISSION" 
  | "SYSTEM";

// Export the NotificationType for components that need it
export const NotificationType = {
  PAYMENT: "PAYMENT" as DatabaseNotificationType,
  BALANCE: "BALANCE" as DatabaseNotificationType,
  MACHINE: "MACHINE" as DatabaseNotificationType,
  COMMISSION: "COMMISSION" as DatabaseNotificationType,
  SYSTEM: "SYSTEM" as DatabaseNotificationType
};
