
import { supabase } from "@/integrations/supabase/client";

export type SupportTicketStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH";
export type SupportTicketType = "INSTALLATION" | "MAINTENANCE" | "REMOVAL" | "REPLACEMENT" | "PAPER" | "OTHER";

export interface SupportTicket {
  id: string;
  client_id: string;
  machine_id?: string | null;
  type: SupportTicketType;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  description?: string;
  scheduled_date?: string | null;
  created_by: string;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    business_name: string;
  };
  machine?: {
    id: string;
    serial_number: string;
    model: string;
  };
}

export interface SupportTicketCreateParams {
  client_id: string;
  machine_id?: string;
  type: SupportTicketType;
  priority: SupportTicketPriority;
  description?: string;
  scheduled_date?: string;
  created_by: string;
}

export interface SupportTicketUpdateParams {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  description?: string;
  scheduled_date?: string | null;
  assigned_to?: string | null;
}

export async function getAllSupportTickets(): Promise<SupportTicket[]> {
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        client:clients(id, business_name),
        machine:machines(id, serial_number, model)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    throw error;
  }
}

export async function getSupportTicketsByStatus(status: SupportTicketStatus): Promise<SupportTicket[]> {
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        client:clients(id, business_name),
        machine:machines(id, serial_number, model)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching support tickets with status ${status}:`, error);
    throw error;
  }
}

export async function getSupportTicketById(id: string): Promise<SupportTicket> {
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .select(`
        *,
        client:clients(id, business_name),
        machine:machines(id, serial_number, model)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching support ticket with id ${id}:`, error);
    throw error;
  }
}

export async function createSupportTicket(params: SupportTicketCreateParams): Promise<SupportTicket> {
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        client_id: params.client_id,
        machine_id: params.machine_id,
        type: params.type,
        status: "PENDING",
        priority: params.priority,
        description: params.description,
        scheduled_date: params.scheduled_date,
        created_by: params.created_by,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
}

export async function updateSupportTicket(id: string, params: SupportTicketUpdateParams): Promise<SupportTicket> {
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .update({
        status: params.status,
        priority: params.priority,
        description: params.description,
        scheduled_date: params.scheduled_date,
        assigned_to: params.assigned_to,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating support ticket ${id}:`, error);
    throw error;
  }
}

export async function getSupportTicketStats(): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("status, priority, scheduled_date");

    if (error) {
      throw error;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculate ticket statistics
    const total = data.length;
    const pendingCount = data.filter(ticket => ticket.status === "PENDING").length;
    const inProgressCount = data.filter(ticket => ticket.status === "IN_PROGRESS").length;
    const resolvedCount = data.filter(ticket => ticket.status === "RESOLVED").length;
    const highPriorityCount = data.filter(ticket => ticket.priority === "HIGH").length;
    const scheduledToday = data.filter(ticket => {
      if (!ticket.scheduled_date) return false;
      const ticketDate = new Date(ticket.scheduled_date);
      return ticketDate >= today && ticketDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    return {
      total,
      pending: pendingCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      highPriority: highPriorityCount,
      scheduledToday
    };
  } catch (error) {
    console.error("Error getting support ticket stats:", error);
    throw error;
  }
}
