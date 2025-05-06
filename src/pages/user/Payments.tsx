
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PATHS } from "@/routes/paths";
import { usePaymentRequests } from "@/hooks/usePaymentRequests";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { BalanceCards } from "@/components/payments/BalanceCards";
import { PaymentHistoryCard } from "@/components/payments/PaymentHistoryCard";
import { usePaymentSubscription } from "@/hooks/usePaymentSubscription";
import { useEffect } from "react";

const UserPayments = () => {
  const {
    isLoading,
    clientBalance,
    paymentRequests,
    isDialogOpen,
    setIsDialogOpen,
    handleRequestPayment,
    pixKeys,
    isLoadingPixKeys,
    loadPaymentRequests
  } = usePaymentRequests();

  // Configurar a inscrição em tempo real para acompanhar mudanças nas solicitações de pagamento deste cliente específico
  // Estamos supondo que o cliente ID está disponível (em um contexto real, seria obtido da sessão do usuário)
  // Fixando em "client-id" para fins de demonstração
  const clientId = "client-id"; // Em uma implementação real, isso viria do contexto de autenticação
  usePaymentSubscription(loadPaymentRequests, { notifyUser: true, filterByClientId: clientId });
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meus Pagamentos" 
        description="Gerencie seus pagamentos e solicitações financeiras"
      />
      
      <BalanceCards clientBalance={clientBalance} />
      
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Solicitar Pagamento</Button>
      </div>
      
      <PaymentHistoryCard 
        payments={paymentRequests}
        isLoading={isLoading} 
      />
      
      <PaymentRequestDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clientBalance={clientBalance}
        pixKeys={pixKeys}
        isLoadingPixKeys={isLoadingPixKeys}
        onRequestPayment={handleRequestPayment}
      />
    </div>
  );
};

export default UserPayments;
