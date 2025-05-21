
import { supabase } from "@/integrations/supabase/client";
import { 
  SupportTicket, 
  CreateTicketParams, 
  UpdateTicketParams 
} from "./types";
import { TicketStatus } from "@/types/enums";

// Get all support tickets
export async function getSupportTickets() {
  try {
    const response = await supabase
      .from("support_tickets")
      .select(`
        *,
        client:client_id (*),
        machine:machine_id (*)
      `)
      .order("created_at", { ascending: false });
    
    return { data: response.data as SupportTicket[], error: response.error };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return { data: null, error };
  }
}

// Get a specific support ticket by ID
export async function getSupportTicketById(ticketId: string) {
  try {
    const response = await supabase
      .from("support_tickets")
      .select(`
        *,
        client:client_id (*),
        machine:machine_id (*)
      `)
      .eq("id", ticketId)
      .single();
    
    return { data: response.data as SupportTicket, error: response.error };
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    return { data: null, error };
  }
}

// Get support tickets for a specific client
export async function getClientSupportTickets(clientId: string) {
  try {
    const response = await supabase
      .from("support_tickets")
      .select(`
        *,
        client:client_id (*),
        machine:machine_id (*)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    
    return { data: response.data as SupportTicket[], error: response.error };
  } catch (error) {
    console.error("Error fetching client support tickets:", error);
    return { data: null, error };
  }
}

// Create a new support ticket
export async function createSupportTicket(params: CreateTicketParams) {
  try {
    const response = await supabase
      .from("support_tickets")
      .insert({
        title: params.title,
        description: params.description,
        client_id: params.client_id,
        machine_id: params.machine_id,
        user_id: params.user_id,
        type: params.type,
        status: params.status || TicketStatus.PENDING,
        priority: params.priority,
        scheduled_date: params.scheduled_date
      })
      .select(`
        *,
        client:client_id (*),
        machine:machine_id (*)
      `)
      .single();
    
    return { data: response.data as SupportTicket, error: response.error };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return { data: null, error };
  }
}

// Update an existing support ticket
export async function updateSupportTicket(ticketId: string, updates: UpdateTicketParams) {
  try {
    const response = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", ticketId)
      .select(`
        *,
        client:client_id (*),
        machine:machine_id (*)
      `)
      .single();
    
    return { data: response.data as SupportTicket, error: response.error };
  } catch (error) {
    console.error("Error updating support ticket:", error);
    return { data: null, error };
  }
}

// Delete a support ticket
export async function deleteSupportTicket(ticketId: string) {
  try {
    const response = await supabase
      .from("support_tickets")
      .delete()
      .eq("id", ticketId);
    
    return { error: response.error };
  } catch (error) {
    console.error("Error deleting support ticket:", error);
    return { error };
  }
}
