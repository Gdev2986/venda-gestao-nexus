
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
  type: string;  // Using string type for compatibility
  priority: string;  // Using string type for compatibility
  client_id: string;
  scheduled_date?: string | null;
}) => {
  // Create request data with explicit string status
  const requestData = {
    ...data,
    status: SupportRequestStatus.PENDING
  };
  
  // We need to cast the entire object to any to bypass TypeScript's type checking
  return await supabase
    .from("support_requests")
    .insert(requestData as any)
    .select()
    .single();
};

// UPDATE a request
export const updateRequest = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    type?: string;  // Using string type for compatibility
    status?: string;  // Using string type for compatibility
    priority?: string;  // Using string type for compatibility
    scheduled_date?: string | null;
    resolution?: string | null;
    technician_id?: string | null;
  }
) => {
  // Cast the update data to any to bypass TypeScript's strict type checking
  return await supabase
    .from("support_requests")
    .update(data as any)
    .eq("id", id)
    .select()
    .single();
};
