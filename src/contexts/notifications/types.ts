
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  entityId?: string;
  entityType?: string;
  link?: string;
  priority?: 'low' | 'medium' | 'high';
  icon?: string;
}
