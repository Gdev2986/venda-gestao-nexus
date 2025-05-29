
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface PartnerCommission {
  id: string;
  sale_id: string;
  amount: number;
  is_paid: boolean;
  created_at: string;
}

interface CommissionSummary {
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  recentCommissions: PartnerCommission[];
}

export const usePartnerCommissions = () => {
  const [summary, setSummary] = useState<CommissionSummary>({
    totalCommission: 0,
    paidCommission: 0,
    pendingCommission: 0,
    recentCommissions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading commission data
    setTimeout(() => {
      setSummary({
        totalCommission: 25000,
        paidCommission: 15000,
        pendingCommission: 10000,
        recentCommissions: [
          {
            id: "1",
            sale_id: "sale-123",
            amount: 150,
            is_paid: true,
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            sale_id: "sale-124",
            amount: 200,
            is_paid: false,
            created_at: new Date().toISOString()
          }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const requestPayment = async (amount: number, pixKeyId: string, description?: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso.",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao solicitar pagamento. Tente novamente.",
      });
      
      return false;
    }
  };

  return {
    summary,
    isLoading,
    requestPayment
  };
};
