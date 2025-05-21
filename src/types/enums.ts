
export enum PaymentMethod {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  PIX = "PIX"
}

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
  PARTNER = "PARTNER",
  FINANCIAL = "FINANCIAL",
  FINANCE = "FINANCE"
}

export enum NotificationType {
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM"
}

export enum PaymentAction {
  VIEW = "VIEW",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  DELETE = "DELETE",
  SEND_RECEIPT = "SEND_RECEIPT"
}
