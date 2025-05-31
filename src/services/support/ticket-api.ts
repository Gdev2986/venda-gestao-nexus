
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, CreateTicketParams, TicketStatus } from "@/types/support.types";

// Get all support tickets
export const getTickets = async () => {
  const { data, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
    return { data: null, error };
  }

  // Transform the data to match our TypeScript types
  const transformedData: SupportTicket[] = (data || []).map(item => ({
    id: item.id,
    client_id: item.client_id,
    assigned_to: item.technician_id,
    title: item.title || item.description?.substring(0, 50) + '...' || 'Untitled',
    description: item.description,
    type: item.type,
    priority: item.priority,
    status: item.status,
    scheduled_date: item.scheduled_date,
    created_at: item.created_at,
    updated_at: item.updated_at,
    resolution: item.resolution,
    client: item.client
  }));

  return { data: transformedData, error: null };
};

// Get tickets for a specific client
export const getClientTickets = async (clientId: string) => {
  const { data, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client tickets:', error);
    return { data: null, error };
  }

  // Transform the data to match our TypeScript types
  const transformedData: SupportTicket[] = (data || []).map(item => ({
    id: item.id,
    client_id: item.client_id,
    assigned_to: item.technician_id,
    title: item.title || item.description?.substring(0, 50) + '...' || 'Untitled',
    description: item.description,
    type: item.type,
    priority: item.priority,
    status: item.status,
    scheduled_date: item.scheduled_date,
    created_at: item.created_at,
    updated_at: item.updated_at,
    resolution: item.resolution,
    client: item.client
  }));

  return { data: transformedData, error: null };
};

// Create a new ticket
export const createTicket = async (ticketData: CreateTicketParams) => {
  const insertData: any = {
    title: ticketData.title,
    description: ticketData.description,
    client_id: ticketData.client_id,
    type: ticketData.type,
    priority: ticketData.priority,
    status: 'PENDING'
  };

  const { data, error } = await supabase
    .from('support_requests')
    .insert(insertData)
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .single();

  if (error) {
    console.error('Error creating ticket:', error);
    return { data: null, error };
  }

  const transformedData: SupportTicket = {
    id: data.id,
    client_id: data.client_id,
    assigned_to: data.technician_id,
    title: data.title || ticketData.title || 'Untitled',
    description: data.description,
    type: data.type,
    priority: data.priority,
    status: data.status,
    scheduled_date: data.scheduled_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    resolution: data.resolution,
    client: data.client
  };

  return { data: transformedData, error: null };
};

// Update a ticket
export const updateTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
  const dbUpdates: any = {};
  
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.assigned_to !== undefined) dbUpdates.technician_id = updates.assigned_to;
  if (updates.resolution !== undefined) dbUpdates.resolution = updates.resolution;
  if (updates.scheduled_date !== undefined) dbUpdates.scheduled_date = updates.scheduled_date;

  const { data, error } = await supabase
    .from('support_requests')
    .update(dbUpdates)
    .eq('id', ticketId)
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .single();

  if (error) {
    console.error('Error updating ticket:', error);
    return { data: null, error };
  }

  const transformedData: SupportTicket = {
    id: data.id,
    client_id: data.client_id,
    assigned_to: data.technician_id,
    title: data.title || data.description?.substring(0, 50) + '...' || 'Untitled',
    description: data.description,
    type: data.type,
    priority: data.priority,
    status: data.status,
    scheduled_date: data.scheduled_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    resolution: data.resolution,
    client: data.client
  };

  return { data: transformedData, error: null };
};
