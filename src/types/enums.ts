
// User roles
export enum UserRole {
  ADMIN = "ADMIN",
  FINANCIAL = "FINANCIAL",
  LOGISTICS = "LOGISTICS",
  PARTNER = "PARTNER",
  CLIENT = "CLIENT",
  USER = "USER", // Added for backward compatibility
  FINANCE = "FINANCE" // Added to fix type error
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

// Payment actions
export enum PaymentAction {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  VIEW = "VIEW",
  SEND_RECEIPT = "SEND_RECEIPT",
  DELETE = "DELETE"
}

// Client status - needed in other files
export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
}

// Payment methods - needed in other files
export enum PaymentMethod {
  CREDIT = "credit",
  DEBIT = "debit",
  PIX = "pix"
}

// Machine status - using lowercase values to match database
export enum MachineStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
  BLOCKED = "blocked",
  STOCK = "stock",
  TRANSIT = "transit"
}

// Ticket status - adding missing statuses
export enum TicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}

// Ticket types - adding missing types
export enum TicketType {
  TECHNICAL = "TECHNICAL",
  BILLING = "BILLING",
  INQUIRY = "INQUIRY",
  MACHINE = "MACHINE",
  OTHER = "OTHER",
  INSTALLATION = "INSTALLATION",
  MAINTENANCE = "MAINTENANCE",
  REMOVAL = "REMOVAL",
  REPLACEMENT = "REPLACEMENT",
  SUPPLIES = "SUPPLIES",
  PAPER = "PAPER"
}
