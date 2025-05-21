
import { supabase } from "@/integrations/supabase/client";

export const getRequestStats = async () => {
  try {
    // Get count of pending requests
    const { count: pendingCount, error: pendingError } = await supabase
      .from('support_requests')
      .select('*', { count: 'exact', head: true })
      .in('status', ['PENDING', 'OPEN']);

    if (pendingError) throw pendingError;

    // Get count of high priority requests
    const { count: highPriorityCount, error: priorityError } = await supabase
      .from('support_requests')
      .select('*', { count: 'exact', head: true })
      .eq('priority', 'HIGH');

    if (priorityError) throw priorityError;

    // Get counts by type
    const { data: typeData, error: typeError } = await supabase
      .from('support_requests')
      .select('type');

    if (typeError) throw typeError;

    // Calculate type counts
    const typeCounts: Record<string, number> = {};
    typeData.forEach(item => {
      if (!typeCounts[item.type]) {
        typeCounts[item.type] = 1;
      } else {
        typeCounts[item.type]++;
      }
    });

    return {
      pendingRequests: pendingCount || 0,
      highPriorityRequests: highPriorityCount || 0,
      typeCounts
    };
  } catch (error) {
    console.error('Error getting support request stats:', error);
    return {
      pendingRequests: 0,
      highPriorityRequests: 0,
      typeCounts: {}
    };
  }
};
