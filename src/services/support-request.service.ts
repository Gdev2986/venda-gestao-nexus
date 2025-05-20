
import { supabase } from "@/integrations/supabase/client";
import { SupportRequest, SupportRequestStatus, SupportRequestType, SupportRequestPriority } from "@/types/support-request.types";
import { TicketStatus, TicketType, TicketPriority } from "@/types/support.types";

/**
 * Get all support requests
 */
export const getAllSupportRequests = async () => {
  const { data, error } = await supabase
    .from("support_requests")
    .select("*, clients(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Map data to SupportTicket type with additional fields
  const supportRequests = data?.map((request: any) => ({
    ...request,
    client_name: request.clients?.business_name || "Unknown client",
    technician_id: request.technician_id || null
  })) || [];

  return supportRequests;
};

/**
 * Create a new support request
 */
export const createSupportRequest = async (supportRequest: Omit<SupportRequest, "id" | "created_at">) => {
  // Ensure we're using the correct string literals that match database expectations
  const insertData = {
    client_id: supportRequest.client_id,
    technician_id: supportRequest.technician_id,
    title: supportRequest.title,
    description: supportRequest.description,
    type: supportRequest.type as "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL",
    status: supportRequest.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED",
    priority: supportRequest.priority as "LOW" | "MEDIUM" | "HIGH",
    scheduled_date: supportRequest.scheduled_date,
    resolution: supportRequest.resolution
  };

  const { data, error } = await supabase
    .from("support_requests")
    .insert(insertData)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Update a support request
 */
export const updateSupportRequest = async (
  id: string,
  updateData: Partial<SupportRequest>
) => {
  // Ensure we're using the correct string literals
  const updatedData = {
    ...updateData,
    type: updateData.type as "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL",
    status: updateData.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED",
    priority: updateData.priority as "LOW" | "MEDIUM" | "HIGH",
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("support_requests")
    .update(updatedData)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Get a support request by ID
 */
export const getSupportRequestById = async (id: string) => {
  const { data, error } = await supabase
    .from("support_requests")
    .select("*, clients(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a support request
 */
export const deleteSupportRequest = async (id: string) => {
  const { error } = await supabase
    .from("support_requests")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

/**
 * Convert a ticket to a support request
 */
export const convertTicketToSupportRequest = (ticket: any): SupportRequest => {
  return {
    id: ticket.id,
    client_id: ticket.client_id,
    technician_id: ticket.technician_id,
    title: ticket.title,
    description: ticket.description,
    status: mapTicketStatusToSupportRequestStatus(ticket.status),
    type: mapTicketTypeToSupportRequestType(ticket.type),
    priority: mapTicketPriorityToSupportRequestPriority(ticket.priority),
    scheduled_date: ticket.scheduled_date,
    resolution: ticket.resolution,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at
  };
};

// Helper functions to map between different enums
function mapTicketStatusToSupportRequestStatus(status: string): SupportRequestStatus {
  switch (status) {
    case TicketStatus.PENDING: return SupportRequestStatus.PENDING;
    case TicketStatus.IN_PROGRESS: return SupportRequestStatus.IN_PROGRESS;
    case TicketStatus.RESOLVED:
    case TicketStatus.CLOSED:
    case TicketStatus.COMPLETED: return SupportRequestStatus.COMPLETED;
    case TicketStatus.REJECTED:
    case TicketStatus.CANCELED: return SupportRequestStatus.CANCELED;
    default: return SupportRequestStatus.PENDING;
  }
}

function mapTicketTypeToSupportRequestType(type: string): SupportRequestType {
  switch (type) {
    case TicketType.MAINTENANCE: return SupportRequestType.MAINTENANCE;
    case TicketType.INSTALLATION: return SupportRequestType.INSTALLATION;
    case TicketType.REPLACEMENT: return SupportRequestType.REPLACEMENT;
    case TicketType.SUPPLIES: return SupportRequestType.SUPPLIES;
    case TicketType.REMOVAL: return SupportRequestType.REMOVAL;
    default: return SupportRequestType.OTHER;
  }
}

function mapTicketPriorityToSupportRequestPriority(priority: string): SupportRequestPriority {
  switch (priority) {
    case TicketPriority.LOW: return SupportRequestPriority.LOW;
    case TicketPriority.MEDIUM: return SupportRequestPriority.MEDIUM;
    case TicketPriority.HIGH:
    case TicketPriority.CRITICAL:
    case TicketPriority.URGENT: return SupportRequestPriority.HIGH;
    default: return SupportRequestPriority.MEDIUM;
  }
}
