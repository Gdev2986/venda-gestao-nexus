import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole, PaymentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { WalletIcon, SendIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Payment request type that matches the database schema
interface PaymentRequest {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  description?: string;
  receipt_url?: string;
  client_id: string;
  approved_at?: string;
  approved_by?: string;
  updated_at?: string;
  pix_key_id?: string;
}

const UserPayments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [clientBalance, setClientBalance] = useState(0);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { userRole } = useUserRole();
  const [pixKeyId, setPixKeyId] = useState<string | null>(null);
  
  // Fetch payment requests and client balance
  useEffect(() => {
    if (!user?.id) return;
    
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Get client ID from profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();
          
        if (profileData) {
          // Fetch payment requests
          const { data: requestsData, error: requestsError } = await supabase
            .from("payment_requests")
            .select("*")
            .eq("client_id", profileData.id)
            .order("created_at", { ascending: false });
            
          if (requestsError) throw requestsError;
          
          // Ensure the data matches our PaymentRequest type
          const typedData: PaymentRequest[] = (requestsData || []).map(item => ({
            id: item.id,
            amount: item.amount,
            status: item.status as PaymentStatus,
            created_at: item.created_at,
            description: item.description,
            receipt_url: item.receipt_url,
            client_id: item.client_id,
            approved_at: item.approved_at,
            approved_by: item.approved_by,
            updated_at: item.updated_at,
            pix_key_id: item.pix_key_id
          }));
          
          setPaymentRequests(typedData);
          
          // Calculate client balance (mock for now, in a real app this would be fetched from the server)
          // For example purposes, we'll set a mock balance
          setClientBalance(15000);
          
          // Get default pix key for payment requests
          const { data: pixKeys } = await supabase
            .from("pix_keys")
            .select("id")
            .eq("user_id", user.id)
            .eq("is_default", true)
            .single();
            
          if (pixKeys) {
            setPixKeyId(pixKeys.id);
          } else {
            // If no default key, get any key
            const { data: anyKey } = await supabase
              .from("pix_keys")
              .select("id")
              .eq("user_id", user.id)
              .limit(1)
              .single();
              
            if (anyKey) {
              setPixKeyId(anyKey.id);
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus pagamentos ou saldo.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up real-time subscription for payment requests updates
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_requests', filter: `client_id=eq.${user.id}` }, 
        (payload) => {
          console.log('Change received!', payload);
          // Refresh payment requests
          loadData();
          toast({
            title: 'Atualização de pagamento',
            description: 'Status do pagamento foi atualizado',
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, user?.id]);
  
  // Filter payment requests based on active tab
  const filteredPaymentRequests = paymentRequests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return request.status === PaymentStatus.PENDING;
    if (activeTab === 'approved') return request.status === PaymentStatus.APPROVED;
    if (activeTab === 'paid') return request.status === PaymentStatus.PAID;
    if (activeTab === 'rejected') return request.status === PaymentStatus.REJECTED;
    return true;
  });
  
  // Handler for requesting a payment
  const handleRequestPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Informe um valor válido para solicitação",
      });
      return;
    }
    
    if (!pixKeyId) {
      toast({
        variant: "destructive",
        title: "Chave PIX não encontrada",
        description: "Você precisa cadastrar uma chave PIX antes de solicitar pagamentos",
      });
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    
    if (parsedAmount > clientBalance) {
      toast({
        variant: "destructive",
        title: "Saldo insuficiente",
        description: "O valor solicitado é maior que seu saldo disponível",
      });
      return;
    }
    
    try {
      // Create payment request in database
      const { data: newRequestData, error } = await supabase
        .from("payment_requests")
        .insert({
          amount: parsedAmount,
          description: description || "Solicitação de pagamento",
          client_id: user?.id,
          status: PaymentStatus.PENDING,
          pix_key_id: pixKeyId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Create a properly typed PaymentRequest from the response
      const newRequest: PaymentRequest = {
        id: newRequestData.id,
        amount: newRequestData.amount,
        status: newRequestData.status as PaymentStatus,
        created_at: newRequestData.created_at,
        description: newRequestData.description,
        receipt_url: newRequestData.receipt_url,
        client_id: newRequestData.client_id,
        approved_at: newRequestData.approved_at,
        approved_by: newRequestData.approved_by,
        updated_at: newRequestData.updated_at,
        pix_key_id: newRequestData.pix_key_id
      };
      
      // Add the new payment request to the list
      setPaymentRequests([newRequest, ...paymentRequests]);
      
      // Show success toast
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de pagamento foi enviada com sucesso",
      });
      
      // Close the dialog and reset form
      setIsDialogOpen(false);
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error creating payment request:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a solicitação de pagamento. Tente novamente.",
      });
    }
  };
  
  // Function to display status badge
  const getStatusBadge = (status: PaymentStatus) => {
    let badgeClass = "";
    let statusText = "";
    
    switch (status) {
      case PaymentStatus.PENDING:
        badgeClass = "bg-yellow-100 text-yellow-800";
        statusText = "Pendente";
        break;
      case PaymentStatus.APPROVED:
        badgeClass = "bg-blue-100 text-blue-800";
        statusText = "Aprovado";
        break;
      case PaymentStatus.PAID:
        badgeClass = "bg-green-100 text-green-800";
        statusText = "Pago";
        break;
      case PaymentStatus.REJECTED:
        badgeClass = "bg-red-100 text-red-800";
        statusText = "Rejeitado";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
        statusText = "Desconhecido";
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {statusText}
      </span>
    );
  };
  
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <SendIcon className="h-4 w-4 mr-2" />
          Solicitar Pagamento
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Saldo Disponível</CardTitle>
            <CardDescription>Valor disponível para solicitação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <WalletIcon className="h-8 w-8 mr-2 text-primary" />
              <div className="text-3xl font-bold">{formatCurrency(clientBalance)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Limite de Retirada</p>
                <p className="text-sm text-muted-foreground">Até {formatCurrency(clientBalance)} por solicitação</p>
              </div>
              <div>
                <p className="font-medium">Prazo de Processamento</p>
                <p className="text-sm text-muted-foreground">Até 2 dias úteis após aprovação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Histórico de Solicitações</CardTitle>
          <CardDescription>Acompanhe o status das suas solicitações de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="approved">Aprovados</TabsTrigger>
              <TabsTrigger value="paid">Pagos</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredPaymentRequests.length > 0 ? (
                <div className="space-y-4">
                  {filteredPaymentRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <p className="font-medium">{request.description || `Pagamento #${request.id.substring(0, 8)}`}</p>
                          <p className="text-sm text-muted-foreground">
                            Criado em {new Date(request.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="font-bold mt-1">{formatCurrency(request.amount)}</p>
                          <div className="mt-2">{getStatusBadge(request.status)}</div>
                        </div>
                        
                        <div className="mt-2 md:mt-0">
                          {request.receipt_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={request.receipt_url} target="_blank" rel="noopener noreferrer">
                                Ver Comprovante
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma solicitação de pagamento encontrada</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Payment request dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Solicitar Pagamento</DialogTitle>
            <DialogDescription>
              Informe o valor que deseja retirar do seu saldo disponível.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Saldo Disponível:</span>
              <span className="font-bold">{formatCurrency(clientBalance)}</span>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor da Solicitação</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Informe a finalidade da solicitação"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleRequestPayment}>
              <SendIcon className="h-4 w-4 mr-2" />
              Solicitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default UserPayments;
