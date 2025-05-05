import { useState } from "react";
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
import { Payment, PaymentStatus, UserRole } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/payments/FileUploader";
import { useUserRole } from "@/hooks/use-user-role";
import { usePayments } from "@/hooks/usePayments";
import { supabase } from "@/integrations/supabase/client";

const PaymentActions = {
  APPROVE: "approve",
  REJECT: "reject",
  VIEW: "view",
};

const AdminPaymentsRefactored = () => {
  const { userRole } = useUserRole();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState<boolean>(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Use our custom hook to handle payments data and operations
  const {
    payments,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPayments,
    approvePayment,
    rejectPayment
  } = usePayments({ statusFilter, searchTerm });

  // Check if user has appropriate role
  const hasPermission = userRole === UserRole.ADMIN || userRole === UserRole.FINANCIAL;

  // Column definitions for the payment requests table
  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (info: any) => {
        // Check if info and getValue exist before using them
        if (!info || typeof info.getValue !== 'function') return "N/A";
        const value = info.getValue();
        if (!value) return "N/A";
        return <span>#{value.substring(0, 8)}</span>;
      }
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
        // Check if info and getValue exist before using them
        if (!info || typeof info.getValue !== 'function') return "N/A";
        const type = info.getValue();
        return <span>{type}</span>;
      }
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => {
        // Check if info and getValue exist before using them
        if (!info || typeof info.getValue !== 'function') return "N/A";
        const value = info.getValue();
        if (typeof value !== 'number') return "N/A";
        return <span>R$ {value.toFixed(2)}</span>;
      }
    },
    {
      id: "created_at",
      header: "Data",
      accessorKey: "created_at",
      cell: (info: any) => {
        // Check if info and getValue exist before using them
        if (!info || typeof info.getValue !== 'function') return "N/A";
        const value = info.getValue();
        if (!value) return "N/A";
        const date = new Date(value);
        return <span>{date.toLocaleDateString('pt-BR')}</span>;
      }
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        // Check if info and getValue exist before using them
        if (!info || typeof info.getValue !== 'function') return "N/A";
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
        // Check if info and info.row exist before accessing original
        if (!info || !info.row || !info.row.original) return null;
        
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
      
      const success = await approvePayment(selectedPayment.id, receiptUrl);
      
      if (success) {
        setApproveDialogOpen(false);
        setReceiptFile(null);
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error("Error in approval process:", error);
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  // Handle payment rejection
  const handleRejectPayment = async () => {
    if (!selectedPayment || !rejectionReason.trim()) return;
    
    const success = await rejectPayment(selectedPayment.id, rejectionReason);
    
    if (success) {
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedPayment(null);
    }
  };

  // Apply filters when button is clicked
  const handleFilterApply = () => {
    fetchPayments();
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
        actionLink={PATHS.ADMIN.SALE_NEW} // Fix: Using SALE_NEW instead of nonexistent PAYMENT_NEW
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
          <Button variant="outline" onClick={handleFilterApply}>Filtrar</Button>
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

export default AdminPaymentsRefactored;
