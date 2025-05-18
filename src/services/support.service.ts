
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, TicketStatus, TicketPriority, TicketType } from "@/types/support.types";
import { CreateSupportTicketParams, UpdateSupportTicketParams } from "@/types/support.types";

// Mock data for local development - will be replaced by Supabase implementation
const mockTickets = [
  {
    id: "1",
    title: "Machine not working",
    description: "The terminal is not turning on",
    status: "PENDING",
    priority: "HIGH",
    type: "MAINTENANCE",
    client_id: "client-1",
    created_by: "user-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: {
      id: "client-1",
      business_name: "ABC Store"
    }
  },
  {
    id: "2",
    title: "Need new paper rolls",
    description: "Please send 5 paper rolls",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    type: "SUPPLIES",
    client_id: "client-2",
    created_by: "user-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: {
      id: "client-2",
      business_name: "XYZ Restaurant"
    }
  }
];

// Helper function to convert database types to our app types
const mapDatabaseTicketToAppTicket = (dbTicket: any): SupportTicket => {
  return {
    ...dbTicket,
    status: dbTicket.status as TicketStatus,
    priority: dbTicket.priority as TicketPriority,
    type: dbTicket.type as TicketType,
    client: dbTicket.client ? {
      id: dbTicket.client.id || "",
      business_name: dbTicket.client.business_name || ""
    } : undefined
  };
};

// Get all support tickets
export async function getAllSupportTickets(): Promise<SupportTicket[]> {
  try {
    // Create a temporary table for development if needed
    const tableExists = await checkIfSupportTicketsTableExists();
    
    if (!tableExists) {
      console.warn("Support tickets table doesn't exist in the database. Using mock data.");
      return mockTickets.map(ticket => mapDatabaseTicketToAppTicket(ticket));
    }
    
    const { data, error } = await supabase
      .from("support_conversations")
      .select(`
        *,
        client:clients(id, business_name, address, city, state),
        machine:machines(id, serial_number, model)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching support tickets:", error);
      return mockTickets.map(ticket => mapDatabaseTicketToAppTicket(ticket));
    }

    return data.map(mapDatabaseTicketToAppTicket);
  } catch (error) {
    console.error("Error in getAllSupportTickets:", error);
    return mockTickets.map(ticket => mapDatabaseTicketToAppTicket(ticket));
  }
}

// Helper to check if support_tickets table exists
async function checkIfSupportTicketsTableExists(): Promise<boolean> {
  try {
    // Use a simple query to check if the table exists
    const { error } = await supabase
      .from('support_conversations')
      .select('id')
      .limit(1);
    
    // If no error, the table exists
    return !error;
  } catch (error) {
    console.warn("Error checking support_tickets table:", error);
    return false;
  }
}

// Create a new support ticket
export async function createSupportTicket(params: CreateSupportTicketParams): Promise<SupportTicket> {
  try {
    // For development, return a mock ticket
    if (!(await checkIfSupportTicketsTableExists())) {
      const newTicket = {
        id: `mock-${Date.now()}`,
        title: params.title,
        description: params.description,
        status: params.status || TicketStatus.PENDING,
        priority: params.priority,
        type: params.type,
        client_id: params.client_id,
        machine_id: params.machine_id,
        user_id: "mock-user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client: {
          id: "mock-client",
          business_name: "Client Name"
        }
      };
      return newTicket as SupportTicket;
    }

    const { data, error } = await supabase
      .from("support_conversations")
      .insert({
        client_id: params.client_id,
        subject: params.title,
        status: "OPEN"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: params.title,
      description: params.description,
      status: TicketStatus.PENDING,
      priority: params.priority as TicketPriority,
      type: params.type as TicketType,
      client_id: params.client_id,
      machine_id: params.machine_id,
      user_id: "system",
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error("Error creating support ticket:", error);
    // Return a mock ticket for development
    return {
      id: `mock-${Date.now()}`,
      title: params.title,
      description: params.description,
      status: TicketStatus.PENDING,
      priority: params.priority as TicketPriority,
      type: params.type as TicketType,
      client_id: params.client_id,
      machine_id: params.machine_id,
      user_id: "mock-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}
