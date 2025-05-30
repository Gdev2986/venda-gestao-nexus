
import React, { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { Button } from "@/components/ui/button";
import { useClientBalance } from "@/hooks/use-client-balance";
import { useClientPayments } from "@/hooks/useClientPayments";
import { usePixKeys } from "@/hooks/usePixKeys";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { paymentService } from "@/services/payment.service";
import { Plus, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const ClientPayments = () => {
  const { user } = useAuth();
  const { balance, isLoading: balanceLoading } = useClientBalance();
  const { payments, isLoading: paymentsLoading, loadPayments } = useClientPayments();
  const { pixKeys, isLoading: pixKeysLoading } = usePixKeys();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Setup real-time subscription
  usePaymentSubscription(loadPayments, { 
    notifyUser: true, 
    filterByClientId: user?.id 
  });

  const handleRequestPayment = async (type: 'PIX' | 'BOLETO', data: any) => {
    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive"
        });
        return;
      }

      // Get client ID
      const { data: clientData } = await supabase.rpc('get_user_client_id', {
        user_uuid: user.id
      });

      if (!clientData) {
        toast({
          title: "Erro",
          description: "Cliente não encontrado",
          variant: "destructive"
        });
        return;
      }

      const params = {
        client_id: clientData,
        amount: data.amount,
        payment_type: type,
        notes: data.notes,
        ...(type === 'PIX' && {
          pix_key_id: data.pix_key_id,
          new_pix_key: data.new_pix_key
        }),
        ...(type === 'BOLETO' && {
          boleto_file: data.boleto_file,
          boleto_code: data.boleto_code
        })
      };

      await paymentService.createPaymentRequest(params);

      toast({
        title: "Solicitação enviada",
        description: `Sua solicitação de ${type === 'PIX' ? 'pagamento PIX' : 'pagamento de boleto'} foi enviada com sucesso!`
      });

      // Refresh data
      loadPayments();

    } catch (error: any) {
      console.error('Error requesting payment:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao solicitar pagamento",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meus Pagamentos"
        description="Gerencie suas solicitações de pagamento e visualize seu saldo"
      />
      
      {/* Balance Section */}
      <BalanceCards clientBalance={balance || 0} />
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Solicitar Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Solicite o saque do seu saldo via PIX ou envie boletos para pagamento.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="w-full"
              disabled={!balance || balance <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Solicitação
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Processamento PIX</p>
                <p className="text-xs text-muted-foreground">Até 1 dia útil após aprovação</p>
              </div>
              <div>
                <p className="text-sm font-medium">Pagamento de Boletos</p>
                <p className="text-xs text-muted-foreground">Processamento em até 2 dias úteis</p>
              </div>
              <div>
                <p className="text-sm font-medium">Chaves PIX</p>
                <p className="text-xs text-muted-foreground">
                  {pixKeys.length} chave(s) cadastrada(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment History */}
      <PaymentHistoryCard 
        payments={payments}
        isLoading={paymentsLoading} 
      />
      
      {/* Payment Request Dialog */}
      <PaymentRequestDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clientBalance={balance || 0}
        pixKeys={pixKeys}
        isLoadingPixKeys={pixKeysLoading}
        onRequestPayment={handleRequestPayment}
      />
    </div>
  );
};

export default ClientPayments;
