
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

/**
 * Checks if the current authenticated user has access to a specific client.
 * Admin, Financial roles have access to all clients.
 * Partner roles have access to clients they manage.
 * Client roles only have access to their own client.
 */
export const hasClientAccess = async (clientId: string, userRole: UserRole, userId: string): Promise<boolean> => {
  if (!clientId || !userRole || !userId) {
    return false;
  }
  
  // Admin and Financial roles have access to all clients
  if (userRole === UserRole.ADMIN || userRole === UserRole.FINANCIAL) {
    return true;
  }
  
  // For partners, check if they manage this client
  if (userRole === UserRole.PARTNER) {
    const { data, error } = await supabase
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .eq('partner_id', userId)
      .single();
      
    if (error || !data) {
      console.error("Error checking partner access to client:", error);
      return false;
    }
    
    return true;
  }
  
  // For clients, check if they have access to this client through user_client_access
  if (userRole === UserRole.CLIENT) {
    const { data, error } = await supabase
      .from('user_client_access')
      .select('client_id')
      .eq('user_id', userId)
      .eq('client_id', clientId)
      .single();
      
    if (error || !data) {
      console.error("Error checking client access:", error);
      return false;
    }
    
    return true;
  }
  
  // Default: no access
  return false;
};

/**
 * Get client IDs that the current user has access to
 */
export const getAccessibleClientIds = async (userRole: UserRole, userId: string): Promise<string[]> => {
  if (!userRole || !userId) {
    return [];
  }
  
  // Admin and Financial roles have access to all clients
  if (userRole === UserRole.ADMIN || userRole === UserRole.FINANCIAL) {
    const { data, error } = await supabase
      .from('clients')
      .select('id');
      
    if (error || !data) {
      console.error("Error fetching all client IDs:", error);
      return [];
    }
    
    return data.map(client => client.id);
  }
  
  // For partners, get clients they manage
  if (userRole === UserRole.PARTNER) {
    const { data, error } = await supabase
      .from('clients')
      .select('id')
      .eq('partner_id', userId);
      
    if (error || !data) {
      console.error("Error fetching partner client IDs:", error);
      return [];
    }
    
    return data.map(client => client.id);
  }
  
  // For clients, get clients they have access to through user_client_access
  if (userRole === UserRole.CLIENT) {
    const { data, error } = await supabase
      .from('user_client_access')
      .select('client_id')
      .eq('user_id', userId);
      
    if (error || !data) {
      console.error("Error fetching client access IDs:", error);
      return [];
    }
    
    return data.map(access => access.client_id);
  }
  
  // Default: no access
  return [];
};

/**
 * Filter a query by client IDs accessible to the current user
 */
export const filterByAccessibleClients = async (
  userRole: UserRole, 
  userId: string,
  query: any, // PostgrestFilterBuilder
  clientIdColumn: string = 'client_id'
) => {
  if (!userRole || !userId) {
    // Return empty query if no role or user ID
    return query.filter('id', 'eq', '00000000-0000-0000-0000-000000000000'); // Guaranteed no results
  }
  
  // Admin and Financial can see all, no filtering needed
  if (userRole === UserRole.ADMIN || userRole === UserRole.FINANCIAL) {
    return query;
  }
  
  // For all other roles, filter by accessible clients
  const clientIds = await getAccessibleClientIds(userRole, userId);
  
  if (clientIds.length === 0) {
    // Return empty query if no accessible clients
    return query.filter('id', 'eq', '00000000-0000-0000-0000-000000000000'); // Guaranteed no results
  }
  
  // Filter by client IDs
  return query.in(clientIdColumn, clientIds);
};
