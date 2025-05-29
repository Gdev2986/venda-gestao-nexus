
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportMessage, CreateTicketParams, UpdateTicketParams } from "@/types/support.types";

// Get all support tickets
export const getSupportTickets = async () => {
  const { data, error } = await supabase
    .from("support_requests")
    .select(`
      *,
      client:clients!client_id (
        id, business_name, contact_name, phone, address, city, state
      ),
      machine:machines!machine_id (
        id, serial_number, model
      ),
      assigned_user:profiles!assigned_to (
        id, name, email
      )
    `)
    .order("created_at", { ascending: false });

  return { data: data as SupportTicket[], error };
};

// Get ticket by ID
export const getTicketById = async (id: string) => {
  const { data, error } = await supabase
    .from("support_requests")
    .select(`
      *,
      client:clients!client_id (
        id, business_name, contact_name, phone, address, city, state
      ),
      machine:machines!machine_id (
        id, serial_number, model
      ),
      assigned_user:profiles!assigned_to (
        id, name, email
      )
    `)
    .eq("id", id)
    .single();

  return { data: data as SupportTicket, error };
};

// Create new support ticket
export const createSupportTicket = async (ticket: CreateTicketParams) => {
  const { data, error } = await supabase
    .from("support_requests")
    .insert({
      title: ticket.title,
      description: ticket.description,
      client_id: ticket.client_id,
      machine_id: ticket.machine_id,
      type: ticket.type,
      priority: ticket.priority,
      status: ticket.status || "PENDING",
      scheduled_date: ticket.scheduled_date,
      attachments: ticket.attachments ? JSON.stringify(ticket.attachments) : null
    })
    .select()
    .single();

  return { data: data as SupportTicket, error };
};

// Update support ticket
export const updateSupportTicket = async (id: string, updates: UpdateTicketParams) => {
  const { data, error } = await supabase
    .from("support_requests")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  return { data: data as SupportTicket, error };
};

// Get messages for a ticket
export const getTicketMessages = async (ticketId: string) => {
  const { data, error } = await supabase
    .from("support_messages")
    .select(`
      *,
      user:profiles!user_id (
        id, name, role
      )
    `)
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  return { data: data as SupportMessage[], error };
};

// Send message
export const sendTicketMessage = async (ticketId: string, message: string, attachments?: File[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const { data, error } = await supabase
    .from("support_messages")
    .insert({
      ticket_id: ticketId,
      user_id: user.id,
      message,
      attachments: attachments ? JSON.stringify(attachments) : null
    })
    .select()
    .single();

  return { data: data as SupportMessage, error };
};

// Assign ticket to user
export const assignTicket = async (ticketId: string, assignedTo: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: new Error("User not authenticated") };
  }

  // Update the ticket
  const { data: ticketData, error: ticketError } = await supabase
    .from("support_requests")
    .update({ assigned_to: assignedTo })
    .eq("id", ticketId)
    .select()
    .single();

  if (ticketError) {
    return { data: null, error: ticketError };
  }

  // Create assignment record
  const { data, error } = await supabase
    .from("support_assignments")
    .insert({
      ticket_id: ticketId,
      assigned_to: assignedTo,
      assigned_by: user.id
    })
    .select()
    .single();

  return { data: ticketData, error };
};

// Upload file
export const uploadSupportFile = async (file: File, ticketId: string) => {
  const fileName = `${ticketId}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from("support-attachments")
    .upload(fileName, file);

  if (error) {
    return { data: null, error };
  }

  const { data: urlData } = supabase.storage
    .from("support-attachments")
    .getPublicUrl(fileName);

  return { data: { path: fileName, url: urlData.publicUrl }, error: null };
};
