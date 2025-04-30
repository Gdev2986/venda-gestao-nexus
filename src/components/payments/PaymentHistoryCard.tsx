
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Payment, PaymentStatus } from "@/types";
import { PaymentRequestTable } from "./PaymentRequestTable";
import { useState } from "react";

interface PaymentHistoryCardProps {
  payments: Payment[];
  isLoading: boolean;
}

export const PaymentHistoryCard = ({ payments, isLoading }: PaymentHistoryCardProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter payment requests based on active tab
  const filteredPayments = payments.filter(payment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return payment.status === PaymentStatus.PENDING;
    if (activeTab === 'approved') return payment.status === PaymentStatus.APPROVED;
    if (activeTab === 'paid') return payment.status === PaymentStatus.PAID;
    if (activeTab === 'rejected') return payment.status === PaymentStatus.REJECTED;
    return true;
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Histórico de Solicitações</CardTitle>
        <CardDescription>Acompanhe o status das suas solicitações de pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovados</TabsTrigger>
            <TabsTrigger value="paid">Pagos</TabsTrigger>
            <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <PaymentRequestTable 
              payments={filteredPayments} 
              isLoading={isLoading} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
