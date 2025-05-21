
import { SupportRequestStatus, SupportRequestPriority, TicketStats } from "./types";
import { getTickets } from "./ticket-api";

/**
 * Get support ticket statistics
 */
export async function getStats(): Promise<TicketStats> {
  try {
    const tickets = await getTickets();
    
    const pendingCount = tickets.filter(t => 
      t.status === SupportRequestStatus.PENDING || 
      t.status === SupportRequestStatus.IN_PROGRESS
    ).length;
    
    const highPriorityCount = tickets.filter(t => 
      t.priority === SupportRequestPriority.HIGH
    ).length;
    
    // Count tickets by type
    const typeCounts: Record<string, number> = {};
    tickets.forEach(ticket => {
      const typeKey = ticket.type.toString();
      if (!typeCounts[typeKey]) {
        typeCounts[typeKey] = 0;
      }
      typeCounts[typeKey]++;
    });
    
    return {
      pendingRequests: pendingCount,
      highPriorityRequests: highPriorityCount,
      typeCounts
    };
  } catch (error) {
    console.error("Error getting support stats:", error);
    return {
      pendingRequests: 0,
      highPriorityRequests: 0,
      typeCounts: {} as Record<string, number>
    };
  }
}
