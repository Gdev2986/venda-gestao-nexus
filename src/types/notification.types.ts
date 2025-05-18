
export type NotificationType = 
  | 'PAYMENT_REQUEST'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'NEW_CLIENT'
  | 'SYSTEM'
  | 'SUPPORT'
  | 'PAYMENT'
  | 'BALANCE'
  | 'MACHINE'
  | 'COMMISSION'
  | 'GENERAL'
  | 'SALE'
  | 'ADMIN_NOTIFICATION';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  is_read: boolean;
  created_at: string;
  timestamp?: Date; // For compatibility with existing code
  read?: boolean;    // For compatibility with existing code
}
