
// User roles
export enum UserRole {
  ADMIN = "ADMIN",
  FINANCIAL = "FINANCIAL",
  LOGISTICS = "LOGISTICS",
  PARTNER = "PARTNER",
  CLIENT = "CLIENT"
}

// Payment status
export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID"
}

// Payment types
export enum PaymentType {
  PIX = "PIX",
  TED = "TED",
  BOLETO = "BOLETO",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  CASH = "CASH",
  OTHER = "OTHER"
}
