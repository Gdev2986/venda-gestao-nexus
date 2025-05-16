
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
  CLIENT = "CLIENTE", 
  FINANCIAL = "FINANCEIRO",
  PARTNER = "PARCEIRO",
  LOGISTICS = "LOGISTICA",
  MANAGER = "GERENTE",
  FINANCE = "FINANCAS",
  SUPPORT = "SUPORTE",
  USER = "USUARIO"
}

export enum NotificationType {
  SUPPORT = "SUPPORT",
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  SYSTEM = "SYSTEM",
  GENERAL = "GENERAL",
  SALE = "SALE",
  BALANCE_UPDATE = "BALANCE_UPDATE",
  PAYMENT_REQUEST = "PAYMENT_REQUEST",
  PAYMENT_APPROVED = "PAYMENT_APPROVED",
  PAYMENT_REJECTED = "PAYMENT_REJECTED"
}

export enum PaymentAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  VIEW = 'view',
  DELETE = 'delete',
  SEND_RECEIPT = 'send_receipt'
}

// Add missing Payment type
export interface Payment {
  id: string;
  status: PaymentStatus | string;
  amount: number;
  created_at: string;
  updated_at?: string;
  client_id: string;
}
