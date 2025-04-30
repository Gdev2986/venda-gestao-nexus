
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
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
import { WalletIcon, SendIcon, HistoryIcon, CircleDollarSignIcon } from "lucide-react";

// Mock type for payment requests
interface PaymentRequest {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  description?: string;
  receipt_url?: string;
}

const UserPayments = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [clientBalance, setClientBalance] = useState(15000); // Mock balance
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { userRole } = useUserRole();
  
  // Fetch payment requests (mocked for now)
  useEffect(() => {
    const loadPaymentRequests = () => {
      setIsLoading(true);
      
      // Mock payment requests
      const mockPaymentRequests: PaymentRequest[] = [
        {
          id: "1",
          amount: 1500.0,
          status: PaymentStatus.PAID,
          created_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
          description: "Pagamento mensal",
          receipt_url: "https://example.com/receipt1"
        },
        {
          id: "2",
          amount: 2500.0,
          status: PaymentStatus.APPROVED,
          created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
          description: "Retirada parcial"
        },
        {
          id: "3",
          amount: 800.0,
          status: PaymentStatus.PENDING,
          created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          description: "Pagamento emergencial"
        },
        {
          id: "4",
          amount: 300.0,
          status: PaymentStatus.REJECTED,
          created_at: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
          description: "Estorno"
        }
      ];
      
      setPaymentRequests(mockPaymentRequests);
      setIsLoading(false);
    };
    
    loadPaymentRequests();
    
    // Set up real-time subscription for new payment requests
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_requests' }, 
        (payload) => {
          console.log('Change received!', payload);
          // In a real app, we would fetch updated data or update our state directly
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
  }, [toast]);
  
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
  const handleRequestPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Informe um valor válido para solicitação",
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
    
    // In a real app, we would call an API to create a payment request
    const newPaymentRequest: PaymentRequest = {
      id: `temp_${Date.now()}`,
      amount: parsedAmount,
      status: PaymentStatus.PENDING,
      created_at: new Date().toISOString(),
      description: description || "Solicitação de pagamento"
    };
    
    // Add the new payment request to the list
    setPaymentRequests([newPaymentRequest, ...paymentRequests]);
    
    // Show success toast
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de pagamento foi enviada com sucesso",
    });
    
    // Close the dialog and reset form
    setIsDialogOpen(false);
    setAmount("");
    setDescription("");
    
    // In a real world scenario, this would trigger a notification to the financial team
    if (userRole === UserRole.CLIENT) {
      console.log('Sending notification to financial team about new payment request');
    }
  };
  
  // Payment requests data table columns
  const columns = [
    {
      id: "created_at",
      header: "Data",
      accessorKey: "created_at",
      cell: (info: any) => new Date(info.row.original.created_at).toLocaleDateString('pt-BR')
    },
    {
      id: "description",
      header: "Descrição",
      accessorKey: "description"
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => formatCurrency(info.row.original.amount)
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.row.original.status;
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
      }
    },
    {
      id: "actions",
      header: "",
      cell: (info: any) => {
        const { receipt_url, status } = info.row.original;
        
        if (receipt_url && (status === PaymentStatus.PAID || status === PaymentStatus.APPROVED)) {
          return (
            <Button size="sm" variant="ghost" asChild>
              <a href={receipt_url} target="_blank" rel="noopener noreferrer">
                Recibo
              </a>
            </Button>
          );
        }
        
        return null;
      }
    }
  ];
  
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
                <DataTable
                  columns={columns}
                  data={filteredPaymentRequests}
                />
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
