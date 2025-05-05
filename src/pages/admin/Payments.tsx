
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Payment, 
  PaymentStatus, 
  PaymentMethod, 
  AccountType,
  PaymentType,
  PaymentFilters
} from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/date-picker";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentReceiptUploader from "@/components/payments/PaymentReceiptUploader";
import { PATHS } from "@/routes/paths";

// Number of items per page
const ITEMS_PER_PAGE = 50;

const AdminPayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selected payment for modals
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data generation
  const generateMockPayments = () => {
    const mockData: Payment[] = [];
    const accountTypes = [AccountType.CLIENT, AccountType.PARTNER];
    const statuses = [PaymentStatus.PENDING, PaymentStatus.APPROVED, PaymentStatus.REJECTED];
    const methods = [PaymentMethod.PIX, PaymentMethod.DEBIT, PaymentMethod.CREDIT];
    const types = [PaymentType.WITHDRAWAL, PaymentType.DEPOSIT, PaymentType.COMMISSION, PaymentType.REFUND];
    
    for (let i = 1; i <= 120; i++) {
      const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
      
      let approvedDate = null;
      let approvedBy = null;
      let receiptUrl = null;
      let rejectionReason = null;
      
      if (status === PaymentStatus.APPROVED) {
        approvedDate = new Date(createdDate);
        approvedDate.setHours(createdDate.getHours() + Math.floor(Math.random() * 48));
        approvedBy = "admin-user-id";
        receiptUrl = "https://via.placeholder.com/300x400?text=Receipt";
      } else if (status === PaymentStatus.REJECTED) {
        rejectionReason = "Informações incorretas ou insuficientes.";
      }
      
      mockData.push({
        id: `payment-${i}`,
        requester_id: `requester-${i}`,
        requester_name: accountType === AccountType.CLIENT 
          ? `Cliente ${i}` 
          : `Parceiro ${i}`,
        account_type: accountType,
        amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
        payment_method: methods[Math.floor(Math.random() * methods.length)],
        payment_type: types[Math.floor(Math.random() * types.length)],
        status: status,
        created_at: createdDate.toISOString(),
        updated_at: status !== PaymentStatus.PENDING ? approvedDate?.toISOString() : undefined,
        approved_at: status === PaymentStatus.APPROVED ? approvedDate?.toISOString() : undefined,
        approved_by: approvedBy,
        receipt_url: receiptUrl,
        rejection_reason: rejectionReason,
        notes: Math.random() > 0.7 ? "Observação do solicitante sobre o pagamento" : undefined
      });
    }
    
    return mockData;
  };

  // Fetch payments data
  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch from Supabase
      // const { data, error } = await supabase
      //   .from('payment_requests')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      
      // For now, use mock data
      const mockData = generateMockPayments();
      
      setPayments(mockData);
      applyFiltersAndSearch(mockData, searchTerm, filters);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar a lista de pagamentos. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchPayments();
    
    // Set up Supabase realtime subscription for new payment requests
    // In a real implementation:
    // const channel = supabase
    //   .channel('payment_requests_changes')
    //   .on('postgres_changes', { 
    //     event: '*', 
    //     schema: 'public', 
    //     table: 'payment_requests' 
    //   }, (payload) => {
    //     // Handle the new payment request
    //     console.log('Change received!', payload);
    //     fetchPayments(); // Re-fetch or update the local state
    //   })
    //   .subscribe();
    
    // Return a cleanup function
    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [fetchPayments]);

  const applyFiltersAndSearch = (data: Payment[], search: string, appliedFilters: PaymentFilters) => {
    let filtered = [...data];
    
    // Apply search term
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.requester_name?.toLowerCase().includes(lowerSearch) ||
        payment.id.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply account type filter
    if (appliedFilters.accountType) {
      filtered = filtered.filter(payment => payment.account_type === appliedFilters.accountType);
    }
    
    // Apply payment method filter
    if (appliedFilters.paymentMethod) {
      filtered = filtered.filter(payment => payment.payment_method === appliedFilters.paymentMethod);
    }
    
    // Apply status filter
    if (appliedFilters.status) {
      filtered = filtered.filter(payment => payment.status === appliedFilters.status);
    }
    
    // Apply date range filter
    if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
      const [startDate, endDate] = appliedFilters.dateRange;
      
      if (startDate && endDate) {
        // Set time to beginning and end of days for proper comparison
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(payment => {
          const paymentDate = new Date(payment.created_at);
          return paymentDate >= start && paymentDate <= end;
        });
      }
    }
    
    setFilteredPayments(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(payments, term, filters);
  };

  const handleFilterChange = (filterType: keyof PaymentFilters, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFiltersAndSearch(payments, searchTerm, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    applyFiltersAndSearch(payments, "", {});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApproveClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleViewDetails = (paymentId: string) => {
    navigate(`${PATHS.ADMIN.PAYMENT_DETAILS(paymentId)}`);
  };

  const handlePaymentAction = async (paymentId: string, approved: boolean, receiptUrl?: string) => {
    if (!selectedPayment) return false;
    
    setIsSubmitting(true);
    try {
      const newStatus = approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;
      
      // In a real implementation, update in Supabase
      // const { error } = await supabase
      //   .from('payment_requests')
      //   .update({ 
      //     status: newStatus,
      //     approved_at: approved ? new Date() : null,
      //     approved_by: user.id,
      //     receipt_url: approved ? receiptUrl : null,
      //     rejection_reason: !approved ? rejectionReason : null
      //   })
      //   .eq('id', paymentId);
      
      // if (error) throw error;
      
      // Simulate API call
      console.log(`Payment ${paymentId} ${approved ? 'approved' : 'rejected'}`);
      
      // Update local state
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === paymentId 
            ? {
                ...payment,
                status: newStatus,
                approved_at: approved ? new Date().toISOString() : undefined,
                receipt_url: approved ? receiptUrl : undefined,
                rejection_reason: !approved ? rejectionReason : undefined
              }
            : payment
        )
      );
      
      // Also update filtered payments
      setFilteredPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === paymentId 
            ? {
                ...payment,
                status: newStatus,
                approved_at: approved ? new Date().toISOString() : undefined,
                receipt_url: approved ? receiptUrl : undefined,
                rejection_reason: !approved ? rejectionReason : undefined
              }
            : payment
        )
      );

      // Create a log entry
      // In a real implementation, save to access_logs table
      const logEntry = {
        action: approved ? 'payment_approved' : 'payment_rejected',
        payment_id: paymentId,
        notes: approved ? 'Payment approved with receipt' : rejectionReason
      };
      console.log('Creating log entry:', logEntry);
      
      // Send notification
      // In a real implementation, create a notification record
      console.log('Notification would be sent to requester');
      
      toast({
        title: approved ? "Pagamento aprovado" : "Pagamento rejeitado",
        description: approved ? "O comprovante foi enviado com sucesso." : "O pagamento foi rejeitado com sucesso.",
      });

      // Close the modals
      if (approved) {
        setIsApproveModalOpen(false);
      } else {
        setIsRejectModalOpen(false);
      }
      
      setSelectedPayment(null);
      return true;
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        variant: "destructive",
        title: "Erro ao processar pagamento",
        description: `Não foi possível ${approved ? 'aprovar' : 'rejeitar'} o pagamento.`,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate pagination
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Determine how to show pagination
  const showPagination = filteredPayments.length > ITEMS_PER_PAGE;
  const showingStart = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return (
          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pendente
          </span>
        );
      case PaymentStatus.APPROVED:
      case PaymentStatus.PAID:
        return (
          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            {status === PaymentStatus.APPROVED ? 'Aprovado' : 'Pago'}
          </span>
        );
      case PaymentStatus.REJECTED:
        return (
          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-50 text-red-700">
            <XCircle className="mr-1 h-3 w-3" />
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700">
            Desconhecido
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pagamentos" 
        description="Gerencie solicitações de pagamento e transações"
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou ID..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select 
            value={filters.accountType || ""}
            onValueChange={(value) => handleFilterChange('accountType', value || undefined)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo de Conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Tipos</SelectItem>
              <SelectItem value={AccountType.CLIENT}>Cliente</SelectItem>
              <SelectItem value={AccountType.PARTNER}>Parceiro</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.paymentMethod || ""}
            onValueChange={(value) => handleFilterChange('paymentMethod', value || undefined)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Métodos</SelectItem>
              <SelectItem value={PaymentMethod.PIX}>PIX</SelectItem>
              <SelectItem value={PaymentMethod.CREDIT}>Crédito</SelectItem>
              <SelectItem value={PaymentMethod.DEBIT}>Débito</SelectItem>
              <SelectItem value={PaymentMethod.OTHER}>Outro</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.status || ""}
            onValueChange={(value) => handleFilterChange('status', value || undefined)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Status</SelectItem>
              <SelectItem value={PaymentStatus.PENDING}>Pendentes</SelectItem>
              <SelectItem value={PaymentStatus.APPROVED}>Aprovados</SelectItem>
              <SelectItem value={PaymentStatus.REJECTED}>Rejeitados</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateRange ? "Filtro Aplicado" : "Período"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selecione o período</p>
                  <div className="grid gap-2">
                    <div>
                      <Label htmlFor="from" className="text-sm">De</Label>
                      <DatePicker 
                        id="from"
                        date={filters.dateRange?.[0]}
                        setDate={(date) => {
                          const currentRange = filters.dateRange || [undefined, undefined];
                          handleFilterChange('dateRange', [date, currentRange[1]]);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="to" className="text-sm">Até</Label>
                      <DatePicker 
                        id="to"
                        date={filters.dateRange?.[1]} 
                        setDate={(date) => {
                          const currentRange = filters.dateRange || [undefined, undefined];
                          handleFilterChange('dateRange', [currentRange[0], date]);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            disabled={!Object.keys(filters).length && !searchTerm}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
      
      <PageWrapper>
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[150px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.requester_name}</TableCell>
                        <TableCell>{payment.account_type}</TableCell>
                        <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.payment_method}</TableCell>
                        <TableCell>{formatDate(payment.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {payment.status === PaymentStatus.PENDING && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveClick(payment)}
                                  className="h-8 px-2 text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="sr-only">Aprovar</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectClick(payment)}
                                  className="h-8 px-2 text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span className="sr-only">Rejeitar</span>
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(payment.id)}
                              className="h-8 px-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver detalhes</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhum pagamento encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {showPagination && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando <span className="font-medium">{showingStart}</span> a{" "}
                  <span className="font-medium">{showingEnd}</span> de{" "}
                  <span className="font-medium">{filteredPayments.length}</span> resultados
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show pages around the current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageToShow}
                        variant={currentPage === pageToShow ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </PageWrapper>
      
      {/* Approve Payment Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aprovar Pagamento</DialogTitle>
            <DialogDescription>
              Envie um comprovante para aprovar este pagamento.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Solicitante</Label>
                  <p className="font-medium">{selectedPayment.requester_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p className="font-medium">R$ {selectedPayment.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <PaymentReceiptUploader 
                payment={selectedPayment}
                onSubmit={handlePaymentAction}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reject Payment Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeitar Pagamento</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição deste pagamento. Esta informação será enviada ao solicitante.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Solicitante</Label>
                  <p className="font-medium">{selectedPayment.requester_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Valor</Label>
                  <p className="font-medium">R$ {selectedPayment.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="rejection-reason">Motivo da Rejeição</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Informe o motivo da rejeição..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handlePaymentAction(selectedPayment.id, false)}
                  disabled={isSubmitting || !rejectionReason.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Rejeitando...
                    </>
                  ) : (
                    "Rejeitar Pagamento"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;
