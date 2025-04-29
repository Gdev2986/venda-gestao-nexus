
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Partner = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  commission_rate: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string;
};

type FilterValues = {
  search: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
};

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateRange: undefined,
  });
  const { toast } = useToast();

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('partners').select('*');

      // Apply search filter if provided
      if (filters.search && filters.search.trim() !== "") {
        query = query.ilike('business_name', `%${filters.search.trim()}%`);
      }

      // Apply date range filter if provided
      if (filters.dateRange?.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }
      
      if (filters.dateRange?.to) {
        // Add one day to include the end date fully
        const endDate = new Date(filters.dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPartners(data || []);
    } catch (error) {
      console.error("Erro ao carregar parceiros:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar parceiros",
        description: "Não foi possível carregar a lista de parceiros.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [filters]);

  const handleFilter = (filterValues: FilterValues) => {
    setFilters(filterValues);
  };

  const deletePartner = async (partnerId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);

      if (error) {
        throw error;
      }

      setPartners(partners.filter(p => p.id !== partnerId));
      toast({
        title: "Parceiro excluído",
        description: "O parceiro foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir parceiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir parceiro",
        description: "Não foi possível excluir o parceiro. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePartner = async (data: Omit<Partner, "id" | "created_at">, partnerId?: string) => {
    setIsLoading(true);
    try {
      if (partnerId) {
        // Update
        const { error } = await supabase
          .from('partners')
          .update(data)
          .eq('id', partnerId);

        if (error) {
          throw error;
        }

        toast({
          title: "Parceiro atualizado",
          description: "O parceiro foi atualizado com sucesso.",
        });
      } else {
        // Create
        const { error } = await supabase
          .from('partners')
          .insert([data]);

        if (error) {
          throw error;
        }

        toast({
          title: "Parceiro cadastrado",
          description: "O parceiro foi cadastrado com sucesso.",
        });
      }
      
      fetchPartners();
      return true;
    } catch (error) {
      console.error("Erro ao salvar parceiro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar parceiro",
        description: "Ocorreu um erro ao salvar o parceiro. Tente novamente mais tarde.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    partners,
    isLoading,
    handleFilter,
    deletePartner,
    savePartner,
    filters,
    refreshPartners: fetchPartners,
  };
};

export type { Partner, FilterValues };
