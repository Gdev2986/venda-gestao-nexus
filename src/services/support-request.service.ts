import { supabase } from "@/integrations/supabase/client";
import { generateUuid } from "@/lib/supabase-utils";
import { NotificationType } from "@/types/notification.types";
import { SupportRequestType, SupportRequestStatus, SupportRequestPriority } from "@/types/support-request.types";
import { SupportTicket } from "@/types/support.types";

export type SupportRequest = SupportTicket;

export async function createSupportRequest(request: SupportRequest): Promise<{ data: any, error: any }> {
  // Map ticket types to support request types expected by the database
  const mapType = (type: string): "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REMOVAL" | "REPLACEMENT" | "SUPPLIES" => {
    if (type === "SUPPORT" || type === "REPAIR" || type === "TRAINING") {
      return "OTHER";
    }
    return type as "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REMOVAL" | "REPLACEMENT" | "SUPPLIES";
  };

  // Create an insert object with the correct string types
  const insertData = {
    client_id: request.client_id,
    technician_id: request.technician_id,
    type: mapType(request.type),
    status: request.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED",
    priority: request.priority as "LOW" | "MEDIUM" | "HIGH",
    title: request.title,
    description: request.description,
    scheduled_date: request.scheduled_date,
    resolution: request.resolution,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Perform the insert with the correct structure
  const { data, error } = await supabase
    .from('support_requests')
    .insert(insertData)
    .select();

  if (!error && data) {
    // Create notification for logistics team using the returned ID from the insert
    const newRequestId = data[0]?.id;
    await createRequestNotification(request, newRequestId);
  }

  return { data, error };
}

export async function updateSupportRequest(id: string, updates: Partial<SupportRequest>): Promise<{ data: any, error: any }> {
  // Map ticket types to support request types expected by the database
  const mapType = (type?: string): "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REMOVAL" | "REPLACEMENT" | "SUPPLIES" | undefined => {
    if (!type) return undefined;
    if (type === "SUPPORT" || type === "REPAIR" || type === "TRAINING") {
      return "OTHER";
    }
    return type as "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REMOVAL" | "REPLACEMENT" | "SUPPLIES";
  };

  // Convert enum values to strings for database compatibility
  const processedUpdates: any = {
    ...updates,
    type: updates.type ? mapType(updates.type) : undefined,
    status: updates.status ? (updates.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED") : undefined,
    priority: updates.priority ? (updates.priority as "LOW" | "MEDIUM" | "HIGH") : undefined,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('support_requests')
    .update(processedUpdates)
    .eq('id', id)
    .select();

  if (!error && updates.status) {
    // Create status update notification
    await createStatusUpdateNotification(id, updates);
  }

  return { data, error };
}

export async function getSupportRequestById(id: string): Promise<{ data: any, error: any }> {
  return await supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id(id, business_name, contact_name, phone, address, city, state, zip),
      technician:technician_id(id, name, email, phone)
    `)
    .eq('id', id)
    .single();
}

export async function getSupportRequests(filters?: {
  status?: string;
  type?: string;
  priority?: string;
  client_id?: string;
  technician_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<{ data: any, error: any }> {
  let query = supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id(id, business_name, contact_name, phone, address, city, state, zip),
      technician:technician_id(id, name, email, phone)
    `)
    .order('created_at', { ascending: false });

  if (filters) {
    // Cast the string filters to match expected types
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.client_id) query = query.eq('client_id', filters.client_id);
    if (filters.technician_id) query = query.eq('technician_id', filters.technician_id);
    if (filters.date_from) query = query.gte('created_at', filters.date_from);
    if (filters.date_to) query = query.lte('created_at', filters.date_to);
  }

  return await query;
}

// Notification functions
async function createRequestNotification(request: SupportRequest, requestId: string) {
  try {
    // Get all logistics users
    const { data: logisticsUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'LOGISTICS');

    if (logisticsUsers && logisticsUsers.length > 0) {
      // Create notifications for each logistics user
      for (const user of logisticsUsers) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Nova Solicitação Técnica',
            message: `${request.title} - ${request.priority}`,
            type: "SUPPORT", // Use string literal instead of enum
            data: { 
              request_id: requestId,
              type: request.type,
              priority: request.priority,
              client_id: request.client_id
            },
            is_read: false,
            created_at: new Date().toISOString()
          });
      }
    }
    
    // Also notify the admin users
    const { data: adminUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'ADMIN');
      
    if (adminUsers && adminUsers.length > 0) {
      for (const user of adminUsers) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'Nova Solicitação Técnica',
            message: `${request.title} - ${request.priority}`,
            type: "SUPPORT", // Use string literal instead of enum
            data: { 
              request_id: requestId,
              type: request.type,
              priority: request.priority,
              client_id: request.client_id
            },
            is_read: false,
            created_at: new Date().toISOString()
          });
      }
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

async function createStatusUpdateNotification(requestId: string, updates: Partial<SupportRequest>) {
  try {
    const { data: request } = await getSupportRequestById(requestId);
    if (!request) return;
    
    // Get client user ID
    const { data: clientData } = await supabase
      .from('user_client_access')
      .select('user_id')
      .eq('client_id', request.client_id)
      .single();
    
    if (clientData) {
      // Notify client
      await supabase
        .from('notifications')
        .insert({
          user_id: clientData.user_id,
          title: 'Atualização de Solicitação',
          message: `Sua solicitação "${request.title}" foi atualizada para ${updates.status}`,
          type: "SUPPORT", // Use string literal instead of enum
          data: { request_id: requestId, new_status: updates.status },
          is_read: false,
          created_at: new Date().toISOString()
        });
    }
    
    // If a technician is assigned, notify them as well
    if (updates.technician_id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: updates.technician_id,
          title: 'Nova Solicitação Atribuída',
          message: `Você foi atribuído à solicitação "${request.title}"`,
          type: "SUPPORT", // Use string literal instead of enum
          data: { request_id: requestId },
          is_read: false,
          created_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error creating status update notification:', error);
  }
}
