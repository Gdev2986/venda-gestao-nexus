
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
  MAINTENANCE = "MAINTENANCE",
  INSTALLATION = "INSTALLATION",
  REPAIR = "REPAIR",
  TRAINING = "TRAINING",
  SUPPORT = "SUPPORT",
  OTHER = "OTHER",
  REPLACEMENT = "REPLACEMENT",
  SUPPLIES = "SUPPLIES",
  REMOVAL = "REMOVAL"
}

export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  FINANCIAL = "FINANCIAL",
  PARTNER = "PARTNER",
  LOGISTICS = "LOGISTICS"
}

export enum ClientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
  PROCESSING = "PROCESSING"
}

export enum PaymentAction {
  VIEW = "VIEW",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  EDIT = "EDIT",
  DELETE = "DELETE",
  SEND_RECEIPT = "SEND_RECEIPT"
}

export enum PaymentMethod {
  PIX = "PIX",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BOLETO = "BOLETO",
  TED = "TED",
  DOC = "DOC",
  CREDIT = "CREDIT_CARD",
  DEBIT = "DEBIT_CARD"
}

export enum PaymentType {
  PIX = "PIX",
  BOLETO = "BOLETO",
  TED = "TED"
}
