
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType, UserRole } from "@/types";
import { getUserId } from "@/utils/auth-utils";

// Define appropriate types based on the database schema
export type DatabaseNotificationType = NotificationType;

interface DatabaseNotification {
  id: string;
  title: string;
  message: string;
  type: DatabaseNotificationType;
  is_read: boolean;
  created_at: string;
  user_id: string;
  data?: Record<string, any>;
  role?: UserRole;
}

const mapDatabaseToClientNotification = (dbNotification: DatabaseNotification): Notification => ({
  id: dbNotification.id,
  title: dbNotification.title,
  message: dbNotification.message,
  type: dbNotification.type,
  read: dbNotification.is_read,
  created_at: dbNotification.created_at,
  user_id: dbNotification.user_id,
  data: dbNotification.data,
  role: dbNotification.role
});

/**
 * Serviço para gerenciar notificações
 */
class NotificationService {
  /**
   * Busca notificações para o usuário atual com paginação e filtros
   */
  async getUserNotifications(
    userId: string,
    page = 1,
    pageSize = 10,
    typeFilter = 'all',
    statusFilter = 'all',
    searchTerm = ''
  ): Promise<{ notifications: Notification[], totalCount: number, totalPages: number }> {
    if (!userId) return { notifications: [], totalCount: 0, totalPages: 0 };

    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply type filter if not 'all'
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      // Apply read status filter
      if (statusFilter === 'read') {
        query = query.eq('is_read', true);
      } else if (statusFilter === 'unread') {
        query = query.eq('is_read', false);
      }

      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      
      const notifications = (data as DatabaseNotification[]).map(mapDatabaseToClientNotification);
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);
      
      return { notifications, totalCount, totalPages };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], totalCount: 0, totalPages: 0 };
    }
  }

  /**
   * Cria uma nova notificação
   */
  async createNotification(notification: {
    title: string;
    message: string;
    type: NotificationType;
    user_id: string;
    data?: Record<string, any>;
  }): Promise<Notification | null> {
    try {
      const { title, message, type, user_id, data } = notification;
      
      // Add default is_read = false
      const { data: responseData, error } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          type,
          user_id,
          is_read: false,
          data
        })
        .select()
        .single();

      if (error) throw error;
      
      return responseData ? mapDatabaseToClientNotification(responseData as DatabaseNotification) : null;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Marca todas as notificações do usuário como lidas
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Conta notificações não lidas para o usuário
   */
  async getUnreadCount(userId: string): Promise<number> {
    if (!userId) return 0;

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      return 0;
    }
  }

  /**
   * Deleta uma notificação específica
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Busca notificações filtradas por tipo
   */
  async getNotificationsByType(type: NotificationType, limit = 10): Promise<Notification[]> {
    const userId = getUserId();
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as DatabaseNotification[]).map(mapDatabaseToClientNotification);
    } catch (error) {
      console.error('Error fetching notifications by type:', error);
      return [];
    }
  }

  /**
   * Envia uma notificação para todos os usuários com um papel específico
   */
  async notifyUsersByRole(
    userRole: UserRole,
    notification: {
      title: string;
      message: string;
      type: NotificationType;
      data?: Record<string, any>;
    }
  ): Promise<boolean> {
    try {
      // Primeiro busca os IDs dos usuários com o papel especificado
      const { data: userProfiles, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', userRole);

      if (userError) throw userError;
      if (!userProfiles || userProfiles.length === 0) {
        console.log(`No users found with role ${userRole}`);
        return false;
      }

      // Cria notificações para cada usuário
      const notificationsToInsert = userProfiles.map(profile => ({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        user_id: profile.id,
        is_read: false,
        data: notification.data || {}
      }));

      // Insere todas as notificações de uma vez
      const { error } = await supabase
        .from('notifications')
        .insert(notificationsToInsert);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error notifying users by role:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
