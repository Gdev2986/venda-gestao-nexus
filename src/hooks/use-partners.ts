
import { useState, useEffect, useCallback } from "react";
import { Partner } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Sample data to start with
const INITIAL_PARTNERS: Partner[] = [
  {
    id: "1",
    company_name: "Tech Solutions Ltda",
    business_name: "TechSol",
    contact_name: "João Silva",
    email: "joao@techsol.com",
    phone: "(11) 99876-5432",
    commission_rate: 10,
    address: "Av. Paulista, 1000",
    created_at: "2023-01-15T10:30:00Z",
    updated_at: "2023-01-15T10:30:00Z",
    total_sales: 15000,
    total_commission: 1500
  },
  {
    id: "2",
    company_name: "Consultoria Express",
    business_name: "ConsultEx",
    contact_name: "Maria Santos",
    email: "maria@consultex.com",
    phone: "(11) 98765-4321",
    commission_rate: 15,
    address: "Rua Augusta, 500",
    created_at: "2023-02-20T14:45:00Z",
    updated_at: "2023-02-20T14:45:00Z",
    total_sales: 22000,
    total_commission: 3300
  },
  {
    id: "3",
    company_name: "Inovação Digital",
    business_name: "InoDigi",
    contact_name: "Carlos Mendes",
    email: "carlos@inodigi.com",
    phone: "(11) 97654-3210",
    commission_rate: 12,
    address: "Av. Faria Lima, 2000",
    created_at: "2023-03-10T09:15:00Z",
    updated_at: "2023-03-10T09:15:00Z",
    total_sales: 18500,
    total_commission: 2220
  }
];

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  // Fetch partners from the database
  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('partners')
        .select('*');

      if (error) throw error;

      // If we have data, format and use it; otherwise use mock data
      if (data && data.length > 0) {
        const formattedPartners: Partner[] = data.map(p => ({
          id: p.id,
          company_name: p.company_name,
          business_name: p.business_name || p.company_name,
          contact_name: p.contact_name || "",
          email: p.email || "",
          phone: p.phone || "",
          commission_rate: p.commission_rate || 0,
          address: p.address || "",
          created_at: p.created_at,
          updated_at: p.updated_at,
          total_sales: p.total_sales || 0,
          total_commission: p.total_commission || 0
        }));

        setPartners(formattedPartners);
        setFilteredPartners(formattedPartners);
      } else {
        // Use mock data if no partners found
        setPartners(INITIAL_PARTNERS);
        setFilteredPartners(INITIAL_PARTNERS);
      }
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError("Falha ao carregar parceiros. Por favor, tente novamente.");
      
      // Use mock data in case of error
      setPartners(INITIAL_PARTNERS);
      setFilteredPartners(INITIAL_PARTNERS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter partners based on search term and commission range
  const filterPartners = useCallback((searchTerm = "", commissionRange?: [number, number]) => {
    let filtered = [...partners];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(partner => 
        partner.company_name.toLowerCase().includes(term) ||
        (partner.business_name && partner.business_name.toLowerCase().includes(term)) ||
        (partner.contact_name && partner.contact_name.toLowerCase().includes(term)) ||
        (partner.email && partner.email.toLowerCase().includes(term)) ||
        (partner.phone && partner.phone.includes(term))
      );
    }

    // Filter by commission range
    if (commissionRange) {
      const [min, max] = commissionRange;
      filtered = filtered.filter(partner => 
        partner.commission_rate >= min && partner.commission_rate <= max
      );
    }

    setFilteredPartners(filtered);
  }, [partners]);

  // Create a new partner
  const createPartner = async (partnerData: Omit<Partner, "id" | "created_at" | "updated_at">) => {
    try {
      // Add required fields with default values if they're not provided
      const fullPartnerData = {
        ...partnerData,
        company_name: partnerData.company_name,
        business_name: partnerData.business_name || partnerData.company_name,
        commission_rate: partnerData.commission_rate || 0,
        address: partnerData.address || "",
        total_sales: partnerData.total_sales || 0,
        total_commission: partnerData.total_commission || 0
      };

      // Insert the partner data into Supabase
      const { data, error } = await supabase
        .from('partners')
        .insert([fullPartnerData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Add the new partner to the state
        const newPartner = data[0] as Partner;
        setPartners(prev => [...prev, newPartner]);
        setFilteredPartners(prev => [...prev, newPartner]);
        
        toast({
          title: "Parceiro criado",
          description: "O parceiro foi criado com sucesso."
        });
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error creating partner:", err);
      
      toast({
        variant: "destructive",
        title: "Erro ao criar parceiro",
        description: "Não foi possível criar o parceiro. Tente novamente."
      });
      
      return false;
    }
  };

  // Update an existing partner
  const updatePartner = async (partnerId: string, partnerData: Partial<Partner>) => {
    try {
      // Update the partner in Supabase
      const { error } = await supabase
        .from('partners')
        .update(partnerData)
        .eq('id', partnerId);

      if (error) throw error;

      // Update the partner in the state
      const updatedPartners = partners.map(p => 
        p.id === partnerId ? { ...p, ...partnerData, updated_at: new Date().toISOString() } : p
      );
      
      setPartners(updatedPartners);
      setFilteredPartners(prevFiltered => {
        // Only update in filtered list if the partner exists there
        const partnerExists = prevFiltered.some(p => p.id === partnerId);
        if (partnerExists) {
          return prevFiltered.map(p => 
            p.id === partnerId ? { ...p, ...partnerData, updated_at: new Date().toISOString() } : p
          );
        }
        return prevFiltered;
      });

      toast({
        title: "Parceiro atualizado",
        description: "As informações do parceiro foram atualizadas com sucesso."
      });
      
      return true;
    } catch (err) {
      console.error("Error updating partner:", err);
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar parceiro",
        description: "Não foi possível atualizar as informações do parceiro."
      });
      
      return false;
    }
  };

  // Delete a partner
  const deletePartner = async (partnerId: string) => {
    try {
      // Delete the partner from Supabase
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);

      if (error) throw error;

      // Remove the partner from the state
      setPartners(prev => prev.filter(p => p.id !== partnerId));
      setFilteredPartners(prev => prev.filter(p => p.id !== partnerId));

      toast({
        title: "Parceiro excluído",
        description: "O parceiro foi excluído com sucesso."
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting partner:", err);
      
      toast({
        variant: "destructive",
        title: "Erro ao excluir parceiro",
        description: "Não foi possível excluir o parceiro."
      });
      
      return false;
    }
  };

  // Load partners on component mount
  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return {
    partners: filteredPartners,
    allPartners: partners,
    loading,
    error,
    refreshPartners: fetchPartners,
    filterPartners,
    createPartner,
    updatePartner,
    deletePartner
  };
};
