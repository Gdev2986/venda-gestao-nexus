
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
      // Create a single object with specific property typing
      const { data, error } = await supabase
        .from('support_requests')
        .insert({
          title: ticketData.title,
          description: ticketData.description,
          client_id: ticketData.client_id,
          technician_id: ticketData.technician_id,
          type: ticketData.type,
          status: (ticketData.status || SupportRequestStatus.PENDING),
          priority: ticketData.priority,
          scheduled_date: ticketData.scheduled_date
        } as any)
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
      if (updateData.status !== undefined) updatePayload.status = updateData.status;
      if (updateData.priority !== undefined) updatePayload.priority = updateData.priority;
      if (updateData.type !== undefined) updatePayload.type = updateData.type;
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
      // Start with the base query
      let query = supabase.from('support_requests').select(`
        *,
        client:client_id(*),
        machine:machine_id(*)
      `);
      
      // Apply filters
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status as any);
        } else {
          query = query.eq('status', filters.status as any);
        }
      }

      if (filters.type) {
        if (Array.isArray(filters.type)) {
          query = query.in('type', filters.type as any);
        } else {
          query = query.eq('type', filters.type as any);
        }
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority as any);
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

      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;

      if (error) throw error;

      // Fix: Use simple type assertion to avoid deep instantiation
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

      // Transform data to match SupportMessage interface
      const messages = (data || []).map(msg => {
        // Initialize default user data
        const userObj: {
          id: string;
          name: string;
          role: string;
        } = {
          id: '',
          name: '',
          role: ''
        };
        
        // Safely access user properties
        if (msg.user && typeof msg.user === 'object') {
          // Type assertion for safety - we know it's an object
          const userAny = msg.user as any;
          
          // Check if it's not an error object
          if (userAny && !userAny.error) {
            userObj.id = userAny.id || '';
            userObj.name = userAny.name || '';
            userObj.role = userAny.role || '';
          }
        }
        
        // Return properly formatted message object
        return {
          id: msg.id,
          ticket_id: msg.conversation_id, // Map conversation_id to ticket_id
          user_id: msg.user_id,
          message: msg.message,
          created_at: msg.created_at,
          user: userObj
        };
      });

      return messages as SupportMessage[];
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
        } as any)
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
