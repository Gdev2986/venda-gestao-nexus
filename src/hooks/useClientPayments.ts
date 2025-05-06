
import { useState, useEffect, useCallback } from "react";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PixKey } from "@/types";

export function useClientPayments(clientId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clientBalance, setClientBalance] = useState<number>(15000); // Valor padrão
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(false);
  const { toast } = useToast();

  // Função para carregar os pagamentos do cliente
  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      // Aqui seria feita uma chamada real para a API para buscar os pagamentos do cliente
      // Simulando dados para este exemplo
      setTimeout(() => {
        const mockPayments: Payment[] = [
          {
            id: "1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            amount: 1000,
            status: PaymentStatus.PENDING,
            client_id: clientId,
            client_name: "Cliente Demo",
            payment_type: PaymentType.PIX,
            rejection_reason: null
          },
          {
            id: "2",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            amount: 2000,
            status: PaymentStatus.APPROVED,
            client_id: clientId,
            client_name: "Cliente Demo",
            payment_type: PaymentType.PIX,
            rejection_reason: null,
            approved_at: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        setPayments(mockPayments);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os pagamentos"
      });
      setIsLoading(false);
    }
  }, [clientId, toast]);

  // Carregar pagamentos na montagem do componente
  useEffect(() => {
    loadPayments();
    
    // Carregar chaves PIX do cliente
    setIsLoadingPixKeys(true);
    setTimeout(() => {
      setPixKeys([
        {
          id: "pix1",
          key: "exemplo@email.com",
          type: "EMAIL",
          key_type: "EMAIL",
          name: "Cliente Demo",
          owner_name: "Cliente Demo",
          user_id: "user1",
          isDefault: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bank_name: "Banco Demo"
        },
        {
          id: "pix2",
          key: "11999999999",
          type: "PHONE",
          key_type: "PHONE",
          name: "Cliente Demo",
          owner_name: "Cliente Demo",
          user_id: "user1",
          isDefault: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bank_name: "Banco Demo"
        }
      ]);
      setIsLoadingPixKeys(false);
    }, 500);
  }, [clientId, loadPayments]);

  // Função para solicitar um pagamento
  const handleRequestPayment = async (
    amount: number,
    pixKeyId: string | null,
    description?: string
  ) => {
    try {
      // Simulação de criação de pagamento
      const newPayment: Payment = {
        id: `new-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        amount,
        status: PaymentStatus.PENDING,
        client_id: clientId,
        client_name: "Cliente Demo",
        payment_type: PaymentType.PIX,
        rejection_reason: null,
        description
      };
      
      setPayments(prevPayments => [newPayment, ...prevPayments]);
      
      toast({
        title: "Pagamento solicitado",
        description: `Solicitação de pagamento de R$ ${amount.toFixed(2)} enviada com sucesso`
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao solicitar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a solicitação de pagamento"
      });
      return false;
    }
  };

  return {
    isLoading,
    payments,
    clientBalance,
    pixKeys,
    isLoadingPixKeys,
    handleRequestPayment,
    loadPayments // Exportando a função de recarga para uso com o usePaymentSubscription
  };
}
