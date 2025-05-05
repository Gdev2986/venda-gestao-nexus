import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus, PaymentType, PixKey } from "@/types";

const ClientPayments = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [clientBalance, setClientBalance] = useState(15000);
  const [paymentRequests, setPaymentRequests] = useState<Payment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(false);
  
  // Fetch payment requests from Supabase
  useEffect(() => {
    const fetchPaymentRequests = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('payment_requests')
          .select(`
            *,
            pix_key:pix_key_id (
              id,
              key,
              type,
              name
            ),
            client:client_id (
              id,
              business_name,
              email
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map the data to our Payment interface
        const formattedData = (data || []).map((item) => ({
          id: item.id,
          amount: item.amount,
          status: item.status as PaymentStatus,
          created_at: item.created_at,
          updated_at: item.updated_at,
          client_id: item.client_id,
          description: item.description || "",
          payment_type: PaymentType.PIX,
          receipt_url: item.receipt_url,
          rejection_reason: item.rejection_reason,
          approved_at: item.approved_at,
          pix_key: item.pix_key ? {
            id: item.pix_key.id,
            key: item.pix_key.key,
            type: item.pix_key.type,
            owner_name: item.pix_key.name
          } : undefined
        }));
        
        setPaymentRequests(formattedData);
      } catch (err) {
        console.error('Error fetching payment requests:', err);
        toast({
          variant: "destructive",
          title: "Erro ao carregar pagamentos",
          description: "Não foi possível carregar as solicitações de pagamento."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentRequests();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('client_payment_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_requests' 
      }, () => {
        fetchPaymentRequests();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Fetch PIX keys
  useEffect(() => {
    const fetchPixKeys = async () => {
      setIsLoadingPixKeys(true);
      
      try {
        const { data, error } = await supabase
          .from('pix_keys')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedKeys = (data || []).map(key => ({
          id: key.id,
          user_id: key.user_id,
          key_type: key.type,
          type: key.type,
          key: key.key,
          owner_name: key.name,
          name: key.name,
          isDefault: key.is_default,
          is_active: true,
          created_at: key.created_at,
          updated_at: key.updated_at,
          bank_name: "Banco"
        }));
        
        setPixKeys(formattedKeys);
      } catch (err) {
        console.error('Error fetching PIX keys:', err);
        toast({
          variant: "destructive",
          title: "Erro ao carregar chaves PIX",
          description: "Não foi possível carregar suas chaves PIX."
        });
      } finally {
        setIsLoadingPixKeys(false);
      }
    };
    
    fetchPixKeys();
  }, [toast]);

  // Handler for requesting a payment
  const handleRequestPayment = async (
    amount: string,
    description: string,
    pixKeyId: string | null,
    documentFile?: File | null
  ) => {
    if (!pixKeyId) {
      toast({
        variant: "destructive",
        title: "Chave PIX não selecionada",
        description: "Por favor, selecione uma chave PIX para continuar.",
      });
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    setIsLoading(true);
    
    try {
      // Store document if provided
      let documentUrl = null;
      if (documentFile) {
        const fileName = `payment_doc_${Date.now()}.${documentFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_receipts')
          .upload(fileName, documentFile);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('payment_receipts')
          .getPublicUrl(fileName);
          
        documentUrl = urlData.publicUrl;
      }
      
      // Create payment request in Supabase
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          amount: parsedAmount,
          status: PaymentStatus.PENDING,
          pix_key_id: pixKeyId,
          client_id: (await supabase.from('clients').select('id').limit(1)).data?.[0]?.id,
          description: description || 'Solicitação de pagamento via PIX',
          receipt_url: documentUrl
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso",
      });
      
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error creating payment request:', err);
      toast({
        variant: "destructive",
        title: "Erro ao criar solicitação",
        description: "Não foi possível criar a solicitação de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <SendIcon className="h-4 w-4 mr-2" />
          Solicitar Pagamento
        </Button>
      </div>
      
      <BalanceCards clientBalance={clientBalance} />
      
      <PaymentHistoryCard 
        payments={paymentRequests} 
        isLoading={isLoading} 
      />
      
      <PaymentRequestDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clientBalance={clientBalance}
        pixKeys={pixKeys}
        isLoadingPixKeys={isLoadingPixKeys}
        onRequestPayment={handleRequestPayment}
      />
    </div>
  );
};

export default ClientPayments;
