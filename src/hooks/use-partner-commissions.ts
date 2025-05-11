
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Commission {
  id: string;
  partner_id: string;
  amount: number;
  sale_id: string;
  created_at: string;
  updated_at: string;
  is_paid: boolean;
  paid_at?: string;
}

interface CommissionSummary {
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  recentCommissions: Commission[];
}

export const usePartnerCommissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary>({
    totalCommission: 0,
    paidCommission: 0,
    pendingCommission: 0,
    recentCommissions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCommissions = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate mock data for demonstration
      setTimeout(() => {
        // Mock commissions data
        const mockCommissions: Commission[] = Array(10).fill(null).map((_, index) => ({
          id: `comm-${index + 1}`,
          partner_id: 'partner-1',
          amount: Math.floor(Math.random() * 500) + 100,
          sale_id: `sale-${index + 1}`,
          created_at: new Date(Date.now() - (index * 86400000)).toISOString(),
          updated_at: new Date(Date.now() - (index * 86400000)).toISOString(),
          is_paid: index > 5,
          paid_at: index > 5 ? new Date(Date.now() - (index - 5) * 86400000).toISOString() : undefined
        }));

        // Calculate summary
        let total = 0;
        let paid = 0;
        let pending = 0;

        mockCommissions.forEach(commission => {
          total += commission.amount;
          if (commission.is_paid) {
            paid += commission.amount;
          } else {
            pending += commission.amount;
          }
        });

        setCommissions(mockCommissions);
        
        setSummary({
          totalCommission: total,
          paidCommission: paid,
          pendingCommission: pending,
          recentCommissions: mockCommissions.slice(0, 5)
        });
        
        setIsLoading(false);
      }, 800);
    } catch (err: any) {
      console.error('Error fetching commissions:', err);
      setError(err.message || 'Erro ao carregar comissões');
      
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar suas comissões.',
      });
      setIsLoading(false);
    }
  }, [user, toast]);

  const requestPayment = async (amount: number, pixKeyId: string, description?: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para solicitar pagamentos.',
      });
      return false;
    }

    try {
      // Simulate API call for demonstration
      toast({
        title: 'Solicitação enviada',
        description: 'Sua solicitação de pagamento foi enviada com sucesso.',
      });

      // Refresh commissions to show updated status
      fetchCommissions();

      return true;
    } catch (err: any) {
      console.error('Error requesting payment:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: err.message || 'Falha ao enviar solicitação de pagamento.',
      });
      
      return false;
    }
  };

  // Fetch commissions on mount or when user changes
  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  return {
    commissions,
    summary,
    isLoading,
    error,
    refresh: fetchCommissions,
    requestPayment
  };
};
