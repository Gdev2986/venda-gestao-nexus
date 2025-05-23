
export enum NotificationType {
  SYSTEM = "system",
  PAYMENT = "payment",
  SALE = "sale",
  MACHINE = "machine",
  SUPPORT = "support",
  GENERAL = "general",
  COMMISSION = "commission",
  BALANCE = "balance",
  ADMIN_NOTIFICATION = "admin_notification",
  LOGISTICS = "logistics"
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  data?: any;
}
