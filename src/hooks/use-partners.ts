
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the Partner interface based on the actual database schema
interface Partner {
  id: string;
  company_name: string;
  commission_rate: number;
  created_at?: string;
  updated_at?: string;
}

interface PartnerFilterOptions {
  searchTerm?: string;
}

export const usePartners = (options?: PartnerFilterOptions) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be a Supabase call
      // For now we're using mock data that matches the schema
      const mockPartners: Partner[] = [
        {
          id: '1',
          company_name: 'Distribuidor ABC',
          commission_rate: 20,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          company_name: 'Representante XYZ',
          commission_rate: 15,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          company_name: 'Agente LTDA',
          commission_rate: 18,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      // Apply search filter if provided
      let filteredPartners = [...mockPartners];
      if (options?.searchTerm) {
        const searchLower = options.searchTerm.toLowerCase();
        filteredPartners = filteredPartners.filter(partner => 
          partner.company_name.toLowerCase().includes(searchLower)
        );
      }

      setPartners(filteredPartners);
    } catch (err: any) {
      console.error('Error fetching partners:', err);
      setError(err.message || 'An error occurred while fetching partners');
      
      toast({
        title: 'Error',
        description: 'Failed to load partners',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [options?.searchTerm, toast]);

  // Function to create a new partner
  const createPartner = async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Generate a unique ID (in a real app, Supabase would do this)
      const newId = `partner-${Date.now()}`;
      
      const newPartner: Partner = {
        id: newId,
        ...partnerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // For a mock implementation, just add to the state
      setPartners(prev => [...prev, newPartner]);
      
      toast({
        title: 'Success',
        description: 'Partner created successfully',
      });
      
      return newPartner;
    } catch (err: any) {
      console.error('Error creating partner:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to create partner',
        variant: 'destructive',
      });
      
      throw err;
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return {
    partners,
    isLoading,
    error,
    refetch: fetchPartners,
    createPartner,
  };
};
