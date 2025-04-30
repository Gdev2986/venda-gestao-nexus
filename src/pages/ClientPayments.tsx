
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { PaymentResponseForm } from '@/components/payments/PaymentResponseForm';

type PaymentRequest = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  client_id: string;
  receipt_url: string | null;
  approved_at: string | null;
};

type Client = {
  id: string;
  business_name: string;
};

const ClientPayments = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();

  const [client, setClient] = useState<Client | null>(null);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        
        // Fetch client details
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, business_name')
          .eq('id', clientId)
          .single();

        if (clientError) throw new Error(clientError.message);
        
        setClient(clientData);

        // Fetch payment requests
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payment_requests')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });

        if (paymentsError) throw new Error(paymentsError.message);
        
        setPaymentRequests(paymentsData as PaymentRequest[]);

      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar dados',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, toast]);

  const pendingRequests = useMemo(() => 
    paymentRequests.filter(req => req.status === 'PENDING'),
    [paymentRequests]
  );

  const approvedRequests = useMemo(() => 
    paymentRequests.filter(req => req.status === 'APPROVED'),
    [paymentRequests]
  );

  const rejectedRequests = useMemo(() => 
    paymentRequests.filter(req => req.status === 'REJECTED'),
    [paymentRequests]
  );

  const handlePaymentResponse = async (paymentId: string, approved: boolean, receiptUrl?: string) => {
    try {
      const updateData = approved
        ? { status: 'APPROVED', approved_at: new Date().toISOString(), receipt_url: receiptUrl }
        : { status: 'REJECTED' };

      const { error } = await supabase
        .from('payment_requests')
        .update(updateData)
        .eq('id', paymentId);

      if (error) throw new Error(error.message);

      // Update local state
      setPaymentRequests(prev => prev.map(req => {
        if (req.id === paymentId) {
          return { ...req, ...updateData };
        }
        return req;
      }));

      toast({
        title: `Pagamento ${approved ? 'aprovado' : 'rejeitado'}`,
        description: `O pagamento foi ${approved ? 'aprovado' : 'rejeitado'} com sucesso.`,
        variant: 'default',
      });

      return true;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao processar pagamento',
        description: error.message,
      });
      return false;
    }
  };

  if (!clientId) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Cliente não encontrado</h2>
            <p className="text-muted-foreground">ID do cliente não foi fornecido</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Pagamentos {client && `- ${client.business_name}`}
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie pagamentos deste cliente
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pendentes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprovados ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejeitados ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Nenhum pagamento pendente.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((payment) => (
                <PaymentResponseForm
                  key={payment.id}
                  payment={payment}
                  onSubmit={handlePaymentResponse}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            {/* Approved payments content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedRequests.length === 0 ? (
                <Card className="md:col-span-2">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Nenhum pagamento aprovado.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                approvedRequests.map((payment) => (
                  <Card key={payment.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(payment.amount)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Data:</span>{' '}
                          {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Aprovado em:</span>{' '}
                          {payment.approved_at
                            ? new Date(payment.approved_at).toLocaleDateString('pt-BR')
                            : '-'}
                        </p>
                        {payment.receipt_url && (
                          <p className="text-sm">
                            <span className="font-medium">Comprovante:</span>{' '}
                            <a
                              href={payment.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Ver comprovante
                            </a>
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            {/* Rejected payments content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rejectedRequests.length === 0 ? (
                <Card className="md:col-span-2">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Nenhum pagamento rejeitado.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                rejectedRequests.map((payment) => (
                  <Card key={payment.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(payment.amount)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Data:</span>{' '}
                          {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClientPayments;
