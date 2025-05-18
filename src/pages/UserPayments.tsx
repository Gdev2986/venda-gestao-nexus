
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getClientPayments } from "@/services/payment.service";
import { formatCurrency } from "@/lib/utils";
import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/page/PageHeader";
import { ptBR } from "date-fns/locale";
import { PaymentStatus } from "@/types/payment.types";
import { Payment } from "@/types/payment.types";

// This is a stub implementation of the user payments page
// It will be expanded with more features in the future

const UserPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // In a real implementation, you would get the client ID from the user context
          // For demo purposes, we're using a hard-coded value
          const clientId = "c87e857c-f385-4f8f-9d5d-a165d6172676"; // TODO: Replace with real client ID from user context
          const data = await getClientPayments(clientId);
          
          // Convert payment service type to payment.types type
          const convertedPayments: Payment[] = data.map(p => ({
            ...p,
            client_id: p.client_id || '',
          }));
          
          setPayments(convertedPayments);
        } catch (error) {
          console.error("Failed to fetch payments:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPayments();
  }, [user]);

  const getStatusBadge = (status: PaymentStatus | string, paymentType?: string) => {
    if (status === PaymentStatus.PENDING) {
      return <Badge variant="outline">Pendente</Badge>;
    } else if (status === PaymentStatus.APPROVED) {
      return <Badge variant="default">Aprovado</Badge>;
    } else if (status === PaymentStatus.REJECTED) {
      return <Badge variant="destructive">Rejeitado</Badge>;
    } else if (status === PaymentStatus.PAID) {
      return <Badge>Pago</Badge>;
    } else {
      return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewDetails = (payment: Payment) => {
    // Ensure payment object has the expected structure for PaymentDetailsDialog
    const adaptedPayment = {
      ...payment,
      pix_key: payment.pix_key ? {
        ...payment.pix_key,
        owner_name: payment.pix_key.owner_name || payment.pix_key.name || ''
      } : undefined
    };
    
    setSelectedPayment(adaptedPayment);
    setIsDetailsOpen(true);
  };

  return (
    <div className="container py-6">
      <PageHeader
        title="Meus Pagamentos"
        description="Visualize e gerencie seus pagamentos"
      />

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>
            Veja todos os pagamentos solicitados e seus status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-4 w-16 mb-2 ml-auto" />
                          <Skeleton className="h-6 w-20 ml-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <Card key={payment.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(payment.created_at),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
                          </p>
                          <p className="font-semibold text-lg">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-sm">
                            {payment.description || "Pagamento"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="mb-2">{getStatusBadge(payment.status, payment.payment_type)}</div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(payment)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Nenhum pagamento encontrado
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedPayment && (
        <PaymentDetailsDialog
          payment={selectedPayment}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  );
};

export default UserPayments;
