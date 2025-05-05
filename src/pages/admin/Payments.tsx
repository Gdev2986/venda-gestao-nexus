
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PageHeader } from "@/components/page/PageHeader";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Calendar, Check, X, Eye } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATHS } from "@/routes/paths";
import { PaymentStatus, PaymentType } from "@/types";
import { usePayments, PaymentData } from "@/hooks/usePayments";
import { FileUploader } from "@/components/payments/FileUploader";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

const Payments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for modals
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // State for form inputs
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Use the payments hook
  const { payments, isLoading, error, fetchPayments, approvePayment, rejectPayment } = usePayments({
    statusFilter,
    fetchOnMount: true
  });

  // Set up real-time subscription for payments
  useEffect(() => {
    const channel = supabase
      .channel('payment_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_requests' 
      }, (payload) => {
        console.log('Payment change detected:', payload);
        fetchPayments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPayments]);

  // Handle search and filter submission
  const handleFilterSubmit = () => {
    fetchPayments();
  };

  // Handle payment actions
  const handlePaymentAction = (payment: PaymentData, action: 'approve' | 'reject' | 'details') => {
    setSelectedPayment(payment);
    
    if (action === 'approve') {
      setApproveDialogOpen(true);
    } else if (action === 'reject') {
      setRejectDialogOpen(true);
    } else if (action === 'details') {
      setDetailsDialogOpen(true);
    }
  };

  // Handle payment approval with receipt upload
  const handleApprovePayment = async () => {
    if (!selectedPayment) return;
    
    setIsUploading(true);
    
    try {
      let receiptUrl = null;
      
      // Upload receipt if provided
      if (receiptFile) {
        const fileName = `payment_${selectedPayment.id}_${Date.now()}.${receiptFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_receipts')
          .upload(fileName, receiptFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the file
        const { data: urlData } = supabase.storage
          .from('payment_receipts')
          .getPublicUrl(fileName);
          
        receiptUrl = urlData.publicUrl;
      }
      
      // Update the payment request with receipt URL
      const { error } = await supabase
        .from('payment_requests')
        .update({ 
          status: PaymentStatus.APPROVED,
          receipt_url: receiptUrl,
          approved_at: new Date().toISOString(),
          approved_by: 'admin-user' // In a real app, this would be the authenticated user's ID
        })
        .eq('id', selectedPayment.id);
      
      if (error) throw error;
      
      // Show success toast
      toast({
        title: "Pagamento aprovado",
        description: "Pagamento aprovado com sucesso."
      });
      
      // Close dialog and reset form
      setApproveDialogOpen(false);
      setReceiptFile(null);
      
      // Refresh payments
      fetchPayments();
      
    } catch (error) {
      console.error('Error approving payment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar pagamento",
        description: "Ocorreu um erro ao aprovar o pagamento."
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle payment rejection with reason
  const handleRejectPayment = async () => {
    if (!selectedPayment || !rejectionReason.trim()) return;
    
    try {
      await rejectPayment(selectedPayment.id, rejectionReason);
      setRejectDialogOpen(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Table columns definition
  const columns = [
    {
      id: "client",
      header: "Cliente",
      accessorFn: (row: PaymentData) => row.client?.business_name || "N/A",
      cell: (info: any) => info.getValue(),
    },
    {
      id: "type",
      header: "Tipo",
      accessorFn: (row: PaymentData) => row.pix_key?.type || "PIX",
      cell: (info: any) => info.getValue(),
    },
    {
      id: "key",
      header: "Chave PIX",
      accessorFn: (row: PaymentData) => row.pix_key?.key || "N/A",
      cell: (info: any) => {
        const key = info.getValue();
        // Truncate long keys for display
        return key.length > 20 ? `${key.substring(0, 17)}...` : key;
      }
    },
    {
      id: "amount",
      header: "Valor",
      accessorKey: "amount",
      cell: (info: any) => formatCurrency(info.getValue()),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const status = info.getValue();
        let badgeClass = "";
        
        switch (status) {
          case PaymentStatus.PENDING:
            badgeClass = "bg-yellow-100 text-yellow-800";
            return <Badge className={badgeClass}>Pendente</Badge>;
          case PaymentStatus.APPROVED:
            badgeClass = "bg-green-100 text-green-800";
            return <Badge className={badgeClass}>Aprovado</Badge>;
          case PaymentStatus.REJECTED:
            badgeClass = "bg-red-100 text-red-800";
            return <Badge className={badgeClass}>Rejeitado</Badge>;
          case PaymentStatus.PAID:
            badgeClass = "bg-blue-100 text-blue-800";
            return <Badge className={badgeClass}>Pago</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      },
    },
    {
      id: "created_at",
      header: "Data",
      accessorKey: "created_at",
      cell: (info: any) => formatDate(info.getValue()),
    },
    {
      id: "actions",
      header: "Ações",
      cell: (info: any) => {
        const payment = info.row.original;
        const isPending = payment.status === PaymentStatus.PENDING;
        
        return (
          <div className="flex items-center space-x-2">
            {isPending && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handlePaymentAction(payment, 'approve')}
                  className="flex items-center text-green-600 hover:text-green-800 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handlePaymentAction(payment, 'reject')}
                  className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handlePaymentAction(payment, 'details')}
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              Detalhes
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader 
        title="Pagamentos" 
        description="Gerencie as solicitações de pagamento"
        actionLabel="Novo Pagamento"
        actionLink={PATHS.ADMIN.PAYMENT_NEW}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {isLoading ? 'Carregando...' : `${payments.length} pagamentos`}
          </span>
        </div>
      </PageHeader>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, descrição..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as PaymentStatus | "ALL")}
          >
            <SelectTrigger className="w-[180px]">
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
          
          <Button 
            variant="outline" 
            onClick={handleFilterSubmit}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      <PageWrapper>
        <DataTable 
          columns={columns} 
          data={payments} 
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Cliente</p>
                <p className="text-sm">{selectedPayment?.client?.business_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Valor</p>
                <p className="text-sm">{selectedPayment ? formatCurrency(selectedPayment.amount) : '--'}</p>
              </div>
            </div>
            
            <FileUploader
              label="Comprovante de pagamento (opcional)"
              onFileSelect={setReceiptFile}
              accept=".jpg,.jpeg,.png,.pdf"
              currentFile={null}
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveDialogOpen(false);
                setReceiptFile(null);
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApprovePayment}
              disabled={isUploading}
            >
              {isUploading ? "Processando..." : "Aprovar Pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Payment Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Informe o motivo para rejeitar este pagamento. Esta informação será enviada ao cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <p className="text-sm font-medium mb-1">Cliente</p>
              <p className="text-sm">{selectedPayment?.client?.business_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Valor</p>
              <p className="text-sm">{selectedPayment ? formatCurrency(selectedPayment.amount) : '--'}</p>
            </div>
          </div>
          
          <Textarea
            placeholder="Motivo da rejeição *"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
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
              Rejeitar Pagamento
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Payment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">ID do Pagamento</p>
                  <p className="text-sm font-mono">{selectedPayment.id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <div>
                    {selectedPayment.status === PaymentStatus.PENDING && (
                      <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                    )}
                    {selectedPayment.status === PaymentStatus.APPROVED && (
                      <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                    )}
                    {selectedPayment.status === PaymentStatus.REJECTED && (
                      <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
                    )}
                    {selectedPayment.status === PaymentStatus.PAID && (
                      <Badge className="bg-blue-100 text-blue-800">Pago</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Informações do Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Nome</p>
                    <p className="text-sm">{selectedPayment.client?.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p className="text-sm">{selectedPayment.client?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Detalhes do Pagamento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Valor</p>
                    <p className="text-sm">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Data da Solicitação</p>
                    <p className="text-sm">{formatDate(selectedPayment.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Tipo de Chave</p>
                    <p className="text-sm">{selectedPayment.pix_key?.type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Chave PIX</p>
                    <p className="text-sm">{selectedPayment.pix_key?.key || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {selectedPayment.description && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <p className="text-sm">{selectedPayment.description}</p>
                </div>
              )}
              
              {selectedPayment.status === PaymentStatus.APPROVED && selectedPayment.approved_at && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Aprovação</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Data de Aprovação</p>
                      <p className="text-sm">{formatDate(selectedPayment.approved_at)}</p>
                    </div>
                    {selectedPayment.receipt_url && (
                      <div>
                        <p className="text-sm font-medium mb-1">Comprovante</p>
                        <Button size="sm" variant="outline" asChild>
                          <a href={selectedPayment.receipt_url} target="_blank" rel="noopener noreferrer">
                            Ver Comprovante
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedPayment.status === PaymentStatus.REJECTED && selectedPayment.rejection_reason && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Rejeição</h3>
                  <p className="text-sm">{selectedPayment.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Payments;
