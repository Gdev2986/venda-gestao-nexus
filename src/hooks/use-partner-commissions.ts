
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

interface Sale {
  id: string;
  client_id: string;
  client_name: string;
  date: string;
  gross_amount: number;
  net_amount: number;
  payment_method: string;
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
      // First get partner ID for this user
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (partnerError) {
        throw new Error('Não foi possível encontrar sua conta de parceiro');
      }

      const partnerId = partnerData?.id;

      if (!partnerId) {
        setIsLoading(false);
        return;
      }

      // Fetch commissions with related sale information
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('commissions')
        .select(`
          *,
          sale:sales(
            id, 
            client_id,
            gross_amount,
            net_amount,
            date,
            payment_method
          )
        `)
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (commissionsError) {
        throw commissionsError;
      }

      // Calculate summary
      let total = 0;
      let paid = 0;
      let pending = 0;

      const processedCommissions: Commission[] = commissionsData?.map((commission) => {
        const amount = commission.amount || 0;
        total += amount;
        
        if (commission.is_paid) {
          paid += amount;
        } else {
          pending += amount;
        }

        return {
          id: commission.id,
          partner_id: commission.partner_id,
          amount,
          sale_id: commission.sale_id,
          created_at: commission.created_at,
          updated_at: commission.updated_at,
          is_paid: commission.is_paid || false,
          paid_at: commission.paid_at
        };
      }) || [];

      setCommissions(processedCommissions);
      
      setSummary({
        totalCommission: total,
        paidCommission: paid,
        pendingCommission: pending,
        recentCommissions: processedCommissions.slice(0, 5)
      });
    } catch (err: any) {
      console.error('Error fetching commissions:', err);
      setError(err.message || 'Erro ao carregar comissões');
      
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar suas comissões.',
      });
    } finally {
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
      // Get partner data for this user
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (partnerError) {
        throw new Error('Não foi possível encontrar sua conta de parceiro');
      }

      const partnerId = partnerData?.id;
      
      // Get a client_id associated with this partner
      // This might need to be adjusted based on your database structure
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('partner_id', partnerId)
        .limit(1)
        .single();
        
      if (clientError) {
        throw new Error('Não foi possível encontrar um cliente vinculado a este parceiro');
      }
      
      const clientId = clientData?.id;
      if (!clientId) {
        throw new Error('Sua conta não está vinculada a nenhum cliente');
      }

      // Create payment request
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          client_id: clientId,
          amount,
          pix_key_id: pixKeyId,
          description: description || 'Solicitação de pagamento de comissão',
          status: 'PENDING'
        })
        .select();

      if (error) throw error;

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
