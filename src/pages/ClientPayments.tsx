import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/components/layout/MainLayout";
import { Payment, PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileCheck, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentReceiptUploader from "@/components/payments/PaymentReceiptUploader";

interface ClientPayment extends Payment {
  description?: string | null; // Make description optional and nullable
}

const ClientPayments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<ClientPayment | null>(null);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayments = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Get payment_requests for this client
      const { data, error } = await supabase
        .from("payment_requests")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our Payment type
      const transformedPayments: ClientPayment[] = (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        description: item.description || null,
        status: item.status as PaymentStatus,
        created_at: item.created_at,
        updated_at: item.updated_at || item.created_at,
        due_date: item.created_at, // Using created_at as due_date for display
        receipt_url: item.receipt_url,
        approved_at: item.approved_at,
        client_id: item.client_id,
      }));
      
      setPayments(transformedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Erro ao carregar pagamentos",
        description: "Não foi possível carregar seus pagamentos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClick = (payment: ClientPayment) => {
    setSelectedPayment(payment);
    setPaymentFormOpen(true);
  };

  const handleUploadReceipt = (payment: ClientPayment) => {
    setSelectedPayment(payment);
    setReceiptDialogOpen(true);
  };

  const respondToPayment = async (paymentId: string, approved: boolean, receiptUrl?: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      const update: {
        status: PaymentStatus;
        approved_at?: string;
        receipt_url?: string;
      } = {
        status: approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED
      };
      
      if (approved) {
        update.approved_at = new Date().toISOString();
        if (receiptUrl) {
          update.receipt_url = receiptUrl;
        }
      }
      
      const { error } = await supabase
        .from("payment_requests")
        .update(update)
        .eq("id", paymentId);

      if (error) throw error;

      toast({
        title: approved ? "Comprovante enviado!" : "Pagamento rejeitado",
        description: approved 
          ? "Seu comprovante foi enviado e está aguardando aprovação."
          : "O pagamento foi rejeitado.",
        variant: approved ? "default" : "destructive",
      });

      setReceiptDialogOpen(false);
      await fetchPayments();
      return true;
    } catch (error) {
      console.error("Error responding to payment:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Badge variant="outline" className="flex gap-1 items-center"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case PaymentStatus.APPROVED:
        return <Badge variant="default" className="flex gap-1 items-center"><CheckCircle2 className="h-3 w-3" /> Aprovado</Badge>;
      case PaymentStatus.REJECTED:
        return <Badge variant="destructive" className="flex gap-1 items-center"><AlertCircle className="h-3 w-3" /> Rejeitado</Badge>;
      case PaymentStatus.PAID:
        return <Badge variant="secondary" className="flex gap-1 items-center"><FileCheck className="h-3 w-3" /> Pago</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const pendingPayments = payments.filter(p => p.status === PaymentStatus.PENDING);
  const approvedPayments = payments.filter(p => p.status === PaymentStatus.APPROVED);
  const completedPayments = payments.filter(p => [PaymentStatus.PAID, PaymentStatus.REJECTED].includes(p.status));

  useEffect(() => {
    fetchPayments();
    
    // Set up subscription for real-time updates
    if (user?.id) {
      const channel = supabase
        .channel(`payment-requests-${user.id}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'payment_requests', filter: `client_id=eq.${user.id}` }, 
          () => {
            fetchPayments();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Meus Pagamentos</h2>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pendentes <Badge variant="outline" className="ml-2">{pendingPayments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprovados <Badge variant="outline" className="ml-2">{approvedPayments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Concluídos <Badge variant="outline" className="ml-2">{completedPayments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos Pendentes</CardTitle>
                    <CardDescription>Pagamentos que precisam da sua ação.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingPayments.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">Não há pagamentos pendentes.</p>
                    ) : (
                      <div className="space-y-4">
                        {pendingPayments.map((payment) => (
                          <div key={payment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                            <div className="space-y-1 mb-2 md:mb-0">
                              <div className="font-medium">{payment.description || `Pagamento #${payment.id.slice(0, 8)}`}</div>
                              <div className="text-sm text-muted-foreground">
                                Criado em: {new Date(payment.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-lg font-bold">{formatCurrency(payment.amount)}</div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                              <Button onClick={() => handlePaymentClick(payment)}>
                                Ver detalhes
                              </Button>
                              <Button variant="default" onClick={() => handleUploadReceipt(payment)}>
                                Enviar comprovante
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos Aprovados</CardTitle>
                    <CardDescription>Pagamentos com comprovante enviado, aguardando confirmação.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {approvedPayments.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">Não há pagamentos aprovados.</p>
                    ) : (
                      <div className="space-y-4">
                        {approvedPayments.map((payment) => (
                          <div key={payment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="font-medium">{payment.description || `Pagamento #${payment.id.slice(0, 8)}`}</div>
                              <div className="text-sm text-muted-foreground">
                                Enviado em: {payment.approved_at ? new Date(payment.approved_at).toLocaleDateString() : 'N/A'}
                              </div>
                              <div className="text-lg font-bold">{formatCurrency(payment.amount)}</div>
                              <div>{getStatusBadge(payment.status)}</div>
                            </div>
                            <Button variant="outline" onClick={() => handlePaymentClick(payment)}>
                              Ver detalhes
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagamentos Concluídos</CardTitle>
                    <CardDescription>Histórico de pagamentos pagos ou rejeitados.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedPayments.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">Não há pagamentos concluídos.</p>
                    ) : (
                      <div className="space-y-4">
                        {completedPayments.map((payment) => (
                          <div key={payment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="font-medium">{payment.description || `Pagamento #${payment.id.slice(0, 8)}`}</div>
                              <div className="text-sm text-muted-foreground">
                                Data: {new Date(payment.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-lg font-bold">{formatCurrency(payment.amount)}</div>
                              <div>{getStatusBadge(payment.status)}</div>
                            </div>
                            <Button variant="outline" onClick={() => handlePaymentClick(payment)}>
                              Ver detalhes
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Payment details dialog */}
      <Dialog open={paymentFormOpen} onOpenChange={setPaymentFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
            <DialogDescription>
              Informações completas sobre este pagamento.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <PaymentForm payment={selectedPayment} />
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt upload dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Comprovante</DialogTitle>
            <DialogDescription>
              Faça o upload do comprovante de pagamento.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <PaymentReceiptUploader
              payment={selectedPayment}
              onSubmit={respondToPayment}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ClientPayments;
