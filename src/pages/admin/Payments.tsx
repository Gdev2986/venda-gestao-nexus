import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PATHS } from "@/routes/paths";
import { Search, Check, X, Eye } from "lucide-react";
import { Payment, PaymentStatus, PaymentType, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { FileUploader } from "@/components/payments/FileUploader";
import { useUserRole } from "@/hooks/use-user-role";

const PaymentActions = {
  APPROVE: "approve",
  REJECT: "reject",
  VIEW: "view",
};

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState<boolean>(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const { toast } = useToast();
  const { userRole } = useUserRole();

  // Check if user has appropriate role
  const hasPermission = userRole === UserRole.ADMIN || userRole === UserRole.FINANCIAL;

  // Column definitions for the payment requests table
  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (info: any) => <span>#{info.getValue().substring(0, 8)}</span>
    },
    {
      id: "client_name",
      header: "Solicitante",
      accessorKey: "client_name",
    },
    {
      id: "payment_type",
      header: "Tipo",
      accessorKey: "payment_type",
      cell: (info: any) => {
        const type = info.getValue();
        return <span>{type}</span>;
      }
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => <span>R$ {Number(info.getValue()).toFixed(2)}</span>
    },
    {
      id: "created_at",
      header: "Data",
      accessorKey: "created_at",
      cell: (info: any) => {
        const date = new Date(info.getValue());
        return <span>{date.toLocaleDateString('pt-BR')}</span>;
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.getValue();
        let statusClass = "";
        switch (status) {
          case PaymentStatus.PENDING:
            statusClass = "bg-yellow-50 text-yellow-700";
            break;
          case PaymentStatus.APPROVED:
            statusClass = "bg-green-50 text-green-700";
            break;
          case PaymentStatus.REJECTED:
            statusClass = "bg-red-50 text-red-700";
            break;
          default:
            statusClass = "bg-gray-50 text-gray-700";
        }
        
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusClass}`}>
            {status === PaymentStatus.PENDING ? "Pendente" : 
             status === PaymentStatus.APPROVED ? "Aprovado" : 
             status === PaymentStatus.REJECTED ? "Recusado" : status}
          </span>
        );
      }
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info: any) => {
        const payment = info.row.original;
        const isPending = payment.status === PaymentStatus.PENDING;
        
        return (
          <div className="flex gap-2">
            {isPending && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleAction(PaymentActions.APPROVE, payment)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleAction(PaymentActions.REJECT, payment)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Recusar
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleAction(PaymentActions.VIEW, payment)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Detalhes
            </Button>
          </div>
        );
      }
    }
  ];

  // Fetch payment data from API
  const fetchPayments = async () => {
    if (!hasPermission) return;
    
    setLoading(true);
    try {
      // Build the query based on filters
      let query = supabase
        .from("payment_requests")
        .select(`
          *,
          pix_key: pix_key_id (key, type, name),
          client: client_id (business_name)
        `)
        .order('created_at', { ascending: false });
        
      // Apply status filter if selected
      if (statusFilter !== "all") {
        // Convert string to PaymentStatus enum to ensure type safety
        const statusValue = statusFilter.toUpperCase() as PaymentStatus;
        query = query.eq("status", statusValue);
      }
      
      // Apply search filter if present
      if (searchTerm) {
        query = query.or(`client.business_name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }
      
      // Paginate the results
      query = query
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);
      
      const { data, error, count } = await query;

      if (error) throw error;
      
      // Transform the data to match our Payment type
      const transformedData = data.map(item => {
        // Define the payment type based on the data or use PIX as default
        let paymentType = PaymentType.PIX;

        return {
          id: item.id,
          amount: item.amount,
          status: item.status as PaymentStatus,
          created_at: item.created_at,
          updated_at: item.updated_at,
          client_id: item.client_id,
          description: item.description,
          approved_at: item.approved_at,
          receipt_url: item.receipt_url,
          client_name: item.client?.business_name || "Cliente desconhecido",
          payment_type: paymentType,
          rejection_reason: item.rejection_reason || null, // Make sure rejection_reason exists or default to null
          pix_key: item.pix_key ? {
            id: item.pix_key_id,
            key: item.pix_key.key,
            type: item.pix_key.type,
            owner_name: item.pix_key.name
          } : undefined
        } as Payment;
      });

      setPayments(transformedData);
      
      if (count) {
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar os pagamentos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    if (!hasPermission) return;
    
    const channel = supabase
      .channel('payment_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_requests' 
      }, () => {
        fetchPayments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hasPermission, statusFilter, searchTerm, currentPage, pageSize]);

  // Initial data fetch
  useEffect(() => {
    fetchPayments();
  }, [hasPermission, statusFilter, searchTerm, currentPage, pageSize]);

  // Handle payment actions (approve, reject, view)
  const handleAction = (action: string, payment: Payment) => {
    setSelectedPayment(payment);
    
    switch (action) {
      case PaymentActions.APPROVE:
        setApproveDialogOpen(true);
        break;
      case PaymentActions.REJECT:
        setRejectDialogOpen(true);
        setRejectionReason('');
        break;
      case PaymentActions.VIEW:
        // Navigate to payment details
        window.location.href = PATHS.ADMIN.PAYMENT_DETAILS(payment.id);
        break;
      default:
        break;
    }
  };

  // Handle payment approval
  const handleApprovePayment = async () => {
    if (!selectedPayment) return;
    
    setIsUploadingReceipt(true);
    try {
      let receiptUrl = null;
      
      // Upload receipt if provided
      if (receiptFile) {
        const fileName = `receipt_${selectedPayment.id}_${Date.now()}.${receiptFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_receipts')
          .upload(fileName, receiptFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the receipt
        const { data: urlData } = supabase.storage
          .from('payment_receipts')
          .getPublicUrl(fileName);
          
        receiptUrl = urlData.publicUrl;
      }
      
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.APPROVED,
          approved_at: new Date().toISOString(),
          receipt_url: receiptUrl
        })
        .eq('id', selectedPayment.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso.",
      });
      
      // Refresh the payments list
      fetchPayments();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Erro ao aprovar pagamento",
        description: "Não foi possível aprovar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingReceipt(false);
      setApproveDialogOpen(false);
      setReceiptFile(null);
      setSelectedPayment(null);
    }
  };

  // Handle payment rejection
  const handleRejectPayment = async () => {
    if (!selectedPayment || !rejectionReason.trim()) return;
    
    try {
      // Update payment status in database
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.REJECTED,
          rejection_reason: rejectionReason
        })
        .eq('id', selectedPayment.id);
        
      if (error) throw error;
      
      toast({
        title: "Pagamento recusado",
        description: "O pagamento foi recusado com sucesso.",
      });
      
      // Refresh the payments list
      fetchPayments();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Erro ao recusar pagamento",
        description: "Não foi possível recusar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedPayment(null);
    }
  };

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pagamentos" 
        description="Gerencie solicitações de pagamento e transações"
        actionLabel="Novo Pagamento"
        actionLink={PATHS.ADMIN.PAYMENT_NEW}
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pagamentos..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => fetchPayments()}>Filtrar</Button>
        </div>
      </div>
      
      <PageWrapper>
        <DataTable 
          columns={columns}
          data={payments}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </PageWrapper>

      {/* Approve Payment Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Pagamento</DialogTitle>
            <DialogDescription>
              Faça upload do comprovante para aprovar o pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FileUploader
              label="Comprovante de pagamento"
              onFileSelect={setReceiptFile}
              accept=".jpg,.jpeg,.png,.pdf"
              currentFile={null}
            />
            <Textarea
              placeholder="Observações (opcional)"
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setApproveDialogOpen(false);
                setReceiptFile(null);
              }}
              disabled={isUploadingReceipt}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleApprovePayment} 
              disabled={isUploadingReceipt}
            >
              {isUploadingReceipt ? "Enviando..." : "Confirmar Aprovação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Payment Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Informe o motivo para recusar este pagamento. Esta informação será enviada ao solicitante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Motivo da recusa"
            className="min-h-[100px]"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectPayment}
              disabled={!rejectionReason.trim()}
            >
              Confirmar Recusa
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPayments;
