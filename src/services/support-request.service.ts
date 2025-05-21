
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportMessage } from "@/types/support-request.types";
import { TicketPriority, TicketStatus, TicketType, UserRole } from "@/types/enums";

export const SupportRequestService = {
  async createTicket(ticketData: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .insert([{
          title: ticketData.title,
          description: ticketData.description,
          client_id: ticketData.client_id,
          technician_id: ticketData.technician_id,
          type: ticketData.type,
          status: ticketData.status || TicketStatus.PENDING,
          priority: ticketData.priority,
          scheduled_date: ticketData.scheduled_date
        }])
        .select()
        .single();

      if (error) throw error;
      return data as SupportTicket;
    } catch (error) {
      console.error("Error creating support request:", error);
      throw error;
    }
  },

  async updateTicket(id: string, updateData: Partial<SupportTicket>) {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .update({
          title: updateData.title,
          description: updateData.description,
          status: updateData.status,
          priority: updateData.priority,
          type: updateData.type,
          technician_id: updateData.technician_id,
          resolution: updateData.resolution,
          scheduled_date: updateData.scheduled_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as SupportTicket;
    } catch (error) {
      console.error("Error updating support request:", error);
      throw error;
    }
  },

  async getTickets(filters: {
    status?: TicketStatus | TicketStatus[],
    client_id?: string,
    technician_id?: string,
    type?: TicketType | TicketType[],
    priority?: TicketPriority,
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

      // Apply filters
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in('status', filters.status as string[]);
        } else {
          query = query.eq('status', filters.status as string);
        }
      }

      if (filters.type) {
        if (Array.isArray(filters.type)) {
          query = query.in('type', filters.type as string[]);
        } else {
          query = query.eq('type', filters.type as string);
        }
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority as string);
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

      return data as SupportTicket[];
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

      // Transform to match SupportMessage interface
      const messages = data.map(msg => ({
        id: msg.id,
        ticket_id: msg.conversation_id,
        user_id: msg.user_id,
        message: msg.message,
        created_at: msg.created_at,
        user: msg.user as any
      }));

      return messages as unknown as SupportMessage[];
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
        .insert([{
          conversation_id: message.ticket_id,
          user_id: message.user_id,
          message: message.message
        }])
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
      
      const pendingCount = tickets.filter(t => t.status === TicketStatus.PENDING || t.status === TicketStatus.OPEN).length;
      const highPriorityCount = tickets.filter(t => 
        t.priority === TicketPriority.HIGH || 
        t.priority === TicketPriority.CRITICAL || 
        t.priority === TicketPriority.URGENT
      ).length;
      
      // Count tickets by type
      const typeCounts: Record<string, number> = {};
      tickets.forEach(ticket => {
        if (!typeCounts[ticket.type]) {
          typeCounts[ticket.type] = 0;
        }
        typeCounts[ticket.type]++;
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
        typeCounts: {}
      };
    }
  }
};

export default SupportRequestService;
