
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts";
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { useToast } from "@/hooks/use-toast";

const UserPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('payment_requests')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erro ao carregar pagamentos:", error);
          toast({
            title: "Erro ao carregar pagamentos",
            description: "Não foi possível carregar seus pagamentos. Tente novamente mais tarde.",
            variant: "destructive",
          });
        } else {
          // Convert PaymentRequest[] to Payment[]
          const convertedPayments: Payment[] = (data || []).map(item => ({
            id: item.id,
            client_id: item.client_id,
            amount: item.amount,
            status: item.status as PaymentStatus,
            approved_by: item.approved_by,
            approved_at: item.approved_at,
            created_at: item.created_at,
            updated_at: item.updated_at,
            receipt_url: item.receipt_url,
            description: item.description,
            rejection_reason: item.rejection_reason || null,
          }));
          
          setPayments(convertedPayments);
        }
      } catch (error) {
        console.error("Erro ao carregar pagamentos:", error);
        toast({
          title: "Erro ao carregar pagamentos",
          description: "Ocorreu um erro ao carregar seus pagamentos. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [user, toast]);

  const getStatusBadge = (status: PaymentStatus | string) => {
    const statusColors = {
      [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [PaymentStatus.APPROVED]: "bg-green-100 text-green-800", 
      [PaymentStatus.REJECTED]: "bg-red-100 text-red-800",
      [PaymentStatus.PAID]: "bg-blue-100 text-blue-800"
    };

    const statusLabels = {
      [PaymentStatus.PENDING]: "Pendente",
      [PaymentStatus.APPROVED]: "Aprovado",
      [PaymentStatus.REJECTED]: "Rejeitado", 
      [PaymentStatus.PAID]: "Pago"
    };

    return (
      <Badge className={statusColors[status as PaymentStatus] || "bg-gray-100 text-gray-800"}>
        {statusLabels[status as PaymentStatus] || status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Pagamentos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie suas solicitações de pagamento
          </p>
        </div>
        <Button onClick={() => setShowRequestDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Solicitar Pagamento
        </Button>
      </div>

      <div className="grid gap-4">
        {payments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum pagamento encontrado</p>
              <Button onClick={() => setShowRequestDialog(true)} variant="outline">
                Solicitar Primeiro Pagamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {formatCurrency(payment.amount)}
                    </CardTitle>
                    <CardDescription>
                      Solicitado em {formatDate(payment.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    {getStatusBadge(payment.status)}
                    {payment.receipt_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {payment.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {payment.description}
                  </p>
                </CardContent>
              )}
              {payment.rejection_reason && (
                <CardContent>
                  <p className="text-sm text-red-600">
                    Motivo da rejeição: {payment.rejection_reason}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      <PaymentRequestDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        onRequestCreated={() => {
          setShowRequestDialog(false);
          // Refresh payments list
          window.location.reload();
        }}
      />
    </div>
  );
};

export default UserPayments;
