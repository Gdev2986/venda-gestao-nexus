
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types";

// Fetch all partners
export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*");
    
    if (error) throw error;
    
    return data as Partner[];
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
};

// Fetch a single partner by ID
export const fetchPartnerById = async (id: string): Promise<Partner | null> => {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    return data as Partner;
  } catch (error) {
    console.error("Error fetching partner:", error);
    return null;
  }
};

// Create a new partner - fixed to match expected parameters by Supabase
export const createPartner = async (partnerData: Partial<Partner>): Promise<Partner | null> => {
  try {
    // Make sure company_name is provided as it's required
    if (!partnerData.company_name) {
      throw new Error("Company name is required");
    }
    
    // Only passing the required fields to match the Supabase schema
    const { data, error } = await supabase
      .from("partners")
      .insert({
        company_name: partnerData.company_name,
        commission_rate: partnerData.commission_rate || 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Partner;
  } catch (error) {
    console.error("Error creating partner:", error);
    return null;
  }
};

// Update an existing partner
export const updatePartner = async (id: string, updates: Partial<Partner>): Promise<Partner | null> => {
  try {
    const { data, error } = await supabase
      .from("partners")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Partner;
  } catch (error) {
    console.error("Error updating partner:", error);
    return null;
  }
};

// Delete a partner
export const deletePartner = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting partner:", error);
    return false;
  }
};
