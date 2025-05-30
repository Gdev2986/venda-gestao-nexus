
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

// Função para executar limpeza de notificações expiradas
export const cleanExpiredNotifications = async (): Promise<CleanupResult> => {
  try {
    const { data, error } = await supabase.rpc('clean_expired_notifications');
    
    if (error) {
      console.error('Erro ao limpar notificações expiradas:', error);
      throw error;
    }
    
    console.log('Limpeza de notificações executada com sucesso:', data);
    return data[0] || { deleted_count: 0, execution_time: new Date().toISOString() };
  } catch (error) {
    console.error('Falha na limpeza de notificações:', error);
    throw error;
  }
};

// Função para limpar notificações expiradas de um usuário específico
export const cleanUserExpiredNotifications = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('clean_user_expired_notifications', {
      target_user_id: userId
    });
    
    if (error) {
      console.error('Erro ao limpar notificações do usuário:', error);
      throw error;
    }
    
    console.log(`Limpeza de notificações do usuário ${userId} executada:`, data);
    return data || 0;
  } catch (error) {
    console.error('Falha na limpeza de notificações do usuário:', error);
    throw error;
  }
};

// Função para obter estatísticas de notificações
export const getNotificationStats = async (): Promise<NotificationStats> => {
  try {
    const { data, error } = await supabase.rpc('get_notifications_stats');
    
    if (error) {
      console.error('Erro ao buscar estatísticas de notificações:', error);
      throw error;
    }
    
    return data[0] || {
      total_notifications: 0,
      notifications_last_24h: 0,
      notifications_last_week: 0,
      oldest_notification: new Date().toISOString(),
      newest_notification: new Date().toISOString()
    };
  } catch (error) {
    console.error('Falha ao buscar estatísticas de notificações:', error);
    throw error;
  }
};

// Hook para executar limpeza automática periodicamente
export const useNotificationCleanup = (intervalMinutes: number = 60) => {
  React.useEffect(() => {
    // Executar limpeza imediatamente
    cleanExpiredNotifications().catch(console.error);
    
    // Configurar interval para executar periodicamente
    const interval = setInterval(() => {
      cleanExpiredNotifications().catch(console.error);
    }, intervalMinutes * 60 * 1000); // Converter minutos para milissegundos
    
    return () => clearInterval(interval);
  }, [intervalMinutes]);
};
