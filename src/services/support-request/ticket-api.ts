
import { supabase } from "@/integrations/supabase/client";
import { 
  SupportRequest, 
  SupportRequestStatus, 
  SupportRequestType, 
  SupportRequestPriority 
} from "@/types/support-request.types";

// Get all support requests
export async function getAllRequests() {
  try {
    const response = await supabase
      .from("support_requests")
      .select("*")
      .order("created_at", { ascending: false });
    
    return { data: response.data as SupportRequest[] || [], error: response.error };
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return { data: [], error };
  }
}

// Get support requests by status
export async function getRequestsByStatus(status: SupportRequestStatus) {
  try {
    const response = await supabase
      .from("support_requests")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    
    return { data: response.data as SupportRequest[] || [], error: response.error };
  } catch (error) {
    console.error(`Error fetching ${status} support requests:`, error);
    return { data: [], error };
  }
}

// Create a new support request
export async function createRequest(requestData: {
  title: string;
  description: string;
  client_id: string;
  technician_id?: string;
  type: "MAINTENANCE" | "INSTALLATION" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  scheduled_date?: string;
}) {
  try {
    const response = await supabase
      .from("support_requests")
      .insert(requestData)
      .select()
      .single();
    
    return { data: response.data as SupportRequest, error: response.error };
  } catch (error) {
    console.error("Error creating support request:", error);
    return { data: null, error };
  }
}

// Update an existing support request
export async function updateRequest(id: string, updateData: {
  title?: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  type?: "MAINTENANCE" | "INSTALLATION" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL" | "OTHER";
  technician_id?: string;
  resolution?: string;
  scheduled_date?: string;
}) {
  try {
    const response = await supabase
      .from("support_requests")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    
    return { data: response.data as SupportRequest, error: response.error };
  } catch (error) {
    console.error("Error updating support request:", error);
    return { data: null, error };
  }
}

// Delete a support request
export async function deleteRequest(id: string) {
  try {
    const response = await supabase
      .from("support_requests")
      .delete()
      .eq("id", id);
    
    return { success: !response.error, error: response.error };
  } catch (error) {
    console.error("Error deleting support request:", error);
    return { success: false, error };
  }
}

// Get support request statistics
export async function getRequestStats() {
  try {
    // Get all requests to calculate stats
    const { data: requests, error } = await supabase
      .from("support_requests")
      .select("*");
    
    if (error) throw error;
    
    const pendingRequests = requests.filter(
      req => req.status === "PENDING" || 
             req.status === "IN_PROGRESS"
    ).length;
    
    const highPriorityRequests = requests.filter(
      req => req.priority === "HIGH"
    ).length;
    
    // Count requests by type
    const typeCounts = requests.reduce((counts: Record<string, number>, req) => {
      const type = req.type as string;
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});
    
    return {
      pendingRequests,
      highPriorityRequests,
      typeCounts,
      totalRequests: requests.length
    };
  } catch (error) {
    console.error("Error getting support request stats:", error);
    return {
      pendingRequests: 0,
      highPriorityRequests: 0,
      typeCounts: {},
      totalRequests: 0
    };
  }
}
