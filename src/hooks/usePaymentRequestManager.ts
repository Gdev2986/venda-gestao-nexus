import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PaymentRequest } from "@/types/payment.types";
import { useAuth } from "@/hooks/use-auth";

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

      setPaymentRequests(data || []);
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
            requestor_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setPaymentRequests((prev) => [data, ...prev]);
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
