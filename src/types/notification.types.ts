
export enum NotificationType {
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
  MACHINE = "MACHINE",
  PAYMENT_APPROVED = "PAYMENT_APPROVED",
  PAYMENT_REJECTED = "PAYMENT_REJECTED",
  PAYMENT_REQUEST = "PAYMENT_REQUEST"
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  data?: Record<string, any>;
}
