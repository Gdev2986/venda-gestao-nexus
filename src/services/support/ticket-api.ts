
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, CreateTicketParams, UpdateTicketParams } from "./types";

// Get all support tickets
export const getTickets = async (): Promise<SupportTicket[]> => {
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
      throw error;
    }

    return data as SupportTicket[];
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error;
  }
};

// Get a single support ticket by ID
export const getTicketById = async (id: string): Promise<SupportTicket> => {
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
      throw error;
    }

    return data as SupportTicket;
  }
  catch (error) {
    console.error("Failed to fetch ticket:", error);
    throw error;
  }
};

// Get tickets for a specific client
export const getClientTickets = async (clientId: string): Promise<SupportTicket[]> => {
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
      throw error;
    }

    return data as SupportTicket[];
  } catch (error) {
    console.error("Failed to fetch client tickets:", error);
    throw error;
  }
};

// Create a new support ticket
export const createTicket = async (ticket: CreateTicketParams): Promise<SupportTicket> => {
  try {
    const { data, error } = await supabase
      .from("support_requests")
      .insert(ticket)
      .select()
      .single();

    if (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }

    return data as SupportTicket;
  } catch (error) {
    console.error("Failed to create ticket:", error);
    throw error;
  }
};

// Update an existing support ticket
export const updateTicket = async (
  id: string,
  updates: UpdateTicketParams
): Promise<SupportTicket> => {
  try {
    const { data, error } = await supabase
      .from("support_requests")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }

    return data as SupportTicket;
  } catch (error) {
    console.error("Failed to update ticket:", error);
    throw error;
  }
};
