
// Add this file to centralize enum definitions
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
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PaymentAction {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  DELETE = "DELETE",
  VIEW = "VIEW",
  SEND_RECEIPT = "SEND_RECEIPT"
}

export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
}

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
}

export enum PaymentMethod {
  CREDIT = "credit",
  DEBIT = "debit",
  PIX = "pix"
}

export enum MachineStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
  STOCK = "STOCK",
  TRANSIT = "TRANSIT",
  BLOCKED = "BLOCKED"
}

export enum TicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

export enum TicketPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH"
}

export enum TicketType {
  INSTALLATION = "INSTALLATION",
  MAINTENANCE = "MAINTENANCE",
  REMOVAL = "REMOVAL",
  REPLACEMENT = "REPLACEMENT", 
  SUPPLIES = "SUPPLIES", 
  PAPER = "PAPER", 
  OTHER = "OTHER"
}

// Import and re-export NotificationType from notification.types.ts
import { NotificationType } from "./notification.types";
export { NotificationType };
