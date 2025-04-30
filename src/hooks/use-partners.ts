
import { useState } from "react";
import { supabase } from "../integrations/supabase/client";

// Updated Partner type to match the database schema
export type Partner = {
  id: string;
  company_name: string;
  commission_rate: number;
  contact_name: string;
  email: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
};

export type FilterValues = {
  company_name?: string;
  contact_name?: string;
  email?: string;
  commission_rate?: number;
};

const usePartners = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);

  // Filter partners based on provided criteria
  const filterPartners = (partners: Partner[], filters: Partial<FilterValues>) => {
    return partners.filter((partner) => {
      const matchCompanyName = !filters.company_name || 
        partner.company_name.toLowerCase().includes(filters.company_name.toLowerCase());
      
      const matchContactName = !filters.contact_name || 
        partner.contact_name.toLowerCase().includes(filters.contact_name.toLowerCase());
      
      const matchEmail = !filters.email || 
        partner.email.toLowerCase().includes(filters.email.toLowerCase());
      
      const matchCommissionRate = 
        filters.commission_rate === undefined || 
        partner.commission_rate === filters.commission_rate;
      
      return matchCompanyName && matchContactName && matchEmail && matchCommissionRate;
    });
  };

  // Fetch all partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("partners")
        .select("*");
        
      if (error) throw new Error(error.message);
      
      const formattedPartners = data.map((item) => ({
        id: item.id,
        company_name: item.company_name,
        contact_name: item.contact_name,
        email: item.email,
        phone: item.phone,
        commission_rate: item.commission_rate,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })) as Partner[];
      
      setPartners(formattedPartners);
      setFilteredPartners(formattedPartners);
      
      return formattedPartners;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch partners";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new partner
  const createPartner = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("partners")
        .insert({
          company_name: partnerData.company_name,
          contact_name: partnerData.contact_name,
          email: partnerData.email,
          phone: partnerData.phone,
          commission_rate: partnerData.commission_rate,
        })
        .select();
      
      if (error) throw new Error(error.message);
      
      const newPartner = {
        id: data[0].id,
        company_name: data[0].company_name,
        contact_name: data[0].contact_name,
        email: data[0].email,
        phone: data[0].phone,
        commission_rate: data[0].commission_rate,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at,
      } as Partner;
      
      setPartners((prev) => [...prev, newPartner]);
      setFilteredPartners((prev) => [...prev, newPartner]);
      
      return newPartner;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create partner";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing partner
  const updatePartner = async (partnerId: string, partnerData: Partial<Omit<Partner, "id" | "created_at" | "updated_at">>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("partners")
        .update({
          company_name: partnerData.company_name,
          contact_name: partnerData.contact_name,
          email: partnerData.email,
          phone: partnerData.phone,
          commission_rate: partnerData.commission_rate,
        })
        .eq("id", partnerId)
        .select();
      
      if (error) throw new Error(error.message);
      
      const updatedPartner = {
        id: data[0].id,
        company_name: data[0].company_name,
        contact_name: data[0].contact_name,
        email: data[0].email,
        phone: data[0].phone,
        commission_rate: data[0].commission_rate,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at,
      } as Partner;
      
      setPartners((prev) => 
        prev.map((p) => (p.id === partnerId ? updatedPartner : p))
      );
      
      setFilteredPartners((prev) => 
        prev.map((p) => (p.id === partnerId ? updatedPartner : p))
      );
      
      return updatedPartner;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update partner";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a partner
  const deletePartner = async (partnerId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", partnerId);
      
      if (error) throw new Error(error.message);
      
      setPartners((prev) => prev.filter((p) => p.id !== partnerId));
      setFilteredPartners((prev) => prev.filter((p) => p.id !== partnerId));
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete partner";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to the partners list
  const applyFilter = (filters: Partial<FilterValues>) => {
    const filtered = filterPartners(partners, filters);
    setFilteredPartners(filtered);
    return filtered;
  };

  return {
    loading,
    error,
    partners,
    filteredPartners,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    applyFilter,
  };
};

export default usePartners;
