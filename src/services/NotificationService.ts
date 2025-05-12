
import { supabase } from "@/integrations/supabase/client";
import { DatabaseNotificationType, UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: DatabaseNotificationType;
  created_at: string;
  read: boolean;
  user_id: string;
  role: UserRole;
  target_id?: string;
  data?: Record<string, any>;
}

interface CreateNotificationParams {
  title: string;
  message: string;
  type: DatabaseNotificationType;
  user_id?: string;
  role?: UserRole;
  target_id?: string;
  data?: Record<string, any>;
}

interface GetNotificationsParams {
  userId: string;
  page: number;
  pageSize: number;
  typeFilter?: string;
  statusFilter?: string;
}

interface SendNotificationParams {
  title: string;
  message: string;
  type: DatabaseNotificationType;
  recipients: {
    role?: UserRole;
    userId?: string;
  };
  target_id?: string;
  data?: Record<string, any>;
}

const mapUserRoleToDBRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "ADMIN";
    case UserRole.CLIENT:
      return "CLIENT";
    case UserRole.FINANCIAL:
      return "FINANCIAL";
    case UserRole.PARTNER:
      return "PARTNER";
    case UserRole.LOGISTICS:
      return "LOGISTICS";
    case UserRole.MANAGER:
      return "MANAGER";
    case UserRole.FINANCE:
      return "FINANCE";
    case UserRole.SUPPORT:
      return "SUPPORT";
    case UserRole.USER:
      return "CLIENT"; // Map USER to CLIENT for DB compatibility
    default:
      return "CLIENT"; // Default to CLIENT
  }
};

class NotificationService {
  // Get notifications for a user
  async getNotifications({
    userId,
    page = 1,
    pageSize = 10,
    typeFilter = 'all',
    statusFilter = 'all',
  }: GetNotificationsParams): Promise<{ notifications: Notification[]; count: number }> {
    try {
      let query = supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      // Apply type filter if not 'all'
      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      // Apply read status filter if not 'all'
      if (statusFilter === "read") {
        query = query.eq("read", true);
      } else if (statusFilter === "unread") {
        query = query.eq("read", false);
      }

      // Apply pagination
      query = query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      // Map database results to the Notification interface
      const notifications = data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type as DatabaseNotificationType,
        created_at: item.created_at,
        read: item.read || false,
        user_id: item.user_id,
        role: item.role || UserRole.USER,
        target_id: item.target_id,
        data: item.data
      })) || [];

      return {
        notifications,
        count: count || 0,
      };
    } catch (error) {
      console.error("Error getting notifications:", error);
      return { notifications: [], count: 0 };
    }
  }

  // Create a notification
  async createNotification({
    title,
    message,
    type,
    user_id,
    role,
    target_id,
    data,
  }: CreateNotificationParams): Promise<Notification | null> {
    try {
      // Check if we have either user_id or role
      if (!user_id && !role) {
        console.error("Either user_id or role is required");
        return null;
      }

      // If role is provided but not user_id, create notifications for all users with that role
      if (role && !user_id) {
        // Get all users with the specified role
        const dbRole = mapUserRoleToDBRole(role);
        const { data: users, error: usersError } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", dbRole);

        if (usersError) {
          console.error("Error getting users with role:", usersError);
          return null;
        }

        // Create notifications for each user
        const promises = users.map(async (user) => {
          const notificationData = {
            title,
            message,
            type,
            user_id: user.id,
            read: false,
            created_at: new Date().toISOString(),
            role: dbRole,
            target_id: target_id || null,
            data: data || null,
          };

          const { error } = await supabase
            .from("notifications")
            .insert(notificationData);

          if (error) {
            console.error("Error creating notification:", error);
            return null;
          }

          return {
            ...notificationData,
            id: '', // This will be assigned by the database
          };
        });

        await Promise.all(promises);
        return null; // Return null since we're creating multiple notifications
      }

      // If user_id is provided, create a notification for that user
      const notificationData = {
        title,
        message,
        type,
        user_id,
        read: false,
        created_at: new Date().toISOString(),
        role: role ? mapUserRoleToDBRole(role) : null,
        target_id: target_id || null,
        data: data || null,
      };

      const { data: notification, error } = await supabase
        .from("notifications")
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        console.error("Error creating notification:", error);
        return null;
      }

      return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as DatabaseNotificationType,
        created_at: notification.created_at,
        read: notification.read,
        user_id: notification.user_id,
        role: (notification.role as UserRole) || UserRole.USER,
        target_id: notification.target_id,
        data: notification.data,
      };
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  // Mark notification as unread
  async markAsUnread(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: false })
        .eq("id", id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      return false;
    }
  }

  // Delete a notification
  async deleteNotification(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }

  // Get unread notifications count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error("Error getting unread notifications count:", error);
      return 0;
    }
  }

  // Send notification to users
  async sendNotification({
    title,
    message,
    type,
    recipients,
    target_id,
    data,
  }: SendNotificationParams): Promise<boolean> {
    try {
      const { role, userId } = recipients;

      // Show toast for real-time feedback
      toast.success("Notificação enviada com sucesso!");
      
      // If specific userId is provided, send to that user
      if (userId) {
        await this.createNotification({
          title,
          message,
          type,
          user_id: userId,
          target_id,
          data,
        });
      }
      // If role is provided, send to all users with that role
      else if (role) {
        await this.createNotification({
          title,
          message,
          type,
          role,
          target_id,
          data,
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Erro ao enviar notificação");
      return false;
    }
  }
}

export const notificationService = new NotificationService();
