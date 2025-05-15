
// Define core enums that match the database schema
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

export enum NotificationType {
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE", 
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  GENERAL = "GENERAL",
  SALE = "SALE",
  SUPPORT = "SUPPORT"
}
