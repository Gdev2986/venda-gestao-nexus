
import { supabase } from "@/integrations/supabase/client";
import { SupportRequest, SupportRequestFilters } from './types';

/**
 * Creates a new support request
 */
export async function createSupportRequest(request: SupportRequest): Promise<{ data: any, error: any }> {
  const { data, error } = await supabase
    .from('support_requests')
    .insert({
      client_id: request.client_id,
      technician_id: request.technician_id,
      type: request.type,
      status: request.status,
      priority: request.priority,
      title: request.title,
      description: request.description,
      scheduled_date: request.scheduled_date,
      resolution: request.resolution,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();

  return { data, error };
}

/**
 * Updates an existing support request
 */
export async function updateSupportRequest(id: string, updates: Partial<SupportRequest>): Promise<{ data: any, error: any }> {
  const { data, error } = await supabase
    .from('support_requests')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  return { data, error };
}

/**
 * Gets a support request by ID
 */
export async function getSupportRequestById(id: string): Promise<{ data: any, error: any }> {
  return await supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id(id, business_name, contact_name, phone, address, city, state, zip),
      technician:technician_id(id, name, email, phone)
    `)
    .eq('id', id)
    .single();
}

/**
 * Gets support requests, optionally filtered
 */
export async function getSupportRequests(filters?: SupportRequestFilters): Promise<{ data: any, error: any }> {
  let query = supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id(id, business_name, contact_name, phone, address, city, state, zip),
      technician:technician_id(id, name, email, phone)
    `)
    .order('created_at', { ascending: false });

  if (filters) {
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.client_id) query = query.eq('client_id', filters.client_id);
    if (filters.technician_id) query = query.eq('technician_id', filters.technician_id);
    if (filters.date_from) query = query.gte('created_at', filters.date_from);
    if (filters.date_to) query = query.lte('created_at', filters.date_to);
  }

  return await query;
}
