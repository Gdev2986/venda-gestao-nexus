
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payments = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]); 
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock fetching payments data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const mockPayments: Payment[] = [
        {
          id: "1",
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          amount: 1250.50,
          status: PaymentStatus.PENDING,
          client_id: "client-123",
          client_name: "Empresa ABC Ltda",
          payment_type: PaymentType.PIX,
          rejection_reason: null
        },
        {
          id: "2",
          created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 9).toISOString(),
          amount: 3750.00,
          status: PaymentStatus.APPROVED,
          client_id: "client-456",
          approved_at: new Date(Date.now() - 86400000 * 9).toISOString(),
          client_name: "Comércio XYZ S/A",
          payment_type: PaymentType.TED,
          rejection_reason: null
        },
        {
          id: "3",
          created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 14).toISOString(),
          amount: 990.00,
          status: PaymentStatus.REJECTED,
          client_id: "client-789",
          client_name: "Indústria DEF ME",
          payment_type: PaymentType.BOLETO,
          rejection_reason: "Documentação incompleta"
        }
      ];
      
      setPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filter payments based on activeTab
  const filteredPayments = payments.filter(payment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return payment.status === PaymentStatus.PENDING;
    if (activeTab === 'approved') return payment.status === PaymentStatus.APPROVED;
    if (activeTab === 'rejected') return payment.status === PaymentStatus.REJECTED;
    return true;
  });
  
  // Columns for the payments table
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
        // Check if info and info.row exist before accessing original
        if (!info || !info.row) return "N/A";
        const date = new Date(info.row.original.created_at);
        return date.toLocaleDateString('pt-BR');
      }
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => {
        // Check if info and info.row exist before accessing original
        if (!info || !info.row) return "N/A";
        return formatCurrency(info.row.original.amount);
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        // Check if info and info.row exist before accessing original
        if (!info || !info.row) return "N/A";
        
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
        // Check if info and info.row exist before accessing original
        if (!info || !info.row) return null;
        
        return (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => {
              toast({
                title: "Detalhes",
                description: `Visualizando detalhes do pagamento #${info.row.original.id}`,
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
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Pagamento</CardTitle>
          <CardDescription>Gerencie as solicitações de pagamento dos clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              ) : filteredPayments.length > 0 ? (
                <DataTable columns={columns} data={filteredPayments} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma solicitação de pagamento encontrada</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
