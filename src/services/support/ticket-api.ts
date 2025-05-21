
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, CreateTicketParams, UpdateTicketParams, TicketStatus } from "./types";

// Return type that matches what the hook expects
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Get all support tickets
export const getTickets = async (): Promise<ApiResponse<SupportTicket[]>> => {
  try {
    const { data, error } = await supabase
      .from("support_requests")
      .select(`
        *,
        client:client_id (
          id, business_name, contact_name, phone, address, city, state
        ),
        machine:machine_id (
          id, serial_number, model
        )
      `);

    if (error) {
      console.error("Error fetching tickets:", error);
      return { data: null, error };
    }

    // Use type assertion to convert the Supabase response to our expected type
    return { data: data as unknown as SupportTicket[], error: null };
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Get a single support ticket by ID
export const getTicketById = async (id: string): Promise<ApiResponse<SupportTicket>> => {
  try {
    const { data, error } = await supabase
      .from("support_requests")
      .select(`
        *,
        client:client_id (
          id, business_name, contact_name, phone, address, city, state
        ),
        machine:machine_id (
          id, serial_number, model
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching ticket:", error);
      return { data: null, error };
    }

    return { data: data as unknown as SupportTicket, error: null };
  }
  catch (error) {
    console.error("Failed to fetch ticket:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Get tickets for a specific client
export const getClientTickets = async (clientId: string): Promise<ApiResponse<SupportTicket[]>> => {
  try {
    const { data, error } = await supabase
      .from("support_requests")
      .select(`
        *,
        client:client_id (
          id, business_name, contact_name, phone, address, city, state
        ),
        machine:machine_id (
          id, serial_number, model
        )
      `)
      .eq("client_id", clientId);

    if (error) {
      console.error("Error fetching client tickets:", error);
      return { data: null, error };
    }

    return { data: data as unknown as SupportTicket[], error: null };
  } catch (error) {
    console.error("Failed to fetch client tickets:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Create a new support ticket
export const createTicket = async (ticket: CreateTicketParams): Promise<ApiResponse<SupportTicket>> => {
  try {
    // Convert the enum types to strings for the database
    const ticketData = {
      title: ticket.title,
      description: ticket.description,
      client_id: ticket.client_id,
      machine_id: ticket.machine_id,
      type: ticket.type.toString(),
      priority: ticket.priority.toString(),
      status: (ticket.status || TicketStatus.PENDING).toString(),
      scheduled_date: ticket.scheduled_date,
      user_id: ticket.user_id
    };

    const { data, error } = await supabase
      .from("support_requests")
      .insert(ticketData)
      .select()
      .single();

    if (error) {
      console.error("Error creating ticket:", error);
      return { data: null, error };
    }

    return { data: data as unknown as SupportTicket, error: null };
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Update an existing support ticket
export const updateTicket = async (
  id: string,
  updates: UpdateTicketParams
): Promise<ApiResponse<SupportTicket>> => {
  try {
    // Convert enum types to strings for the database
    const ticketUpdates = {
      ...updates,
      type: updates.type ? updates.type.toString() : undefined,
      priority: updates.priority ? updates.priority.toString() : undefined,
      status: updates.status ? updates.status.toString() : undefined,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("support_requests")
      .update(ticketUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ticket:", error);
      return { data: null, error };
    }

    return { data: data as unknown as SupportTicket, error: null };
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};
