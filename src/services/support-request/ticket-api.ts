
import { supabase } from "@/integrations/supabase/client";
import { SupportRequestStatus, SupportRequestType, SupportRequestPriority } from "@/types/support-request.types";

// GET all requests
export const getAllRequests = async () => {
  return await supabase
    .from("support_requests")
    .select("*")
    .order("created_at", { ascending: false });
};

// GET requests by client
export const getClientRequests = async (clientId: string) => {
  return await supabase
    .from("support_requests")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
};

// GET a single request by ID
export const getRequestById = async (id: string) => {
  return await supabase
    .from("support_requests")
    .select("*")
    .eq("id", id)
    .single();
};

// CREATE a new request
export const createRequest = async (data: {
  title: string;
  description: string;
  type: string;  // Changed from SupportRequestType to string
  priority: string;  // Changed from SupportRequestPriority to string
  client_id: string;
  scheduled_date?: string | null;
}) => {
  return await supabase
    .from("support_requests")
    .insert({
      ...data,
      status: SupportRequestStatus.PENDING as string  // Cast to string
    })
    .select()
    .single();
};

// UPDATE a request
export const updateRequest = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    type?: string;  // Changed from SupportRequestType to string
    status?: string;  // Changed from SupportRequestStatus to string
    priority?: string;  // Changed from SupportRequestPriority to string
    scheduled_date?: string | null;
    resolution?: string | null;
    technician_id?: string | null;
  }
) => {
  return await supabase
    .from("support_requests")
    .update(data)
    .eq("id", id)
    .select()
    .single();
};
