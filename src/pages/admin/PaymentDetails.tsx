
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Payment, PaymentStatus } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { ChevronLeft, AlertCircle, CheckCircle, XCircle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PaymentReceiptUploader from "@/components/payments/PaymentReceiptUploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

export default function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      // For now we mock this data
      // In a real implementation, we would fetch from Supabase
      const mockPayment: Payment = {
        id: id,
        requester_id: "client-123",
        requester_name: "Empresa ABC",
        account_type: "CLIENT" as any,
        amount: 1500.75,
        payment_method: "PIX" as any,
        payment_type: "WITHDRAWAL" as any,
        status: "PENDING" as any,
        created_at: new Date().toISOString(),
        notes: "Pagamento mensal de comissão",
      };

      setPayment(mockPayment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar pagamento",
        description: "Não foi possível carregar os detalhes do pagamento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentAction = async (approved: boolean, receiptUrl?: string) => {
    if (!payment) return false;
    
    setIsSubmitting(true);
    try {
      const newStatus = approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;
      
      // In a real implementation, update in Supabase
      console.log(`Payment ${payment.id} ${approved ? 'approved' : 'rejected'}`);
      
      // Update local state
      setPayment(prev => 
        prev ? {
          ...prev,
          status: newStatus,
          approved_at: approved ? new Date().toISOString() : undefined,
          receipt_url: approved ? receiptUrl : undefined,
          rejection_reason: !approved ? rejectionReason : undefined
        } : null
      );

      // Create a log entry
      const logEntry = {
        action: approved ? 'payment_approved' : 'payment_rejected',
        payment_id: payment.id,
        notes: approved ? 'Payment approved with receipt' : rejectionReason
      };
      console.log('Creating log entry:', logEntry);
      
      // Send notification
      console.log('Notification would be sent to requester');
      
      toast({
        title: approved ? "Pagamento aprovado" : "Pagamento rejeitado",
        description: approved ? "O comprovante foi enviado com sucesso." : "O pagamento foi rejeitado com sucesso.",
      });

      if (!approved) {
        setIsRejectDialogOpen(false);
        setRejectionReason("");
      }
      
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

  const getStatusBadgeClass = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "bg-yellow-50 text-yellow-700";
      case PaymentStatus.APPROVED:
      case PaymentStatus.PAID:
        return "bg-green-50 text-green-700";
      case PaymentStatus.REJECTED:
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case PaymentStatus.APPROVED:
      case PaymentStatus.PAID:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case PaymentStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Pagamento não encontrado</h2>
        <p className="text-muted-foreground mb-4">O pagamento solicitado não existe ou foi removido.</p>
        <Button onClick={() => navigate("/admin/payments")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para pagamentos
        </Button>
      </div>
    );
  }

  const formattedDate = payment.created_at 
    ? format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm')
    : 'Data desconhecida';
  
  const formattedApprovedDate = payment.approved_at
    ? format(new Date(payment.approved_at), 'dd/MM/yyyy HH:mm')
    : '-';

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/payments")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para pagamentos
          </Button>

          <div className="flex items-center space-x-2">
            {payment.status === PaymentStatus.PENDING && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isSubmitting}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
                {/* Approve button is not needed here as it's handled by the receipt uploader */}
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pagamento</CardTitle>
              <CardDescription>Informações sobre a solicitação de pagamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-medium">{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solicitante:</span>
                <span className="font-medium">{payment.requester_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de Conta:</span>
                <span className="font-medium">{payment.account_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-medium">R$ {payment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método:</span>
                <span className="font-medium">{payment.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">{payment.payment_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data da Solicitação:</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-1">{payment.status}</span>
                </span>
              </div>
              {payment.notes && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground mb-1">Observações:</span>
                  <span className="font-medium bg-muted p-2 rounded">{payment.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {payment.status === PaymentStatus.PENDING ? (
              <Card>
                <CardHeader>
                  <CardTitle>Aprovar Pagamento</CardTitle>
                  <CardDescription>Envie o comprovante para aprovar este pagamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentReceiptUploader 
                    payment={payment}
                    onSubmit={handlePaymentAction}
                    isSubmitting={isSubmitting} 
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Processamento</CardTitle>
                  <CardDescription>Detalhes do processamento da solicitação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payment.status === PaymentStatus.APPROVED && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data de Aprovação:</span>
                        <span className="font-medium">{formattedApprovedDate}</span>
                      </div>
                      {payment.receipt_url && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground mb-2">Comprovante:</span>
                          <div className="border rounded-md overflow-hidden">
                            <img
                              src={payment.receipt_url}
                              alt="Comprovante"
                              className="w-full h-auto max-h-[200px] object-contain"
                            />
                          </div>
                          <Button variant="outline" className="mt-2 w-full" asChild>
                            <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="mr-2 h-4 w-4" />
                              Ver Comprovante Completo
                            </a>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  {payment.status === PaymentStatus.REJECTED && payment.rejection_reason && (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground mb-1">Motivo da Rejeição:</span>
                      <span className="font-medium bg-red-50 text-red-700 p-2 rounded">{payment.rejection_reason}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeitar Pagamento</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição deste pagamento. Esta informação será enviada ao solicitante.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-right">
                Motivo da Rejeição
              </Label>
              <Textarea
                id="reason"
                placeholder="Informe o motivo da rejeição..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handlePaymentAction(false)}
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              Rejeitar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
