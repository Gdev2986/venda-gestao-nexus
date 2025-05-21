import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, CreateTicketParams, UpdateTicketParams, SupportMessage } from "@/types/support.types";
import { TicketStatus, NotificationType, TicketPriority, TicketType, UserRole } from "@/types/enums";
import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

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
      type: ticket.type,
      priority: ticket.priority,
      status: (ticket.status || TicketStatus.OPEN),
      scheduled_date: ticket.scheduled_date
    } as any) // Use 'as any' to bypass strict TypeScript checking
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
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString()
  };
  
  // Only update fields that are provided
  if (updates.title) updateData.title = updates.title;
  if (updates.description) updateData.description = updates.description;
  if (updates.status) updateData.status = updates.status;
  if (updates.priority) updateData.priority = updates.priority;
  if (updates.type) updateData.type = updates.type;
  if (updates.assigned_to) updateData.assigned_to = updates.assigned_to;
  if (updates.resolution) updateData.resolution = updates.resolution;
  if (updates.scheduled_date) updateData.scheduled_date = updates.scheduled_date;

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
  // Create a query without type constraints to avoid deep type instantiation
  let query = supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id(*),
      machine:machine_id(*)
    `);
  
  // Apply filters
  if (filters) {
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        // Convert enum values to strings to avoid type errors
        const statusValues = filters.status.map(s => s.toString());
        query = query.in('status', statusValues as any);
      } else {
        query = query.eq('status', filters.status.toString() as any);
      }
    }
    
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        // Convert enum values to strings to avoid type errors
        const typeValues = filters.type.map(t => t.toString());
        query = query.in('type', typeValues as any);
      } else {
        query = query.eq('type', filters.type.toString() as any);
      }
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority.toString() as any);
    }
    
    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    
    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
  }

  // Add ordering
  query = query.order('created_at', { ascending: false });

  // Execute the query
  const { data, error } = await query;
  
  // Return with simplified type casting to avoid deep type instantiation
  return { 
    data: data as unknown as SupportTicket[], 
    error 
  };
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
  // Try with conversation_id (our standardized approach)
  const { data, error } = await supabase
    .from('support_messages')
    .select('*, user:user_id(id, name, role)')
    .eq('conversation_id', ticketId)
    .order('created_at', { ascending: true });
    
  if (error) {
    return { data: null, error };
  }
  
  if (!data || data.length === 0) {
    // If no results, it could be using a different column name
    // This is a fallback mechanism for backward compatibility
    const { data: altData, error: altError } = await supabase
      .from('support_messages')
      .select('*, user:user_id(id, name, role)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
      
    if (altError) return { data: null, error: altError };
      
    if (!altData || altData.length === 0) {
      return { data: [], error: null };
    }
    
    // Transform data to match SupportMessage interface
    const transformedData = altData.map(messageTransformer);
    return { data: transformedData, error: null };
  }
  
  // Process standard response
  const transformedData = data.map(messageTransformer);
  return { data: transformedData, error: null };
}

// Helper function to transform message data consistently
function messageTransformer(msg: any): SupportMessage {
  const userObj = {
    id: '',
    name: '',
    role: ''
  };
  
  // Safely access user properties
  if (msg.user && typeof msg.user === 'object') {
    const userAny = msg.user as any;
    if (userAny && !userAny.error) {
      userObj.id = userAny.id || '';
      userObj.name = userAny.name || '';
      userObj.role = userAny.role || '';
    }
  }
  
  // Ensure we have a ticket_id property, falling back to conversation_id if needed
  const messageTicketId = msg.ticket_id || msg.conversation_id;
  
  return {
    id: msg.id,
    ticket_id: messageTicketId,
    user_id: msg.user_id,
    message: msg.message,
    created_at: msg.created_at,
    user: userObj
  };
}

// Add a message to a ticket
export async function addTicketMessage(ticketId: string, userId: string, message: string): Promise<{ data: any, error: any }> {
  // Always use conversation_id for consistency
  const { data, error } = await supabase
    .from('support_messages')
    .insert({
      conversation_id: ticketId,
      user_id: userId,
      message: message
    } as any)
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
    // Notify support staff and admins - convert UserRole enum values to strings
    const roles = [
      UserRole.ADMIN.toString(), 
      UserRole.FINANCIAL.toString(), 
      UserRole.SUPPORT.toString(), 
      UserRole.LOGISTICS.toString()
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
        type: NotificationType.SUPPORT,
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
          type: NotificationType.SUPPORT,
          data: JSON.stringify({ ticket_id: ticketId }) as Json,
          is_read: false
        } as any);
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
    
    if (sender && sender.role === UserRole.CLIENT.toString()) {
      // Notify assigned staff or all support staff if unassigned
      if (ticket.assigned_to) {
        recipientIds.push(ticket.assigned_to);
      } else {
        // Convert UserRole enum values to strings
        const roles = [
          UserRole.ADMIN.toString(), 
          UserRole.FINANCIAL.toString(), 
          UserRole.SUPPORT.toString()
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
          type: NotificationType.SUPPORT,
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
