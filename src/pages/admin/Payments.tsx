
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PageHeader } from "@/components/page/PageHeader";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Eye, FileText, Plus, Search, Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PATHS } from "@/routes/paths";
import { PaymentStatus } from "@/types";

// Mock data for demo
const MOCK_PAYMENTS = [
  {
    id: "1",
    amount: 1250.0,
    status: PaymentStatus.PENDING,
    created_at: "2023-06-15T14:30:00Z",
    client_name: "Padaria Central",
    client_id: "1",
    description: "Pagamento para liberação de máquina"
  },
  {
    id: "2",
    amount: 750.0,
    status: PaymentStatus.APPROVED,
    created_at: "2023-06-10T09:15:00Z",
    client_name: "Mercado Silva",
    client_id: "2",
    description: "Pagamento mensal"
  },
  {
    id: "3",
    amount: 950.0,
    status: PaymentStatus.REJECTED,
    created_at: "2023-06-08T16:45:00Z",
    client_name: "Restaurante Sabor",
    client_id: "3",
    description: "Pagamento de manutenção"
  },
  {
    id: "4",
    amount: 2000.0,
    status: PaymentStatus.PAID,
    created_at: "2023-06-01T11:20:00Z",
    client_name: "Farmácia Saúde",
    client_id: "4",
    description: "Pagamento de taxa de adesão"
  }
];

type PaymentStatusFilter = PaymentStatus | "ALL";

const statusLabels = {
  [PaymentStatus.PENDING]: "Pendente",
  [PaymentStatus.APPROVED]: "Aprovado",
  [PaymentStatus.REJECTED]: "Rejeitado",
  [PaymentStatus.PAID]: "Pago",
  "ALL": "Todos"
};

const Payments = () => {
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<typeof MOCK_PAYMENTS>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from Supabase
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let filteredPayments = [...MOCK_PAYMENTS];
        
        // Apply status filter
        if (statusFilter !== "ALL") {
          filteredPayments = filteredPayments.filter(
            payment => payment.status === statusFilter
          );
        }
        
        // Apply search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredPayments = filteredPayments.filter(
            payment => 
              payment.client_name.toLowerCase().includes(term) ||
              payment.description.toLowerCase().includes(term) ||
              payment.id.toLowerCase().includes(term)
          );
        }
        
        setPayments(filteredPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os pagamentos."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayments();
  }, [statusFilter, searchTerm, toast]);
  
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case PaymentStatus.APPROVED:
        return <Badge className="bg-emerald-500">Aprovado</Badge>;
      case PaymentStatus.REJECTED:
        return <Badge variant="destructive">Rejeitado</Badge>;
      case PaymentStatus.PAID:
        return <Badge className="bg-blue-500">Pago</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const handleApprove = async (paymentId: string) => {
    try {
      // In a real app, call Supabase
      // await supabase.from('payment_requests').update({
      //   status: 'APPROVED',
      //   approved_at: new Date().toISOString(),
      // }).eq('id', paymentId);
      
      // Update local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: PaymentStatus.APPROVED }
          : payment
      ));
      
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso."
      });
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar o pagamento."
      });
    }
  };
  
  const handleReject = async (paymentId: string) => {
    try {
      // In a real app, show dialog for rejection reason first
      
      // Then call Supabase
      // await supabase.from('payment_requests').update({
      //   status: 'REJECTED',
      //   rejection_reason: 'Rejection reason'
      // }).eq('id', paymentId);
      
      // Update local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: PaymentStatus.REJECTED }
          : payment
      ));
      
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso."
      });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível rejeitar o pagamento."
      });
    }
  };
  
  const handleViewDetails = (paymentId: string) => {
    navigate(PATHS.ADMIN.PAYMENT_DETAILS(paymentId));
  };
  
  const handleCreatePayment = () => {
    navigate(PATHS.ADMIN.PAYMENT_NEW);
  };
  
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os pagamentos do sistema</p>
        </div>
        <Button onClick={handleCreatePayment}>
          <Plus className="mr-2 h-4 w-4" /> Novo Pagamento
        </Button>
      </div>
      
      <PageWrapper>
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="approved">Aprovados</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
            </TabsList>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar pagamento..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatusFilter)}>
                <SelectTrigger className="w-[180px] hidden sm:flex">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os status</SelectItem>
                  <SelectItem value={PaymentStatus.PENDING}>Pendentes</SelectItem>
                  <SelectItem value={PaymentStatus.APPROVED}>Aprovados</SelectItem>
                  <SelectItem value={PaymentStatus.REJECTED}>Rejeitados</SelectItem>
                  <SelectItem value={PaymentStatus.PAID}>Pagos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all">
            <PaymentsTable 
              payments={payments}
              isLoading={isLoading}
              isMobile={isMobile}
              statusFilter="ALL"
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <PaymentsTable 
              payments={payments.filter(p => p.status === PaymentStatus.PENDING)}
              isLoading={isLoading}
              isMobile={isMobile}
              statusFilter={PaymentStatus.PENDING}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <PaymentsTable 
              payments={payments.filter(p => p.status === PaymentStatus.APPROVED)}
              isLoading={isLoading}
              isMobile={isMobile}
              statusFilter={PaymentStatus.APPROVED}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <PaymentsTable 
              payments={payments.filter(p => p.status === PaymentStatus.REJECTED)}
              isLoading={isLoading}
              isMobile={isMobile}
              statusFilter={PaymentStatus.REJECTED}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
};

interface PaymentsTableProps {
  payments: typeof MOCK_PAYMENTS;
  isLoading: boolean;
  isMobile: boolean;
  statusFilter: PaymentStatusFilter;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (id: string) => void;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: PaymentStatus) => JSX.Element;
}

const PaymentsTable = ({
  payments,
  isLoading,
  isMobile,
  statusFilter,
  onApprove,
  onReject,
  onViewDetails,
  formatDate,
  formatCurrency,
  getStatusBadge
}: PaymentsTableProps) => {
  const tableTitle = statusFilter === "ALL" 
    ? "Todos os Pagamentos" 
    : `Pagamentos ${statusLabels[statusFilter]}`;
    
  const tableDescription = statusFilter === "ALL"
    ? "Visualize e gerencie todos os pagamentos"
    : `Lista de pagamentos com status ${statusLabels[statusFilter].toLowerCase()}`;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tableTitle}</CardTitle>
        <CardDescription>{tableDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead className="hidden sm:table-cell">Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum pagamento encontrado com os critérios selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">
                      {payment.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{payment.client_name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                      {payment.description}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(payment.created_at)}
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(payment.id)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {payment.status === PaymentStatus.PENDING && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600"
                              onClick={() => onApprove(payment.id)}
                              title="Aprovar"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => onReject(payment.id)}
                              title="Rejeitar"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Payments;
