
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { PaymentResponseDialog } from "@/components/admin/PaymentResponseDialog";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentRequests = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentRequests, setPaymentRequests] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<Payment | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Fetch payment requests
  useEffect(() => {
    const fetchPaymentRequests = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from Supabase
        // For now, we'll use mock data that matches the Payment type
        const mockPaymentRequests: Payment[] = [
          {
            id: "1",
            amount: 1200.0,
            status: PaymentStatus.PENDING,
            created_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
            updated_at: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
            client_id: "client-1",
            client_name: "Empresa ABC Ltda",
            description: "Pagamento mensal",
            payment_type: PaymentType.PIX,
            pix_key: {
              id: "pk-1",
              key: "123.456.789-00",
              type: "CPF",
              owner_name: "João da Silva"
            },
            rejection_reason: null
          },
          {
            id: "2",
            amount: 2500.0,
            status: PaymentStatus.PENDING,
            created_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
            updated_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
            client_id: "client-2",
            client_name: "XYZ Comércio",
            description: "Retirada parcial",
            payment_type: PaymentType.PIX,
            pix_key: {
              id: "pk-2",
              key: "email@example.com",
              type: "EMAIL",
              owner_name: "Maria Oliveira"
            },
            rejection_reason: null
          },
          {
            id: "3",
            amount: 800.0,
            status: PaymentStatus.APPROVED,
            created_at: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
            updated_at: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
            approved_at: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
            client_id: "client-3",
            client_name: "Tech Solutions",
            description: "Pagamento emergencial",
            payment_type: PaymentType.PIX,
            rejection_reason: null
          },
          {
            id: "4",
            amount: 300.0,
            status: PaymentStatus.REJECTED,
            created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
            updated_at: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
            client_id: "client-2",
            client_name: "XYZ Comércio",
            description: "Estorno",
            payment_type: PaymentType.PIX,
            rejection_reason: "Documentação inválida"
          }
        ];
        
        setPaymentRequests(mockPaymentRequests);
      } catch (error) {
        console.error("Error fetching payment requests:", error);
        toast({
          title: "Erro ao carregar solicitações",
          description: "Não foi possível carregar as solicitações de pagamento.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentRequests();
  }, [toast]);

  // Filter payment requests based on activeTab
  const filteredRequests = paymentRequests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return request.status === PaymentStatus.PENDING;
    if (activeTab === 'approved') return request.status === PaymentStatus.APPROVED;
    if (activeTab === 'rejected') return request.status === PaymentStatus.REJECTED;
    return true;
  });

  // Handle opening the approval/rejection dialog
  const handleOpenResponseDialog = (request: Payment, isApproving: boolean) => {
    setSelectedRequest(request);
    setIsApproving(isApproving);
    setIsResponseDialogOpen(true);
  };

  // Handle payment request approval
  const handleApproveRequest = async (requestId: string, receiptUrl?: string) => {
    try {
      // In a real implementation, this would update the request in Supabase
      // For now, we'll just update our local state
      const updatedRequests = paymentRequests.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: PaymentStatus.APPROVED,
            approved_at: new Date().toISOString(),
            receipt_url: receiptUrl || req.receipt_url,
            updated_at: new Date().toISOString()
          };
        }
        return req;
      });
      
      setPaymentRequests(updatedRequests);
      setIsResponseDialogOpen(false);
      
      toast({
        title: "Solicitação aprovada",
        description: "A solicitação de pagamento foi aprovada com sucesso.",
      });
    } catch (error) {
      console.error("Error approving payment request:", error);
      toast({
        title: "Erro na aprovação",
        description: "Não foi possível aprovar a solicitação de pagamento.",
        variant: "destructive"
      });
    }
  };

  // Handle payment request rejection
  const handleRejectRequest = async (requestId: string, rejectionReason: string) => {
    try {
      // In a real implementation, this would update the request in Supabase
      // For now, we'll just update our local state
      const updatedRequests = paymentRequests.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: PaymentStatus.REJECTED,
            rejection_reason: rejectionReason,
            updated_at: new Date().toISOString()
          };
        }
        return req;
      });
      
      setPaymentRequests(updatedRequests);
      setIsResponseDialogOpen(false);
      
      toast({
        title: "Solicitação rejeitada",
        description: "A solicitação de pagamento foi rejeitada.",
      });
    } catch (error) {
      console.error("Error rejecting payment request:", error);
      toast({
        title: "Erro na rejeição",
        description: "Não foi possível rejeitar a solicitação de pagamento.",
        variant: "destructive"
      });
    }
  };

  // Define columns for the DataTable component
  const columns = [
    {
      id: "client",
      header: "Cliente",
      accessorKey: "client_name",
    },
    {
      id: "created_at",
      header: "Data",
      accessorKey: "created_at",
      cell: (info: any) => {
        if (!info.row.original) return "N/A";
        return new Date(info.row.original.created_at).toLocaleDateString('pt-BR');
      }
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => {
        if (!info.row.original) return "N/A";
        return formatCurrency(info.row.original.amount);
      }
    },
    {
      id: "payment_type",
      header: "Tipo",
      accessorKey: "payment_type",
      cell: (info: any) => {
        if (!info.row.original) return "N/A";
        
        const paymentType = info.row.original.payment_type;
        switch (paymentType) {
          case PaymentType.PIX:
            return "PIX";
          case PaymentType.TED:
            return "TED";
          case PaymentType.BOLETO:
            return "Boleto";
          default:
            return paymentType;
        }
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        if (!info.row.original) return "N/A";
        
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
      header: "Ações",
      cell: (info: any) => {
        if (!info.row.original) return null;
        const request = info.row.original;
        
        // Only show approve/reject buttons for pending requests
        if (request.status === PaymentStatus.PENDING) {
          return (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleOpenResponseDialog(request, true)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleOpenResponseDialog(request, false)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </div>
          );
        }
        
        // For approved or rejected requests, show a details button
        return (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => {
              toast({
                title: "Detalhes",
                description: `Visualizando detalhes da solicitação #${request.id}`,
              });
            }}
          >
            Detalhes
          </Button>
        );
      }
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Solicitações de Pagamento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Solicitações</CardTitle>
          <CardDescription>Visualize e processe as solicitações de pagamento dos clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="approved">Aprovados</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredRequests.length > 0 ? (
                <DataTable columns={columns} data={filteredRequests} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma solicitação de pagamento encontrada</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedRequest && (
        <PaymentResponseDialog
          isOpen={isResponseDialogOpen}
          onOpenChange={setIsResponseDialogOpen}
          paymentRequest={selectedRequest}
          isApproving={isApproving}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default PaymentRequests;
