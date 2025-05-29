
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { PaymentStatus } from "@/types/enums";

interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  pix_key_id: string;
  description: string;
  receipt_url: string;
  rejection_reason: string;
  approved_at: string;
  approved_by: string;
}

interface UsePaymentRequestManagerProps {
  clientId?: string;
  initialPaymentRequests?: PaymentRequest[];
}

export const usePaymentRequestManager = ({
  clientId,
  initialPaymentRequests = [],
}: UsePaymentRequestManagerProps = {}) => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(
    initialPaymentRequests
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadPaymentRequests = useCallback(async () => {
    if (!clientId) {
      console.warn("clientId is missing in usePaymentRequestManager");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData: PaymentRequest[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        amount: item.amount,
        status: item.status as PaymentStatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        pix_key_id: item.pix_key_id,
        description: item.description || '',
        receipt_url: item.receipt_url || '',
        rejection_reason: item.rejection_reason || '',
        approved_at: item.approved_at || '',
        approved_by: item.approved_by || ''
      }));

      setPaymentRequests(formattedData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description:
          error.message || "Não foi possível carregar as solicitações de pagamento.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [clientId, toast]);

  const handleRequestPayment = async (
    amount: number,
    pixKeyId: string | undefined
  ) => {
    if (!clientId || !user) {
      console.error(
        "Missing client ID or user in handleRequestPayment:",
        clientId,
        user
      );
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível solicitar o pagamento.",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_requests")
        .insert([
          {
            client_id: clientId,
            amount,
            status: "PENDING",
            pix_key_id: pixKeyId,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const formattedData: PaymentRequest = {
          id: data.id,
          client_id: data.client_id,
          amount: data.amount,
          status: data.status as PaymentStatus,
          created_at: data.created_at,
          updated_at: data.updated_at,
          pix_key_id: data.pix_key_id,
          description: data.description || '',
          receipt_url: data.receipt_url || '',
          rejection_reason: data.rejection_reason || '',
          approved_at: data.approved_at || '',
          approved_by: data.approved_by || ''
        };
        
        setPaymentRequests((prev) => [formattedData, ...prev]);
        toast({
          title: "Solicitação enviada",
          description: "Sua solicitação de pagamento foi enviada com sucesso!",
        });
        setIsDialogOpen(false);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível solicitar o pagamento.",
        });
        return false;
      }
    } catch (error: any) {
      console.error("Error requesting payment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error.message || "Ocorreu um erro ao solicitar o pagamento.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    paymentRequests,
    isDialogOpen,
    isLoading,
    setIsDialogOpen,
    handleRequestPayment,
    loadPaymentRequests,
  };
};
