
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { SupabaseClientRow } from "@/types/client";
import { mockClients, getMockClientById } from "@/data/mockClients";
import { v4 as uuidv4 } from "uuid";

// Get all clients
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*");

    if (error) throw error;

    // Safely type cast the data - if we're in development and no DB, use mockClients
    const clients = (data || mockClients) as unknown as Client[];
    
    return clients;
  } catch (err) {
    console.error("Error fetching clients:", err);
    return mockClients; // Return mock data as fallback
  }
};

// Get a client by ID
export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as unknown as Client;
  } catch (err) {
    console.error("Error fetching client by ID:", err);
    // Return mock client as fallback
    return getMockClientById(id);
  }
};

// Create a new client
export const createClient = async (clientData: Omit<Client, "id" | "created_at" | "updated_at" | "status">): Promise<Client> => {
  try {
    // Create a new client object with an ID
    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // In a real app, this would insert into Supabase
    const { data, error } = await supabase
      .from("clients")
      .insert([{
        id: newClient.id,
        business_name: newClient.business_name,
        document: newClient.document,
        // Add other fields as needed based on your Supabase schema
      } as SupabaseClientRow]);

    if (error) throw error;

    return newClient;
  } catch (err) {
    console.error("Error creating client:", err);
    // For development, just return the client with a fake ID
    const mockClient: Client = {
      ...clientData,
      id: uuidv4(),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return mockClient;
  }
};

// Update a client
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    // Update the client in Supabase
    const { error } = await supabase
      .from("clients")
      .update({
        business_name: clientData.business_name,
        document: clientData.document,
        // Add other fields as needed based on your Supabase schema
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    // Get the updated client
    return fetchClientById(id);
  } catch (err) {
    console.error("Error updating client:", err);
    // For development, return the updated mock client
    const clientIndex = mockClients.findIndex(client => client.id === id);
    if (clientIndex !== -1) {
      const updatedClient = {
        ...mockClients[clientIndex],
        ...clientData,
        updated_at: new Date().toISOString(),
      };
      mockClients[clientIndex] = updatedClient;
      return updatedClient;
    }
    return null;
  }
};

// Delete a client
export const deleteClientById = async (id: string): Promise<boolean> => {
  try {
    // Delete the client from Supabase
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (err) {
    console.error("Error deleting client:", err);
    return false;
  }
};
