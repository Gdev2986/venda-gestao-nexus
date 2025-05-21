import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, CreateTicketParams, UpdateTicketParams, SupportMessage } from "@/types/support.types";
import { TicketStatus, NotificationType, TicketPriority, TicketType, UserRole } from "@/types/enums";

// Create a new support ticket
export async function createSupportTicket(ticket: CreateTicketParams): Promise<{ data: SupportTicket | null, error: any }> {
  // Insert into support_requests table (matching the database schema)
  const { data, error } = await supabase
    .from('support_requests')
    .insert({
      client_id: ticket.client_id,
      machine_id: ticket.machine_id,
      user_id: ticket.user_id,
      title: ticket.title,
      description: ticket.description,
      type: ticket.type, // Enum value
      priority: ticket.priority, // Enum value
      status: (ticket.status || TicketStatus.OPEN), // Enum value
      scheduled_date: ticket.scheduled_date
    })
    .select('*, client:client_id(*), machine:machine_id(*)')
    .single();
  
  if (!error && data) {
    await createTicketNotification(data as unknown as SupportTicket);
  }
  
  return { data: data as unknown as SupportTicket, error };
}

// Update an existing ticket
export async function updateSupportTicket(id: string, updates: UpdateTicketParams): Promise<{ data: any, error: any }> {
  // Prepare updates ensuring it matches database schema
  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  // Use enum values directly
  if (updates.status) updateData.status = updates.status;
  if (updates.priority) updateData.priority = updates.priority;
  if (updates.type) updateData.type = updates.type;

  const { data, error } = await supabase
    .from('support_requests')
    .update(updateData)
    .eq('id', id)
    .select();

  if (!error && updates.status) {
    // Create status update notification
    await createStatusUpdateNotification(id, updates);
  }

  return { data, error };
}

// Get a single ticket by ID
export async function getSupportTicketById(id: string): Promise<{ data: SupportTicket | null, error: any }> {
  const { data, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id(*),
      machine:machine_id(*)
    `)
    .eq('id', id)
    .single();
    
  return { data: data as unknown as SupportTicket, error };
}

// Get all tickets with optional filters
export async function getSupportTickets(filters?: {
  status?: TicketStatus | TicketStatus[];
  type?: TicketType | TicketType[];
  priority?: TicketPriority;
  client_id?: string;
  assigned_to?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<{ data: SupportTicket[] | null, error: any }> {
  let query = supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id(*),
      machine:machine_id(*)
    `)
    .order('created_at', { ascending: false });

  if (filters) {
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        // Use enum values directly
        query = query.in('status', filters.status);
      } else {
        // Use enum value directly
        query = query.eq('status', filters.status);
      }
    }
    
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        // Use enum values directly
        query = query.in('type', filters.type);
      } else {
        // Use enum value directly
        query = query.eq('type', filters.type);
      }
    }
    
    if (filters.priority) {
      // Use enum value directly
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.client_id) query = query.eq('client_id', filters.client_id);
    if (filters.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters.user_id) query = query.eq('user_id', filters.user_id);
    if (filters.date_from) query = query.gte('created_at', filters.date_from);
    if (filters.date_to) query = query.lte('created_at', filters.date_to);
  }

  const { data, error } = await query;
  return { data: data as unknown as SupportTicket[], error };
}

// Get tickets for a client
export async function getClientSupportTickets(clientId: string): Promise<{ data: SupportTicket[] | null, error: any }> {
  const { data, error } = await supabase
    .from('support_requests')
    .select('*, client:client_id(*), machine:machine_id(*)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
    
  return { data: data as unknown as SupportTicket[], error };
}

// Get messages for a ticket
export async function getTicketMessages(ticketId: string): Promise<{ data: SupportMessage[] | null, error: any }> {
  const { data, error } = await supabase
    .from('support_messages')
    .select('*, user:user_id(id, name, role)')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
    
  // Handle any data transformation here if needed
  const messages = data ? data.map(msg => ({
    id: msg.id,
    ticket_id: msg.ticket_id || msg.conversation_id, // Handle both field names
    user_id: msg.user_id,
    message: msg.message,
    created_at: msg.created_at,
    user: msg.user
  })) : null;
    
  return { data: messages as SupportMessage[] | null, error };
}

// Add a message to a ticket
export async function addTicketMessage(ticketId: string, userId: string, message: string): Promise<{ data: any, error: any }> {
  const { data, error } = await supabase
    .from('support_messages')
    .insert({
      ticket_id: ticketId,
      user_id: userId,
      message: message
    })
    .select();

  if (!error) {
    // Also update the ticket's updated_at timestamp
    await supabase
      .from('support_requests')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);
      
    // Create notification for the message
    await createMessageNotification(ticketId, userId, message);
  }

  return { data, error };
}

// Notification helpers
async function createTicketNotification(ticket: SupportTicket) {
  try {
    // Notify support staff and admins
    const { data: staffUsers } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['ADMIN', 'FINANCIAL', 'SUPPORT', 'LOGISTICS']);
      
    if (staffUsers && staffUsers.length > 0) {
      const notifications = staffUsers.map(user => ({
        user_id: user.id,
        title: 'Novo Chamado de Suporte',
        message: `${ticket.title} - ${ticket.priority}`,
        type: NotificationType.SUPPORT,
        data: { ticket_id: ticket.id, priority: ticket.priority },
        is_read: false
      }));
      
      await supabase.from('notifications').insert(notifications);
    }
  } catch (error) {
    console.error('Error creating ticket notification:', error);
  }
}

async function createStatusUpdateNotification(ticketId: string, updates: UpdateTicketParams) {
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
          type: NotificationType.SUPPORT,
          data: { ticket_id: ticketId, new_status: updates.status },
          is_read: false
        });
    }
    
    // If ticket is assigned to someone, notify them as well
    if (updates.assigned_to) {
      await supabase
        .from('notifications')
        .insert({
          user_id: updates.assigned_to,
          title: 'Chamado Atribuído',
          message: `Você foi designado para o chamado "${ticket.title}"`,
          type: NotificationType.SUPPORT,
          data: { ticket_id: ticketId },
          is_read: false
        });
    }
  } catch (error) {
    console.error('Error creating status update notification:', error);
  }
}

async function createMessageNotification(ticketId: string, senderId: string, message: string) {
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
        const { data: staffUsers } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['ADMIN', 'FINANCIAL']);
        
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
          type: NotificationType.SUPPORT,
          data: { ticket_id: ticketId },
          is_read: false
        }));
      
      if (notifications.length > 0) {
        await supabase.from('notifications').insert(notifications);
      }
    }
  } catch (error) {
    console.error('Error creating message notification:', error);
  }
}
