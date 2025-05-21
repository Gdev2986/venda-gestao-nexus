import { supabase } from "@/integrations/supabase/client";
import { 
  SupportTicket, 
  CreateTicketParams, 
  UpdateTicketParams, 
  TicketFilters,
  TicketStatus
} from "./types";
import { createTicketNotification, createStatusUpdateNotification } from "./notification-api";

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
      type: ticket.type as any, // Use 'as any' to bypass strict TypeScript checking
      priority: ticket.priority as any, // Use 'as any' to bypass strict TypeScript checking
      status: (ticket.status || TicketStatus.OPEN) as any,
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
    
  return { data: data as any, error };
}

// Get all tickets with optional filters
export async function getSupportTickets(filters?: TicketFilters): Promise<{ data: SupportTicket[] | null, error: any }> {
  try {
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
    
    // Fix: Simplify type casting to avoid deep instantiation
    return { data: data as any, error };
  } catch (error) {
    console.error("Error in getSupportTickets:", error);
    return { data: null, error };
  }
}

// Get tickets for a client
export async function getClientSupportTickets(clientId: string): Promise<{ data: SupportTicket[] | null, error: any }> {
  const { data, error } = await supabase
    .from('support_requests')
    .select('*, client:client_id(*), machine:machine_id(*)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
    
  return { data: data as any, error };
}
