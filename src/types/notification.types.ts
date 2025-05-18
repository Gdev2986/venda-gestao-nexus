
export enum NotificationType {
  SYSTEM = "SYSTEM",
  PAYMENT = "PAYMENT",
  BALANCE = "BALANCE",
  MACHINE = "MACHINE",
  COMMISSION = "COMMISSION",
  GENERAL = "GENERAL",
  SALE = "SALE",
  SUPPORT = "SUPPORT"
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  is_read?: boolean;
  created_at: string;
  recipients?: "all" | "admins" | "clients"; // Optional field for sending notifications
}
