
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
      )
    `)
    .order("created_at", { ascending: false });

  return { data: data as unknown as SupportTicket[], error };
};

// Get ticket by ID
export const getTicketById = async (id: string) => {
  const { data, error } = await supabase
    .from("support_requests")
    .select(`
      *,
      client:clients!client_id (
        id, business_name, contact_name, phone, address, city, state
      )
    `)
    .eq("id", id)
    .single();

  return { data: data as unknown as SupportTicket, error };
};

// Create new support ticket
export const createSupportTicket = async (ticket: CreateTicketParams) => {
  const { data, error } = await supabase
    .from("support_requests")
    .insert({
      title: ticket.description, // Use description as title since that's what we have
      description: ticket.description,
      client_id: ticket.client_id,
      type: ticket.type.toString() as "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL",
      priority: ticket.priority.toString() as "LOW" | "MEDIUM" | "HIGH",
      status: (ticket.status || "PENDING").toString() as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED",
      scheduled_date: ticket.scheduled_date
    })
    .select()
    .single();

  return { data: data as unknown as SupportTicket, error };
};

// Update support ticket
export const updateSupportTicket = async (id: string, updates: UpdateTicketParams) => {
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (updates.description) {
    updateData.title = updates.description;
    updateData.description = updates.description;
  }
  if (updates.status) {
    updateData.status = updates.status.toString() as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  }
  if (updates.priority) {
    updateData.priority = updates.priority.toString() as "LOW" | "MEDIUM" | "HIGH";
  }
  if (updates.type) {
    updateData.type = updates.type.toString() as "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL";
  }
  if (updates.technician_id) {
    updateData.technician_id = updates.technician_id;
  }
  if (updates.resolution) {
    updateData.resolution = updates.resolution;
  }
  if (updates.scheduled_date) {
    updateData.scheduled_date = updates.scheduled_date;
  }

  const { data, error } = await supabase
    .from("support_requests")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return { data: data as unknown as SupportTicket, error };
};

// Get messages for a ticket
export const getTicketMessages = async (ticketId: string) => {
  const { data, error } = await supabase
    .from("support_messages")
    .select(`
      *
    `)
    .eq("conversation_id", ticketId)
    .order("created_at", { ascending: true });

  if (data) {
    // Map conversation_id to ticket_id for compatibility
    const mappedData = data.map(msg => ({
      ...msg,
      ticket_id: msg.conversation_id,
      user: {
        id: msg.user_id,
        name: "User",
        role: "CLIENT"
      }
    }));
    return { data: mappedData as SupportMessage[], error };
  }

  return { data: null, error };
};

// Send message - removed attachments parameter since it's not supported
export const sendTicketMessage = async (ticketId: string, message: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const { data, error } = await supabase
    .from("support_messages")
    .insert({
      conversation_id: ticketId,
      user_id: user.id,
      message
    })
    .select()
    .single();

  if (data) {
    // Map conversation_id to ticket_id for compatibility
    const mappedData = {
      ...data,
      ticket_id: data.conversation_id,
      user: {
        id: data.user_id,
        name: "User",
        role: "CLIENT"
      }
    };
    return { data: mappedData as SupportMessage, error };
  }

  return { data: null, error };
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
