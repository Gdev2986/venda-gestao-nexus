
import { supabase } from "@/integrations/supabase/client";

export interface NotificationStats {
  total_notifications: number;
  notifications_last_24h: number;
  notifications_last_week: number;
  oldest_notification: string;
  newest_notification: string;
}

export interface CleanupResult {
  deleted_count: number;
  execution_time: string;
}

// Função para executar limpeza de notificações expiradas (fallback direto)
export const cleanExpiredNotifications = async (): Promise<CleanupResult> => {
  try {
    const cutoffTime = new Date(Date.now() - 120 * 60 * 60 * 1000); // 120 horas atrás
    
    const { error, count } = await supabase
      .from('notifications')
      .delete({ count: 'exact' })
      .lt('created_at', cutoffTime.toISOString());
    
    if (error) {
      console.error('Erro ao limpar notificações expiradas:', error);
      throw error;
    }
    
    const result = {
      deleted_count: count || 0,
      execution_time: new Date().toISOString()
    };
    
    console.log('Limpeza de notificações executada com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Falha na limpeza de notificações:', error);
    throw error;
  }
};

// Função para limpar notificações expiradas de um usuário específico
export const cleanUserExpiredNotifications = async (userId: string): Promise<number> => {
  try {
    const cutoffTime = new Date(Date.now() - 120 * 60 * 60 * 1000); // 120 horas atrás
    
    const { error, count } = await supabase
      .from('notifications')
      .delete({ count: 'exact' })
      .eq('user_id', userId)
      .lt('created_at', cutoffTime.toISOString());
    
    if (error) {
      console.error('Erro ao limpar notificações do usuário:', error);
      throw error;
    }
    
    console.log(`Limpeza de notificações do usuário ${userId} executada:`, count);
    return count || 0;
  } catch (error) {
    console.error('Falha na limpeza de notificações do usuário:', error);
    throw error;
  }
};

// Função para obter estatísticas de notificações
export const getNotificationStats = async (): Promise<NotificationStats> => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Buscar todas as notificações para calcular estatísticas
    const { data: allNotifications, error: allError } = await supabase
      .from('notifications')
      .select('created_at');

    if (allError) {
      console.error('Erro ao buscar notificações:', allError);
      throw allError;
    }

    const notifications = allNotifications || [];
    const total = notifications.length;
    
    const last24hCount = notifications.filter(n => 
      new Date(n.created_at) >= last24h
    ).length;
    
    const lastWeekCount = notifications.filter(n => 
      new Date(n.created_at) >= lastWeek
    ).length;

    const dates = notifications.map(n => new Date(n.created_at));
    const oldest = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
    const newest = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();

    return {
      total_notifications: total,
      notifications_last_24h: last24hCount,
      notifications_last_week: lastWeekCount,
      oldest_notification: oldest.toISOString(),
      newest_notification: newest.toISOString()
    };
  } catch (error) {
    console.error('Falha ao buscar estatísticas de notificações:', error);
    throw error;
  }
};
