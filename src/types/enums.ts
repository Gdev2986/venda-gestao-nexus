
export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO"
}

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

export enum NotificationType {
  SUPPORT = "SUPPORT",
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  GENERAL = "GENERAL",
  SALE = "SALE"
}

export enum PaymentAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  VIEW = 'view',
  DELETE = 'delete',
  SEND_RECEIPT = 'send_receipt'
}

// PaymentRequestStatus should be exactly the same string literals as PaymentStatus to ensure compatibility
export type PaymentRequestStatus = "PENDING" | "PROCESSING" | "APPROVED" | "REJECTED" | "PAID";
