
import { supabase } from "@/integrations/supabase/client";
import { TicketStatus, TicketPriority, TicketType, SupportTicket, CreateSupportTicketParams, UpdateSupportTicketParams } from "@/types/support.types";

/**
 * Gets a list of all support tickets with optional filtering
 */
export const getSupportTickets = async (
  filters?: { clientId?: string; status?: TicketStatus; type?: TicketType; }
): Promise<SupportTicket[]> => {
  try {
    // Start building the query
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        client:clients(business_name),
        machine:machines(id, serial_number, model)
      `);

    // Apply filters if they exist
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets:', error);
      throw error;
    }

    // Transform the data to match our SupportTicket interface
    return data.map(ticket => {
      return {
        id: ticket.id,
        title: ticket.title,
        client_id: ticket.client_id,
        machine_id: ticket.machine_id,
        user_id: ticket.user_id,
        type: ticket.type as TicketType,
        status: ticket.status as TicketStatus,
        priority: ticket.priority as TicketPriority,
        description: ticket.description,
        scheduled_date: ticket.scheduled_date,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        created_by: ticket.created_by,
        assigned_to: ticket.assigned_to,
        client: {
          id: ticket.client_id,
          business_name: ticket.client?.business_name || ""
        },
        machine: ticket.machine ? {
          id: ticket.machine.id,
          serial_number: ticket.machine.serial_number,
          model: ticket.machine.model
        } : undefined
      };
    });
  } catch (error) {
    console.error('Error in getSupportTickets:', error);
    return [];
  }
};

/**
 * Gets support tickets by client ID
 */
export const getClientSupportTickets = async (clientId: string): Promise<SupportTicket[]> => {
  return getSupportTickets({ clientId });
};

/**
 * Gets support tickets by type
 */
export const getSupportTicketsByType = async (type: TicketType): Promise<SupportTicket[]> => {
  return getSupportTickets({ type });
};

/**
 * Gets a single support ticket by ID
 */
export const getSupportTicketById = async (id: string): Promise<SupportTicket | null> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        client:clients(business_name),
        machine:machines(id, serial_number, model)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching support ticket:', error);
      return null;
    }

    // Transform the data to match our SupportTicket interface
    return {
      id: data.id,
      title: data.title,
      client_id: data.client_id,
      machine_id: data.machine_id,
      user_id: data.user_id,
      type: data.type as TicketType,
      status: data.status as TicketStatus,
      priority: data.priority as TicketPriority,
      description: data.description,
      scheduled_date: data.scheduled_date,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      assigned_to: data.assigned_to,
      client: {
        id: data.client_id,
        business_name: data.client?.business_name || ""
      },
      machine: data.machine ? {
        id: data.machine.id,
        serial_number: data.machine.serial_number,
        model: data.machine.model
      } : undefined
    };
  } catch (error) {
    console.error('Error in getSupportTicketById:', error);
    return null;
  }
};

/**
 * Creates a new support ticket
 */
export const createSupportTicket = async (ticket: CreateSupportTicketParams): Promise<SupportTicket | null> => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        title: ticket.title,
        description: ticket.description,
        client_id: ticket.client_id,
        machine_id: ticket.machine_id,
        user_id: ticket.user_id,
        type: ticket.type,
        status: ticket.status || TicketStatus.PENDING,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        created_by: ticket.created_by
      })
      .select(`
        *,
        client:clients(business_name)
      `)
      .single();

    if (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      client_id: data.client_id,
      machine_id: data.machine_id,
      user_id: data.user_id,
      type: data.type as TicketType,
      status: data.status as TicketStatus,
      priority: data.priority as TicketPriority,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      assigned_to: data.assigned_to,
      client: {
        id: data.client_id,
        business_name: data.client?.business_name || ""
      }
    };
  } catch (error) {
    console.error('Error in createSupportTicket:', error);
    return null;
  }
};

/**
 * Updates an existing support ticket
 */
export const updateSupportTicket = async (id: string, updates: UpdateSupportTicketParams): Promise<SupportTicket | null> => {
  try {
    // Create an update object with only the fields that need to be updated
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.assigned_to !== undefined) updateData.assigned_to = updates.assigned_to;
    if (updates.user_id !== undefined) updateData.user_id = updates.user_id;
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('support_tickets')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:clients(business_name)
      `)
      .single();

    if (error) {
      console.error('Error updating support ticket:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      client_id: data.client_id,
      machine_id: data.machine_id,
      user_id: data.user_id,
      type: data.type as TicketType,
      status: data.status as TicketStatus,
      priority: data.priority as TicketPriority,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      assigned_to: data.assigned_to,
      client: {
        id: data.client_id,
        business_name: data.client?.business_name || ""
      }
    };
  } catch (error) {
    console.error('Error in updateSupportTicket:', error);
    return null;
  }
};
