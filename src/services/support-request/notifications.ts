
import { supabase } from "@/integrations/supabase/client";
import { NotificationType } from "@/types/notification.types";
import { SupportRequest } from "./types";
import { getSupportRequestById } from "./crud-operations";

/**
 * Creates notifications for logistics team about a new support request
 */
export async function createRequestNotification(request: SupportRequest, requestId: string) {
  try {
    // Get all logistics users
    const { data: logisticsUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'LOGISTICS');

    if (logisticsUsers && logisticsUsers.length > 0) {
      // Create notifications for each logistics user
      for (const user of logisticsUsers) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Nova Solicitação Técnica',
            message: `${request.title} - ${request.priority}`,
            type: NotificationType.SUPPORT,
            data: { 
              request_id: requestId,
              type: request.type,
              priority: request.priority,
              client_id: request.client_id
            },
            is_read: false,
            created_at: new Date().toISOString()
          });
      }
    }
    
    // Also notify the admin users
    const { data: adminUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'ADMIN');
      
    if (adminUsers && adminUsers.length > 0) {
      for (const user of adminUsers) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Nova Solicitação Técnica',
            message: `${request.title} - ${request.priority}`,
            type: NotificationType.SUPPORT,
            data: { 
              request_id: requestId,
              type: request.type,
              priority: request.priority,
              client_id: request.client_id
            },
            is_read: false,
            created_at: new Date().toISOString()
          });
      }
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Creates notifications about status updates for support requests
 */
export async function createStatusUpdateNotification(requestId: string, updates: Partial<SupportRequest>) {
  try {
    const { data: request } = await getSupportRequestById(requestId);
    if (!request) return;
    
    // Get client user ID
    const { data: clientData } = await supabase
      .from('user_client_access')
      .select('user_id')
      .eq('client_id', request.client_id)
      .single();
    
    if (clientData) {
      // Notify client
      await supabase
        .from('notifications')
        .insert({
          user_id: clientData.user_id,
          title: 'Atualização de Solicitação',
          message: `Sua solicitação "${request.title}" foi atualizada para ${updates.status}`,
          type: NotificationType.SUPPORT,
          data: { request_id: requestId, new_status: updates.status },
          is_read: false,
          created_at: new Date().toISOString()
        });
    }
    
    // If a technician is assigned, notify them as well
    if (updates.technician_id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: updates.technician_id,
          title: 'Nova Solicitação Atribuída',
          message: `Você foi atribuído à solicitação "${request.title}"`,
          type: NotificationType.SUPPORT,
          data: { request_id: requestId },
          is_read: false,
          created_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error creating status update notification:', error);
  }
}
