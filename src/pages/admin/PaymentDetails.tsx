
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PaymentStatus, PaymentType } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/payments/FileUploader";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PATHS } from "@/routes/paths";

// Define the payment type
interface PaymentWithDetails {
  id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  receipt_url?: string;
  description?: string;
  rejection_reason?: string;
  client_id: string;
  client: {
    id: string;
    business_name: string;
    email?: string;
  };
  pix_key: {
    id: string;
    key: string;
    type: string;
  };
}

const PaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [payment, setPayment] = useState<PaymentWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('payment_requests')
          .select(`
            *,
            client:client_id (*),
            pix_key:pix_key_id (*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // If we're mocking data
        if (!data) {
          const mockPayment: PaymentWithDetails = {
            id: id || '1',
            amount: 1500.00,
            status: PaymentStatus.PENDING,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            description: "Pagamento via PIX",
            client_id: "client-123",
            client: {
              id: "client-123",
              business_name: "Empresa ABC Ltda",
              email: "contato@empresaabc.com"
            },
            pix_key: {
              id: "pix-123",
              key: "empresa@pix.com",
              type: PaymentType.PIX
            },
            rejection_reason: ""
          };
          
          setPayment(mockPayment);
        } else {
          setPayment(data as unknown as PaymentWithDetails);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar detalhes",
          description: "Não foi possível obter os detalhes do pagamento."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentDetails();
  }, [id, toast]);
  
  const handleApprovePayment = async () => {
    if (!payment) return;
    
    setIsProcessing(true);
    
    try {
      let receiptUrl = payment.receipt_url;
      
      // Upload receipt if provided
      if (receiptFile) {
        const fileName = `receipt_${payment.id}_${Date.now()}.${receiptFile.name.split('.').pop()}`;
        
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
      
      // Update the payment status
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.APPROVED,
          receipt_url: receiptUrl,
          approved_at: new Date().toISOString(),
          approved_by: 'admin-user', // In a real app, this would be the current user's ID
        })
        .eq('id', payment.id);
      
      if (error) throw error;
      
      // Update local state
      setPayment({
        ...payment,
        status: PaymentStatus.APPROVED,
        receipt_url: receiptUrl,
        approved_at: new Date().toISOString()
      });
      
      // Show success message
      toast({
        title: "Pagamento aprovado",
        description: "O pagamento foi aprovado com sucesso."
      });
      
      // Close dialog
      setApproveDialogOpen(false);
      setReceiptFile(null);
      
    } catch (error) {
      console.error('Error approving payment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao aprovar pagamento",
        description: "Ocorreu um erro ao aprovar o pagamento."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRejectPayment = async () => {
    if (!payment || !rejectionReason.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Update the payment status
      const { error } = await supabase
        .from('payment_requests')
        .update({
          status: PaymentStatus.REJECTED,
          rejection_reason: rejectionReason
        })
        .eq('id', payment.id);
      
      if (error) throw error;
      
      // Update local state
      setPayment({
        ...payment,
        status: PaymentStatus.REJECTED,
        rejection_reason: rejectionReason
      });
      
      // Show success message
      toast({
        title: "Pagamento rejeitado",
        description: "O pagamento foi rejeitado com sucesso."
      });
      
      // Close dialog
      setRejectDialogOpen(false);
      setRejectionReason('');
      
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao rejeitar pagamento",
        description: "Ocorreu um erro ao rejeitar o pagamento."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  return (
    <>
      <PageHeader 
        title="Detalhes do Pagamento" 
        description="Visualize e gerencie informações do pagamento"
        actionLabel="Voltar para Pagamentos"
        actionLink={PATHS.ADMIN.PAYMENTS}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(PATHS.ADMIN.PAYMENTS)}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </PageHeader>
      
      <PageWrapper>
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        ) : payment ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Pagamento #{payment.id.substring(0, 8)}
              </h2>
              <div>
                {payment.status === PaymentStatus.PENDING && (
                  <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                )}
                {payment.status === PaymentStatus.APPROVED && (
                  <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                )}
                {payment.status === PaymentStatus.REJECTED && (
                  <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
                )}
                {payment.status === PaymentStatus.PAID && (
                  <Badge className="bg-blue-100 text-blue-800">Pago</Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Informações do Cliente</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{payment.client.business_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{payment.client.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID do Cliente</p>
                      <p className="font-mono text-sm">{payment.client.id}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Detalhes do Pagamento</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-semibold text-xl">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p>{payment.pix_key.type}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Chave PIX</p>
                      <p className="font-mono text-sm">{payment.pix_key.key}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                      <p>{formatDate(payment.created_at)}</p>
                    </div>
                    {payment.description && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                        <p className="bg-muted p-2 rounded text-sm">{payment.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Status do Pagamento</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Status Atual</p>
                      <div>
                        {payment.status === PaymentStatus.PENDING && (
                          <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                        )}
                        {payment.status === PaymentStatus.APPROVED && (
                          <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
                        )}
                        {payment.status === PaymentStatus.REJECTED && (
                          <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
                        )}
                        {payment.status === PaymentStatus.PAID && (
                          <Badge className="bg-blue-100 text-blue-800">Pago</Badge>
                        )}
                      </div>
                    </div>
                    
                    {payment.status === PaymentStatus.APPROVED && payment.approved_at && (
                      <>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">Data de Aprovação</p>
                          <p>{formatDate(payment.approved_at)}</p>
                        </div>
                        {payment.receipt_url && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Comprovante</p>
                            <Button asChild className="w-full">
                              <a 
                                href={payment.receipt_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visualizar Comprovante
                              </a>
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    
                    {payment.status === PaymentStatus.REJECTED && payment.rejection_reason && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Motivo da Rejeição</p>
                        <p className="bg-muted p-2 rounded text-sm text-destructive">
                          {payment.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {payment.status === PaymentStatus.PENDING && (
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Ações</h3>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setApproveDialogOpen(true)}
                        className="w-full"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprovar Pagamento
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => setRejectDialogOpen(true)}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rejeitar Pagamento
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Pagamento não encontrado</h3>
            <p className="text-muted-foreground">
              O pagamento que você está procurando não existe ou não está disponível.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate(PATHS.ADMIN.PAYMENTS)}
            >
              Voltar para Pagamentos
            </Button>
          </div>
        )}
      </PageWrapper>
      
      {/* Approve Payment Dialog */}
      <AlertDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Faça upload do comprovante para aprovar este pagamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <FileUploader
              label="Comprovante de pagamento (opcional)"
              onFileSelect={setReceiptFile}
              accept=".jpg,.jpeg,.png,.pdf"
              currentFile={null}
            />
          </div>
          
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveDialogOpen(false);
                setReceiptFile(null);
              }}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApprovePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Confirmar Aprovação"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Payment Dialog */}
      <AlertDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Informe o motivo para rejeitar este pagamento. Esta informação será enviada ao cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Textarea
            placeholder="Motivo da rejeição"
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
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectPayment}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? "Processando..." : "Confirmar Rejeição"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentDetails;
