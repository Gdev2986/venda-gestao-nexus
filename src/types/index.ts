
// Re-export all types from the types directory
export * from "./client";
export * from "./payment.types";
// Remove circular import: export * from "../types";

// Add the commonly used types directly here
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

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX",
  BOLETO = "BOLETO",
  TRANSFER = "TRANSFER"
}

export enum NotificationType {
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  SALE = "SALE",
  SUPPORT = "SUPPORT"
}
