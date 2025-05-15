
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Partner, UserRole } from '@/types';
import { useAuth } from '@/hooks/use-auth'; // Using correct import
import { useToast } from '@/hooks/use-toast';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth(); // Using the correct hook
  const { toast } = useToast();

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setPartners(data || []);
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error fetching partners",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const getUserRole = (): UserRole | undefined => {
    return user?.user_metadata?.role;
  };

  const createPartner = async (partner: Omit<Partner, 'id'>) => {
    setLoading(true);
    try {
      // Fix: Properly insert a single partner object, not an array
      const { data, error } = await supabase
        .from('partners')
        .insert(partner) // Send just the object
        .select();

      if (error) {
        throw new Error(error.message);
      }

      setPartners(prevPartners => [...prevPartners, data[0]]);
      toast({
        title: "Partner created",
        description: "Partner created successfully.",
      });
      
      return true; // Return a boolean to indicate success
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error creating partner",
        description: error.message,
        variant: "destructive",
      });
      return false; // Return a boolean to indicate failure
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (id: string, updates: Partial<Partner>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw new Error(error.message);
      }

      setPartners(prevPartners =>
        prevPartners.map(partner => (partner.id === id ? { ...partner, ...data[0] } : partner))
      );
      toast({
        title: "Partner updated",
        description: "Partner updated successfully.",
      });
      
      return true; // Return a boolean to indicate success
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error updating partner",
        description: error.message,
        variant: "destructive",
      });
      return false; // Return a boolean to indicate failure
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setPartners(prevPartners => prevPartners.filter(partner => partner.id !== id));
      toast({
        title: "Partner deleted",
        description: "Partner deleted successfully.",
      });
      
      return true; // Return a boolean to indicate success
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error deleting partner",
        description: error.message,
        variant: "destructive",
      });
      return false; // Return a boolean to indicate failure
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = (): boolean => {
    return user?.user_metadata?.role === UserRole.ADMIN;
  };

  const isFinancial = (): boolean => {
    return user?.user_metadata?.role === UserRole.FINANCIAL;
  };

  return {
    partners,
    loading,
    error,
    getUserRole,
    createPartner,
    updatePartner,
    deletePartner,
    isAdmin,
    isFinancial,
    filterPartners: (filters: any) => {
      // Implement filtering logic here
      if (!filters || Object.keys(filters).length === 0) {
        return partners;
      }
      
      return partners.filter(partner => {
        let match = true;
        
        if (filters.name && partner.company_name) {
          match = match && partner.company_name.toLowerCase().includes(filters.name.toLowerCase());
        }
        
        // Add more filter conditions as needed
        
        return match;
      });
    }
  };
};
