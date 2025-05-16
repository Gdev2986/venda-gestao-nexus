export enum PaymentStatus {
  PENDING = "PENDENTE",
  PROCESSING = "EM_PROCESSAMENTO",
  APPROVED = "APROVADO",
  REJECTED = "RECUSADO",
  PAID = "PAGO"
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
  SALE = "SALE"
}

export enum PaymentAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  VIEW = 'view',
  DELETE = 'delete',
  SEND_RECEIPT = 'send_receipt'
}
