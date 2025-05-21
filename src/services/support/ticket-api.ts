
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

// Create a new support ticket - handle the type conversion explicitly
export const createTicket = async (ticket: CreateTicketParams): Promise<ApiResponse<SupportTicket>> => {
  try {
    // Define explicit type for database fields
    type TicketData = {
      title: string;
      description: string;
      client_id: string;
      machine_id?: string;
      technician_id?: string;
      type: "MAINTENANCE" | "INSTALLATION" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL" | "OTHER";
      priority: "LOW" | "MEDIUM" | "HIGH";
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
      scheduled_date?: string;
    };

    // Map and cast values to match database schema
    const ticketData: TicketData = {
      title: ticket.title,
      description: ticket.description,
      client_id: ticket.client_id,
      machine_id: ticket.machine_id,
      // For these fields, explicitly cast to the correct database types
      type: ticket.type.toString() as "MAINTENANCE" | "INSTALLATION" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL" | "OTHER",
      priority: ticket.priority.toString() as "LOW" | "MEDIUM" | "HIGH",
      status: (ticket.status || TicketStatus.PENDING).toString() as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED",
      scheduled_date: ticket.scheduled_date,
      technician_id: ticket.user_id // Map user_id to technician_id for compatibility
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
    // Define explicit type for database fields
    type TicketUpdates = {
      title?: string;
      description?: string;
      technician_id?: string;
      resolution?: string;
      scheduled_date?: string;
      type?: "MAINTENANCE" | "INSTALLATION" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL" | "OTHER";
      priority?: "LOW" | "MEDIUM" | "HIGH";
      status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
      updated_at: string;
    };

    // Map and cast values to match database schema
    const ticketUpdates: TicketUpdates = {
      title: updates.title,
      description: updates.description,
      resolution: updates.resolution,
      scheduled_date: updates.scheduled_date,
      // For these fields, explicitly cast to the correct database types
      type: updates.type ? 
        updates.type.toString() as "MAINTENANCE" | "INSTALLATION" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL" | "OTHER" : 
        undefined,
      priority: updates.priority ? 
        updates.priority.toString() as "LOW" | "MEDIUM" | "HIGH" : 
        undefined,
      status: updates.status ? 
        updates.status.toString() as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" : 
        undefined,
      technician_id: updates.assigned_to,
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
