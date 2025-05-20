
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;  // Changed from 'read' to 'is_read' to match database
  created_at: string; // Changed from 'createdAt' to 'created_at' to match database
  user_id: string;  // Added to match database
  data?: any;  // Added to match database schema
  // Removed entityId, entityType, link, priority, icon as they're not in the database schema
}
