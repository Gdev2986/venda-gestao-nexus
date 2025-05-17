
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpCircle, 
  FilePlus, 
  PlusCircle, 
  SendIcon 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentStatus, PaymentType } from "@/types/enums";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { BoletoRequestDialog } from "@/components/payments/BoletoRequestDialog";
import { TedRequestDialog } from "@/components/payments/TedRequestDialog";
import { PaymentRequestTable } from "@/components/payments/PaymentRequestTable";
import { formatCurrency } from "@/lib/utils";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";

const UserPayments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [clientBalance, setClientBalance] = useState(0);
  const [isPixDialogOpen, setIsPixDialogOpen] = useState(false);
  const [isBoletoDialogOpen, setIsBoletoDialogOpen] = useState(false);
  const [isTedDialogOpen, setIsTedDialogOpen] = useState(false);
  const [pixKeys, setPixKeys] = useState([]);
  const [isLoadingPixKeys, setIsLoadingPixKeys] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch client data and ID
  const fetchClientData = async () => {
    if (!user) return;
    
    try {
      const { data: clientAccessData, error: clientAccessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      if (clientAccessError || !clientAccessData) {
        console.error("Erro ao buscar acesso do cliente:", clientAccessError);
        return;
      }
      
      setClientId(clientAccessData.client_id);
      
      // Fetch client balance
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('balance, business_name')
        .eq('id', clientAccessData.client_id)
        .single();
      
      if (clientError) {
        console.error("Erro ao buscar dados do cliente:", clientError);
      } else if (clientData) {
        setClientBalance(clientData.balance || 0);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
    }
  };
  
  // Fetch payment requests
  const fetchPayments = async () => {
    if (!clientId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`
          id,
          amount,
          description,
          status,
          created_at,
          updated_at,
          rejection_reason,
          receipt_url,
          pix_key_id,
          client_id,
          payment_type,
          document_url,
          due_date,
          bank_info,
          pix_key:pix_keys(id, key, type, name)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPayments(data || []);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as solicitações de pagamento."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch pix keys
  const fetchPixKeys = async () => {
    if (!user) return;
    
    setIsLoadingPixKeys(true);
    try {
      const { data, error } = await supabase
        .from('pix_keys')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setPixKeys(data || []);
    } catch (error) {
      console.error("Erro ao buscar chaves PIX:", error);
    } finally {
      setIsLoadingPixKeys(false);
    }
  };
  
  // Handle payment request (PIX)
  const handleRequestPayment = async (amount: number, pixKeyId: string, description?: string) => {
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível identificar o cliente"
      });
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          amount,
          pix_key_id: pixKeyId,
          client_id: clientId,
          description: description || "Solicitação de pagamento via PIX",
          status: "PENDING", // Using string literal to match database enum
          payment_type: PaymentType.PIX
        });
      
      if (error) throw error;
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento PIX foi enviada com sucesso"
      });
      
      setIsPixDialogOpen(false);
      fetchPayments();
      return true;
    } catch (error) {
      console.error("Erro ao solicitar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao solicitar o pagamento"
      });
      return false;
    }
  };
  
  // Handle boleto request
  const handleRequestBoleto = async (amount: number, dueDate: string, description?: string, documentFile?: File) => {
    if (!clientId) return false;
    
    try {
      let documentUrl = null;
      
      // Upload boleto document if provided
      if (documentFile) {
        const fileName = `boletos/${clientId}/${Date.now()}-${documentFile.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment-documents")
          .upload(fileName, documentFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from("payment-documents")
          .getPublicUrl(fileName);
          
        documentUrl = data.publicUrl;
      }
      
      // Create payment request
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          amount,
          client_id: clientId,
          description: description || "Solicitação de pagamento via Boleto",
          status: "PENDING", // Using string literal to match database enum
          payment_type: PaymentType.BOLETO,
          document_url: documentUrl,
          due_date: dueDate
        });
      
      if (error) throw error;
      
      toast({
        title: "Boleto registrado",
        description: "Seu boleto foi registrado com sucesso"
      });
      
      setIsBoletoDialogOpen(false);
      fetchPayments();
      return true;
    } catch (error) {
      console.error("Erro ao registrar boleto:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao registrar o boleto"
      });
      return false;
    }
  };
  
  // Handle TED request
  const handleRequestTED = async (amount: number, bankInfo: any, description?: string) => {
    if (!clientId) return false;
    
    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          amount,
          client_id: clientId,
          description: description || "Solicitação de pagamento via TED",
          status: "PENDING", // Using string literal to match database enum
          payment_type: PaymentType.TED,
          bank_info: bankInfo
        });
      
      if (error) throw error;
      
      toast({
        title: "Solicitação TED enviada",
        description: "Sua solicitação de TED foi enviada com sucesso"
      });
      
      setIsTedDialogOpen(false);
      fetchPayments();
      return true;
    } catch (error) {
      console.error("Erro ao solicitar TED:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao solicitar o TED"
      });
      return false;
    }
  };
  
  // Effect to load initial data
  useEffect(() => {
    fetchClientData();
    fetchPixKeys();
  }, [user]);
  
  // Effect to load payments when clientId is available
  useEffect(() => {
    if (clientId) {
      fetchPayments();
    }
  }, [clientId]);
  
  // Set up real-time subscription
  usePaymentSubscription(fetchPayments, {
    notifyUser: true,
    filterByClientId: clientId
  });
  
  // Filter payments by tab
  const filteredPayments = payments.filter(payment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return payment.status === PaymentStatus.PENDING;
    if (activeTab === 'processing') return payment.status === PaymentStatus.PROCESSING;
    if (activeTab === 'approved') return payment.status === PaymentStatus.APPROVED;
    if (activeTab === 'rejected') return payment.status === PaymentStatus.REJECTED;
    if (activeTab === 'paid') return payment.status === PaymentStatus.PAID;
    return true;
  });

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie suas solicitações de pagamento</p>
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0 space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Solicitar Pagamento
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsPixDialogOpen(true)}>
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Via PIX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTedDialogOpen(true)}>
                <SendIcon className="mr-2 h-4 w-4" />
                Via TED/DOC
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsBoletoDialogOpen(true)}>
                <FilePlus className="mr-2 h-4 w-4" />
                Via Boleto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <BalanceCards clientBalance={clientBalance} />
      
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="processing">Em Processamento</TabsTrigger>
              <TabsTrigger value="approved">Aprovadas</TabsTrigger>
              <TabsTrigger value="rejected">Recusadas</TabsTrigger>
              <TabsTrigger value="paid">Pagas</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <PaymentRequestTable 
                payments={filteredPayments} 
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Diálogo de solicitação de pagamento PIX */}
      <PaymentRequestDialog 
        isOpen={isPixDialogOpen}
        onOpenChange={setIsPixDialogOpen}
        clientBalance={clientBalance}
        pixKeys={pixKeys}
        isLoadingPixKeys={isLoadingPixKeys}
        onRequestPayment={handleRequestPayment}
      />
      
      {/* Diálogo de solicitação de boleto */}
      <BoletoRequestDialog
        isOpen={isBoletoDialogOpen}
        onOpenChange={setIsBoletoDialogOpen}
        onRequestBoleto={handleRequestBoleto}
      />
      
      {/* Diálogo de solicitação de TED */}
      <TedRequestDialog
        isOpen={isTedDialogOpen}
        onOpenChange={setIsTedDialogOpen}
        onRequestTED={handleRequestTED}
      />
    </div>
  );
};

export default UserPayments;
