import { useState, useEffect } from 'react';
import { Partner } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setPartners(data || []);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getUserRole = async (userId: string) => {
    if (!user) {
      console.error("No user found");
      return null;
    }

    try {
      setIsLoading(true);
      
      // Replace with the correct function name
      const result = await supabase.rpc('get_user_role', { 
        user_id: user.id 
      });

      if (result.error) {
        throw result.error;
      }

      return result.data;
    } catch (error: any) {
      console.error("Error fetching user role:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createPartner = async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      
      // Use the upsert method with a random uuid for the id
      const { error } = await supabase
        .from('partners')
        .insert({
          ...partnerData,
          id: crypto.randomUUID() // Generate a UUID for the new partner
        });

      if (error) throw error;
      
      await fetchPartners();
      toast({
        title: "Success",
        description: "Partner created successfully"
      });
      return true;
    } catch (error: any) {
      console.error("Error creating partner:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePartner = async (id: string, partnerData: Partner) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('partners')
        .update(partnerData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchPartners();
      toast({
        title: "Success",
        description: "Partner updated successfully"
      });
      return true;
    } catch (error: any) {
      console.error("Error updating partner:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPartners();
      toast({
        title: "Success",
        description: "Partner deleted successfully"
      });
      return true;
    } catch (error: any) {
      console.error("Error deleting partner:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    partners,
    loading,
    error,
    getUserRole,
    createPartner,
    updatePartner,
    deletePartner,
    isLoading
  };
};
