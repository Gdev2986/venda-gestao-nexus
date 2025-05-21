
import { supabase } from "@/integrations/supabase/client";
import { NotificationType, UserRole } from "./types";
import { Json } from "@/integrations/supabase/types";
import { getSupportTicketById } from "./ticket-api";

// Notification for new ticket
export async function createTicketNotification(ticket: any) {
  try {
    // Convert UserRole enum values to strings
    const roles = [
      'ADMIN', 
      'FINANCIAL', 
      'SUPPORT', 
      'LOGISTICS'
    ];
    
    const { data: staffUsers } = await supabase
      .from('profiles')
      .select('id')
      .in('role', roles as any);
      
    if (staffUsers && staffUsers.length > 0) {
      // Create notification objects for each staff user
      const notifications = staffUsers.map(user => ({
        user_id: user.id,
        title: 'Novo Chamado de Suporte',
        message: `${ticket.title} - ${ticket.priority}`,
        type: 'SUPPORT',
        data: JSON.stringify({ 
          ticket_id: ticket.id, 
          priority: ticket.priority 
        }) as Json,
        is_read: false
      }));
      
      // Insert notifications one by one to avoid array type issues
      for (const notification of notifications) {
        await supabase.from('notifications').insert(notification as any);
      }
    }
  } catch (error) {
    console.error('Error creating ticket notification:', error);
  }
}

// Notification for status update
export async function createStatusUpdateNotification(ticketId: string, updates: any) {
  try {
    const { data: ticket } = await getSupportTicketById(ticketId);
    if (!ticket) return;
    
    // Get the ticket creator to notify them
    const { data: userData } = await supabase
      .from('user_client_access')
      .select('user_id')
      .eq('client_id', ticket.client_id)
      .single();
    
    if (userData) {
      await supabase
        .from('notifications')
        .insert({
          user_id: userData.user_id,
          title: 'Atualização de Chamado',
          message: `Seu chamado "${ticket.title}" foi atualizado para ${updates.status}`,
          type: 'SUPPORT',
          data: JSON.stringify({ 
            ticket_id: ticketId, 
            new_status: updates.status 
          }) as Json,
          is_read: false
        } as any);
    }
    
    // If ticket is assigned to someone, notify them as well
    if (updates.assigned_to) {
      await supabase
        .from('notifications')
        .insert({
          user_id: updates.assigned_to,
          title: 'Chamado Atribuído',
          message: `Você foi designado para o chamado "${ticket.title}"`,
          type: 'SUPPORT',
          data: JSON.stringify({ ticket_id: ticketId }) as Json,
          is_read: false
        } as any);
    }
  } catch (error) {
    console.error('Error creating status update notification:', error);
  }
}

// Notification for new message
export async function createMessageNotification(ticketId: string, senderId: string, message: string) {
  try {
    const { data: ticket } = await getSupportTicketById(ticketId);
    if (!ticket) return;
    
    // Determine who should be notified (not the sender)
    let recipientIds: string[] = [];
    
    // If sender is client, notify support staff
    const { data: sender } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', senderId)
      .single();
    
    if (sender && sender.role === 'CLIENT') {
      // Notify assigned staff or all support staff if unassigned
      if (ticket.assigned_to) {
        recipientIds.push(ticket.assigned_to);
      } else {
        // Convert UserRole enum values to strings
        const roles = [
          'ADMIN', 
          'FINANCIAL', 
          'SUPPORT'
        ];
        
        const { data: staffUsers } = await supabase
          .from('profiles')
          .select('id')
          .in('role', roles as any);
        
        if (staffUsers) {
          recipientIds = staffUsers.map(user => user.id);
        }
      }
    } else {
      // If sender is staff, notify client
      const { data: clientUser } = await supabase
        .from('user_client_access')
        .select('user_id')
        .eq('client_id', ticket.client_id)
        .single();
      
      if (clientUser) {
        recipientIds.push(clientUser.user_id);
      }
    }
    
    // Create notifications for all recipients
    if (recipientIds.length > 0) {
      const notifications = recipientIds
        .filter(id => id !== senderId) // Don't notify the sender
        .map(userId => ({
          user_id: userId,
          title: 'Nova Mensagem de Suporte',
          message: `Nova mensagem no chamado "${ticket.title}"`,
          type: 'SUPPORT',
          data: JSON.stringify({ ticket_id: ticketId }) as Json,
          is_read: false
        }));
      
      // Insert notifications one by one to avoid array type issues
      for (const notification of notifications) {
        await supabase.from('notifications').insert(notification as any);
      }
    }
  } catch (error) {
    console.error('Error creating message notification:', error);
  }
}
