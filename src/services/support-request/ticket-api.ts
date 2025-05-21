
import { supabase } from "@/integrations/supabase/client";
import { 
  SupportRequest,
  SupportRequestStatus,
  TicketFilters
} from "./types";

/**
 * Create a new support ticket
 */
export async function createTicket(ticketData: Omit<SupportRequest, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Create a single object with specific property typing
    const { data, error } = await supabase
      .from('support_requests')
      .insert({
        title: ticketData.title,
        description: ticketData.description,
        client_id: ticketData.client_id,
        technician_id: ticketData.technician_id,
        type: ticketData.type,
        status: (ticketData.status || SupportRequestStatus.PENDING),
        priority: ticketData.priority,
        scheduled_date: ticketData.scheduled_date
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as SupportRequest;
  } catch (error) {
    console.error("Error creating support request:", error);
    throw error;
  }
}

/**
 * Update an existing ticket
 */
export async function updateTicket(id: string, updateData: Partial<SupportRequest>) {
  try {
    // Prepare updates ensuring it matches database schema
    const updatePayload: Record<string, any> = {};
    
    if (updateData.title !== undefined) updatePayload.title = updateData.title;
    if (updateData.description !== undefined) updatePayload.description = updateData.description;
    if (updateData.status !== undefined) updatePayload.status = updateData.status;
    if (updateData.priority !== undefined) updatePayload.priority = updateData.priority;
    if (updateData.type !== undefined) updatePayload.type = updateData.type;
    if (updateData.technician_id !== undefined) updatePayload.technician_id = updateData.technician_id;
    if (updateData.resolution !== undefined) updatePayload.resolution = updateData.resolution;
    if (updateData.scheduled_date !== undefined) updatePayload.scheduled_date = updateData.scheduled_date;
    
    // Always update the updated_at timestamp
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('support_requests')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SupportRequest;
  } catch (error) {
    console.error("Error updating support request:", error);
    throw error;
  }
}

/**
 * Get tickets with optional filters
 */
export async function getTickets(filters: TicketFilters = {}) {
  try {
    // Start with the base query
    let query = supabase.from('support_requests').select(`
      *,
      client:client_id(*),
      machine:machine_id(*)
    `);
    
    // Apply filters
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status as any);
      } else {
        query = query.eq('status', filters.status as any);
      }
    }

    if (filters.type) {
      if (Array.isArray(filters.type)) {
        query = query.in('type', filters.type as any);
      } else {
        query = query.eq('type', filters.type as any);
      }
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority as any);
    }

    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }

    if (filters.technician_id) {
      query = query.eq('technician_id', filters.technician_id);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;

    if (error) throw error;

    // Fix: Use simple type assertion to avoid deep instantiation
    return data as any[];
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return [];
  }
}
