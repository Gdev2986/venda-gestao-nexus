
import { supabase } from "@/integrations/supabase/client";
import { TicketFilters } from "./types";

/**
 * Get statistics for support tickets
 */
export async function getStats() {
  try {
    // Get tickets with PENDING status
    const { data: pendingTickets, error: pendingError } = await supabase
      .from('support_requests')
      .select('id')
      .eq('status', 'PENDING');

    if (pendingError) throw pendingError;

    // Get tickets with HIGH priority
    const { data: highPriorityTickets, error: priorityError } = await supabase
      .from('support_requests')
      .select('id')
      .eq('priority', 'HIGH');

    if (priorityError) throw priorityError;

    // Get count of tickets by type
    const { data: typeData, error: typeError } = await supabase
      .from('support_requests')
      .select('type, id');

    if (typeError) throw typeError;

    // Calculate type counts
    const typeCounts: Record<string, number> = {};
    if (typeData) {
      typeData.forEach(item => {
        const type = item.type as string;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
    }

    return {
      pendingRequests: pendingTickets?.length || 0,
      highPriorityRequests: highPriorityTickets?.length || 0,
      typeCounts
    };
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    return {
      pendingRequests: 0,
      highPriorityRequests: 0,
      typeCounts: {}
    };
  }
}
