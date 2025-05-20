
export enum NotificationType {
  SYSTEM = "SYSTEM",
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  GENERAL = "GENERAL",
  SALE = "SALE",
  SUPPORT = "SUPPORT",
  ADMIN_NOTIFICATION = "ADMIN_NOTIFICATION",
  LOGISTICS = "LOGISTICS"
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType | string;
  data?: any;
  is_read?: boolean;
  created_at: string;
  recipient_roles?: string[];
}
