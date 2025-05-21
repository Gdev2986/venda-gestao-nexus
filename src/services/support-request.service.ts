
import { supabase } from "@/integrations/supabase/client";
import { 
  SupportRequest, 
  SupportMessage, 
  SupportRequestStatus, 
  SupportRequestType, 
  SupportRequestPriority 
} from "@/types/support-request.types";

export const SupportRequestService = {
  async createTicket(ticketData: Omit<SupportRequest, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Create a single object with proper type casting
      const { data, error } = await supabase
        .from('support_requests')
        .insert({
          title: ticketData.title,
          description: ticketData.description,
          client_id: ticketData.client_id,
          technician_id: ticketData.technician_id,
          type: ticketData.type as string,
          status: (ticketData.status || SupportRequestStatus.PENDING) as string,
          priority: ticketData.priority as string,
          scheduled_date: ticketData.scheduled_date
        })
        .select()
        .single();

      if (error) throw error;
      return data as SupportRequest;
    } catch (error) {
      console.error("Error creating support request:", error);
      throw error;
    }
  },

  async updateTicket(id: string, updateData: Partial<SupportRequest>) {
    try {
      // Prepare updates ensuring it matches database schema
      const updatePayload: Record<string, any> = {};
      
      if (updateData.title !== undefined) updatePayload.title = updateData.title;
      if (updateData.description !== undefined) updatePayload.description = updateData.description;
      if (updateData.status !== undefined) updatePayload.status = updateData.status as string;
      if (updateData.priority !== undefined) updatePayload.priority = updateData.priority as string;
      if (updateData.type !== undefined) updatePayload.type = updateData.type as string;
      if (updateData.technician_id !== undefined) updatePayload.technician_id = updateData.technician_id;
      if (updateData.resolution !== undefined) updatePayload.resolution = updateData.resolution;
      if (updateData.scheduled_date !== undefined) updatePayload.scheduled_date = updateData.scheduled_date;
      
      // Always update the updated_at timestamp
      updatePayload.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('support_requests')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as SupportRequest;
    } catch (error) {
      console.error("Error updating support request:", error);
      throw error;
    }
  },

  async getTickets(filters: {
    status?: SupportRequestStatus | SupportRequestStatus[],
    client_id?: string,
    technician_id?: string,
    type?: SupportRequestType | SupportRequestType[],
    priority?: SupportRequestPriority,
    search?: string
  } = {}) {
    try {
      let query = supabase
        .from('support_requests')
        .select(`
          *,
          client:client_id(*),
          machine:machine_id(*)
        `);

      // Apply filters with proper type handling
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          // Convert enum values to strings for the query
          const statusValues = filters.status.map(s => s.toString());
          query = query.in('status', statusValues as any);
        } else {
          query = query.eq('status', filters.status.toString() as any);
        }
      }

      if (filters.type) {
        if (Array.isArray(filters.type)) {
          // Convert enum values to strings for the query
          const typeValues = filters.type.map(t => t.toString());
          query = query.in('type', typeValues as any);
        } else {
          query = query.eq('type', filters.type.toString() as any);
        }
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority.toString() as any);
      }

      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      if (filters.technician_id) {
        query = query.eq('technician_id', filters.technician_id);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data as SupportRequest[];
    } catch (error) {
      console.error("Error fetching support requests:", error);
      return [];
    }
  },

  async getTicketMessages(ticketId: string) {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select(`
          *,
          user:user_id(*)
        `)
        .eq('conversation_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform to match SupportMessage interface with proper fallbacks
      const messages = data.map(msg => {
        // Handle potential missing user data
        let userData = {
          id: '',
          name: '',
          role: ''
        };
        
        // Only try to access user properties if they exist
        if (msg.user && typeof msg.user === 'object' && !('error' in msg.user)) {
          userData = {
            id: msg.user.id || '',
            name: msg.user.name || '',
            role: msg.user.role || ''
          };
        }
        
        // Return properly formatted message object
        return {
          id: msg.id,
          ticket_id: msg.conversation_id, // Map conversation_id to ticket_id
          user_id: msg.user_id,
          message: msg.message,
          created_at: msg.created_at,
          user: userData
        };
      }) as SupportMessage[];

      return messages;
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
      return [];
    }
  },

  async addMessage(message: {
    ticket_id: string,
    user_id: string,
    message: string
  }) {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: message.ticket_id,  // Map ticket_id to conversation_id
          user_id: message.user_id,
          message: message.message
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding support message:", error);
      throw error;
    }
  },

  async getStats() {
    try {
      const tickets = await this.getTickets();
      
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
};

export default SupportRequestService;
